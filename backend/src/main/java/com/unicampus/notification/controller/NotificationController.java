package com.unicampus.notification.controller;

import com.unicampus.notification.dto.NotificationRequestDTO;
import com.unicampus.notification.dto.NotificationResponseDTO;
import com.unicampus.notification.service.NotificationService;
import com.unicampus.auth.security.CustomUserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @Valid @RequestBody NotificationRequestDTO requestDTO) {
        NotificationResponseDTO response = notificationService.createNotification(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(notificationService.getCurrentUserNotifications(principal.getUserId()));
    }

    @GetMapping("/me/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getMyUnreadNotifications(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(notificationService.getCurrentUserUnreadNotifications(principal.getUserId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(notificationService.markAsRead(id, principal.getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        notificationService.deleteNotification(id, principal.getUserId());
        return ResponseEntity.ok("Notification deleted successfully");
    }
}
