package com.unicampus.auth.security;

import com.unicampus.auth.entity.User;
import com.unicampus.auth.enums.AuthProvider;
import com.unicampus.auth.enums.Role;
import com.unicampus.auth.repository.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;

    public CustomOidcUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String providerId = oidcUser.getSubject();

        User user = userRepository.findByEmail(email)
                .map(existingUser -> updateExistingUser(existingUser, name, providerId))
                .orElseGet(() -> createNewUser(name, email, providerId));

        return new CustomUserPrincipal(user, oidcUser.getClaims(), oidcUser.getIdToken(), oidcUser.getUserInfo());
    }

    private User updateExistingUser(User user, String name, String providerId) {
        user.setName(name);
        user.setProvider(AuthProvider.GOOGLE);
        user.setProviderId(providerId);
        if (user.getRole() == null) {
            user.setRole(Role.USER);
        }
        user.setActive(true);
        return userRepository.save(user);
    }

    private User createNewUser(String name, String email, String providerId) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setProvider(AuthProvider.GOOGLE);
        user.setProviderId(providerId);
        user.setRole(Role.USER);
        user.setActive(true);
        return userRepository.save(user);
    }
}
