package com.hexaware.automobileinsurance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.hexaware.automobileinsurance.service.PolicyDocumentService;
import com.hexaware.automobileinsurance.dto.ProposalDTO;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.service.ProposalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/proposals")
public class ProposalController {

    @Autowired
    private ProposalService proposalService;
    @Autowired
    private PolicyDocumentService policyDocumentService;

    @PostMapping
    public Proposal createProposal(
            @RequestBody @Valid ProposalDTO dto) {

        return proposalService.createProposal(dto);
    }

    @GetMapping("/{id}")
    public Proposal getProposalById(@PathVariable Integer id) {

        return proposalService.getProposalById(id);
    }

    @GetMapping
    public List<Proposal> getAllProposals() {

        return proposalService.getAllProposals();
    }

    @PutMapping("/{id}")
    public Proposal updateProposal(
            @PathVariable Integer id,
            @RequestBody @Valid ProposalDTO dto) {

        return proposalService.updateProposal(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteProposal(@PathVariable Integer id) {

        proposalService.deleteProposal(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public Proposal approveProposal(
            @PathVariable Integer id) {

        return proposalService.approveProposal(id);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public Proposal rejectProposal(
            @PathVariable Integer id) {

        return proposalService.rejectProposal(id);
    }
    @GetMapping("/{id}/policy-document")
    public ResponseEntity<byte[]> downloadPolicyDocument(@PathVariable Integer id) {

        Proposal proposal = proposalService.getProposalById(id);

        String status = proposal.getProposalStatus();
        if (!"ACTIVE".equalsIgnoreCase(status) && !"EXPIRED".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException(
                    "Policy document is only available once the policy is active.");
        }

        byte[] pdf = policyDocumentService.generatePolicyDocument(proposal);
        String filename = "Policy-" + proposal.getProposalId() + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}