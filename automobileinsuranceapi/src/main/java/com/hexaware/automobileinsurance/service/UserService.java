package com.hexaware.automobileinsurance.service;

import java.util.List;

import com.hexaware.automobileinsurance.dto.UserDTO;
import com.hexaware.automobileinsurance.model.User;

public interface UserService {

    User registerUser(UserDTO dto);

    User getUserById(Integer userId);

    List<User> getAllUsers();

    User updateUser(Integer userId, UserDTO dto);

    void deleteUser(Integer userId);

    // Generates a new temporary password for the given email, saves it
    // (hashed), and emails it to the user. Used by the public
    // /auth/forgot-password endpoint.
    void resetPassword(String email);
}