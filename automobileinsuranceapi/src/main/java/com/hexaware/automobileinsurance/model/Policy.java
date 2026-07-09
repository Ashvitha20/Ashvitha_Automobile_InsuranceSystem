package com.hexaware.automobileinsurance.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "policies")
@Data
@NoArgsConstructor
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "policy_id")
    private Integer policyId;

    @Column(name = "policy_name", nullable = false)
    private String policyName;

    @Column(name = "vehicle_type", nullable = false)
    private String vehicleType;

    @Column(name = "coverage_details")
    private String coverageDetails;

    @Column(name = "base_premium", nullable = false)
    private Double basePremium;

    @Column(name = "status")
    private String status;
}