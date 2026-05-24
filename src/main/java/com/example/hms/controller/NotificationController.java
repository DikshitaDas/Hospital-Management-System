package com.example.hms.controller;

import com.example.hms.entity.Notification;
import com.example.hms.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

        @Autowired
        private NotificationService notificationService;

        @GetMapping
        public List<Notification> getNotifications() {

                return notificationService
                                .getUserNotifications();
        }
}