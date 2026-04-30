package com.unicampus.booking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookingReviewRequestDTO {

    @NotNull(message = "Decision is required")
    private ReviewDecision decision;

    @Size(max = 500, message = "Reason must be under 500 characters")
    private String reason;

    public enum ReviewDecision {
        APPROVE,
        REJECT
    }

    public ReviewDecision getDecision() {
        return decision;
    }

    public void setDecision(ReviewDecision decision) {
        this.decision = decision;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}