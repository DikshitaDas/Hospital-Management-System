package com.example.hms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddBedRequest {

    @NotBlank
    private String bedNumber;

    @NotNull
    private Long wardId;
}