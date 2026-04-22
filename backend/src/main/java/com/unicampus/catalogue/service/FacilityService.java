package com.unicampus.catalogue.service;

import com.unicampus.catalogue.dto.FacilityRequestDTO;
import com.unicampus.catalogue.dto.FacilityResponseDTO;
import com.unicampus.catalogue.entity.Facility;
import com.unicampus.catalogue.exception.FacilityNotFoundException;
import com.unicampus.catalogue.repository.FacilityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for managing campus facilities and assets.
 * Handles business logic for facility lifecycle management.
 */
@Service
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public FacilityService(FacilityRepository facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    @Transactional
    public FacilityResponseDTO createFacility(FacilityRequestDTO request) {
        Facility facility = Facility.builder()
                .name(request.getName())
                .type(request.getType())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus())
                .availabilityStart(request.getAvailabilityStart())
                .availabilityEnd(request.getAvailabilityEnd())
                .build();

        Facility saved = facilityRepository.save(facility);
        return FacilityResponseDTO.fromEntity(saved);
    }

    public List<FacilityResponseDTO> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(FacilityResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public FacilityResponseDTO getFacilityById(Long id) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new FacilityNotFoundException(id));
        return FacilityResponseDTO.fromEntity(facility);
    }

    @Transactional
    public FacilityResponseDTO updateFacility(Long id, FacilityRequestDTO request) {
        Facility facility = facilityRepository.findById(id)
                .orElseThrow(() -> new FacilityNotFoundException(id));

        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setLocation(request.getLocation());
        facility.setCapacity(request.getCapacity());
        facility.setDescription(request.getDescription());
        facility.setImageUrl(request.getImageUrl());

        Facility updated = facilityRepository.save(facility);
        return FacilityResponseDTO.fromEntity(updated);
    }

    @Transactional
    public void deleteFacility(Long id) {
        if (!facilityRepository.existsById(id)) {
            throw new FacilityNotFoundException(id);
        }
        facilityRepository.deleteById(id);
    }
}
