package com.example.hms.repository;

import com.example.hms.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BillRepository
        extends JpaRepository<Bill, Long> {

    List<Bill> findByPatientId(Long patientId);

    Long countByStatus(String status);

    @Query("SELECT SUM(b.amount) FROM Bill b WHERE b.status='PAID'")
    Double getTotalRevenue();

    


}