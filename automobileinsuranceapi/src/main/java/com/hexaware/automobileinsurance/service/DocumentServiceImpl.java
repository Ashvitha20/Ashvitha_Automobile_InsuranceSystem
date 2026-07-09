package com.hexaware.automobileinsurance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import lombok.extern.slf4j.Slf4j;
import com.hexaware.automobileinsurance.dto.DocumentDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.Document;
import com.hexaware.automobileinsurance.model.Proposal;
import com.hexaware.automobileinsurance.repository.DocumentRepository;
import com.hexaware.automobileinsurance.repository.ProposalRepository;

@Slf4j
@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ProposalRepository proposalRepository;

    @Override
    public Document uploadDocument(DocumentDTO dto) {

        Proposal proposal = proposalRepository.findById(dto.getProposalId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Proposal not found with id : " + dto.getProposalId()));

        Document document = new Document();

        document.setProposal(proposal);
        document.setDocumentName(dto.getDocumentName());
        document.setFilePath(dto.getFilePath());
        document.setUploadedDate(LocalDateTime.now());

        Document saved = documentRepository.save(document);
        log.info("Document '{}' uploaded for proposal {}", saved.getDocumentName(), proposal.getProposalId());
        return saved;
    }

    @Override
    public Document getDocumentById(Integer documentId) {

        Document document =
                documentRepository.findById(documentId).orElse(null);

        if (document == null) {

            throw new ResourceNotFoundException(
                    "Document not found with id : " + documentId);
        }

        return document;
    }

    @Override
    public List<Document> getAllDocuments() {

        return documentRepository.findAll();
    }

    @Override
    public void deleteDocument(Integer documentId) {

        Document document =
                documentRepository.findById(documentId).orElse(null);

        if (document == null) {

            throw new ResourceNotFoundException(
                    "Document not found with id : " + documentId);
        }

        documentRepository.delete(document);
        log.info("Document {} deleted", documentId);
    }
    
}