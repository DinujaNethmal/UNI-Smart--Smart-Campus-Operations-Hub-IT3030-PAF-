package com.campus.hub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Facility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type; // e.g. LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT

    @Min(value = 0, message = "Capacity must be a positive number")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String availabilityWindows; // Store as JSON or string like "08:00-17:00"

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    private String description;

    public enum Status {
        ACTIVE, OUT_OF_SERVICE
    }
}
