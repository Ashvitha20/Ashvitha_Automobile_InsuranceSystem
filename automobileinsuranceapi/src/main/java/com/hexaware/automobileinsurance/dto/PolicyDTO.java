package com.hexaware.automobileinsurance.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class PolicyDTO {

    private Integer policyId;

    @NotNull
    @NotEmpty
    private String policyName;

    @NotNull
    @NotEmpty
    private String vehicleType;

    @NotNull
    @NotEmpty
    private String coverageDetails;

    @Min(1000)
    private double basePremium;

    @NotNull
    @NotEmpty
    private String status;
}