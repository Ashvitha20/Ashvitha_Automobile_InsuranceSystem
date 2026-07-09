package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.ClaimDTO;
import com.hexaware.automobileinsurance.model.Claim;

public interface ClaimService {

    Claim raiseClaim(ClaimDTO dto);

    Claim getClaimById(Integer claimId);

    List<Claim> getAllClaims();

    Claim updateClaimStatus(Integer claimId, ClaimDTO dto);
    
    Claim approveClaim(Integer claimId);

    Claim rejectClaim(Integer claimId);
}