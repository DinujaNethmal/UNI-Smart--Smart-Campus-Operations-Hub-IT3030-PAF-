package com.unicampus.auth.dto;

import com.unicampus.auth.enums.Role;
import jakarta.validation.constraints.NotNull;

public class UserRoleUpdateRequestDTO {

    @NotNull
    private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
