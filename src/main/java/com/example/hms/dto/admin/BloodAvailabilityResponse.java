package com.example.hms.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class BloodAvailabilityResponse {

    private String bloodGroup;

    private Integer unitsAvailable;

    private Boolean available;
}