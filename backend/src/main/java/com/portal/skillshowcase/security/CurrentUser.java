package com.portal.skillshowcase.security;

import com.portal.skillshowcase.model.User;
import com.portal.skillshowcase.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

/** Small helper: turns the logged-in "Authentication" into the User row from the database. */
@Component
@RequiredArgsConstructor
public class CurrentUser {
    private final UserRepository userRepository;

    public User get(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in again"));
    }
}
