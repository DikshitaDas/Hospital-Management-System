package com.example.hms.repository;

import com.example.hms.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalProfileRepository extends JpaRepository<HospitalProfile, Long> {
}
