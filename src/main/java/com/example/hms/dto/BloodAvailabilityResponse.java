package com.example.hms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class BloodAvailabilityResponse {

    private String bloodGroup;

    private Integer unitsAvailable;

    private Boolean available;
}