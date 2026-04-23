package com.unicampus.auth.service;

import com.unicampus.auth.dto.AuthUserResponseDTO;
import com.unicampus.auth.dto.RegisterRequestDTO;
import com.unicampus.auth.entity.User;
import com.unicampus.auth.enums.AuthProvider;
import com.unicampus.auth.enums.Role;
import com.unicampus.auth.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthUserResponseDTO registerLocalUser(RegisterRequestDTO request) {
        String normalizedName = request.getName().trim();
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        userRepository.findByEmail(normalizedEmail).ifPresent(existingUser -> {
            throw new IllegalArgumentException("An account with this email already exists");
        });

        User user = new User();
        user.setName(normalizedName);
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setProvider(AuthProvider.LOCAL);
        user.setRole(Role.USER);
        user.setActive(true);

        return AuthUserResponseDTO.fromUser(userRepository.save(user));
    }
}
