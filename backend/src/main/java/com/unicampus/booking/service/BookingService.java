package com.unicampus.booking.service;

import com.unicampus.booking.dto.BookingRequestDTO;
import com.unicampus.booking.dto.BookingResponseDTO;
import com.unicampus.booking.entity.Booking;
import com.unicampus.booking.entity.BookingStatus;
import com.unicampus.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public BookingResponseDTO createBooking(Long userId, BookingRequestDTO request) {

        // 🔥 Conflict check
        List<Booking> conflicts = bookingRepository
                .findByResourceIdAndBookingDate(request.getResourceId(), request.getBookingDate());

        for (Booking b : conflicts) {
            if (b.getStartTime().isBefore(request.getEndTime()) &&
                b.getEndTime().isAfter(request.getStartTime())) {

                throw new RuntimeException("Time slot already booked!");
            }
        }

        // Create entity
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setResourceId(request.getResourceId());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Convert to response
        BookingResponseDTO response = new BookingResponseDTO();
        response.setId(saved.getId());
        response.setUserId(saved.getUserId());
        response.setResourceId(saved.getResourceId());
        response.setBookingDate(saved.getBookingDate());
        response.setStartTime(saved.getStartTime());
        response.setEndTime(saved.getEndTime());
        response.setPurpose(saved.getPurpose());
        response.setExpectedAttendees(saved.getExpectedAttendees());
        response.setStatus(saved.getStatus());

        return response;
    }
}