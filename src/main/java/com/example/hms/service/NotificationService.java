package com.example.hms.service;

import com.example.hms.entity.Notification;
import com.example.hms.repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository
            notificationRepository;

    // CREATE NOTIFICATION
    public void createNotification(

            String title,

            String message,

            String role,

            Long userId
    ) {

        Notification notification =
                new Notification();

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setRole(role);

        notification.setUserId(userId);

        notificationRepository.save(
                notification
        );
    }

    // GET USER NOTIFICATIONS
    public List<Notification>
    getUserNotifications(Long userId) {

        return notificationRepository

                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }
}