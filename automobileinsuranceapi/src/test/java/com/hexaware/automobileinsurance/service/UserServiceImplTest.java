package com.hexaware.automobileinsurance.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.hexaware.automobileinsurance.dto.UserDTO;
import com.hexaware.automobileinsurance.exception.ResourceNotFoundException;
import com.hexaware.automobileinsurance.model.User;
import com.hexaware.automobileinsurance.repository.UserRepository;

public class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User mockUser;
    private UserDTO mockUserDTO;

    @BeforeEach
    public void setup() {

        MockitoAnnotations.openMocks(this);

        mockUser = new User();
        mockUser.setUserId(1);
        mockUser.setName("John Doe");
        mockUser.setEmail("john@example.com");
        mockUser.setPassword("$2a$10$hashedPasswordPlaceholder");
        mockUser.setDob(LocalDate.of(2000, 1, 1));
        mockUser.setAadhaar("123456789012");
        mockUser.setPan("ABCDE1234F");
        mockUser.setRole("CUSTOMER");

        mockUserDTO = new UserDTO();
        mockUserDTO.setName("John Doe");
        mockUserDTO.setEmail("john@example.com");
        mockUserDTO.setPassword("password123");
        mockUserDTO.setDob(LocalDate.of(2000, 1, 1));
        mockUserDTO.setAadhaar("123456789012");
        mockUserDTO.setPan("ABCDE1234F");
        mockUserDTO.setRole("CUSTOMER");
    }

    @Test
    public void testRegisterUser() {

        when(userRepository.existsByEmail("john@example.com"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("$2a$10$hashedPasswordPlaceholder");

        when(userRepository.save(any(User.class)))
                .thenReturn(mockUser);

        User result = userService.registerUser(mockUserDTO);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@example.com", result.getEmail());
        assertEquals("$2a$10$hashedPasswordPlaceholder", result.getPassword());

        verify(passwordEncoder, times(1)).encode("password123");
    }

    @Test
    public void testRegisterUser_DuplicateEmail_ThrowsException() {

        when(userRepository.existsByEmail("john@example.com"))
                .thenReturn(true);

        assertThrows(
                IllegalArgumentException.class,
                () -> userService.registerUser(mockUserDTO));

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    public void testGetUserById() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(mockUser));

        User result = userService.getUserById(1);

        assertNotNull(result);
        assertEquals(1, result.getUserId());
        assertEquals("John Doe", result.getName());
    }

    @Test
    public void testGetUserByIdNotFound() {

        when(userRepository.findById(100))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> userService.getUserById(100));
    }

    @Test
    public void testUpdateUser() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(mockUser));

        when(passwordEncoder.encode("password123"))
                .thenReturn("$2a$10$hashedPasswordPlaceholder");

        when(userRepository.save(any(User.class)))
                .thenReturn(mockUser);

        User result = userService.updateUser(1, mockUserDTO);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
    }

    @Test
    public void testDeleteUser() {

        when(userRepository.findById(1))
                .thenReturn(Optional.of(mockUser));

        assertDoesNotThrow(() ->
                userService.deleteUser(1));

        verify(userRepository, times(1))
                .delete(mockUser);
    }
}
