package com.example.hms.repository;

import com.example.hms.entity.BloodRequest;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository
        extends JpaRepository<BloodRequest, Long> {
}