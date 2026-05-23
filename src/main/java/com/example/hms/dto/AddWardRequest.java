package com.example.hms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AddWardRequest {

    @NotBlank
    private String wardName;

    @NotBlank
    private String wardType;

    @NotNull
    @Min(1)
    private Integer totalBeds;
}