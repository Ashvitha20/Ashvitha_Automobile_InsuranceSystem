package com.hexaware.automobileinsurance.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class QuoteDTO {

    private Integer quoteId;

    @NotNull
    private Integer proposalId;

    @Min(1000)
    private double premiumAmount;

    @NotNull
    @NotEmpty
    private String addOns;
}