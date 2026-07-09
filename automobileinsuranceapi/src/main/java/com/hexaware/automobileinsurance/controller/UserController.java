package com.hexaware.automobileinsurance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.hexaware.automobileinsurance.security.UserPrincipal;
import com.hexaware.automobileinsurance.dto.UserDTO;
import com.hexaware.automobileinsurance.model.User;
import com.hexaware.automobileinsurance.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public User registerUser(
            @RequestBody @Valid UserDTO dto) {

        return userService.registerUser(dto);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {

        return userService.getUserById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Integer id,
            @RequestBody @Valid UserDTO dto) {

        return userService.updateUser(id, dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {

        userService.deleteUser(id);
    }
    @GetMapping("/me")
    public User getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {

        return userService.getUserById(principal.getUserId());
    }

    @PutMapping("/me")
    public User updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody @Valid UserDTO dto) {

        dto.setRole(principal.getRole());

        return userService.updateUser(principal.getUserId(), dto);
    }
}