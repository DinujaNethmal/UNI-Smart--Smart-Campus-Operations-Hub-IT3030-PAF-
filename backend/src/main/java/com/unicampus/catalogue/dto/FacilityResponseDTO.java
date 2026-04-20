package com.unicampus.catalogue.dto;

import com.unicampus.catalogue.entity.Facility;
import java.time.LocalDateTime;

public class FacilityResponseDTO {
    private Long id;
    private String name;
    private String type;
    private String location;
    private Integer capacity;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    public static FacilityResponseDTO fromEntity(Facility facility) {
        FacilityResponseDTO response = new FacilityResponseDTO();
        response.id = facility.getId();
        response.name = facility.getName();
        response.type = facility.getType();
        response.location = facility.getLocation();
        response.capacity = facility.getCapacity();
        response.description = facility.getDescription();
        response.imageUrl = facility.getImageUrl();
        response.createdAt = facility.getCreatedAt();
        return response;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public String getLocation() { return location; }
    public Integer getCapacity() { return capacity; }
    public String getDescription() { return description; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
