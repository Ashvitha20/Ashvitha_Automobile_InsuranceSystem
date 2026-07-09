package com.hexaware.automobileinsurance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hexaware.automobileinsurance.dto.DocumentDTO;
import com.hexaware.automobileinsurance.model.Document;
import com.hexaware.automobileinsurance.service.DocumentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping
    public Document uploadDocument(
            @RequestBody @Valid DocumentDTO dto) {

        return documentService.uploadDocument(dto);
    }

    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Integer id) {

        return documentService.getDocumentById(id);
    }

    @GetMapping
    public List<Document> getAllDocuments() {

        return documentService.getAllDocuments();
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable Integer id) {

        documentService.deleteDocument(id);
    }
    
}