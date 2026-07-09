package com.hexaware.automobileinsurance.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ForgotPasswordRequestDTO {

    @NotNull
    @NotEmpty
    @Email
    private String email;
}
