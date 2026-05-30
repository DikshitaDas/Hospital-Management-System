package com.example.hms.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PayBillRequest {

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;
}
