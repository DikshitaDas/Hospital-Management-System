package com.example.hms.repository;

import com.example.hms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    

    Optional<User> findByMobile(String mobile);

    Optional<User> findByUhid(String uhid);

    boolean existsByUhid(String uhid);

    List<User> findByRole(String role);

    List<User> findByNameContainingIgnoreCaseAndRole(
            String name,
            String role);

    @Query("""
            SELECT u FROM User u WHERE u.role = :role AND (
                LOWER(u.name) LIKE LOWER(CONCAT('%', :q, '%')) OR
                LOWER(u.uhid) LIKE LOWER(CONCAT('%', :q, '%')) OR
                u.mobile LIKE CONCAT('%', :q, '%'))
            """)
    List<User> searchByRoleAndQuery(
            @Param("role") String role,
            @Param("q") String q);
}
