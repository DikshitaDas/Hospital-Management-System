package com.example.hms.repository;

import com.example.hms.entity.Appointment;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository
                extends JpaRepository<Appointment, Long> {

        Long countByDoctorIdAndAppointmentDate(
                        Long doctorId,
                        LocalDate appointmentDate);

        Long countByPatientId(Long patientId);

        @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a WHERE a.doctor.id = :doctorId")
        Long countDistinctPatientsByDoctorId(@Param("doctorId") Long doctorId);

        @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a WHERE a.patient.id = :patientId AND a.doctor.id = :doctorId AND a.appointmentDate = :appointmentDate AND a.status <> 'CANCELLED' AND (:excludedAppointmentId IS NULL OR a.id <> :excludedAppointmentId)")
        boolean existsActiveAppointment(
                        @Param("patientId") Long patientId,
                        @Param("doctorId") Long doctorId,
                        @Param("appointmentDate") LocalDate appointmentDate,
                        @Param("excludedAppointmentId") Long excludedAppointmentId);

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
