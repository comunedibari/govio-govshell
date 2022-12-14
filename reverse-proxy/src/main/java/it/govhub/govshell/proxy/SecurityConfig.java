package it.govhub.govshell.proxy;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.govhub.govregistry.commons.security.AccessDeniedHandlerImpl;
import it.govhub.govregistry.commons.security.GovhubUserDetailService;
import it.govhub.govregistry.commons.security.ProblemHttp403ForbiddenEntryPoint;



/**
 * Configurazione della sicurezza
 * 
 */

@Configuration
@EnableWebSecurity
public class SecurityConfig{
	
	@Value("${server.servlet.session.cookie.name}")
	private String sessionCookieName;
	
	@Autowired
	private ObjectMapper jsonMapper;

	@Autowired
	private AccessDeniedHandlerImpl accessDeniedHandler;
	
	@Autowired
	private LoginSuccessHandler loginSuccessHandler;
	
	@Autowired
	private  LoginFailureHandler loginFailureHandler;
	
	@Autowired
	protected GovhubUserDetailService userDetailService;

	@Bean
	public SecurityFilterChain securityFilterChainDev(HttpSecurity http) throws Exception {
		applyAuthRules(http)
			.csrf().disable()																												// Disabilita csrf perchè il cookie di sessione viene rilasciato con SameSite: strict
		.formLogin()
			.loginProcessingUrl("/do-login")
			.successHandler(this.loginSuccessHandler)
			.failureHandler(this.loginFailureHandler)
			.permitAll()
		.and()
		.exceptionHandling()
		.accessDeniedHandler(this.accessDeniedHandler)																		// Gestisci accessDenied in modo da restituire un problem ben formato TODO: Vedi se a govshell serve davero
		.authenticationEntryPoint(new ProblemHttp403ForbiddenEntryPoint(this.jsonMapper))			// Gestisci la mancata autenticazione con un problem ben formato
		.and()
		.logout()
			.logoutUrl("/logout")
			.deleteCookies(this.sessionCookieName)
			.invalidateHttpSession(true)
			.logoutSuccessHandler(new DefaultLogoutSuccessHandler())
		.and()
		.sessionManagement()
		; 
	
		return http.build();
	}
	
	public class DefaultLogoutSuccessHandler implements LogoutSuccessHandler {
	    @Override
	    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
	            response.setStatus(HttpServletResponse.SC_OK);
	    }
	}
	
	
	private HttpSecurity applyAuthRules(HttpSecurity http) throws Exception {
		
		http
		.authorizeRequests()
		.anyRequest().authenticated();
		
		return http;
	}
	
}
