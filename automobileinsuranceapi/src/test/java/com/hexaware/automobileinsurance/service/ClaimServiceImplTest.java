package com.hexaware.automobileinsurance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.automobileinsurance.dto.ClaimDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Claim;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.repository.ClaimRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;

public class ClaimServiceImplTest {

    @Mock
    private ClaimRepository claimRepository;

    @Mock
    private ProposalRepository proposalRepository;

    @InjectMocks
    private ClaimServiceImpl claimService;

    private Claim mockClaim;
    private ClaimDTO mockClaimDTO;
    private Proposal mockProposal;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        mockProposal = new Proposal();
        mockProposal.setProposalId(1);

        mockClaim = new Claim();
        mockClaim.setClaimId(1);
        mockClaim.setProposal(mockProposal);
        mockClaim.setClaimDescription("Accident Damage");
        mockClaim.setClaimAmount(25000.0);
        mockClaim.setClaimStatus("INITIATED");

        mockClaimDTO = new ClaimDTO();
        mockClaimDTO.setProposalId(1);
        mockClaimDTO.setClaimDescription("Accident Damage");
        mockClaimDTO.setClaimAmount(25000.0);
        mockClaimDTO.setClaimStatus("INITIATED");
    }

    @Test
    public void testRaiseClaim() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        when(claimRepository.save(any(Claim.class)))
                .thenReturn(mockClaim);

        Claim result =
                claimService.raiseClaim(mockClaimDTO);

        assertNotNull(result);
        assertEquals(1, result.getClaimId());
    }

    @Test
    public void testGetClaimById() {

        when(claimRepository.findById(1))
                .thenReturn(Optional.of(mockClaim));

        Claim result =
                claimService.getClaimById(1);

        assertNotNull(result);
        assertEquals(1, result.getClaimId());
    }

    @Test
    public void testGetClaimByIdNotFound() {

        when(claimRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> claimService.getClaimById(100));
    }

    @Test
    public void testApproveClaim() {

        when(claimRepository.findById(1))
                .thenReturn(Optional.of(mockClaim));

        when(claimRepository.save(any(Claim.class)))
                .thenReturn(mockClaim);

        Claim result =
                claimService.approveClaim(1);

        assertNotNull(result);

        verify(claimRepository, times(1))
                .save(mockClaim);
    }

    @Test
    public void testRejectClaim() {

        when(claimRepository.findById(1))
                .thenReturn(Optional.of(mockClaim));

        when(claimRepository.save(any(Claim.class)))
                .thenReturn(mockClaim);

        Claim result =
                claimService.rejectClaim(1);

        assertNotNull(result);

        verify(claimRepository, times(1))
                .save(mockClaim);
    }

    @Test
    public void testRaiseClaimProposalNotFound() {

        when(proposalRepository.findById(100))
                .thenReturn(Optional.empty());

        mockClaimDTO.setProposalId(100);

        assertThrows(
                ResourceNotFoundException.class,
                () -> claimService.raiseClaim(mockClaimDTO));
    }
}