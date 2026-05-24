package com.example.hms.repository;

import com.example.hms.entity.LabTest;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LabTestRepository
        extends JpaRepository<LabTest, Long> {
}