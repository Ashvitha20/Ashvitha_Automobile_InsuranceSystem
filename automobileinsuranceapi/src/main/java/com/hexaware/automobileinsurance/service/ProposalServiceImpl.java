package com.hexaware.automobileinsurance.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import com.hexaware.automobileinsurance.dto.ProposalDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.model.User;
import com.hexaware.automobileinsurance.repository.PolicyRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;
import com.hexaware.automobileinsurance.repository.UserRepository;

@Slf4j
@Service
public class ProposalServiceImpl implements ProposalService {

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public Proposal createProposal(ProposalDTO dto) {

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id : " + dto.getUserId()));

        Policy policy = policyRepository.findById(dto.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Policy not found with id : " + dto.getPolicyId()));

        Proposal proposal = new Proposal();

        proposal.setUser(user);
        proposal.setPolicy(policy);
        proposal.setVehicleNumber(dto.getVehicleNumber());
        proposal.setVehicleModel(dto.getVehicleModel());
        proposal.setVehicleYear(dto.getVehicleYear());

        proposal.setProposalStatus("PROPOSAL_SUBMITTED");

        proposal.setSubmittedDate(LocalDate.now());

        Proposal saved = proposalRepository.save(proposal);
        log.info("Proposal {} created by user {} for policy {}", saved.getProposalId(), user.getUserId(), policy.getPolicyId());
        return saved;
    }

    @Override
    public Proposal getProposalById(Integer proposalId) {

        Proposal proposal =
                proposalRepository.findById(proposalId).orElse(null);

        if (proposal == null) {

            throw new ResourceNotFoundException(
                    "Proposal not found with id : " + proposalId);
        }

        return proposal;
    }

    @Override
    public List<Proposal> getAllProposals() {

        return proposalRepository.findAll();
    }

    @Override
    public Proposal updateProposal(Integer proposalId, ProposalDTO dto) {

        Proposal existingProposal =
                proposalRepository.findById(proposalId).orElse(null);

        if (existingProposal == null) {

            throw new ResourceNotFoundException(
                    "Proposal not found with id : " + proposalId);
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id : " + dto.getUserId()));

        Policy policy = policyRepository.findById(dto.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Policy not found with id : " + dto.getPolicyId()));

        existingProposal.setUser(user);
        existingProposal.setPolicy(policy);
        existingProposal.setVehicleNumber(dto.getVehicleNumber());
        existingProposal.setVehicleModel(dto.getVehicleModel());
        existingProposal.setVehicleYear(dto.getVehicleYear());

        return proposalRepository.save(existingProposal);
    }

    @Override
    public void deleteProposal(Integer proposalId) {

        Proposal proposal =
                proposalRepository.findById(proposalId).orElse(null);

        if (proposal == null) {

            throw new ResourceNotFoundException(
                    "Proposal not found with id : " + proposalId);
        }

        proposalRepository.delete(proposal);
        log.info("Proposal {} deleted", proposalId);
    }

    @Override
    public Proposal approveProposal(Integer proposalId) {

        Proposal proposal =
                proposalRepository.findById(proposalId).orElse(null);

        if (proposal == null) {

            throw new ResourceNotFoundException(
                    "Proposal not found with id : " + proposalId);
        }

        proposal.setProposalStatus("QUOTE_GENERATED");

        Proposal saved = proposalRepository.save(proposal);
        log.info("Proposal {} approved - status set to QUOTE_GENERATED", proposalId);
        return saved;
    }

    @Override
    public Proposal rejectProposal(Integer proposalId) {

        Proposal proposal =
                proposalRepository.findById(proposalId).orElse(null);

        if (proposal == null) {

            throw new ResourceNotFoundException(
                    "Proposal not found with id : " + proposalId);
        }

        proposal.setProposalStatus("REJECTED");

        Proposal saved = proposalRepository.save(proposal);
        log.info("Proposal {} rejected", proposalId);
        return saved;
    }
}