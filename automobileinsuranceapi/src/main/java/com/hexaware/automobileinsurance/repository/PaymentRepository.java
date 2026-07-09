package com.hexaware.automobileinsurance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.automobileinsurance.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

}