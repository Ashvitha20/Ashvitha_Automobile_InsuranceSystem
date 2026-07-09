package com.hexaware.automobileinsurance.model;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "proposals")
@Data
@NoArgsConstructor

public class Proposal {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proposal_id")
    private Integer proposalId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "vehicle_number", length = 20)
    private String vehicleNumber;

    @Column(name = "vehicle_model", length = 100)
    private String vehicleModel;

    @Column(name = "vehicle_year")
    private Integer vehicleYear;

    @Column(name = "proposal_status")
    private String proposalStatus;

    @Column(name = "submitted_date")
    private LocalDate submittedDate;

    @Column(name = "activation_date")
    private LocalDate activationDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    // Tracks whether the 7-day-before-expiry reminder email has already
    // been sent for this proposal, so the scheduler never sends it twice.
    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;

}
