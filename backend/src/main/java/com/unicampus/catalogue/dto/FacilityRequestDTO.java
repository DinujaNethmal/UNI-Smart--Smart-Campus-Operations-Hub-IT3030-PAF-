package com.unicampus.catalogue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class FacilityRequestDTO {
    @NotBlank(message = "Facility name is required")
    private String name;

    @NotBlank(message = "Facility type is required")
    private String type;

    private String location;

    @Positive(message = "Capacity must be a positive number")
    private Integer capacity;

    private String description;
    private String imageUrl;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
