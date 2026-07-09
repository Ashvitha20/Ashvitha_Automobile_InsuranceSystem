package com.hexaware.automobileinsurance.model;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor

public class Claim {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "claim_id")
	    private Integer claimId;

	    @ManyToOne
	    @JoinColumn(name = "proposal_id", nullable = false)
	    private Proposal proposal;

	    @Column(name = "claim_description")
	    private String claimDescription;

	    @Column(name = "claim_amount")
	    private Double claimAmount;

	    @Column(name = "claim_status")
	    private String claimStatus;

	    @Column(name = "claim_date")
	    private LocalDateTime claimDate;

}
