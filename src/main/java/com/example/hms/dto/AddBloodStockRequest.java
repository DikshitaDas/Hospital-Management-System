package com.example.hms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddBloodStockRequest {

    @NotBlank
    private String bloodGroup;

    @NotNull
    @Min(1)
    private Integer unitsAvailable;
}