package com.campus.hub.controller;

import com.campus.hub.model.Facility;
import com.campus.hub.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "*") // For local dev CORS handling
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    // GET /api/facilities (with filtering)
    @GetMapping
    public List<Facility> getAllFacilities(@RequestParam(required = false) String type, 
                                            @RequestParam(required = false) String location, 
                                            @RequestParam(required = false) Integer minCapacity) {
        if (type != null || location != null || minCapacity != null) {
            return facilityService.searchFacilities(type, location, minCapacity);
        }
        return facilityService.getAllFacilities();
    }

    // GET /api/facilities/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable Long id) {
        return facilityService.getFacilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/facilities
    @PostMapping
    public ResponseEntity<Facility> createFacility(@Valid @RequestBody Facility facility) {
        Facility created = facilityService.createFacility(facility);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/facilities/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable Long id, @Valid @RequestBody Facility facility) {
        try {
            return ResponseEntity.ok(facilityService.updateFacility(id, facility));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE /api/facilities/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        try {
            facilityService.deleteFacility(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
