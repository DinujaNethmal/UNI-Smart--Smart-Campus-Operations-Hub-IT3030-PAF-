package com.unicampus.auth.repository;

import com.unicampus.auth.entity.User;
import com.unicampus.auth.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndActiveTrue(Role role);
}
