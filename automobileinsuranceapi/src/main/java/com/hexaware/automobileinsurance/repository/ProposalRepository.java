package com.hexaware.automobileinsurance.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hexaware.automobileinsurance.model.Proposal;

public interface ProposalRepository extends JpaRepository<Proposal, Integer> {

    
    List<Proposal> findByProposalStatusAndExpiryDateAndReminderSent(
            String proposalStatus, LocalDate expiryDate, Boolean reminderSent);

    
    List<Proposal> findByProposalStatusAndExpiryDateBefore(
            String proposalStatus, LocalDate expiryDate);

}
