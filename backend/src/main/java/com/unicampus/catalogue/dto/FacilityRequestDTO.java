package com.unicampus.catalogue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.time.LocalTime;

@Data
public class FacilityRequestDTO {
    @NotBlank(message = "Facility name is required")
    @jakarta.validation.constraints.Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Facility type is required")
    private String type;

    private String location;

    @Positive(message = "Capacity must be a positive number")
    private Integer capacity;

    private String description;
    private String imageUrl;

    @NotBlank(message = "Facility status is required")
    private String status;

    private LocalTime availabilityStart;
    private LocalTime availabilityEnd;
}
