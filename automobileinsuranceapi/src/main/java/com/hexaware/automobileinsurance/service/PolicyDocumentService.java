package com.hexaware.automobileinsurance.service;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import com.hexaware.automobileinsurance.model.Proposal;

import lombok.extern.slf4j.Slf4j;

/**
 * Generates the downloadable/emailable PDF policy document for an
 * active proposal (policy number, holder, vehicle and validity details).
 */
@Slf4j
@Service
public class PolicyDocumentService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

    public byte[] generatePolicyDocument(Proposal proposal) {

        try (PDDocument document = new PDDocument()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font bodyFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {

                float margin = 50;
                float leading = 20;
                float y = page.getMediaBox().getHeight() - margin;

                content.beginText();
                content.setFont(titleFont, 18);
                content.newLineAtOffset(margin, y);
                content.showText("Automobile Insurance Policy Document");
                content.endText();
                y -= leading * 2;

                String[] lines = {
                    "Policy Number: POL-" + proposal.getProposalId(),
                    "Policy Name: " + safe(proposal.getPolicy() != null ? proposal.getPolicy().getPolicyName() : null),
                    "Vehicle Type: " + safe(proposal.getPolicy() != null ? proposal.getPolicy().getVehicleType() : null),
                    "Coverage Details: " + safe(proposal.getPolicy() != null ? proposal.getPolicy().getCoverageDetails() : null),
                    "",
                    "Policy Holder: " + safe(proposal.getUser() != null ? proposal.getUser().getName() : null),
                    "Email: " + safe(proposal.getUser() != null ? proposal.getUser().getEmail() : null),
                    "",
                    "Vehicle Number: " + safe(proposal.getVehicleNumber()),
                    "Vehicle Model: " + safe(proposal.getVehicleModel()),
                    "Vehicle Year: " + (proposal.getVehicleYear() != null ? proposal.getVehicleYear().toString() : "N/A"),
                    "",
                    "Status: " + safe(proposal.getProposalStatus()),
                    "Active From: " + (proposal.getActivationDate() != null ? proposal.getActivationDate().format(DATE_FORMAT) : "N/A"),
                    "Valid Until: " + (proposal.getExpiryDate() != null ? proposal.getExpiryDate().format(DATE_FORMAT) : "N/A"),
                    "",
                    "This document is proof of your vehicle insurance policy.",
                    "Please retain a copy for your records."
                };

                content.setFont(bodyFont, 11);
                for (String line : lines) {
                    content.beginText();
                    content.newLineAtOffset(margin, y);
                    content.showText(line);
                    content.endText();
                    y -= leading;
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();

        } catch (IOException ex) {
            log.error("Failed to generate policy document PDF for proposal {}. Reason: {}",
                    proposal.getProposalId(), ex.getMessage());
            throw new RuntimeException("Unable to generate policy document.");
        }
    }

    private String safe(String value) {
        return (value == null || value.isBlank()) ? "N/A" : value;
    }
}