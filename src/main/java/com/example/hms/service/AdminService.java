package com.example.hms.service;

import com.example.hms.dto.ChangePasswordRequest;
import com.example.hms.dto.UpdateProfileRequest;
import com.example.hms.dto.admin.AddBedRequest;
import com.example.hms.dto.admin.AddBloodStockRequest;
import com.example.hms.dto.admin.AddDoctorRequest;
import com.example.hms.dto.admin.AddDonorRequest;
import com.example.hms.dto.admin.AddWardRequest;
import com.example.hms.dto.admin.AdmitPatientRequest;
import com.example.hms.dto.admin.BloodAvailabilityResponse;
import com.example.hms.dto.admin.BookAppointmentRequest;
import com.example.hms.dto.admin.CreateBillRequest;
import com.example.hms.dto.admin.CreateBloodRequest;
import com.example.hms.dto.admin.CreatePrescriptionRequest;
import com.example.hms.dto.admin.DashboardStatsResponse;
import com.example.hms.dto.admin.DonateBloodRequest;
import com.example.hms.dto.admin.EmergencyAdmissionRequest;
import com.example.hms.dto.admin.RescheduleAppointmentRequest;
import com.example.hms.dto.admin.TransferPatientRequest;
import com.example.hms.dto.admin.UpdateDoctorRequest;
import com.example.hms.dto.admin.UpdatePatientRequest;
import com.example.hms.dto.admin.UpdateRoleRequest;
import com.example.hms.dto.admin.UpdateWardRequest;
import com.example.hms.dto.admin.WardOccupancyResponse;
import com.example.hms.entity.Admission;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bed;
import com.example.hms.entity.Bill;
import com.example.hms.entity.BloodRequest;
import com.example.hms.entity.BloodStock;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.Donation;
import com.example.hms.entity.Donor;
import com.example.hms.entity.Prescription;
import com.example.hms.entity.User;
import com.example.hms.entity.Ward;
import com.example.hms.repository.AdmissionRepository;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BedRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.BloodRequestRepository;
import com.example.hms.repository.BloodStockRepository;
import com.example.hms.repository.DoctorProfileRepository;
import com.example.hms.repository.DonationRepository;
import com.example.hms.repository.DonorRepository;
import com.example.hms.repository.PrescriptionRepository;
import com.example.hms.repository.UserRepository;
import com.example.hms.repository.WardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class AdminService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private DoctorProfileRepository doctorProfileRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private AppointmentRepository appointmentRepository;

        @Autowired
        private WardRepository wardRepository;

        @Autowired
        private BedRepository bedRepository;

        @Autowired
        private AdmissionRepository admissionRepository;

        @Autowired
        private PrescriptionRepository prescriptionRepository;

        @Autowired
        private BloodRequestRepository bloodRequestRepository;

        @Autowired
        private DonorRepository donorRepository;

        @Autowired
        private DonationRepository donationRepository;

        // Get all patients
        public List<User> getAllPatients() {

                return userRepository.findByRole("PATIENT");
        }

        @Autowired
        private BillRepository billRepository;
        @Autowired
        private BloodStockRepository bloodStockRepository;

        @Autowired
        private NotificationService notificationService;

        public List<User> searchPatients(String name) {

                return userRepository
                                .findByNameContainingIgnoreCaseAndRole(
                                                name,
                                                "PATIENT");
        }

        public String deletePatient(Long id) {

                User user = userRepository.findById(id)
                                .orElse(null);

                if (user == null) {
                        return "Patient not found!";
                }

                userRepository.delete(user);

                return "Patient deleted successfully!";
        }

        public String updatePatient(
                        Long id,
                        UpdatePatientRequest request) {

                User user = userRepository.findById(id)
                                .orElse(null);

                if (user == null) {
                        return "Patient not found!";
                }

                user.setName(request.getName());
                user.setGender(request.getGender());
                user.setAge(request.getAge());
                user.setMobile(request.getMobile());

                userRepository.save(user);

                return "Patient updated successfully!";
        }

        public String addDoctor(AddDoctorRequest request) {

                if (userRepository.findByMobile(request.getMobile()).isPresent()) {
                        return "Mobile already registered!";
                }

                // CREATE USER
                User user = new User();

                user.setUhid(generateUHID());
                user.setName(request.getName());
                user.setGender(request.getGender());
                user.setAge(request.getAge());
                user.setMobile(request.getMobile());

                user.setPassword(
                                passwordEncoder.encode(request.getPassword()));

                user.setRole("DOCTOR");

                User savedUser = userRepository.save(user);

                // CREATE DOCTOR PROFILE
                DoctorProfile doctorProfile = new DoctorProfile();

                doctorProfile.setSpecialization(
                                request.getSpecialization());

                doctorProfile.setDepartment(
                                request.getDepartment());

                doctorProfile.setConsultationFee(
                                request.getConsultationFee());

                doctorProfile.setAvailability(
                                request.getAvailability());

                // RELATIONSHIP
                doctorProfile.setUser(savedUser);

                doctorProfileRepository.save(doctorProfile);

                return "Doctor added successfully!";
        }

        private String generateUHID() {

                Random random = new Random();

                int number = 100000 + random.nextInt(900000);

                return "HMS" + number;
        }

        public List<DoctorProfile> getAllDoctors() {

                return doctorProfileRepository.findAll();
        }

        public String deleteDoctor(Long userId) {

                DoctorProfile doctorProfile = doctorProfileRepository
                                .findByUserId(userId)
                                .orElse(null);

                if (doctorProfile == null) {
                        return "Doctor not found!";
                }
                // DELETE DOCTOR PROFILE
                doctorProfileRepository.delete(doctorProfile);
                // DELETE USER
                userRepository.delete(doctorProfile.getUser());
                return "Doctor deleted successfully!";
        }

        public List<DoctorProfile> searchDoctors(
                        String name) {

                return doctorProfileRepository
                                .findByUserNameContainingIgnoreCase(name);
        }

        public String updateDoctor(
                        Long userId,
                        UpdateDoctorRequest request) {

                DoctorProfile doctorProfile = doctorProfileRepository
                                .findByUserId(userId)
                                .orElse(null);

                if (doctorProfile == null) {
                        return "Doctor not found!";
                }

                // USER TABLE UPDATE
                User user = doctorProfile.getUser();

                user.setName(request.getName());
                user.setGender(request.getGender());
                user.setAge(request.getAge());
                user.setMobile(request.getMobile());

                userRepository.save(user);

                // DOCTOR PROFILE UPDATE
                doctorProfile.setSpecialization(
                                request.getSpecialization());

                doctorProfile.setDepartment(
                                request.getDepartment());

                doctorProfile.setConsultationFee(
                                request.getConsultationFee());

                doctorProfile.setAvailability(
                                request.getAvailability());

                doctorProfileRepository.save(doctorProfile);

                return "Doctor updated successfully!";
        }

        public String bookAppointment(
                        BookAppointmentRequest request) {

                // FIND PATIENT
                User patient = userRepository
                                .findById(request.getPatientId())
                                .orElse(null);

                if (patient == null ||
                                !patient.getRole().equals("PATIENT")) {

                        return "Patient not found!";
                }

                // FIND DOCTOR
                User doctor = userRepository
                                .findById(request.getDoctorId())
                                .orElse(null);

                if (doctor == null ||
                                !doctor.getRole().equals("DOCTOR")) {

                        return "Doctor not found!";
                }

                // CREATE APPOINTMENT
                Appointment appointment = new Appointment();

                appointment.setAppointmentDate(
                                request.getAppointmentDate());

                appointment.setStatus("BOOKED");

                // RELATIONSHIPS
                appointment.setPatient(patient);

                appointment.setDoctor(doctor);

                // GENERATE TOKEN NUMBER

                Long totalAppointments = appointmentRepository
                                .countByDoctorIdAndAppointmentDate(
                                                doctor.getId(),
                                                request.getAppointmentDate());

                appointment.setTokenNumber(
                                totalAppointments.intValue() + 1);

                appointmentRepository.save(appointment);

                return "Appointment booked successfully!";
        }

        public List<Appointment> getAllAppointments() {
                return appointmentRepository.findAll();
        }

        public String cancelAppointment(Long id) {

                Appointment appointment = appointmentRepository
                                .findById(id)
                                .orElse(null);

                if (appointment == null) {
                        return "Appointment not found!";
                }

                appointment.setStatus("CANCELLED");

                appointmentRepository.save(appointment);

                return "Appointment cancelled successfully!";
        }

        public String rescheduleAppointment(

                        Long id,

                        RescheduleAppointmentRequest request) {

                Appointment appointment = appointmentRepository
                                .findById(id)
                                .orElse(null);

                if (appointment == null) {
                        return "Appointment not found!";
                }

                appointment.setAppointmentDate(
                                request.getAppointmentDate());

                appointment.setStatus("RESCHEDULED");

                appointmentRepository.save(appointment);

                return "Appointment rescheduled successfully!";
        }

        public String approveAppointment(Long id) {

                Appointment appointment = appointmentRepository
                                .findById(id)
                                .orElse(null);

                if (appointment == null) {
                        return "Appointment not found!";
                }

                appointment.setStatus("APPROVED");

                appointmentRepository.save(appointment);

                return "Appointment approved successfully!";
        }

        public String addWard(
                        AddWardRequest request) {

                Ward ward = new Ward();

                ward.setWardName(request.getWardName());

                ward.setWardType(request.getWardType());

                ward.setTotalBeds(request.getTotalBeds());

                wardRepository.save(ward);

                return "Ward added successfully!";
        }

        public String addBed(
                        AddBedRequest request) {

                Ward ward = wardRepository
                                .findById(request.getWardId())
                                .orElse(null);

                if (ward == null) {
                        return "Ward not found!";
                }

                Bed bed = new Bed();

                bed.setBedNumber(request.getBedNumber());

                bed.setStatus("AVAILABLE");

                // RELATIONSHIP
                bed.setWard(ward);

                bedRepository.save(bed);

                return "Bed added successfully!";
        }

        public List<Bed> getAvailableBeds() {

                return bedRepository
                                .findByStatus("AVAILABLE");
        }

        public String admitPatient(
                        AdmitPatientRequest request) {

                // FIND PATIENT
                User patient = userRepository
                                .findById(request.getPatientId())
                                .orElse(null);

                if (patient == null ||
                                !patient.getRole().equals("PATIENT")) {

                        return "Patient not found!";
                }

                // FIND BED
                Bed bed = bedRepository
                                .findById(request.getBedId())
                                .orElse(null);

                if (bed == null) {
                        return "Bed not found!";
                }

                // CHECK BED STATUS
                if (!bed.getStatus().equals("AVAILABLE")) {
                        return "Bed is already occupied!";
                }

                // CREATE ADMISSION
                Admission admission = new Admission();

                admission.setAdmissionDate(LocalDate.now());

                admission.setStatus("ADMITTED");

                admission.setPatient(patient);

                admission.setBed(bed);

                admissionRepository.save(admission);

                // UPDATE BED STATUS
                bed.setStatus("OCCUPIED");

                bedRepository.save(bed);

                return "Patient admitted successfully!";
        }

        public String dischargePatient(Long patientId) {

                Admission admission = admissionRepository
                                .findByPatientIdAndStatus(
                                                patientId,
                                                "ADMITTED")
                                .orElse(null);

                if (admission == null) {
                        return "No active admission found!";
                }

                // UPDATE ADMISSION
                admission.setDischargeDate(LocalDate.now());

                admission.setStatus("DISCHARGED");

                admissionRepository.save(admission);

                // FREE BED
                Bed bed = admission.getBed();

                bed.setStatus("AVAILABLE");

                bedRepository.save(bed);

                return "Patient discharged successfully!";
        }

        public List<WardOccupancyResponse> getWardOccupancy() {

                List<Ward> wards = wardRepository.findAll();

                List<WardOccupancyResponse> response = new ArrayList<>();

                for (Ward ward : wards) {

                        Long totalBeds = bedRepository.countByWardId(
                                        ward.getId());

                        Long occupiedBeds = bedRepository
                                        .countByWardIdAndStatus(
                                                        ward.getId(),
                                                        "OCCUPIED");

                        Long availableBeds = totalBeds - occupiedBeds;

                        WardOccupancyResponse wardResponse = new WardOccupancyResponse(

                                        ward.getWardName(),

                                        ward.getWardType(),

                                        totalBeds,

                                        occupiedBeds,

                                        availableBeds);

                        response.add(wardResponse);
                }

                return response;
        }

        public String transferPatient(
                        TransferPatientRequest request) {

                // FIND ACTIVE ADMISSION
                Admission admission = admissionRepository
                                .findByPatientIdAndStatus(
                                                request.getPatientId(),
                                                "ADMITTED")
                                .orElse(null);

                if (admission == null) {
                        return "No active admission found!";
                }

                // FIND NEW BED
                Bed newBed = bedRepository
                                .findById(request.getNewBedId())
                                .orElse(null);

                if (newBed == null) {
                        return "New bed not found!";
                }

                // CHECK NEW BED STATUS
                if (!newBed.getStatus()
                                .equals("AVAILABLE")) {

                        return "Selected bed is occupied!";
                }

                // OLD BED
                Bed oldBed = admission.getBed();

                // FREE OLD BED
                oldBed.setStatus("AVAILABLE");

                bedRepository.save(oldBed);

                // OCCUPY NEW BED
                newBed.setStatus("OCCUPIED");

                bedRepository.save(newBed);

                // UPDATE ADMISSION
                admission.setBed(newBed);

                admissionRepository.save(admission);

                return "Patient transferred successfully!";
        }

        public List<Ward> getAllWards() {

                return wardRepository.findAll();
        }

        public String updateWard(

                        Long id,

                        UpdateWardRequest request) {

                Ward ward = wardRepository
                                .findById(id)
                                .orElse(null);

                if (ward == null) {
                        return "Ward not found!";
                }

                ward.setWardName(request.getWardName());

                ward.setWardType(request.getWardType());

                ward.setTotalBeds(request.getTotalBeds());

                wardRepository.save(ward);

                return "Ward updated successfully!";
        }

        public String deleteWard(Long id) {

                Ward ward = wardRepository
                                .findById(id)
                                .orElse(null);

                if (ward == null) {
                        return "Ward not found!";
                }

                Long totalBeds = bedRepository.countByWardId(id);

                if (totalBeds > 0) {
                        return "Cannot delete ward with beds!";
                }

                wardRepository.delete(ward);

                return "Ward deleted successfully!";
        }

        public String emergencyAdmission(
                        EmergencyAdmissionRequest request) {

                // FIND PATIENT
                User patient = userRepository
                                .findById(request.getPatientId())
                                .orElse(null);

                if (patient == null ||
                                !patient.getRole().equals("PATIENT")) {

                        return "Patient not found!";
                }

                // AUTO FIND AVAILABLE BED
                Bed bed = bedRepository
                                .findFirstByWardWardTypeAndStatus(
                                                request.getWardType(),
                                                "AVAILABLE")
                                .orElse(null);

                if (bed == null) {
                        return "No available bed in requested ward!";
                }

                // CREATE ADMISSION
                Admission admission = new Admission();

                admission.setAdmissionDate(LocalDate.now());

                admission.setStatus("ADMITTED");

                admission.setPatient(patient);

                admission.setBed(bed);

                admissionRepository.save(admission);

                // OCCUPY BED
                bed.setStatus("OCCUPIED");

                bedRepository.save(bed);

                return "Emergency bed allocated successfully!";
        }

        public String createPrescription(
                        CreatePrescriptionRequest request) {

                // FIND APPOINTMENT
                Appointment appointment = appointmentRepository
                                .findById(request.getAppointmentId())
                                .orElse(null);

                if (appointment == null) {
                        return "Appointment not found!";
                }

                // CHECK DUPLICATE PRESCRIPTION
                boolean alreadyExists = prescriptionRepository
                                .existsByAppointmentId(
                                                request.getAppointmentId());

                if (alreadyExists) {
                        return "Prescription already exists!";
                }

                // CREATE PRESCRIPTION
                Prescription prescription = new Prescription();

                prescription.setDiagnosis(
                                request.getDiagnosis());

                prescription.setMedicines(
                                request.getMedicines());

                prescription.setDosageInstructions(
                                request.getDosageInstructions());

                // RELATIONSHIP
                prescription.setAppointment(appointment);

                prescriptionRepository.save(prescription);

                return "Prescription created successfully!";
        }

        public List<Prescription> getAllPrescriptions() {

                return prescriptionRepository.findAll();
        }

        public List<Prescription> getPatientPrescriptionHistory(
                        Long patientId) {

                return prescriptionRepository
                                .findByAppointmentPatientId(patientId);
        }

        public String createBill(
                        CreateBillRequest request) {

                // FIND PATIENT
                User patient = userRepository
                                .findById(request.getPatientId())
                                .orElse(null);

                if (patient == null ||
                                !patient.getRole().equals("PATIENT")) {

                        return "Patient not found!";
                }

                // CREATE BILL
                Bill bill = new Bill();

                bill.setAmount(request.getAmount());

                bill.setBillType(request.getBillType());

                bill.setStatus("PENDING");

                bill.setBillDate(LocalDate.now());

                // RELATIONSHIP
                bill.setPatient(patient);

                billRepository.save(bill);

                return "Bill generated successfully!";
        }

        public List<Bill> getAllBills() {

                return billRepository.findAll();
        }

        public String payBill(Long billId) {

                Bill bill = billRepository
                                .findById(billId)
                                .orElse(null);

                if (bill == null) {
                        return "Bill not found!";
                }

                // CHECK ALREADY PAID
                if (bill.getStatus().equals("PAID")) {
                        return "Bill already paid!";
                }

                // UPDATE STATUS
                bill.setStatus("PAID");

                billRepository.save(bill);

                notificationService
                                .createNotification(

                                                "Payment Successful",

                                                "Your payment was successful.",

                                                "PATIENT",

                                                bill.getPatient().getId());
                return "Payment successful!";
        }

        public DashboardStatsResponse getDashboardStats() {

                Long totalPatients = (long) userRepository
                                .findByRole("PATIENT")
                                .size();

                Long totalDoctors = (long) userRepository
                                .findByRole("DOCTOR")
                                .size();

                Long totalAppointments = appointmentRepository.count();

                Double totalRevenue = billRepository.getTotalRevenue();

                if (totalRevenue == null) {
                        totalRevenue = 0.0;
                }

                return new DashboardStatsResponse(

                                totalPatients,

                                totalDoctors,

                                totalAppointments,

                                totalRevenue);
        }

        public String addBloodStock(
                        AddBloodStockRequest request) {

                BloodStock existingStock = bloodStockRepository
                                .findByBloodGroup(
                                                request.getBloodGroup())
                                .orElse(null);

                // IF BLOOD GROUP EXISTS
                if (existingStock != null) {

                        existingStock.setUnitsAvailable(

                                        existingStock.getUnitsAvailable()
                                                        +
                                                        request.getUnitsAvailable());

                        bloodStockRepository.save(existingStock);

                        return "Blood stock updated successfully!";
                }

                // NEW BLOOD GROUP
                BloodStock stock = new BloodStock();

                stock.setBloodGroup(
                                request.getBloodGroup());

                stock.setUnitsAvailable(
                                request.getUnitsAvailable());

                bloodStockRepository.save(stock);

                return "Blood stock added successfully!";
        }

        public List<BloodStock> getAllBloodStock() {

                return bloodStockRepository.findAll();
        }

        public String requestBlood(
                        CreateBloodRequest request) {

                // FIND PATIENT
                User patient = userRepository
                                .findById(request.getPatientId())
                                .orElse(null);

                if (patient == null ||
                                !patient.getRole().equals("PATIENT")) {

                        return "Patient not found!";
                }

                // FIND BLOOD STOCK
                BloodStock stock = bloodStockRepository
                                .findByBloodGroup(
                                                request.getBloodGroup())
                                .orElse(null);

                if (stock == null) {
                        return "Blood group not available!";
                }

                // CHECK AVAILABLE UNITS
                if (stock.getUnitsAvailable() < request.getUnitsRequired()) {

                        return "Insufficient blood units!";
                }

                // CREATE REQUEST
                BloodRequest bloodRequest = new BloodRequest();

                bloodRequest.setBloodGroup(
                                request.getBloodGroup());

                bloodRequest.setUnitsRequired(
                                request.getUnitsRequired());

                bloodRequest.setStatus("APPROVED");

                bloodRequest.setRequestDate(
                                LocalDate.now());

                bloodRequest.setPatient(patient);

                bloodRequestRepository.save(
                                bloodRequest);

                // REDUCE STOCK
                stock.setUnitsAvailable(

                                stock.getUnitsAvailable()
                                                -
                                                request.getUnitsRequired());

                bloodStockRepository.save(stock);

                return "Blood request approved!";
        }

        public List<BloodRequest> getAllBloodRequests() {

                return bloodRequestRepository.findAll();
        }

        public BloodAvailabilityResponse checkBloodAvailability(
                        String bloodGroup) {

                BloodStock stock = bloodStockRepository
                                .findByBloodGroup(bloodGroup)
                                .orElse(null);

                // IF BLOOD GROUP NOT FOUND
                if (stock == null) {

                        return new BloodAvailabilityResponse(

                                        bloodGroup,

                                        0,

                                        false);
                }

                // CHECK AVAILABLE UNITS
                boolean available = stock.getUnitsAvailable() > 0;

                return new BloodAvailabilityResponse(

                                stock.getBloodGroup(),

                                stock.getUnitsAvailable(),

                                available);
        }

        public String addDonor(
                        AddDonorRequest request) {

                Donor donor = new Donor();

                donor.setDonorName(
                                request.getDonorName());

                donor.setBloodGroup(
                                request.getBloodGroup());

                donor.setMobile(
                                request.getMobile());

                donorRepository.save(donor);

                return "Donor added successfully!";
        }

        public String donateBlood(
                        DonateBloodRequest request) {

                // FIND DONOR
                Donor donor = donorRepository
                                .findById(request.getDonorId())
                                .orElse(null);

                if (donor == null) {
                        return "Donor not found!";
                }

                // CREATE DONATION HISTORY
                Donation donation = new Donation();

                donation.setUnitsDonated(
                                request.getUnitsDonated());

                donation.setDonationDate(
                                LocalDate.now());

                donation.setDonor(donor);

                donationRepository.save(donation);

                // FIND BLOOD STOCK
                BloodStock stock = bloodStockRepository
                                .findByBloodGroup(
                                                donor.getBloodGroup())
                                .orElse(null);

                // IF BLOOD GROUP EXISTS
                if (stock != null) {

                        stock.setUnitsAvailable(

                                        stock.getUnitsAvailable()
                                                        +
                                                        request.getUnitsDonated());

                        bloodStockRepository.save(stock);

                } else {

                        // CREATE NEW STOCK
                        BloodStock newStock = new BloodStock();

                        newStock.setBloodGroup(
                                        donor.getBloodGroup());

                        newStock.setUnitsAvailable(
                                        request.getUnitsDonated());

                        bloodStockRepository.save(
                                        newStock);
                }

                return "Blood donated successfully!";
        }

        public String updateUserRole(

                        Long userId,

                        UpdateRoleRequest request) {

                User user = userRepository
                                .findById(userId)
                                .orElse(null);

                if (user == null) {
                        return "User not found!";
                }

                user.setRole(request.getRole());

                userRepository.save(user);

                return "User role updated successfully!";
        }

        public List<User> getUsersByRole(
                        String role) {

                return userRepository
                                .findByRole(role);
        }

        public User getAdminProfile(
                        Long adminId) {

                return userRepository
                                .findById(adminId)
                                .orElse(null);
        }

        public String updateAdminProfile(

                        Long adminId,

                        UpdateProfileRequest request) {

                User user = userRepository
                                .findById(adminId)
                                .orElse(null);

                if (user == null) {
                        return "Admin not found!";
                }

                user.setName(request.getName());

                user.setGender(request.getGender());

                user.setAge(request.getAge());

                user.setMobile(request.getMobile());

                userRepository.save(user);

                return "Profile updated successfully!";
        }

        public String changePassword(

                        Long adminId,

                        ChangePasswordRequest request) {

                User user = userRepository
                                .findById(adminId)
                                .orElse(null);

                if (user == null) {
                        return "User not found!";
                }

                // CHECK OLD PASSWORD
                boolean matched = passwordEncoder.matches(

                                request.getOldPassword(),

                                user.getPassword());

                if (!matched) {
                        return "Old password incorrect!";
                }

                // ENCRYPT NEW PASSWORD
                user.setPassword(

                                passwordEncoder.encode(
                                                request.getNewPassword()));

                userRepository.save(user);

                return "Password changed successfully!";
        }

}