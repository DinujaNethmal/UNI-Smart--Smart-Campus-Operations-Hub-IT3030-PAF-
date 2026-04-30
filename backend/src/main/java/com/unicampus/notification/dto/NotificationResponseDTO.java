package com.unicampus.notification.dto;

import java.time.LocalDateTime;

public class NotificationResponseDTO {

    private final Long id;
    private final Long userId;
    private final String title;
    private final String message;
    private final String type;
    private final boolean read;
    private final LocalDateTime createdAt;

    public NotificationResponseDTO(
            Long id,
            Long userId,
            String title,
            String message,
            String type,
            boolean read,
            LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }

    public boolean isRead() {
        return read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
