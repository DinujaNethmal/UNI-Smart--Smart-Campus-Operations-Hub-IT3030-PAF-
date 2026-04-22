package com.unicampus.catalogue.controller;

import com.unicampus.catalogue.dto.FacilityRequestDTO;
import com.unicampus.catalogue.dto.FacilityResponseDTO;
import com.unicampus.catalogue.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/facilities")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5180"
})
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @PostMapping
    public ResponseEntity<FacilityResponseDTO> createFacility(@Valid @RequestBody FacilityRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facilityService.createFacility(request));
    }

    @GetMapping
    public ResponseEntity<List<FacilityResponseDTO>> getAllFacilities() {
        return ResponseEntity.ok(facilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacilityResponseDTO> getFacilityById(@PathVariable Long id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacilityResponseDTO> updateFacility(
            @PathVariable Long id,
            @Valid @RequestBody FacilityRequestDTO request) {
        return ResponseEntity.ok(facilityService.updateFacility(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}
