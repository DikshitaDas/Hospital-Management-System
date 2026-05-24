package com.example.hms.repository;

import com.example.hms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

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
}
