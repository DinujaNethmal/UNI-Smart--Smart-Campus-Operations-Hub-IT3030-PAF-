package com.campus.hub;

import com.campus.hub.model.Facility;
import com.campus.hub.repository.FacilityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(FacilityRepository repository) {
        return args -> {
            repository.save(new Facility(null, "Newton Auditorium", "LECTURE_HALL", 500, "Block A", "08:00-20:00", Facility.Status.ACTIVE, "Large hall for main lectures."));
            repository.save(new Facility(null, "Edison Lab", "LAB", 40, "Block B, Room 204", "09:00-18:00", Facility.Status.ACTIVE, "Advanced electrical engineering lab."));
            repository.save(new Facility(null, "Einstein Room", "MEETING_ROOM", 12, "Block C, 3rd Floor", "08:00-22:00", Facility.Status.ACTIVE, "Small room for group meetings."));
            repository.save(new Facility(null, "Projector P-001", "EQUIPMENT", 0, "Inventory Room", "Always", Facility.Status.ACTIVE, "Portable Epson 4K Projector."));
            repository.save(new Facility(null, "Main Hall Cinema", "LECTURE_HALL", 300, "Block A, Basement", "08:00-18:00", Facility.Status.OUT_OF_SERVICE, "Currently under renovation."));
        };
    }
}
