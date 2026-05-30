package com.example.hms.repository;

import com.example.hms.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorProfileRepository
        extends JpaRepository<DoctorProfile, Long> {
    Optional<DoctorProfile> findByUserId(Long userId);

    List<DoctorProfile> findByUserNameContainingIgnoreCase(String name);

    @Query("""
            SELECT d FROM DoctorProfile d WHERE
                LOWER(d.user.name) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(d.user.uhid) LIKE LOWER(CONCAT('%', :q, '%')) OR
                d.user.mobile LIKE CONCAT('%', :q, '%')
            """)
    List<DoctorProfile> searchByQuery(@Param("q") String q);
}