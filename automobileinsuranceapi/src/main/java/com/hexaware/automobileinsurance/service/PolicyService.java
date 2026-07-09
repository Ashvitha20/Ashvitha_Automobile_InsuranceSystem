package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.PolicyDTO;
import com.hexaware.automobileinsurance.model.Policy;

public interface PolicyService {

    Policy addPolicy(PolicyDTO dto);

    Policy getPolicyById(Integer policyId);

    List<Policy> getAllPolicies();

    Policy updatePolicy(Integer policyId, PolicyDTO dto);

    void deletePolicy(Integer policyId);
}