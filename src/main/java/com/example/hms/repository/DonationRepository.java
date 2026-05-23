package com.example.hms.repository;

import com.example.hms.entity.Donation;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository
        extends JpaRepository<Donation, Long> {
}