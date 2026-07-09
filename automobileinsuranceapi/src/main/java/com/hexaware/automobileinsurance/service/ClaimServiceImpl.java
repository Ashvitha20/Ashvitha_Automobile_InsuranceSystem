package com.hexaware.automobileinsurance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import lombok.extern.slf4j.Slf4j;
import com.hexaware.automobileinsurance.dto.ClaimDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Claim;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.repository.ClaimRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;

@Slf4j
@Service
public class ClaimServiceImpl implements ClaimService {

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Override
    public Claim raiseClaim(ClaimDTO dto) {

        Proposal proposal = proposalRepository.findById(dto.getProposalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Proposal not found with id : " + dto.getProposalId()));

        Claim claim = new Claim();

        claim.setProposal(proposal);
        claim.setClaimDescription(dto.getClaimDescription());
        claim.setClaimAmount(dto.getClaimAmount());
        claim.setClaimStatus("INITIATED");
        claim.setClaimDate(LocalDateTime.now());

        Claim saved = claimRepository.save(claim);
        log.info("Claim {} raised for proposal {} - amount {}", saved.getClaimId(), proposal.getProposalId(), dto.getClaimAmount());
        return saved;
    }

    @Override
    public Claim getClaimById(Integer claimId) {

        Claim claim =
                claimRepository.findById(claimId).orElse(null);

        if (claim == null) {

            throw new ResourceNotFoundException(
                    "Claim not found with id : " + claimId);
        }

        return claim;
    }

    @Override
    public List<Claim> getAllClaims() {

        return claimRepository.findAll();
    }

    @Override
    public Claim updateClaimStatus(Integer claimId, ClaimDTO dto) {

        Claim existingClaim =
                claimRepository.findById(claimId).orElse(null);

        if (existingClaim == null) {

            throw new ResourceNotFoundException(
                    "Claim not found with id : " + claimId);
        }

        existingClaim.setClaimStatus(dto.getClaimStatus());

        return claimRepository.save(existingClaim);
    }
    
    @Override
    public Claim approveClaim(Integer claimId) {

        Claim claim =
                claimRepository.findById(claimId).orElse(null);

        if(claim == null) {

            throw new ResourceNotFoundException(
                    "Claim not found with id : " + claimId);
        }

        claim.setClaimStatus("APPROVED");

        Claim saved = claimRepository.save(claim);
        log.info("Claim {} approved", claimId);
        return saved;
    }
    
    @Override
    public Claim rejectClaim(Integer claimId) {

        Claim claim =
                claimRepository.findById(claimId).orElse(null);

        if(claim == null) {

            throw new ResourceNotFoundException(
                    "Claim not found with id : " + claimId);
        }

        claim.setClaimStatus("REJECTED");

        Claim saved = claimRepository.save(claim);
        log.info("Claim {} rejected", claimId);
        return saved;
    }
}