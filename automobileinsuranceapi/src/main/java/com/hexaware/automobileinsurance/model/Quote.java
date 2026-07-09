package com.hexaware.automobileinsurance.model;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "quotes")

@Data
@NoArgsConstructor


public class Quote {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quote_id")
    private Integer quoteId;

    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @Column(name = "premium_amount", nullable = false)
    private Double premiumAmount;

    @Column(name = "add_ons")
    private String addOns;

    @Column(name = "generated_date")
    private LocalDateTime generatedDate;
}
