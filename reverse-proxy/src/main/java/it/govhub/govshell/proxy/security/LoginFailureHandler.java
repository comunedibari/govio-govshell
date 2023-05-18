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
package it.govhub.govshell.proxy.security;

import java.io.IOException;
import java.net.URI;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.govhub.govregistry.commons.api.beans.Problem;
import it.govhub.govregistry.commons.exception.UnreachableException;
import it.govhub.govregistry.commons.exception.handlers.RestResponseEntityExceptionHandler;
import it.govhub.govregistry.commons.messages.SystemMessages;



@Component
public class LoginFailureHandler  extends SimpleUrlAuthenticationFailureHandler {

	@Autowired
	private ObjectMapper jsonMapper;
	
	Logger log = LoggerFactory.getLogger(LoginFailureHandler.class);
	
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,	AuthenticationException exception) throws IOException, ServletException {
		log.debug("Login request failed: {}", request);
		
		Problem problem = new Problem();
		
		// Non è stato possibile trovare l'utente o la password è errata
		if (exception instanceof BadCredentialsException) {
			problem.setStatus(HttpStatus.FORBIDDEN.value());
			problem.setTitle(HttpStatus.FORBIDDEN.getReasonPhrase());
			problem.setDetail(exception.getLocalizedMessage());
		} else {
			problem.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
			problem.setTitle(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
			problem.setDetail(SystemMessages.internalError());
		}
		
		// imposto il content-type della risposta
		response.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		response.setStatus(problem.getStatus());
		
		ServletOutputStream outputStream = null;
		try{
			problem.setInstance(new URI(RestResponseEntityExceptionHandler.problemTypes.get(HttpStatus.FORBIDDEN)));
			outputStream = response.getOutputStream();
			this.jsonMapper.writeValue(outputStream, problem);
			outputStream.flush();
		}catch(Exception e) {
			throw new UnreachableException(e);
		}
	}

}