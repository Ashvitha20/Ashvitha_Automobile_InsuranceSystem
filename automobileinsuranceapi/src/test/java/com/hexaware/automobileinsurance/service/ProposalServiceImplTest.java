package com.hexaware.automobileinsurance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.automobileinsurance.dto.ProposalDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.model.User;
import com.hexaware.automobileinsurance.repository.PolicyRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;
import com.hexaware.automobileinsurance.repository.UserRepository;

public class ProposalServiceImplTest {

    @Mock
    private ProposalRepository proposalRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PolicyRepository policyRepository;

    @InjectMocks
    private ProposalServiceImpl proposalService;

    private User mockUser;
    private Policy mockPolicy;
    private Proposal mockProposal;
    private ProposalDTO mockProposalDTO;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setName("John Doe");

        mockPolicy = new Policy();
        mockPolicy.setPolicyId(1);

        mockProposal = new Proposal();
        mockProposal.setProposalId(1);
        mockProposal.setUser(mockUser);
        mockProposal.setPolicy(mockPolicy);
        mockProposal.setVehicleNumber("TN01AB1234");
        mockProposal.setVehicleModel("Hyundai i20");
        mockProposal.setVehicleYear(2022);
        mockProposal.setProposalStatus("PROPOSAL_SUBMITTED");

        mockProposalDTO = new ProposalDTO();
        mockProposalDTO.setUserId(1);
        mockProposalDTO.setPolicyId(1);
        mockProposalDTO.setVehicleNumber("TN01AB1234");
        mockProposalDTO.setVehicleModel("Hyundai i20");
        mockProposalDTO.setVehicleYear(2022);
        mockProposalDTO.setProposalStatus("PROPOSAL_SUBMITTED");
    }

    @Test
    public void testCreateProposal() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(mockUser));

        when(policyRepository.findById(1))
                .thenReturn(Optional.of(mockPolicy));

        when(proposalRepository.save(any(Proposal.class)))
                .thenReturn(mockProposal);

        Proposal result =
                proposalService.createProposal(mockProposalDTO);

        assertNotNull(result);
        assertEquals(1, result.getProposalId());
    }

    @Test
    public void testGetProposalById() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        Proposal result =
                proposalService.getProposalById(1);

        assertNotNull(result);
        assertEquals(1, result.getProposalId());
    }

    @Test
    public void testGetProposalByIdNotFound() {

        when(proposalRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> proposalService.getProposalById(100));
    }

    @Test
    public void testApproveProposal() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        when(proposalRepository.save(any(Proposal.class)))
                .thenReturn(mockProposal);

        Proposal result =
                proposalService.approveProposal(1);

        assertNotNull(result);
    }

    @Test
    public void testRejectProposal() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        when(proposalRepository.save(any(Proposal.class)))
                .thenReturn(mockProposal);

        Proposal result =
                proposalService.rejectProposal(1);

        assertNotNull(result);
    }

    @Test
    public void testDeleteProposal() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        assertDoesNotThrow(() ->
                proposalService.deleteProposal(1));

        verify(proposalRepository, times(1))
                .delete(mockProposal);
    }
}