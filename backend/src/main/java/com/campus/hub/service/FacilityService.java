package com.campus.hub.service;

import com.campus.hub.model.Facility;
import com.campus.hub.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public List<Facility> searchFacilities(String type, String location, Integer minCapacity) {
        return facilityRepository.searchFacilities(type, location, minCapacity);
    }

    public Optional<Facility> getFacilityById(Long id) {
        return facilityRepository.findById(id);
    }

    public Facility createFacility(Facility facility) {
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(Long id, Facility updatedFacility) {
        return facilityRepository.findById(id).map(facility -> {
            facility.setName(updatedFacility.getName());
            facility.setType(updatedFacility.getType());
            facility.setCapacity(updatedFacility.getCapacity());
            facility.setLocation(updatedFacility.getLocation());
            facility.setAvailabilityWindows(updatedFacility.getAvailabilityWindows());
            facility.setStatus(updatedFacility.getStatus());
            facility.setDescription(updatedFacility.getDescription());
            return facilityRepository.save(facility);
        }).orElseThrow(() -> new RuntimeException("Facility not found with id " + id));
    }

    public void deleteFacility(Long id) {
        facilityRepository.deleteById(id);
    }
}
