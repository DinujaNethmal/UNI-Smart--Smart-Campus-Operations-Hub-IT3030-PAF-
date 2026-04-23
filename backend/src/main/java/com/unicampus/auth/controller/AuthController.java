package com.unicampus.auth.controller;

import com.unicampus.auth.dto.AuthUserResponseDTO;
import com.unicampus.auth.dto.LoginRequestDTO;
import com.unicampus.auth.dto.RegisterRequestDTO;
import com.unicampus.auth.entity.User;
import com.unicampus.auth.repository.UserRepository;
import com.unicampus.auth.security.CustomUserPrincipal;
import com.unicampus.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthController(AuthenticationManager authenticationManager, AuthService authService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponseDTO> getCurrentUser(
            @AuthenticationPrincipal Object principal) {
        if (principal instanceof CustomUserPrincipal customUserPrincipal && customUserPrincipal.getUser() != null) {
            return ResponseEntity.ok(AuthUserResponseDTO.fromUser(customUserPrincipal.getUser()));
        }

        if (principal instanceof OidcUser oidcUser) {
            User user = userRepository.findByEmail(oidcUser.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user"));
            return ResponseEntity.ok(AuthUserResponseDTO.fromUser(user));
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user");
    }

    @GetMapping("/login/google-url")
    public ResponseEntity<Map<String, String>> getGoogleLoginUrl() {
        return ResponseEntity.ok(Map.of(
                "loginUrl", "http://localhost:8081/oauth2/authorization/google",
                "successRedirect", frontendUrl + "/auth/callback"
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthUserResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.registerLocalUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthUserResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request,
            HttpServletRequest httpServletRequest) {

        try {
            String email = request.getEmail().trim().toLowerCase();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email,
                            request.getPassword()
                    )
            );

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);

            HttpSession session = httpServletRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

            Object principal = authentication.getPrincipal();

            if (principal instanceof CustomUserPrincipal customUserPrincipal) {
                return ResponseEntity.ok(
                        AuthUserResponseDTO.fromUser(customUserPrincipal.getUser())
                );
            }

            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user type");

        } catch (Exception e) {
            e.printStackTrace(); // IMPORTANT for debugging
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }
    }
}
