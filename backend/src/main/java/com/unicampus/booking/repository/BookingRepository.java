package com.unicampus.booking.repository;

import com.unicampus.booking.entity.Booking;
import com.unicampus.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByResourceIdAndBookingDate(Long resourceId, LocalDate bookingDate);

    List<Booking> findByResourceIdAndBookingDateAndStatus(
            Long resourceId,
            LocalDate bookingDate,
            BookingStatus status
    );
}