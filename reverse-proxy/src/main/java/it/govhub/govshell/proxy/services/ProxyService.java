/*
 * GovShell - Application dashboard for GovHub
 *
 * Copyright (c) 2021-2023 Link.it srl (http://www.link.it).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3, as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
package it.govhub.govshell.proxy.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.ConnectException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.Builder;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.time.Duration;
import java.util.Enumeration;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.ThreadContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.govhub.govregistry.commons.api.beans.Problem;
import it.govhub.govregistry.commons.entity.ApplicationEntity;
import it.govhub.govregistry.commons.entity.UserEntity;
import it.govhub.govregistry.commons.exception.ResourceNotFoundException;
import it.govhub.govregistry.commons.exception.handlers.RestResponseEntityExceptionHandler;
import it.govhub.govregistry.commons.messages.SystemMessages;
import it.govhub.govshell.proxy.repository.ApplicationRepository;
import it.govhub.security.services.SecurityService;


@Service
public class ProxyService {
	
	final Logger logger = LoggerFactory.getLogger(ProxyService.class);
	
	final static TreeSet<String> reservedHeaders = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
	static {
		reservedHeaders.addAll(Set.of(HttpHeaders.HOST, HttpHeaders.CONNECTION));
	}

	@Value("${govshell.auth.header:Govhub-Consumer-Principal}")
	String headerAuthentication;

	@Value("${govshell.proxy.trace.header-name:Govshell-Trace-Id}")
	String traceHeaderName;

	@Value("${govshell.proxy.forwarded-prefix:}")
	String forwardedPrefix;
	
	@Autowired
	ApplicationRepository appRepo;
	
	@Autowired
	ObjectMapper jsonMapper;
	
	TreeSet<String> responseBlackListHeaders;
	
	HttpClient client;
	
	public ProxyService(
			@Value("${govshell.proxy.headers.response.blacklist:}")	List<String> blackListHeaders,
			@Value("${govshell.proxy.connection-timeout:10}")	Integer connectionTimeout) {
		
		this.responseBlackListHeaders = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);
		this.responseBlackListHeaders.addAll(blackListHeaders);
		
		this.client = HttpClient.newBuilder()
				.connectTimeout(Duration.ofSeconds(connectionTimeout))
				.build();
	}
	

	public ResponseEntity<Resource> processProxyRequest(String applicationId, HttpServletRequest request)
			throws URISyntaxException, IOException, InterruptedException {

		String traceId = UUID.randomUUID().toString();
		logger.debug("Handling request with traceId [{}]", traceId);

		ThreadContext.put(this.traceHeaderName, traceId);

		// Se l'applicazione non c'è, restituiamo un 404 come fosse una pagina non esistente
		ApplicationEntity application = this.appRepo.findByApplicationId(applicationId)
				.orElseThrow(ResourceNotFoundException::new);

		URI applicationUri = new URI(application.getDeployedUri());
		String requestPath = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
		String prefix = "/" + applicationId;
		String resourcePath = requestPath.substring(prefix.length());
		URI destUri = UriComponentsBuilder.fromUri(applicationUri).path(resourcePath).query(request.getQueryString())
				.build(true).toUri();

		logger.debug("Proxying request: {}\nApplicationId: {}\nApplicationURI: {}\nSourceRequestPath: {}\nDestUri: {}", traceId, applicationId,
				applicationUri, requestPath, destUri);

		ServletInputStream inStream = request.getInputStream();

		Builder builder = HttpRequest.newBuilder()
				.uri(destUri)
				.method(request.getMethod(),
						HttpRequest.BodyPublishers.ofInputStream(() -> inStream));

		Enumeration<String> headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String headerName = headerNames.nextElement();
			
			if (!reservedHeaders.contains(headerName)) {
				try {
					builder.header(headerName, request.getHeader(headerName));
				} catch (IllegalArgumentException e) {
					logger.error("Header riservato {}", headerName);
				}
			}
		}

		builder.header(this.traceHeaderName, traceId);
		builder.header("X-Forwarded-Prefix", this.forwardedPrefix + "/" + applicationId);

		// Aggiungo header di autenticazione
		UserEntity principal = SecurityService.getPrincipal();
		builder.header(this.headerAuthentication, principal.getPrincipal());

		HttpRequest newRequest = builder.build();

		HttpResponse<InputStream> response = null;
		try {
			
			response = this.client.send(newRequest, BodyHandlers.ofInputStream());
			logger.debug("Proxying request: {} - Got response from backend: {}", traceId, response.statusCode());
			
		} catch (ConnectException e) {
			
			logger.error("Connect Exception while contacting the backend: " + e.getLocalizedMessage());
			
			Problem p = RestResponseEntityExceptionHandler.buildProblem(HttpStatus.BAD_GATEWAY, "Can't connect to the backend service.");
			ByteArrayInputStream bs = new ByteArrayInputStream(jsonMapper.writeValueAsString(p).getBytes());
			InputStreamResource resourceStream = new InputStreamResource(bs);
			
			return new ResponseEntity<>(resourceStream, HttpStatus.BAD_GATEWAY);
		} catch (InterruptedException e) {
			
			logger.error("Request to the backend was aborted: " + e.getLocalizedMessage());
			
			Problem p = RestResponseEntityExceptionHandler.buildProblem(HttpStatus.BAD_GATEWAY, "Request to the backend service took to much.");
			ByteArrayInputStream bs = new ByteArrayInputStream(jsonMapper.writeValueAsString(p).getBytes());
			InputStreamResource resourceStream = new InputStreamResource(bs);
			
			return new ResponseEntity<>(resourceStream, HttpStatus.BAD_GATEWAY);
		}		
		if (response.statusCode() == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
			
			Problem p = RestResponseEntityExceptionHandler.buildProblem(HttpStatus.BAD_GATEWAY, SystemMessages.internalError());
			ByteArrayInputStream bs = new ByteArrayInputStream(jsonMapper.writeValueAsString(p).getBytes());
			InputStreamResource resourceStream = new InputStreamResource(bs);
			
			return new ResponseEntity<>(resourceStream, HttpStatus.BAD_GATEWAY);
		} else {
			
			HttpHeaders retHeaders = new HttpHeaders();
			response.headers().map().forEach((key, values) -> {
				if (!this.responseBlackListHeaders.contains(key)) {
					retHeaders.addAll(key, values);
				}
			});
			
			InputStreamResource resourceStream = new InputStreamResource(response.body());
			logger.debug("Proxying request: {} - Returning response to the client.", traceId);
			return new ResponseEntity<>(resourceStream, retHeaders, response.statusCode());
		}

	}
}