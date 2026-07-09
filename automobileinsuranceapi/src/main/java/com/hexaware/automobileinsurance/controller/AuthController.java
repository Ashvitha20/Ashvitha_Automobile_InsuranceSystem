package com.hexaware.automobileinsurance.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.automobileinsurance.dto.ForgotPasswordRequestDTO;
import com.hexaware.automobileinsurance.dto.LoginRequestDTO;
import com.hexaware.automobileinsurance.dto.LoginResponseDTO;
import com.hexaware.automobileinsurance.dto.UserDTO;
import com.hexaware.automobileinsurance.model.User;
import com.hexaware.automobileinsurance.security.JwtUtil;
import com.hexaware.automobileinsurance.security.UserPrincipal;
import com.hexaware.automobileinsurance.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    @PostMapping("/register")
    public User register(@RequestBody @Valid UserDTO dto) {
        return userService.registerUser(dto);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody @Valid LoginRequestDTO loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        String token = jwtUtil.generateToken(userPrincipal);

        return new LoginResponseDTO(
                token,
                userPrincipal.getUserId(),
                userPrincipal.getName(),
                userPrincipal.getUsername(),
                userPrincipal.getRole(),
                jwtExpirationMs);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody @Valid ForgotPasswordRequestDTO dto) {

        userService.resetPassword(dto.getEmail());

        return Map.of("message",
                "If an account exists for that email, a temporary password has been sent to it.");
    }
}
