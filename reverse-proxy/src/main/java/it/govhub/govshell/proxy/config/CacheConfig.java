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
package it.govhub.govshell.proxy.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;


@Configuration
@EnableCaching
public class CacheConfig {
	
	public static final String APPLICATIONS = "applications";
	
	private Logger logger = LoggerFactory.getLogger(CacheConfig.class);
	
	@CacheEvict(value = APPLICATIONS, allEntries = true)
	@Scheduled(fixedRateString = "${caching.govhub.applications.TTL:300000}")
	public void emptyApplicationsCache() {
		logger.info("CLEARING " + APPLICATIONS + " CACHE.");
	}
	

}
