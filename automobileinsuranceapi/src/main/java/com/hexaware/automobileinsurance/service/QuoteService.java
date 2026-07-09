package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.QuoteDTO;
import com.hexaware.automobileinsurance.model.Quote;

public interface QuoteService {

    Quote generateQuote(QuoteDTO dto);

    Quote getQuoteById(Integer quoteId);

    List<Quote> getAllQuotes();
    
    Quote calculatePremium(Integer proposalId);
}