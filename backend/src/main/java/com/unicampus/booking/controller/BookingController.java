package com.unicampus.booking.controller;

import com.unicampus.booking.dto.BookingRequestDTO;
import com.unicampus.booking.dto.BookingResponseDTO;
import com.unicampus.booking.dto.BookingReviewRequestDTO;
import com.unicampus.booking.entity.BookingStatus;
import com.unicampus.booking.service.BookingService;
import com.unicampus.auth.security.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5175",
    "http://localhost:5180"
})public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        BookingResponseDTO response = bookingService.createBooking(request, principal.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getBookingsForUser(principal.getUserId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        return ResponseEntity.ok(bookingService.getAllBookings(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PatchMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> reviewBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingReviewRequestDTO review) {
        return ResponseEntity.ok(bookingService.reviewBooking(id, review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, principal.getUserId()));
    }
}
