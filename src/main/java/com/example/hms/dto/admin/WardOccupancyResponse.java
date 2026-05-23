package com.example.hms.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class WardOccupancyResponse {

    private String wardName;

    private String wardType;

    private Long totalBeds;

    private Long occupiedBeds;

    private Long availableBeds;
}