package it.govhub.govshell.proxy.beans;

import java.net.URI;
import java.util.Objects;

import javax.annotation.Generated;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.hateoas.RepresentationModel;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Application
 */

@Generated(value = "it.govhub.openapi.codegen.GovhubCodegenGenerator", date = "2023-05-11T11:25:33.328355764+02:00[Europe/Rome]")
public class Application extends RepresentationModel<Application>  {

  @JsonProperty("application_id")
  private String applicationId;

  @JsonProperty("application_name")
  private String applicationName;

  @JsonProperty("deployed_uri")
  private URI deployedUri;
  
  @JsonProperty("webapp_uri")
  private URI webappUri;

  @JsonProperty("logo")
  private Object logo;

  public Application applicationId(String applicationId) {
    this.applicationId = applicationId;
    return this;
  }

  /**
   * Get applicationId
   * @return applicationId
  */
  @Pattern(regexp = "^[a-zA-Z0-9_\\-]+$") @Size(max = 256) 
  @Schema(name = "application_id", example = "govregistry", required = false)
  public String getApplicationId() {
    return applicationId;
  }

  public void setApplicationId(String applicationId) {
    this.applicationId = applicationId;
  }

  public Application applicationName(String applicationName) {
    this.applicationName = applicationName;
    return this;
  }

  /**
   * Get applicationName
   * @return applicationName
  */
  @Pattern(regexp = "^[a-zA-Z0-9_\\-]+$") @Size(max = 256) 
  @Schema(name = "application_name", example = "govregistry", required = false)
  public String getApplicationName() {
    return applicationName;
  }

  public void setApplicationName(String applicationName) {
    this.applicationName = applicationName;
  }

  public Application deployedUri(URI deployedUri) {
    this.deployedUri = deployedUri;
    return this;
  }
  
  public Application webappUri(URI webappUri) {
	    this.webappUri = webappUri;
	    return this;
	  }

  /**
   * Get deployedUri
   * @return deployedUri
  */
  @Valid 
  @Schema(name = "deployed_uri", required = false)
  public URI getDeployedUri() {
    return deployedUri;
  }

  public void setDeployedUri(URI deployedUri) {
    this.deployedUri = deployedUri;
  }
  
  /**
   * Get webappUri
   * @return webappUri
  */
  @Valid 
  @Schema(name = "webapp_uri", required = false)
  public URI getWebappUri() {
    return webappUri;
  }

  public void setWebappUri(URI deployedUri) {
    this.webappUri = deployedUri;
  }

  public Application logo(Object logo) {
    this.logo = logo;
    return this;
  }

  /**
   * Get logo
   * @return logo
  */
  
  @Schema(name = "logo", required = false)
  public Object getLogo() {
    return logo;
  }

  public void setLogo(Object logo) {
    this.logo = logo;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Application application = (Application) o;
    return Objects.equals(this.applicationId, application.applicationId) &&
        Objects.equals(this.applicationName, application.applicationName) &&
        Objects.equals(this.deployedUri, application.deployedUri) &&
        Objects.equals(this.webappUri, application.webappUri) &&
        Objects.equals(this.logo, application.logo);
  }

  @Override
  public int hashCode() {
    return Objects.hash(applicationId, applicationName, deployedUri, logo);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class Application {\n");
    sb.append("    applicationId: ").append(toIndentedString(applicationId)).append("\n");
    sb.append("    applicationName: ").append(toIndentedString(applicationName)).append("\n");
    sb.append("    deployedUri: ").append(toIndentedString(deployedUri)).append("\n");
    sb.append("    webappUri: ").append(toIndentedString(webappUri)).append("\n");
    sb.append("    logo: ").append(toIndentedString(logo)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

