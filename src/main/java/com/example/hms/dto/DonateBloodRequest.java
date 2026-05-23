package com.example.hms.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class DonateBloodRequest {

    @NotNull
    private Long donorId;

    @NotNull
    @Min(1)
    private Integer unitsDonated;
}