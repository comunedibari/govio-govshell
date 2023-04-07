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
package it.govhub.govshell.proxy.web;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Parameter;
import it.govhub.govregistry.commons.entity.ApplicationEntity;
import it.govhub.govregistry.commons.entity.UserEntity;
import it.govhub.govshell.proxy.beans.GovhubApplication;
import it.govhub.govshell.proxy.beans.GovhubApplicationList;
import it.govhub.govshell.proxy.repository.ApplicationRepository;
import it.govhub.govshell.proxy.services.ProxyService;
import it.govhub.security.services.SecurityService;


@RestController
public class ProxyController {
	
    @Autowired
    ProxyService service;
    
    @Autowired
    ApplicationRepository appRepo;
    
    @RequestMapping("/{application_id}/**")
    public ResponseEntity<Resource> proxyMultipart(
    				@Parameter(name = "application_id", required = true) @PathVariable("application_id") String applicationId, 
    				HttpServletRequest request )
            throws URISyntaxException, IOException, InterruptedException {
    	
    	return this.service.processProxyRequest(applicationId, request);
    }
    
    
    @RequestMapping(
            method = RequestMethod.GET,
            value = "/applications",
            produces = { "application/json", "application/problem+json" }
        )
    public ResponseEntity<GovhubApplicationList> listApplications() {
    	
    	UserEntity principal = SecurityService.getPrincipal();
    	
    	Set<ApplicationEntity> userApps = new HashSet<>();
    	for (var auth :  principal.getAuthorizations()) {
    		userApps.add(auth.getRole().getGovhubApplication());
    	}
    	
    	GovhubApplicationList ret = new GovhubApplicationList();
    	
    	for (ApplicationEntity a : userApps) {
    		GovhubApplication a1 = GovhubApplication.builder()
    				.appUrl(a.getDeployedUri())
    				.id(a.getApplicationId())
    				.name(a.getName())
    				.logo(a.getLogo())
    				.build();
    		
    		ret.getApplications().add(a1);
    	}
    	
    	return ResponseEntity.ok(ret);
    }
    

}