package com.hexaware.automobileinsurance.dto;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class UserDTO {

    private Integer userId;

    @NotNull
    @NotEmpty
    private String name;

    @NotNull
    @NotEmpty
    @Email
    private String email;
    private String password;

    @NotNull
    private LocalDate dob;

    @Pattern(regexp = "\\d{12}")
    private String aadhaar;

    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}")
    private String pan;
    
    @NotNull
    @NotEmpty
    private String address;

    @NotNull
    @NotEmpty
    private String role;
}