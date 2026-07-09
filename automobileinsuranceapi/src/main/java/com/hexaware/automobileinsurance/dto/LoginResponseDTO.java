package com.hexaware.automobileinsurance.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponseDTO {

    private String token;
    private String tokenType = "Bearer";
    private Integer userId;
    private String name;
    private String email;
    private String role;
    private long expiresInMs;

    public LoginResponseDTO(String token, Integer userId, String name, String email,
                             String role, long expiresInMs) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.expiresInMs = expiresInMs;
    }
}