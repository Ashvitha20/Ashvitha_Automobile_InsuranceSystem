package com.hexaware.automobileinsurance.service;
import com.hexaware.automobileinsurance.model.Proposal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.automobileinsurance.dto.PaymentDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Payment;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.model.Quote;
import com.hexaware.automobileinsurance.repository.PaymentRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;
import com.hexaware.automobileinsurance.repository.QuoteRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PolicyDocumentService policyDocumentService;

    @Override
    public Payment makePayment(PaymentDTO dto) {

        Quote quote = quoteRepository.findById(dto.getQuoteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Quote not found with id : " + dto.getQuoteId()));
        
        if ("CREDIT_CARD".equalsIgnoreCase(dto.getPaymentMethod())) {
            if (dto.getBankName() == null || dto.getBankName().isBlank()
                    || dto.getBankBranch() == null || dto.getBankBranch().isBlank()
                    || dto.getCardNumber() == null || !dto.getCardNumber().matches("\\d{16}")) {
                throw new IllegalArgumentException(
                        "Please provide a valid bank name, branch, and 16-digit card number.");
            }
        }

        Payment payment = new Payment();

        payment.setQuote(quote);
        payment.setAmount(dto.getAmount());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setBankName(dto.getBankName());
        payment.setBankBranch(dto.getBankBranch());
        payment.setCardNumber(dto.getCardNumber());

        // Initial payment status
        payment.setPaymentStatus("PENDING");

        // Auto payment date
        payment.setPaymentDate(LocalDateTime.now());

        log.info("Payment of {} submitted for quote id {}", dto.getAmount(), dto.getQuoteId());

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getPaymentById(Integer paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId).orElse(null);

        if (payment == null) {

            throw new ResourceNotFoundException(
                    "Payment not found with id : " + paymentId);
        }

        return payment;
    }

    @Override
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }

    @Override
    public Payment approvePayment(Integer paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId).orElse(null);

        if (payment == null) {

            throw new ResourceNotFoundException(
                    "Payment not found with id : " + paymentId);
        }

        payment.setPaymentStatus("SUCCESS");

        Proposal proposal = payment.getQuote().getProposal();

        // Activate proposal after successful payment, and start the
        // 1-year validity window used for expiry tracking/reminders.
        LocalDate activationDate = LocalDate.now();
        LocalDate expiryDate = activationDate.plusYears(1);

        proposal.setProposalStatus("ACTIVE");
        proposal.setActivationDate(activationDate);
        proposal.setExpiryDate(expiryDate);
        proposal.setReminderSent(false);
        proposalRepository.save(proposal);

        log.info("Payment {} approved. Proposal {} is now ACTIVE (expires {})",
                paymentId, proposal.getProposalId(), expiryDate);

        Payment saved = paymentRepository.save(payment);

        byte[] policyDocument = policyDocumentService.generatePolicyDocument(proposal);

        emailService.sendPolicyActivatedEmailWithAttachment(
                proposal.getUser().getEmail(),
                proposal.getUser().getName(),
                proposal.getPolicy().getPolicyName(),
                proposal.getVehicleNumber(),
                activationDate.toString(),
                expiryDate.toString(),
                policyDocument,
                "Policy-" + proposal.getProposalId() + ".pdf");

        return saved;
    }
}
