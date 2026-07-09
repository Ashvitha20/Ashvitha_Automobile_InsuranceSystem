package com.hexaware.automobileinsurance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PaymentDTO {

    private Integer paymentId;

    @NotNull
    private Integer quoteId;

    @Min(100)
    private double amount;

    private String paymentStatus;
    
   
    private String bankName;

   
    private String bankBranch;

    
    private String cardNumber;
    
    @NotNull
    @NotEmpty
    private String paymentMethod;
}