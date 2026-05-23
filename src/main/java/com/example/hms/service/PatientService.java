package com.example.hms.service;

import com.example.hms.dto.patient.PatientDashboardResponse;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bill;
import com.example.hms.entity.Prescription;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.PrescriptionRepository;
import com.example.hms.dto.patient.RescheduleAppointmentRequest;
import java.util.List;

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

    public PatientDashboardResponse getPatientDashboard(Long patientId) {

        Long totalAppointments = appointmentRepository.count();

        Long totalPrescriptions = prescriptionRepository.count();

        Long pendingBills = billRepository.countByStatus(
                "PENDING");

        Boolean admitted = false;

        return new PatientDashboardResponse(

                totalAppointments,

                totalPrescriptions,

                pendingBills,

                admitted);
    }

    public List<Appointment> getPatientAppointments(
            Long patientId) {

        return appointmentRepository
                .findByPatientId(patientId);
    }

    public String cancelAppointment(
            Long appointmentId) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElse(null);

        if (appointment == null) {
            return "Appointment not found!";
        }

        appointment.setStatus("CANCELLED");

        appointmentRepository.save(appointment);

        return "Appointment cancelled successfully!";
    }

    public String rescheduleAppointment(

            Long appointmentId,

            RescheduleAppointmentRequest request) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElse(null);

        if (appointment == null) {
            return "Appointment not found!";
        }

        appointment.setAppointmentDate(

                request.getAppointmentDate());

        appointment.setStatus("PENDING");

        appointmentRepository.save(appointment);

        return "Appointment rescheduled successfully!";
    }

    public List<Prescription> getPatientPrescriptions(
            Long patientId) {

        return prescriptionRepository
                .findByAppointmentPatientId(
                        patientId);
    }

    public List<Bill> getPatientBills(
            Long patientId) {

        return billRepository
                .findByPatientId(patientId);
    }

    public String payBill(
            Long billId) {

        Bill bill = billRepository
                .findById(billId)
                .orElse(null);

        if (bill == null) {
            return "Bill not found!";
        }

        bill.setStatus("PAID");

        billRepository.save(bill);

        return "Payment successful!";
    }

}