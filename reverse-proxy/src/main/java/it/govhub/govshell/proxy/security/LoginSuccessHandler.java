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
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.govhub.govregistry.commons.api.beans.Authorization;
import it.govhub.govregistry.commons.api.beans.Profile;
import it.govhub.govregistry.commons.entity.UserEntity;
import it.govhub.govregistry.commons.exception.UnreachableException;
import it.govhub.govregistry.readops.api.assemblers.ProfileAssembler;
import it.govhub.security.services.SecurityService;

@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

	@Autowired
	private ObjectMapper jsonMapper;
	
	@Autowired
	private ProfileAssembler profileAssembler;
	
	Logger log = LoggerFactory.getLogger(LoginSuccessHandler.class);

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
		log.debug("Logged in succesfully, responding with user info.");

		response.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
		response.setStatus(HttpStatus.OK.value());
		
		
		ServletOutputStream outputStream = null;
		try{
			outputStream = response.getOutputStream();
			
	        UserEntity principal = SecurityService.getPrincipal();
	        
	        Profile user = this.profileAssembler.toModel(principal);
	        
	        OffsetDateTime now = OffsetDateTime.now();

			List<Authorization> newAuthorizations = user.getAuthorizations().stream()
					.filter( auth -> auth.getExpirationDate() == null || now.compareTo(auth.getExpirationDate()) < 0 )
					.collect(Collectors.toList());
			
			user.setAuthorizations(newAuthorizations);
	        
			this.jsonMapper.writeValue(outputStream, user);
			
			outputStream.flush();
		}catch(Exception e) {
			throw new UnreachableException();
		}
	}


}
