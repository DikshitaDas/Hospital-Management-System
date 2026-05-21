package com.example.hms.repository;

import com.example.hms.entity.Appointment;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    Long countByDoctorIdAndAppointmentDate(
            Long doctorId,
            LocalDate appointmentDate);
}