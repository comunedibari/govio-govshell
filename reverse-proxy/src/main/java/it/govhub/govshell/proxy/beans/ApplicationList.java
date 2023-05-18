package it.govhub.govshell.proxy.beans;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.annotation.Generated;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.springframework.hateoas.RepresentationModel;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * ApplicationList
 */

@Generated(value = "it.govhub.openapi.codegen.GovhubCodegenGenerator", date = "2023-05-11T11:25:33.328355764+02:00[Europe/Rome]")
public class ApplicationList extends RepresentationModel<ApplicationList>  {

  @JsonProperty("items")
  @Valid
  private List<Application> items = new ArrayList<>();

  public ApplicationList items(List<Application> items) {
    this.items = items;
    return this;
  }

  public ApplicationList addItemsItem(Application itemsItem) {
    this.items.add(itemsItem);
    return this;
  }

  /**
   * Get items
   * @return items
  */
  @NotNull @Valid @Size(min = 0, max = 2147483647) 
  @Schema(name = "items", required = true)
  public List<Application> getItems() {
    return items;
  }

  public void setItems(List<Application> items) {
    this.items = items;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ApplicationList applicationList = (ApplicationList) o;
    return Objects.equals(this.items, applicationList.items);
  }

  @Override
  public int hashCode() {
    return Objects.hash(items);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ApplicationList {\n");
    sb.append("    items: ").append(toIndentedString(items)).append("\n");
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

