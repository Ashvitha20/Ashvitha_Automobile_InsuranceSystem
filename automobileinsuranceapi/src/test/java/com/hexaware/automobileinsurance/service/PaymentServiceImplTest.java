package com.hexaware.automobileinsurance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.automobileinsurance.dto.PaymentDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Payment;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.model.Quote;
import com.hexaware.automobileinsurance.repository.PaymentRepository;
import com.hexaware.automobileinsurance.repository.QuoteRepository;

public class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private QuoteRepository quoteRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private Payment mockPayment;
    private PaymentDTO mockPaymentDTO;
    private Quote mockQuote;
    private Proposal mockProposal;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        Policy policy = new Policy();
        policy.setPolicyId(1);

        mockProposal = new Proposal();
        mockProposal.setProposalId(1);
        mockProposal.setPolicy(policy);
        mockProposal.setProposalStatus("QUOTE_GENERATED");

        mockQuote = new Quote();
        mockQuote.setQuoteId(1);
        mockQuote.setProposal(mockProposal);

        mockPayment = new Payment();
        mockPayment.setPaymentId(1);
        mockPayment.setQuote(mockQuote);
        mockPayment.setAmount(5000.0);
        mockPayment.setPaymentStatus("PENDING");

        mockPaymentDTO = new PaymentDTO();
        mockPaymentDTO.setQuoteId(1);
        mockPaymentDTO.setAmount(5000.0);
    }

    @Test
    public void testMakePayment() {

        when(quoteRepository.findById(1))
                .thenReturn(Optional.of(mockQuote));

        when(paymentRepository.save(any(Payment.class)))
                .thenReturn(mockPayment);

        Payment result =
                paymentService.makePayment(mockPaymentDTO);

        assertNotNull(result);
        assertEquals(1, result.getPaymentId());
    }

    @Test
    public void testGetPaymentById() {

        when(paymentRepository.findById(1))
                .thenReturn(Optional.of(mockPayment));

        Payment result =
                paymentService.getPaymentById(1);

        assertNotNull(result);
        assertEquals(1, result.getPaymentId());
    }

    @Test
    public void testGetPaymentByIdNotFound() {

        when(paymentRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.getPaymentById(100));
    }

    @Test
    public void testApprovePayment() {

        when(paymentRepository.findById(1))
                .thenReturn(Optional.of(mockPayment));

        when(paymentRepository.save(any(Payment.class)))
                .thenReturn(mockPayment);

        Payment result =
                paymentService.approvePayment(1);

        assertNotNull(result);

        verify(paymentRepository, times(1))
                .save(mockPayment);
    }

    @Test
    public void testApprovePaymentNotFound() {

        when(paymentRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> paymentService.approvePayment(100));
    }
}
