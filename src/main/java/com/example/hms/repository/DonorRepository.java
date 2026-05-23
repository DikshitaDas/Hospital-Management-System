package com.example.hms.repository;

import com.example.hms.entity.Donor;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorRepository
        extends JpaRepository<Donor, Long> {
}