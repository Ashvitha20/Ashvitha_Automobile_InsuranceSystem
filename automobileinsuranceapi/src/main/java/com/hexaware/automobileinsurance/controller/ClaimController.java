package com.hexaware.automobileinsurance.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.automobileinsurance.dto.ClaimDTO;
import com.hexaware.automobileinsurance.model.Claim;
import com.hexaware.automobileinsurance.service.ClaimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @PostMapping
    public Claim raiseClaim(
            @RequestBody @Valid ClaimDTO dto) {

        return claimService.raiseClaim(dto);
    }

    @GetMapping("/{id}")
    public Claim getClaimById(@PathVariable Integer id) {

        return claimService.getClaimById(id);
    }

    @GetMapping
    public List<Claim> getAllClaims() {

        return claimService.getAllClaims();
    }

    @PutMapping("/{id}")
    public Claim updateClaimStatus(
            @PathVariable Integer id,
            @RequestBody @Valid ClaimDTO dto) {

        return claimService.updateClaimStatus(id, dto);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public Claim approveClaim(
            @PathVariable Integer id) {

        return claimService.approveClaim(id);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public Claim rejectClaim(
            @PathVariable Integer id) {

        return claimService.rejectClaim(id);
    }
}