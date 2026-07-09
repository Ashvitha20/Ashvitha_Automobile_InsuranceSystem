package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.PaymentDTO;
import com.hexaware.automobileinsurance.model.Payment;

public interface PaymentService {

    Payment makePayment(PaymentDTO dto);

    Payment getPaymentById(Integer paymentId);

    List<Payment> getAllPayments();
    
    Payment approvePayment(Integer paymentId);
}