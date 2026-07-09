package com.hexaware.automobileinsurance.dto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ProposalDTO {

    private Integer proposalId;

    @NotNull
    private Integer userId;

    @NotNull
    private Integer policyId;

    @NotNull
    @NotEmpty
    private String vehicleNumber;

    @NotNull
    @NotEmpty
    private String vehicleModel;

    @Min(2000)
    private int vehicleYear;

    
    private String proposalStatus;
}