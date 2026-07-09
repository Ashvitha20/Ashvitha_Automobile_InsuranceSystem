package com.hexaware.automobileinsurance.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ClaimDTO {

    private Integer claimId;

    @NotNull
    private Integer proposalId;

    @NotNull
    @NotEmpty
    private String claimDescription;

    @Min(1000)
    private double claimAmount;

    
    private String claimStatus;
}