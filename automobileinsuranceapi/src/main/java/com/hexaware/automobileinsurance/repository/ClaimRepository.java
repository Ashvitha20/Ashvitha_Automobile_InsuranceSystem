package com.hexaware.automobileinsurance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.automobileinsurance.model.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Integer> {

}