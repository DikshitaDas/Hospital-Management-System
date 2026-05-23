package com.example.hms.repository;

import com.example.hms.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository
        extends JpaRepository<Ward, Long> {
}