package com.unicampus.ticket.repository;

import com.unicampus.ticket.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    long countByStatus(String status);
}

