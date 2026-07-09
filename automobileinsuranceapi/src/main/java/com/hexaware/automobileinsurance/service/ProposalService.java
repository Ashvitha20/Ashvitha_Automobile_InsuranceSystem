package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.ProposalDTO;
import com.hexaware.automobileinsurance.model.Proposal;

public interface ProposalService {

    Proposal createProposal(ProposalDTO dto);

    Proposal getProposalById(Integer proposalId);

    List<Proposal> getAllProposals();

    Proposal updateProposal(Integer proposalId, ProposalDTO dto);

    void deleteProposal(Integer proposalId);
    
    Proposal approveProposal(Integer proposalId);

    Proposal rejectProposal(Integer proposalId);
}