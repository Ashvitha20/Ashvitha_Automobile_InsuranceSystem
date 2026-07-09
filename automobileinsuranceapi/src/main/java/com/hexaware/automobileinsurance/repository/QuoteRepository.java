package com.hexaware.automobileinsurance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.automobileinsurance.model.Quote;

public interface QuoteRepository extends JpaRepository<Quote, Integer> {

}