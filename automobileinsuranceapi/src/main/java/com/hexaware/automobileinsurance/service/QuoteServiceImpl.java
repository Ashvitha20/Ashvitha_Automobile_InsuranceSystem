package com.hexaware.automobileinsurance.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.automobileinsurance.dto.QuoteDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.model.Quote;
import com.hexaware.automobileinsurance.repository.ProposalRepository;
import com.hexaware.automobileinsurance.repository.QuoteRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class QuoteServiceImpl implements QuoteService {

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public Quote generateQuote(QuoteDTO dto) {

        Proposal proposal = proposalRepository.findById(dto.getProposalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Proposal not found with id : " + dto.getProposalId()));

        Quote quote = new Quote();

        quote.setProposal(proposal);
        quote.setPremiumAmount(dto.getPremiumAmount());
        quote.setAddOns(dto.getAddOns());
        quote.setGeneratedDate(LocalDateTime.now());

        Quote saved = quoteRepository.save(quote);

        log.info("Custom quote {} generated for proposal {} - premium {}",
                saved.getQuoteId(), proposal.getProposalId(), dto.getPremiumAmount());

        emailService.sendQuoteEmail(
                proposal.getUser().getEmail(),
                proposal.getUser().getName(),
                proposal.getVehicleModel(),
                dto.getPremiumAmount(),
                dto.getAddOns());

        return saved;
    }

    @Override
    public Quote getQuoteById(Integer quoteId) {

        Quote quote =
                quoteRepository.findById(quoteId).orElse(null);

        if (quote == null) {

            throw new ResourceNotFoundException(
                    "Quote not found with id : " + quoteId);
        }

        return quote;
    }

    @Override
    public List<Quote> getAllQuotes() {

        return quoteRepository.findAll();
    }

    @Override
    public Quote calculatePremium(Integer proposalId) {

        Proposal proposal =
                proposalRepository.findById(proposalId).orElse(null);

        if (proposal == null) {

            throw new ResourceNotFoundException(
                    "Proposal not found with id : " + proposalId);
        }

        Quote quote = new Quote();

        quote.setProposal(proposal);

        double premium = proposal.getPolicy().getBasePremium();

        if (proposal.getVehicleYear() < 2020) {

            premium = premium + 2000;
        }

        quote.setPremiumAmount(premium);

        quote.setAddOns("Basic Coverage");
        quote.setGeneratedDate(LocalDateTime.now());

        Quote saved = quoteRepository.save(quote);

        log.info("Auto-calculated quote {} generated for proposal {} - premium {}",
                saved.getQuoteId(), proposal.getProposalId(), premium);

        emailService.sendQuoteEmail(
                proposal.getUser().getEmail(),
                proposal.getUser().getName(),
                proposal.getVehicleModel(),
                premium,
                "Basic Coverage");

        return saved;
    }
}
