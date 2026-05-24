package com.example.hms.service;

import com.example.hms.entity.Notification;
import com.example.hms.repository.NotificationRepository;
import com.example.hms.repository.UserRepository;
import com.example.hms.security.SecurityUtils;
import com.example.hms.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

        @Autowired
        private NotificationRepository notificationRepository;

        @Autowired
        private UserRepository userRepository;

        // CREATE NOTIFICATION
        public void createNotification(

                        String title,

                        String message,

                        String role,

                        Long userId) {

                Notification notification = new Notification();

                notification.setTitle(title);

                notification.setMessage(message);

                notification.setRole(role);

                notification.setUserId(userId);

                notificationRepository.save(
                                notification);
        }

        public List<Notification> getUserNotifications() {

                String uhid = SecurityUtils.getCurrentUhid();

                User user = userRepository
                                .findByUhid(uhid)
                                .orElse(null);

                if (user == null) {
                        return List.of();
                }

                return notificationRepository

                                .findByUserIdOrderByCreatedAtDesc(
                                                user.getId());
        }
}