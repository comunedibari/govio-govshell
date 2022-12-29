package it.govhub.govshell.proxy.web;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpRequest.Builder;
import java.net.http.HttpResponse.BodyHandlers;
import java.net.http.HttpResponse;
import java.util.Enumeration;
import java.util.UUID;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.util.UriComponentsBuilder;

import io.swagger.v3.oas.annotations.Parameter;
import it.govhub.govregistry.commons.entity.UserEntity;
import it.govhub.govregistry.commons.exception.ResourceNotFoundException;
import it.govhub.govshell.proxy.entities.ApplicationEntity;
import it.govhub.govshell.proxy.repository.ApplicationRepository;
import it.govhub.govshell.proxy.services.ProxyService;
import it.govhub.security.services.SecurityService;


@RestController
public class ProxyController {
	
    @Autowired
    ProxyService service;
    
    @Value("${govshell.auth.header}")
    private String headerAuthentication;
    
    @Autowired
    private ApplicationRepository appRepo;
    
    private final Logger logger =  LoggerFactory.getLogger(ProxyService.class);
    
    /*@RequestMapping("/{application_id}/**")
    public ResponseEntity<String> sendRequestToSPM(
    				@Parameter(name = "application_id", required = true) @PathVariable("application_id") String applicationId, 
    				@RequestBody(required = false) String body,
    				HttpMethod method, 
    				HttpServletRequest request, 
    				HttpServletResponse response) 
            throws URISyntaxException {
    	
        return service.processProxyRequest(applicationId, body,method,request,response,UUID.randomUUID().toString());
    }*/
    
    @RequestMapping("/{application_id}/**")
    public ResponseEntity<String> proxyMultipart(
    				@Parameter(name = "application_id", required = true) @PathVariable("application_id") String applicationId, 
    				HttpServletRequest request )
            throws URISyntaxException, IOException, InterruptedException {
    	
		logger.info("V2 Redirect");
		
		ApplicationEntity application = this.appRepo.findByApplicationId(applicationId)
				.orElseThrow(ResourceNotFoundException::new);
		
		URI applicationUri = new URI(application.getDeployedUri());
		String requestPath = (String) request.getAttribute(
		        HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
		
		logger.debug("Proxying request.\nApplicationId: {}\nApplicationURI: {}\nSourceRequestPath: {}",applicationId, applicationUri, requestPath);
		
		String prefix = "/"+applicationId;
		
		String resourcePath = requestPath.substring(prefix.length());
		
		URI destUri = UriComponentsBuilder.fromUri(applicationUri)
			.path(resourcePath)
			.query(request.getQueryString())
			.build(true).toUri();
		
		logger.info("Proxying request to: {}", destUri);
        
       ServletInputStream inStream = request.getInputStream();
    	
	   Builder builder = HttpRequest.newBuilder()
				.uri(destUri)
				.method(request.getMethod(), HttpRequest.BodyPublishers.ofInputStream(() -> inStream));

	   Enumeration<String> headerNames = request.getHeaderNames();
	   while (headerNames.hasMoreElements()) {
	       String headerName = headerNames.nextElement();
	       if (!headerName.equals(HttpHeaders.TRANSFER_ENCODING)) {
	    	   try {
	    		   builder.header(headerName,request.getHeader(headerName));
	    	   } catch (IllegalArgumentException e) {
	    		   logger.error("Header riservato {}", headerName);
	    	   }
	       }
	   }
	   
       // Aggiungo header di autenticazione 
       UserEntity principal = SecurityService.getPrincipal();
       builder.header(this.headerAuthentication, principal.getPrincipal());
    	
       HttpRequest newRequest = builder.build();
       
       HttpClient client = HttpClient.newHttpClient();

       // TODO: Qui il body handler scriverà sullo streamingResponseSTream?
       HttpResponse<String> response = client.send(newRequest, BodyHandlers.ofString());
       
       java.net.http.HttpHeaders respHeaders = response.headers();
       
       HttpHeaders retHeaders = new HttpHeaders();
       respHeaders.map().forEach( (key, values) -> {
    	   retHeaders.addAll(key, values);
       });
       
       return ResponseEntity.status(response.statusCode())
    		   	.headers(retHeaders)
    		    .body(response.body());
       
    }
    

}