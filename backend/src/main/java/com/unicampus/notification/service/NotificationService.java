package com.unicampus.notification.service;

import com.unicampus.notification.dto.NotificationRequestDTO;
import com.unicampus.notification.dto.NotificationResponseDTO;

import java.util.List;

public interface NotificationService {

    NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO);

    List<NotificationResponseDTO> getNotificationsByUserId(Long userId);

    List<NotificationResponseDTO> getUnreadNotificationsByUserId(Long userId);

    NotificationResponseDTO markAsRead(Long id);

    void deleteNotification(Long id);
}