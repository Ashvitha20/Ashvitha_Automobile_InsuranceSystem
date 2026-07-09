package com.hexaware.automobileinsurance.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hexaware.automobileinsurance.dto.QuoteDTO;
import com.hexaware.automobileinsurance.model.Quote;
import com.hexaware.automobileinsurance.service.QuoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/quotes")
public class QuoteController {

    @Autowired
    private QuoteService quoteService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Quote generateQuote(
            @RequestBody @Valid QuoteDTO dto) {

        return quoteService.generateQuote(dto);
    }

    @GetMapping("/{id}")
    public Quote getQuoteById(@PathVariable Integer id) {

        return quoteService.getQuoteById(id);
    }

    @GetMapping
    public List<Quote> getAllQuotes() {

        return quoteService.getAllQuotes();
    }
    @GetMapping("/calculate/{proposalId}")
    public Quote calculatePremium(
            @PathVariable Integer proposalId) {

        return quoteService.calculatePremium(proposalId);
    }
}