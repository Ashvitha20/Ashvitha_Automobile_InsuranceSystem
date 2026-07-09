package com.hexaware.automobileinsurance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.automobileinsurance.model.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Integer> {

}