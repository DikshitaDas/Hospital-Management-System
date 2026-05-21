package com.example.hms.repository;

import com.example.hms.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorProfileRepository
        extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);

    List<DoctorProfile> findByUserNameContainingIgnoreCase(String name);
}