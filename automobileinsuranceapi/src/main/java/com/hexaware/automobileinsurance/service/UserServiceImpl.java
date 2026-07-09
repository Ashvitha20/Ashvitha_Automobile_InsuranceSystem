package com.hexaware.automobileinsurance.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hexaware.automobileinsurance.dto.UserDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.User;
import com.hexaware.automobileinsurance.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private static final String TEMP_PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public User registerUser(UserDTO dto) {

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required to register a user.");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException(
                    "A user with email " + dto.getEmail() + " is already registered.");
        }

        User user = new User();

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setDob(dto.getDob());
        user.setAadhaar(dto.getAadhaar());
        user.setPan(dto.getPan());
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole() == null ? "CUSTOMER" : dto.getRole().toUpperCase());
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        log.info("New user registered: id={}, email={}, role={}", saved.getUserId(), saved.getEmail(), saved.getRole());
        return saved;
    }

    @Override
    public User getUserById(Integer userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {

            throw new ResourceNotFoundException(
                    "User not found with id : " + userId);
        }

        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Integer userId, UserDTO dto) {

        User existingUser =
                userRepository.findById(userId).orElse(null);

        if (existingUser == null) {

            throw new ResourceNotFoundException(
                    "User not found with id : " + userId);
        }

        existingUser.setName(dto.getName());
        existingUser.setEmail(dto.getEmail());

        // Only re-hash the password if a new one was actually supplied.
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        existingUser.setDob(dto.getDob());
        existingUser.setAadhaar(dto.getAadhaar());
        existingUser.setPan(dto.getPan());
        existingUser.setAddress(dto.getAddress());
        existingUser.setRole(dto.getRole() == null ? existingUser.getRole() : dto.getRole().toUpperCase());

        User saved = userRepository.save(existingUser);
        log.info("User updated: id={}, email={}", saved.getUserId(), saved.getEmail());
        return saved;
    }

    @Override
    public void deleteUser(Integer userId) {

        User user =
                userRepository.findById(userId).orElse(null);

        if (user == null) {

            throw new ResourceNotFoundException(
                    "User not found with id : " + userId);
        }

        userRepository.delete(user);
        log.info("User deleted: id={}, email={}", userId, user.getEmail());
    }

    @Override
    public void resetPassword(String email) {

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Deliberately don't reveal whether the email exists - just log
            // it server-side and return quietly, same as many production
            // systems do to avoid leaking which emails are registered.
            log.warn("Password reset requested for unknown email: {}", email);
            return;
        }

        String temporaryPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);

        log.info("Password reset for user id={}, email={}", user.getUserId(), email);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), temporaryPassword);
    }

    private String generateTemporaryPassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(random.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
