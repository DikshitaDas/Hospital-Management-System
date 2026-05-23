package com.example.hms.repository;

import com.example.hms.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface AdmissionRepository
                extends JpaRepository<Admission, Long> {
        Optional<Admission> findByPatientIdAndStatus(
                        Long patientId,
                        String status);

        List<Admission> findByPatientId(Long patientId);
}