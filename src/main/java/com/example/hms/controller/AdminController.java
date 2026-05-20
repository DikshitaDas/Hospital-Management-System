package com.example.hms.controller;

import com.example.hms.entity.User;
import com.example.hms.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")

public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/patients")
    public List<User> getAllPatients() {

        return adminService.getAllPatients();
    }
}