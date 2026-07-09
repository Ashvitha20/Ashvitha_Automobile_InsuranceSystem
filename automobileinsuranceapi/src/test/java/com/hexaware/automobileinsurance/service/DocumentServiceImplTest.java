package com.hexaware.automobileinsurance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hexaware.automobileinsurance.dto.DocumentDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Document;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.repository.DocumentRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;

public class DocumentServiceImplTest {

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private ProposalRepository proposalRepository;

    @InjectMocks
    private DocumentServiceImpl documentService;

    private Proposal mockProposal;
    private Document mockDocument;
    private DocumentDTO mockDocumentDTO;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        mockProposal = new Proposal();
        mockProposal.setProposalId(1);

        mockDocument = new Document();
        mockDocument.setDocumentId(1);
        mockDocument.setProposal(mockProposal);
        mockDocument.setDocumentName("RC Book");
        mockDocument.setFilePath("/documents/rcbook.pdf");

        mockDocumentDTO = new DocumentDTO();
        mockDocumentDTO.setProposalId(1);
        mockDocumentDTO.setDocumentName("RC Book");
        mockDocumentDTO.setFilePath("/documents/rcbook.pdf");
    }

    @Test
    public void testUploadDocument() {

        when(proposalRepository.findById(1))
                .thenReturn(Optional.of(mockProposal));

        when(documentRepository.save(any(Document.class)))
                .thenReturn(mockDocument);

        Document result =
                documentService.uploadDocument(mockDocumentDTO);

        assertNotNull(result);
        assertEquals(1, result.getDocumentId());
        assertEquals("RC Book",
                result.getDocumentName());
    }

    @Test
    public void testGetDocumentById() {

        when(documentRepository.findById(1))
                .thenReturn(Optional.of(mockDocument));

        Document result =
                documentService.getDocumentById(1);

        assertNotNull(result);
        assertEquals(1, result.getDocumentId());
    }

    @Test
    public void testGetDocumentByIdNotFound() {

        when(documentRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> documentService.getDocumentById(100));
    }

    @Test
    public void testDeleteDocument() {

        when(documentRepository.findById(1))
                .thenReturn(Optional.of(mockDocument));

        assertDoesNotThrow(() ->
                documentService.deleteDocument(1));

        verify(documentRepository, times(1))
                .delete(mockDocument);
    }

    @Test
    public void testUploadDocumentProposalNotFound() {

        when(proposalRepository.findById(100))
                .thenReturn(Optional.empty());

        mockDocumentDTO.setProposalId(100);

        assertThrows(
                ResourceNotFoundException.class,
                () -> documentService.uploadDocument(mockDocumentDTO));
    }
}