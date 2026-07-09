package com.hexaware.automobileinsurance.service;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.automobileinsurance.dto.QuoteDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Policy;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.model.Quote;
import com.hexaware.automobileinsurance.repository.ProposalRepository;
import com.hexaware.automobileinsurance.repository.QuoteRepository;

public class QuoteServiceImplTest {

    @Mock
    private QuoteRepository quoteRepository;

    @Mock
    private ProposalRepository proposalRepository;

    @InjectMocks
    private QuoteServiceImpl quoteService;

    private Proposal mockProposal;
    private Quote mockQuote;
    private QuoteDTO mockQuoteDTO;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        Policy policy = new Policy();
        policy.setPolicyId(1);
        policy.setBasePremium(5000.0);

        mockProposal = new Proposal();
        mockProposal.setProposalId(1);
        mockProposal.setVehicleYear(2022);
        mockProposal.setPolicy(policy);

        mockQuote = new Quote();
        mockQuote.setQuoteId(1);
        mockQuote.setProposal(mockProposal);
        mockQuote.setPremiumAmount(5000.0);
        mockQuote.setAddOns("Basic Coverage");

        mockQuoteDTO = new QuoteDTO();
        mockQuoteDTO.setProposalId(1);
        mockQuoteDTO.setPremiumAmount(5000.0);
        mockQuoteDTO.setAddOns("Basic Coverage");
    }

    @Test
    public void testGenerateQuote() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        when(quoteRepository.save(any(Quote.class)))
                .thenReturn(mockQuote);

        Quote result = quoteService.generateQuote(mockQuoteDTO);

        assertNotNull(result);
        assertEquals(1, result.getQuoteId());
        assertEquals(5000.0, result.getPremiumAmount());
    }

    @Test
    public void testGetQuoteById() {

        when(quoteRepository.findById(1))
                .thenReturn(Optional.of(mockQuote));

        Quote result = quoteService.getQuoteById(1);

        assertNotNull(result);
        assertEquals(1, result.getQuoteId());
    }

    @Test
    public void testGetQuoteByIdNotFound() {

        when(quoteRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> quoteService.getQuoteById(100));
    }

    @Test
    public void testCalculatePremium() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        when(quoteRepository.save(any(Quote.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Quote result = quoteService.calculatePremium(1);

        assertNotNull(result);
        assertEquals(5000.0, result.getPremiumAmount());
    }

    @Test
    public void testCalculatePremiumProposalNotFound() {

        when(proposalRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> quoteService.calculatePremium(100));
    }
}
