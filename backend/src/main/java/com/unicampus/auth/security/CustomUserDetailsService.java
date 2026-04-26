package com.unicampus.auth.security;

import com.unicampus.auth.entity.User;
import com.unicampus.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        if (user.getProvider() != null && user.getProvider().name().equals("GOOGLE") && user.getPasswordHash() == null) {
            throw new UsernameNotFoundException("This account uses Google login. Please sign in with Google.");
        }

        return new CustomUserPrincipal(user, Collections.emptyMap());
    }
}
