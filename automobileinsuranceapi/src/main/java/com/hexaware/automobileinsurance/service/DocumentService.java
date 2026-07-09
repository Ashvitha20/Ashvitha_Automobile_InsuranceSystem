package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.DocumentDTO;
import com.hexaware.automobileinsurance.model.Document;

public interface DocumentService {

    Document uploadDocument(DocumentDTO dto);

    Document getDocumentById(Integer documentId);

    List<Document> getAllDocuments();

    void deleteDocument(Integer documentId);
    
    
}