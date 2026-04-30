package com.unicampus.auth.controller;

import com.unicampus.auth.dto.AuthUserResponseDTO;
import com.unicampus.auth.dto.UserRoleUpdateRequestDTO;
import com.unicampus.auth.entity.User;
import com.unicampus.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<AuthUserResponseDTO> updateUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody UserRoleUpdateRequestDTO request) {
        User updatedUser = userService.updateUserRole(userId, request.getRole());
        return ResponseEntity.ok(AuthUserResponseDTO.fromUser(updatedUser));
    }
}
