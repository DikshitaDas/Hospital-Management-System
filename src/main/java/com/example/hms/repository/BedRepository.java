package com.example.hms.repository;

import com.example.hms.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BedRepository
        extends JpaRepository<Bed, Long> {

    List<Bed> findByStatus(String status);

    Long countByWardId(Long wardId);

    Long countByWardIdAndStatus(
            Long wardId,
            String status);
            
}