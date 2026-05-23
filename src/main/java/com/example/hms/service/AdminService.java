package com.example.hms.service;

import com.example.hms.dto.AddBedRequest;
import com.example.hms.dto.AddDoctorRequest;
import com.example.hms.dto.AddWardRequest;
import com.example.hms.dto.AdmitPatientRequest;
import com.example.hms.dto.BookAppointmentRequest;
import com.example.hms.dto.CreateBillRequest;
import com.example.hms.dto.CreatePrescriptionRequest;
import com.example.hms.dto.EmergencyAdmissionRequest;
import com.example.hms.dto.RescheduleAppointmentRequest;
import com.example.hms.dto.TransferPatientRequest;
import com.example.hms.dto.UpdateDoctorRequest;
import com.example.hms.dto.UpdatePatientRequest;
import com.example.hms.dto.UpdateWardRequest;
import com.example.hms.dto.WardOccupancyResponse;
import com.example.hms.entity.Admission;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bed;
import com.example.hms.entity.Bill;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.Prescription;
import com.example.hms.entity.User;
import com.example.hms.entity.Ward;
import com.example.hms.repository.AdmissionRepository;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BedRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.DoctorProfileRepository;
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

        // Get all patients
        public List<User> getAllPatients() {

                return userRepository.findByRole("PATIENT");
        }

        @Autowired
        private BillRepository billRepository;

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

}