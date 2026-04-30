package com.unicampus.auth.dto;

import com.unicampus.auth.entity.User;

public class AuthUserResponseDTO {

    private final Long id;
    private final String name;
    private final String email;
    private final String provider;
    private final String role;
    private final boolean active;

    public AuthUserResponseDTO(Long id, String name, String email, String provider, String role, boolean active) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.provider = provider;
        this.role = role;
        this.active = active;
    }

    public static AuthUserResponseDTO fromUser(User user) {
        return new AuthUserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getProvider() != null ? user.getProvider().name() : "LOCAL",
                user.getRole() != null ? user.getRole().name() : "USER",
                user.isActive()
        );
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getProvider() {
        return provider;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }
}
