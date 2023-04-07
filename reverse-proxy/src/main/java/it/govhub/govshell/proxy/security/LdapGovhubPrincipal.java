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

import org.springframework.security.ldap.userdetails.LdapUserDetails;

import it.govhub.govregistry.commons.entity.UserEntity;
import it.govhub.security.beans.GovhubPrincipal;

public class LdapGovhubPrincipal extends GovhubPrincipal implements LdapUserDetails {

	private static final long serialVersionUID = 1L;
	
	private String dn;

	public LdapGovhubPrincipal(UserEntity user, String dn) {
		super(user);
		this.dn = dn;
	}

	@Override
	public void eraseCredentials() {
	}

	@Override
	public String getDn() {
		return this.dn;
	}

}
