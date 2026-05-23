package com.example.hms.repository;

import com.example.hms.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BedRepository
                extends JpaRepository<Bed, Long> {

        List<Bed> findByStatus(String status);

        Long countByWardId(Long wardId);

        Long countByWardIdAndStatus(
                        Long wardId,
                        String status);

        Optional<Bed> findFirstByWardWardTypeAndStatus(
                        String wardType,
                        String status);
}