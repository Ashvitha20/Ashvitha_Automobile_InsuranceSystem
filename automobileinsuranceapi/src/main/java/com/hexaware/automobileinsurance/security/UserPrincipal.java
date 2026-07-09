package com.hexaware.automobileinsurance.security;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hexaware.automobileinsurance.model.User;

/**
 * Spring Security representation of an authenticated {@link User}.
 * Wraps the existing User entity without modifying it structurally.
 */
public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;

    private final Integer userId;
    private final String name;
    private final String email;
    private final String password;
    private final String role;

    public UserPrincipal(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    public static UserPrincipal build(User user) {
        return new UserPrincipal(user);
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String authority = "ROLE_" + (role == null ? "CUSTOMER" : role.toUpperCase());
        return Collections.singletonList(new SimpleGrantedAuthority(authority));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        // Email is used as the username for authentication.
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
