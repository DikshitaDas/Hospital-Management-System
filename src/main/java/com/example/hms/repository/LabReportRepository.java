package com.example.hms.repository;

import com.example.hms.entity.LabReport;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LabReportRepository
        extends JpaRepository<LabReport, Long> {
    List<LabReport> findByAppointmentPatientId(
            Long patientId);
}