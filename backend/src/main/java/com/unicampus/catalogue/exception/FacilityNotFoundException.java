package com.unicampus.catalogue.exception;

public class FacilityNotFoundException extends RuntimeException {
    public FacilityNotFoundException(Long id) {
        super("Facility not found with id: " + id);
    }
}
