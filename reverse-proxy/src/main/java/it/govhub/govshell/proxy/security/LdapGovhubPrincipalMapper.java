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

import java.util.Collection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.ldap.userdetails.LdapUserDetailsMapper;
import org.springframework.stereotype.Service;

import it.govhub.govregistry.commons.entity.UserEntity;
import it.govhub.govregistry.commons.messages.UserMessages;
import it.govhub.security.cache.Caches;
import it.govhub.security.repository.SecurityUserRepository;

/**
 * Mappa l'utente Ldap in un GovhubPrincipal, ignora gli attributi letti dallo
 * ldapUser. Se gli attributi non servono, allora implementare
 * UserDetailsContextMapper e restituire direttamente lo userDetails che ci
 * serve.
 * 
 * Se necessario restituire un LdapGovhubUser che ha anche il dn
 * 
 * String dn = ctx.getNameInNamespace();
 *
 */
@Service
public class LdapGovhubPrincipalMapper extends LdapUserDetailsMapper {

	@Autowired
	SecurityUserRepository userRepo;

	@Autowired
	UserMessages userMessages;
	
	Logger logger = LoggerFactory.getLogger(LdapGovhubPrincipalMapper.class);

	@Override
	@Cacheable(cacheNames = Caches.PRINCIPALS, key = "#username")
	public UserDetails mapUserFromContext(DirContextOperations ctx, String username, Collection<? extends GrantedAuthority> authorities) {
		logger.debug("Mappo Utenza Ldap in un GovhubPrincipal.");
		
		// Ignoro gli userDetails 
		super.mapUserFromContext(ctx, username, authorities);

		UserEntity user = this.userRepo.findAndPreloadByPrincipal(username)
				.orElseThrow(() -> new UsernameNotFoundException(this.userMessages.principalNotFound(username)));

		return new LdapGovhubPrincipal(user, ctx.getNameInNamespace());
	}

}
