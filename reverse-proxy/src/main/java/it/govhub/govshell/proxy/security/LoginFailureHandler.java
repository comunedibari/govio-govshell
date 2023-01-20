package it.govhub.govshell.proxy.security;

import java.io.IOException;
import java.net.URI;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import it.govhub.govregistry.commons.beans.AuthenticationProblem;
import it.govhub.govregistry.commons.exception.UnreachableException;
import it.govhub.govregistry.commons.exception.handlers.RestResponseEntityExceptionHandler;
import it.govhub.govregistry.commons.messages.SystemMessages;



@Component
public class LoginFailureHandler  extends SimpleUrlAuthenticationFailureHandler {

	@Autowired
	private ObjectMapper jsonMapper;
	
	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		
		AuthenticationProblem problem = new AuthenticationProblem();
		
		// Non è stato possibile trovare l'utente o la password è errata
		if ( exception instanceof BadCredentialsException) {
			problem.status = HttpStatus.FORBIDDEN.value();
			problem.title = HttpStatus.FORBIDDEN.getReasonPhrase();
			problem.detail = exception.getLocalizedMessage();
		} else {
			problem.status = HttpStatus.INTERNAL_SERVER_ERROR.value();
			problem.title = HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase();
			problem.detail = SystemMessages.internalError();
		}
		
		// imposto il content-type della risposta
		response.addHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PROBLEM_JSON_VALUE);
		response.setStatus(problem.status);
		
		ServletOutputStream outputStream = null;
		try{
			problem.instance = new URI(RestResponseEntityExceptionHandler.problemTypes.get(HttpStatus.FORBIDDEN));
			outputStream = response.getOutputStream();
			this.jsonMapper.writeValue(outputStream, problem);
			outputStream.flush();
		}catch(Exception e) {
			throw new UnreachableException(e);
		}
	}

}