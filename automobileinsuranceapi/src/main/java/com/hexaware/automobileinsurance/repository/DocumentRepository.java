package com.hexaware.automobileinsurance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hexaware.automobileinsurance.model.Document;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

}