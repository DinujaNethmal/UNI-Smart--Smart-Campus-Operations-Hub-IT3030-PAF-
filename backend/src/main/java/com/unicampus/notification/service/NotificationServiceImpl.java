package com.unicampus.notification.service;

import com.unicampus.auth.entity.User;
import com.unicampus.notification.dto.NotificationRequestDTO;
import com.unicampus.notification.dto.NotificationResponseDTO;
import com.unicampus.notification.entity.Notification;
import com.unicampus.notification.repository.NotificationRepository;
import com.unicampus.auth.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public NotificationServiceImpl(
            NotificationRepository notificationRepository,
            UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Override
    public NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO) {
        User recipient = userService.getUserById(requestDTO.getRecipientUserId());

        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setTitle(requestDTO.getTitle());
        notification.setMessage(requestDTO.getMessage());
        notification.setType(requestDTO.getType());

        Notification saved = notificationRepository.save(notification);
        return mapToResponseDTO(saved);
    }

    @Override
    public List<NotificationResponseDTO> getCurrentUserNotifications(Long userId) {
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public List<NotificationResponseDTO> getCurrentUserUnreadNotifications(Long userId) {
        return notificationRepository.findByUser_IdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    @Override
    public NotificationResponseDTO markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return mapToResponseDTO(updated);
    }

    @Override
    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

        notificationRepository.delete(notification);
    }

    private NotificationResponseDTO mapToResponseDTO(Notification notification) {
        return new NotificationResponseDTO(
                notification.getId(),
                notification.getUser().getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
