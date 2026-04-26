package com.unicampus.ticket.service;

import com.unicampus.ticket.models.Ticket;
import com.unicampus.ticket.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    private final TicketRepository repo;

    public TicketService(TicketRepository repo) {
        this.repo = repo;
    }

    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    public Ticket getTicket(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Ticket createTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    public Ticket updateTicket(Long id, Ticket updated) {
        Ticket existing = getTicket(id);
        existing.setCategory(updated.getCategory());
        existing.setTitle(updated.getTitle());
        existing.setResource(updated.getResource());
        existing.setDescription(updated.getDescription());
        existing.setPriority(updated.getPriority());
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());
        existing.setStatus(updated.getStatus());
        return repo.save(existing);
    }

    public void deleteTicket(Long id) {
        repo.deleteById(id);
    }
}
