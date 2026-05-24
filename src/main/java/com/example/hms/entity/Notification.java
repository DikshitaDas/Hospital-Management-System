package com.example.hms.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data

public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String title;

    private String message;

    private String role;

    private Long userId;

    private Boolean isRead = false;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}