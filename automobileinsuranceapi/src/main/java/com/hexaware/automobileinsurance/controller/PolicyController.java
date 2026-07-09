package com.hexaware.automobileinsurance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.automobileinsurance.dto.PolicyDTO;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.service.PolicyService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/policies")
public class PolicyController {

    @Autowired
    private PolicyService policyService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Policy addPolicy(
            @RequestBody @Valid PolicyDTO dto) {

        return policyService.addPolicy(dto);
    }

    @GetMapping("/{id}")
    public Policy getPolicyById(@PathVariable Integer id) {

        return policyService.getPolicyById(id);
    }

    @GetMapping
    public List<Policy> getAllPolicies() {

        return policyService.getAllPolicies();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Policy updatePolicy(
            @PathVariable Integer id,
            @RequestBody @Valid PolicyDTO dto) {

        return policyService.updatePolicy(id, dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deletePolicy(@PathVariable Integer id) {

        policyService.deletePolicy(id);
    }
}