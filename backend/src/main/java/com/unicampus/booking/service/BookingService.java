package com.unicampus.booking.service;

import com.unicampus.booking.dto.BookingRequestDTO;
import com.unicampus.booking.dto.BookingResponseDTO;
import com.unicampus.booking.dto.BookingReviewRequestDTO;
import com.unicampus.booking.entity.Booking;
import com.unicampus.booking.entity.BookingStatus;
import com.unicampus.booking.exception.BookingConflictException;
import com.unicampus.booking.exception.BookingNotFoundException;
import com.unicampus.booking.exception.InvalidBookingStateException;
import com.unicampus.booking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, Long userId) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time");
        }

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "This resource is already booked during the requested time range"
            );
        }

        Booking booking = new Booking();
        booking.setResourceId(request.getResourceId());
        booking.setUserId(userId);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return BookingResponseDTO.fromEntity(saved);
    }

    public List<BookingResponseDTO> getBookingsForUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings(BookingStatus statusFilter) {
        List<Booking> bookings = (statusFilter != null)
                ? bookingRepository.findByStatus(statusFilter)
                : bookingRepository.findAll();

        return bookings.stream()
                .map(BookingResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException(id));
        return BookingResponseDTO.fromEntity(booking);
    }

    @Transactional
    public BookingResponseDTO reviewBooking(Long bookingId, BookingReviewRequestDTO review) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidBookingStateException(
                    "Only PENDING bookings can be reviewed. Current status: " + booking.getStatus()
            );
        }

        if (review.getDecision() == BookingReviewRequestDTO.ReviewDecision.APPROVE) {
            List<Booking> conflicts = bookingRepository.findConflictingBookings(
                    booking.getResourceId(),
                    booking.getBookingDate(),
                    booking.getStartTime(),
                    booking.getEndTime()
            );

            boolean hasOtherApproved = conflicts.stream()
                    .anyMatch(b -> !b.getId().equals(booking.getId())
                            && b.getStatus() == BookingStatus.APPROVED);

            if (hasOtherApproved) {
                throw new BookingConflictException(
                        "Cannot approve: another booking is already approved for this slot"
                );
            }

            booking.setStatus(BookingStatus.APPROVED);
            booking.setRejectionReason(null);
        } else {
            booking.setStatus(BookingStatus.REJECTED);
            booking.setRejectionReason(review.getReason());
        }

        Booking updated = bookingRepository.save(booking);
        return BookingResponseDTO.fromEntity(updated);
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new InvalidBookingStateException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING
                && booking.getStatus() != BookingStatus.APPROVED) {
            throw new InvalidBookingStateException(
                    "Cannot cancel a booking with status: " + booking.getStatus()
            );
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);
        return BookingResponseDTO.fromEntity(updated);
    }
}