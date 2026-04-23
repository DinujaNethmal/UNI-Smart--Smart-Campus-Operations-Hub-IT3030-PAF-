package com.unicampus.auth.service;

import com.unicampus.auth.entity.User;
import com.unicampus.auth.enums.Role;
import com.unicampus.auth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
    }

    public List<User> getActiveUsersByRole(Role role) {
        List<User> activeUsers = userRepository.findByRoleAndActiveTrue(role);
        return activeUsers.isEmpty() ? userRepository.findByRole(role) : activeUsers;
    }

    @Transactional
    public User updateUserRole(Long userId, Role role) {
        User user = getUserById(userId);
        user.setRole(role);
        return userRepository.save(user);
    }
}
