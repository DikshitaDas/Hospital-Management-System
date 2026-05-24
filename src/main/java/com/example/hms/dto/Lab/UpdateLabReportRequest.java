package com.example.hms.dto.Lab;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateLabReportRequest {

    @NotBlank
    private String result;
}