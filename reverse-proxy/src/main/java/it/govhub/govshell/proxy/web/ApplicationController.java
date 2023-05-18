package it.govhub.govshell.proxy.web;

import java.net.URI;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import it.govhub.govregistry.commons.entity.ApplicationEntity;
import it.govhub.govregistry.commons.exception.InternalConfigurationException;
import it.govhub.govshell.proxy.beans.Application;
import it.govhub.govshell.proxy.beans.ApplicationList;
import it.govhub.govshell.proxy.repository.ApplicationRepository;

@RestController
public class ApplicationController implements ApplicationApi {
	
	@Autowired
	ApplicationRepository applicationRepo;
	
	@Autowired
	ObjectMapper objectMapper;

	@Override
	public ResponseEntity<ApplicationList> listApplications() {
		
		List<ApplicationEntity> applications = this.applicationRepo.findAll();
		
		ApplicationList ret = new ApplicationList();
		
		for (var app: applications) {
			Application item = new Application();
			
			try {
				if (app.getLogo() != null) {
					JsonNode logo  = this.objectMapper.readTree(app.getLogo());
					item.setLogo(logo);
				}
			} catch (JsonProcessingException e) {
				throw new InternalConfigurationException(e.getMessage());
			}
			
			item.setApplicationId(app.getApplicationId());
			item.setApplicationName(app.getName());
			item.setDeployedUri(URI.create(app.getDeployedUri()));
			if (app.getWebappUri() != null) {
				item.setWebappUri(URI.create(app.getWebappUri()));
			}
			ret.addItemsItem(item);
		}
		
		return ResponseEntity.ok(ret);
	}

}
