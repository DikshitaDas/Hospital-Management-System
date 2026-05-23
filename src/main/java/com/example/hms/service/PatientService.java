package com.example.hms.service;

import com.example.hms.dto.patient.PatientDashboardResponse;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.PrescriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private BillRepository billRepository;

    public PatientDashboardResponse
    getPatientDashboard(Long patientId) {

        Long totalAppointments =
                appointmentRepository.count();

        Long totalPrescriptions =
                prescriptionRepository.count();

        Long pendingBills =
                billRepository.countByStatus(
                        "PENDING"
                );

        Boolean admitted = false;

        return new PatientDashboardResponse(

                totalAppointments,

                totalPrescriptions,

                pendingBills,

                admitted
        );
    }
}