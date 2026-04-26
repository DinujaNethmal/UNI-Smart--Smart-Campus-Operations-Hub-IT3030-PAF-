package com.unicampus.auth.security;

import com.unicampus.auth.entity.User;
import com.unicampus.auth.enums.AuthProvider;
import com.unicampus.auth.enums.Role;
import com.unicampus.auth.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = delegate.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if (!"google".equalsIgnoreCase(registrationId)) {
            throw new OAuth2AuthenticationException(new OAuth2Error("invalid_registration"), "Only Google login is supported");
        }

        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = getRequiredAttribute(attributes, "email");
        String name = getRequiredAttribute(attributes, "name");
        String providerId = getRequiredAttribute(attributes, "sub");

        User user = userRepository.findByEmail(email)
                .map(existingUser -> updateExistingUser(existingUser, name, providerId))
                .orElseGet(() -> createNewUser(name, email, providerId));

        return new CustomUserPrincipal(user, attributes);
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

    private String getRequiredAttribute(Map<String, Object> attributes, String attributeName) {
        Object value = attributes.get(attributeName);
        if (value == null) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("missing_attribute"),
                    "Missing Google attribute: " + attributeName
            );
        }
        return value.toString();
    }
}
