package com.example.hms.repository;

import com.example.hms.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpecializationRepository extends JpaRepository<Specialization, Long> {

    Optional<Specialization> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
