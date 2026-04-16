package com.unicampus.booking.dto;

import com.unicampus.booking.entity.Booking;
import com.unicampus.booking.entity.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingResponseDTO {

    private Long id;
    private Long resourceId;
    private Long userId;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BookingResponseDTO fromEntity(Booking booking) {
        BookingResponseDTO response = new BookingResponseDTO();
        response.id = booking.getId();
        response.resourceId = booking.getResourceId();
        response.userId = booking.getUserId();
        response.bookingDate = booking.getBookingDate();
        response.startTime = booking.getStartTime();
        response.endTime = booking.getEndTime();
        response.purpose = booking.getPurpose();
        response.expectedAttendees = booking.getExpectedAttendees();
        response.status = booking.getStatus();
        response.rejectionReason = booking.getRejectionReason();
        response.createdAt = booking.getCreatedAt();
        response.updatedAt = booking.getUpdatedAt();
        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getResourceId() {
        return resourceId;
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public String getPurpose() {
        return purpose;
    }

    public Integer getExpectedAttendees() {
        return expectedAttendees;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}