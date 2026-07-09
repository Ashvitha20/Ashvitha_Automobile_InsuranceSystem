package com.hexaware.automobileinsurance.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.automobileinsurance.dto.PaymentDTO;
import com.hexaware.automobileinsurance.model.Payment;
import com.hexaware.automobileinsurance.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public Payment makePayment(
            @RequestBody @Valid PaymentDTO dto) {

        return paymentService.makePayment(dto);
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Integer id) {

        return paymentService.getPaymentById(id);
    }

    @GetMapping
    public List<Payment> getAllPayments() {

        return paymentService.getAllPayments();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public Payment approvePayment(
            @PathVariable Integer id) {

        return paymentService.approvePayment(id);
    }
}