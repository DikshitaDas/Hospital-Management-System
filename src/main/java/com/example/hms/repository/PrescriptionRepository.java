package com.example.hms.repository;

import com.example.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {
    boolean existsByAppointmentId(Long appointmentId);
}
