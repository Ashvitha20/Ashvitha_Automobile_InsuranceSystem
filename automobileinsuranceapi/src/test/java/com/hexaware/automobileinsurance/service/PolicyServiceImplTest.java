package com.hexaware.automobileinsurance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.automobileinsurance.dto.PolicyDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.repository.PolicyRepository;

public class PolicyServiceImplTest {

    @Mock
    private PolicyRepository policyRepository;

    @InjectMocks
    private PolicyServiceImpl policyService;

    private Policy mockPolicy;
    private PolicyDTO mockPolicyDTO;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        mockPolicy = new Policy();

        mockPolicy.setPolicyId(1);
        mockPolicy.setPolicyName("Comprehensive Policy");
        mockPolicy.setVehicleType("CAR");
        mockPolicy.setCoverageDetails("Full Coverage");
        mockPolicy.setBasePremium(5000.0);
        mockPolicy.setStatus("ACTIVE");

        mockPolicyDTO = new PolicyDTO();

        mockPolicyDTO.setPolicyName("Comprehensive Policy");
        mockPolicyDTO.setVehicleType("CAR");
        mockPolicyDTO.setCoverageDetails("Full Coverage");
        mockPolicyDTO.setBasePremium(5000.0);
        mockPolicyDTO.setStatus("ACTIVE");
    }

    @Test
    public void testAddPolicy() {

        when(policyRepository.save(any(Policy.class)))
                .thenReturn(mockPolicy);

        Policy result =
                policyService.addPolicy(mockPolicyDTO);

        assertNotNull(result);
        assertEquals(1, result.getPolicyId());
        assertEquals("Comprehensive Policy",
                result.getPolicyName());
    }

    @Test
    public void testGetPolicyById() {

        when(policyRepository.findById(1))
                .thenReturn(Optional.of(mockPolicy));

        Policy result =
                policyService.getPolicyById(1);

        assertNotNull(result);
        assertEquals(1, result.getPolicyId());
    }

    @Test
    public void testGetPolicyByIdNotFound() {

        when(policyRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> policyService.getPolicyById(100));
    }

    @Test
    public void testUpdatePolicy() {

        when(policyRepository.findById(1))
                .thenReturn(Optional.of(mockPolicy));

        when(policyRepository.save(any(Policy.class)))
                .thenReturn(mockPolicy);

        Policy result =
                policyService.updatePolicy(1, mockPolicyDTO);

        assertNotNull(result);
        assertEquals("Comprehensive Policy",
                result.getPolicyName());
    }

    @Test
    public void testDeletePolicy() {

        when(policyRepository.findById(1))
                .thenReturn(Optional.of(mockPolicy));

        assertDoesNotThrow(() ->
                policyService.deletePolicy(1));

        verify(policyRepository, times(1))
                .delete(mockPolicy);
    }
}