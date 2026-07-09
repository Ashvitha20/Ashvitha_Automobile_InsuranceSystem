package com.hexaware.automobileinsurance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

import com.hexaware.automobileinsurance.dto.PolicyDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.repository.PolicyRepository;

@Slf4j
@Service
public class PolicyServiceImpl implements PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public Policy addPolicy(PolicyDTO dto) {

        Policy policy = new Policy();

        policy.setPolicyName(dto.getPolicyName());
        policy.setVehicleType(dto.getVehicleType());
        policy.setCoverageDetails(dto.getCoverageDetails());
        policy.setBasePremium(dto.getBasePremium());
        policy.setStatus(dto.getStatus());

        Policy saved = policyRepository.save(policy);
        log.info("Policy {} created: {}", saved.getPolicyId(), saved.getPolicyName());
        return saved;
    }

    @Override
    public Policy getPolicyById(Integer policyId) {

        Policy policy =
                policyRepository.findById(policyId).orElse(null);

        if (policy == null) {

            throw new ResourceNotFoundException(
                    "Policy not found with id : " + policyId);
        }

        return policy;
    }

    @Override
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    @Override
    public Policy updatePolicy(Integer policyId, PolicyDTO dto) {

        Policy existingPolicy =
                policyRepository.findById(policyId).orElse(null);

        if (existingPolicy == null) {

            throw new ResourceNotFoundException(
                    "Policy not found with id : " + policyId);
        }

        existingPolicy.setPolicyName(dto.getPolicyName());
        existingPolicy.setVehicleType(dto.getVehicleType());
        existingPolicy.setCoverageDetails(dto.getCoverageDetails());
        existingPolicy.setBasePremium(dto.getBasePremium());
        existingPolicy.setStatus(dto.getStatus());

        return policyRepository.save(existingPolicy);
    }

    @Override
    public void deletePolicy(Integer policyId) {

        Policy policy =
                policyRepository.findById(policyId).orElse(null);

        if (policy == null) {

            throw new ResourceNotFoundException(
                    "Policy not found with id : " + policyId);
        }

        policyRepository.delete(policy);
        log.info("Policy {} deleted", policyId);
    }
}