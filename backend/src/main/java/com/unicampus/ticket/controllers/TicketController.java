package com.unicampus.ticket.controllers;

import com.unicampus.ticket.models.Ticket;
import com.unicampus.ticket.service.TicketService;
import com.unicampus.ticket.repository.TicketRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173") // allow React dev server
public class TicketController {
    private final TicketService service;
    private final TicketRepository ticketRepository;

    public TicketController(TicketService service, TicketRepository ticketRepository) {
        this.service = service;
        this.ticketRepository = ticketRepository;
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return service.getTicket(id);
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return service.createTicket(ticket);
    }

    @PutMapping("/{id}")
    public Ticket updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return service.updateTicket(id, ticket);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
    }

     // ✅ Add your summary endpoint here
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
