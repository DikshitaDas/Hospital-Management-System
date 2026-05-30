package com.example.hms.service;

import com.example.hms.dto.ChangePasswordRequest;
import com.example.hms.dto.UpdateProfileRequest;
import com.example.hms.dto.admin.BloodAvailabilityResponse;
import com.example.hms.dto.admin.BookAppointmentRequest;
import com.example.hms.dto.admin.BookAppointmentResponse;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.admin.PayBillRequest;
import com.example.hms.dto.patient.PatientBookAppointmentRequest;
import com.example.hms.dto.patient.PatientDashboardResponse;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.Admission;
import com.example.hms.entity.User;
import com.example.hms.repository.UserRepository;
import com.example.hms.security.SecurityUtils;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bill;
import com.example.hms.entity.LabReport;
import com.example.hms.entity.Prescription;
import com.example.hms.repository.AdmissionRepository;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.LabReportRepository;
import com.example.hms.repository.PrescriptionRepository;
import com.example.hms.dto.patient.RescheduleAppointmentRequest;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Autowired
        private PrescriptionRepository prescriptionRepository;

        @Autowired
        private BillRepository billRepository;

        @Autowired
        private AdmissionRepository admissionRepository;

        @Autowired
        private AdminService adminService;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private LabReportRepository labReportRepository;

        @Autowired
        private NotificationService notificationService;

        public PatientDashboardResponse getPatientDashboard(Long patientId) {

                Long totalAppointments = appointmentRepository
                                .countByPatientId(patientId);

                Long totalPrescriptions = prescriptionRepository
                                .countByAppointmentPatientId(patientId);

                Long pendingBills = billRepository
                                .countByPatientIdAndStatus(
                                                patientId,
                                                "PENDING");

                Boolean admitted = admissionRepository
                                .existsByPatientIdAndStatus(
                                                patientId,
                                                "ADMITTED");

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

        public List<DoctorProfile> searchDoctors(String name) {

                return adminService.searchDoctors(name);
        }

        public BookAppointmentResponse bookAppointment(
                        PatientBookAppointmentRequest request) {

                User patient = getCurrentPatient();

                BookAppointmentRequest book = new BookAppointmentRequest();
                book.setPatientId(patient.getId());
                book.setDoctorId(request.getDoctorId());
                book.setAppointmentDate(request.getAppointmentDate());

                BookAppointmentResponse response = adminService.bookAppointment(book);

                if (response.getBillId() != null
                                && Boolean.TRUE.equals(request.getPayNow())) {

                        String method = request.getPaymentMethod();

                        if (method == null || method.isBlank()) {
                                method = "UPI";
                        }

                        PayBillRequest pay = new PayBillRequest();
                        pay.setPaymentMethod(method);

                        payBill(response.getBillId(), pay);

                        response.setMessage(
                                        "Appointment booked and consultation fee paid (Rs. "
                                                        + response.getConsultationFee()
                                                        + ").");

                        response.setBillStatus("PAID");
                }

                return response;
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

                if (appointmentRepository.existsActiveAppointment(
                                appointment.getPatient().getId(),
                                appointment.getDoctor().getId(),
                                request.getAppointmentDate(),
                                appointment.getId())) {

                        return "Appointment already exists for this patient and doctor on this date!";
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

        public String payBill(Long billId, PayBillRequest request) {

                User patient = getCurrentPatient();

                Bill bill = billRepository
                                .findById(billId)
                                .orElse(null);

                if (bill == null) {
                        return "Bill not found!";
                }

                if (!bill.getPatient().getId().equals(patient.getId())) {
                        return "You can only pay your own bills!";
                }

                if ("PAID".equals(bill.getStatus())) {
                        return "Bill already paid!";
                }

                bill.setStatus("PAID");
                bill.setPaymentMethod(request.getPaymentMethod().trim().toUpperCase());

                billRepository.save(bill);

                notificationService
                                .createNotification(

                                                "Payment Successful",

                                                "Your payment was successful.",

                                                "PATIENT",

                                                bill.getPatient().getId());

                return "Payment successful!";
        }

        public List<Admission> getPatientAdmissions(
                        Long patientId) {

                return admissionRepository
                                .findByPatientId(patientId);
        }

        public BloodAvailabilityResponse checkBloodAvailability(
                        String bloodGroup) {

                return adminService
                                .checkBloodAvailability(
                                                bloodGroup);
        }

        public String requestBlood(CreateBloodRequest request) {

                User patient = getCurrentPatient();
                request.setPatientId(patient.getId());

                return adminService.requestBlood(request);
        }

        public User getPatientProfile() {

                return resolveCurrentPatient();
        }

        public User getPatientProfile(Long patientId) {

                User current = resolveCurrentPatient();

                if (!current.getId().equals(patientId)) {
                        throw new IllegalStateException(
                                        "You can only view your own profile.");
                }

                return current;
        }

        private User resolveCurrentPatient() {

                User fromContext = SecurityUtils.getCurrentUser();

                if (fromContext != null) {
                        return fromContext;
                }

                String uhid = SecurityUtils.getCurrentUhid();

                if (uhid != null && !uhid.isBlank()) {
                        return userRepository
                                        .findByUhid(uhid)
                                        .orElseThrow(() -> new IllegalStateException(
                                                        "Patient not found"));
                }

                throw new IllegalStateException("Not authenticated");
        }

        private User getCurrentPatient() {

                return resolveCurrentPatient();
        }

        public String updatePatientProfile(

                        Long patientId,

                        UpdateProfileRequest request) {

                User patient = userRepository
                                .findById(patientId)
                                .orElse(null);

                if (patient == null) {
                        return "Patient not found!";
                }

                patient.setName(request.getName());

                patient.setGender(request.getGender());

                patient.setAge(request.getAge());

                patient.setMobile(request.getMobile());

                userRepository.save(patient);

                return "Patient profile updated successfully!";
        }

        public String changePatientPassword(

                        Long patientId,

                        ChangePasswordRequest request) {

                User patient = userRepository
                                .findById(patientId)
                                .orElse(null);

                if (patient == null) {
                        return "Patient not found!";
                }

                boolean matched = passwordEncoder.matches(

                                request.getOldPassword(),

                                patient.getPassword());

                if (!matched) {
                        return "Old password incorrect!";
                }

                patient.setPassword(

                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(patient);

                return "Password changed successfully!";
        }

        public List<LabReport> getPatientLabReports(
                        Long patientId) {

                return labReportRepository

                                .findByAppointmentPatientId(
                                                patientId);
        }

}
