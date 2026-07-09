package com.hexaware.automobileinsurance.scheduler;


import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.repository.ProposalRepository;
import com.hexaware.automobileinsurance.service.EmailService;

import lombok.extern.slf4j.Slf4j;

/**
 * Daily job that:
 *  1. Emails a reminder to any policyholder whose ACTIVE policy expires
 *     in exactly 7 days (Scope item 7 - "Premium reminder email").
 *  2. Marks any ACTIVE policy whose expiry date has already passed as
 *     EXPIRED (Scope item 6 - "Track policy status ... expired").
 *
 * Runs once a day at 08:00 server time. Also runs once shortly after
 * startup (initialDelay) purely so it's easy to see it working in a
 * short-lived demo/dev session without waiting a full day.
 */
@Slf4j
@Component
public class PolicyExpiryScheduler {

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private EmailService emailService;

    // Runs every 24 hours, starting 1 minute after application startup.
    @Scheduled(initialDelay = 60_000, fixedRate = 24 * 60 * 60 * 1000)
    public void runDailyPolicyChecks() {

        sendExpiryReminders();
        expireOverduePolicies();
    }

    private void sendExpiryReminders() {

        LocalDate reminderDate = LocalDate.now().plusDays(7);

        List<Proposal> expiringSoon = proposalRepository
                .findByProposalStatusAndExpiryDateAndReminderSent("ACTIVE", reminderDate, false);

        log.info("Policy expiry reminder check: {} polic(y/ies) expiring on {}",
                expiringSoon.size(), reminderDate);

        for (Proposal proposal : expiringSoon) {

            emailService.sendExpiryReminderEmail(
                    proposal.getUser().getEmail(),
                    proposal.getUser().getName(),
                    proposal.getPolicy().getPolicyName(),
                    proposal.getVehicleNumber(),
                    proposal.getExpiryDate().toString());

            proposal.setReminderSent(true);
            proposalRepository.save(proposal);
        }
    }

    private void expireOverduePolicies() {

        LocalDate today = LocalDate.now();

        List<Proposal> overdue = proposalRepository
                .findByProposalStatusAndExpiryDateBefore("ACTIVE", today);

        log.info("Policy expiry check: {} polic(y/ies) past their expiry date", overdue.size());

        for (Proposal proposal : overdue) {
            proposal.setProposalStatus("EXPIRED");
            proposalRepository.save(proposal);
            log.info("Proposal {} marked EXPIRED (expiry date was {})",
                    proposal.getProposalId(), proposal.getExpiryDate());
        }
    }
}
