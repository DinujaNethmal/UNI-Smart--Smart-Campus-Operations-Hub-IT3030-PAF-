package com.unicampus.ticket.controllers;

import com.unicampus.ticket.models.Ticket;
import com.unicampus.ticket.service.TicketService;
import com.unicampus.ticket.repository.TicketRepository;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(originPatterns = "http://localhost:*")
public class TicketController {

    private final TicketService service;
    private final TicketRepository ticketRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public TicketController(TicketService service, TicketRepository ticketRepository) {
        this.service = service;
        this.ticketRepository = ticketRepository;
    }

    // ✅ GET ALL
    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return service.getTicket(id);
    }

    // 🔥 CREATE WITH IMAGES (multipart/form-data)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTicket(
            @RequestParam String category,
            @RequestParam String title,
            @RequestParam String resource,
            @RequestParam String description,
            @RequestParam String priority,
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String email,
            @RequestParam(required = false) List<MultipartFile> images
    ) {
        try {
            List<String> imageUrls = new ArrayList<>();

            if (images != null && !images.isEmpty()) {
                for (MultipartFile file : images) {
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);

                    Files.createDirectories(filePath.getParent());
                    Files.write(filePath, file.getBytes());

                    String fileUrl = "http://localhost:8081/uploads/" + fileName;
                    imageUrls.add(fileUrl);
                }
            }

            Ticket ticket = new Ticket();
            ticket.setCategory(category);
            ticket.setTitle(title);
            ticket.setResource(resource);
            ticket.setDescription(description);
            ticket.setPriority(priority);
            ticket.setName(name);
            ticket.setPhone(phone);
            ticket.setEmail(email);
            ticket.setImages(imageUrls);

            Ticket saved = service.createTicket(ticket);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving ticket: " + e.getMessage());
        }
    }

    // 🔄 UPDATE (JSON only for now)
    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return service.updateTicket(id, ticket);
    }

    // ❌ DELETE
    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
    }

    // 📊 STATUS SUMMARY
    @GetMapping("/status-summary")
    public Map<String, Long> getStatusSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("OPEN", ticketRepository.countByStatus("OPEN"));
        summary.put("IN_PROGRESS", ticketRepository.countByStatus("IN_PROGRESS"));
        summary.put("RESOLVED", ticketRepository.countByStatus("RESOLVED"));
        summary.put("CLOSED", ticketRepository.countByStatus("CLOSED"));
        return summary;
    }
}
