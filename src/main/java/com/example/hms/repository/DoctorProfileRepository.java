package com.example.hms.repository;

import com.example.hms.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorProfileRepository
        extends JpaRepository<DoctorProfile, Long> {
}