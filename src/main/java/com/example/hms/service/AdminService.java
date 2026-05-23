package com.example.hms.service;

import com.example.hms.dto.AddDoctorRequest;
import com.example.hms.dto.AddWardRequest;
import com.example.hms.dto.BookAppointmentRequest;
import com.example.hms.dto.RescheduleAppointmentRequest;
import com.example.hms.dto.UpdateDoctorRequest;
import com.example.hms.dto.UpdatePatientRequest;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.DoctorProfile;
import com.example.hms.entity.User;
import com.example.hms.entity.Ward;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.DoctorProfileRepository;
import com.example.hms.repository.UserRepository;
import com.example.hms.repository.WardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

        // Get all patients
        public List<User> getAllPatients() {

                return userRepository.findByRole("PATIENT");
        }

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

}