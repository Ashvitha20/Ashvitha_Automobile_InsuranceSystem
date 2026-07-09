package com.hexaware.automobileinsurance.dto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class DocumentDTO {

    private Integer documentId;

    @NotNull
    private Integer proposalId;

    @NotNull
    @NotEmpty
    private String documentName;

    @NotNull
    @NotEmpty
    private String filePath;
}