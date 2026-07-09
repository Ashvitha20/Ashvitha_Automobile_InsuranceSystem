package com.hexaware.automobileinsurance.model;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
public class Document {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Integer documentId;

    @ManyToOne
    @JoinColumn(name = "proposal_id", nullable = false)
    private Proposal proposal;

    @Column(name = "document_name", nullable = false)
    private String documentName;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "uploaded_date")
    private LocalDateTime uploadedDate;
}
