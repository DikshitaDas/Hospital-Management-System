package com.example.hms.repository;

import com.example.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {
    boolean existsByAppointmentId(Long appointmentId);

    Long countByAppointmentPatientId(Long patientId);

    List<Prescription> findByAppointmentPatientId(Long patientId);

    List<Prescription> findByAppointmentDoctorId(Long doctorId);
}
