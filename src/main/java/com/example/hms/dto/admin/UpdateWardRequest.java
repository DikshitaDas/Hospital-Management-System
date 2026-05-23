package com.example.hms.dto.admin;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateWardRequest {

    @NotBlank
    private String wardName;

    @NotBlank
    private String wardType;

    @NotNull
    @Min(1)
    private Integer totalBeds;
}