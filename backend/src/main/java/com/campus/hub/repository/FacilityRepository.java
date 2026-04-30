package com.campus.hub.repository;

import com.campus.hub.model.Facility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends JpaRepository<Facility, Long> {

    @Query("SELECT f FROM Facility f WHERE " +
           "(:type IS NULL OR LOWER(f.type) LIKE LOWER(CONCAT('%', :type, '%'))) AND " +
           "(:location IS NULL OR LOWER(f.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:capacity IS NULL OR f.capacity >= :capacity)")
    List<Facility> searchFacilities(@Param("type") String type, 
                                     @Param("location") String location, 
                                     @Param("capacity") Integer capacity);
}
