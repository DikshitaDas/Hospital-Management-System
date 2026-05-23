package com.example.hms.repository;

import com.example.hms.entity.Appointment;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
                extends JpaRepository<Appointment, Long> {

        Long countByDoctorIdAndAppointmentDate(
                        Long doctorId,
                        LocalDate appointmentDate);

        List<Appointment> findByAppointmentDate(LocalDate date);

        List<Appointment> findByPatientNameContainingIgnoreCase(
                        String name);

        List<Appointment> findByDoctorId(Long doctorId);

        List<Appointment> findByDoctorIdAndPatientNameContainingIgnoreCase(

                        Long doctorId,

                        String name);

        List<Appointment> findByPatientId(Long patientId);

        List<Appointment> findByStatus(String status);
}