package com.unicampus.notification.service;

import com.unicampus.notification.dto.NotificationRequestDTO;
import com.unicampus.notification.dto.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {

    NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO);

    List<NotificationResponseDTO> getCurrentUserNotifications(Long userId);

    List<NotificationResponseDTO> getCurrentUserUnreadNotifications(Long userId);

    NotificationResponseDTO markAsRead(Long notificationId, Long userId);

    void deleteNotification(Long notificationId, Long userId);
}
