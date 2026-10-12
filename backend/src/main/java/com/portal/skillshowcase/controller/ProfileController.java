package com.portal.skillshowcase.controller;

import com.portal.skillshowcase.dto.Dtos.*;
import com.portal.skillshowcase.model.User;
import com.portal.skillshowcase.repository.UserRepository;
import com.portal.skillshowcase.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final UserRepository userRepository;
    private final CurrentUser currentUser;

    @GetMapping
    public ProfileResponse get(Authentication auth) {
        return ProfileResponse.from(currentUser.get(auth));
    }

    @PutMapping
    public ProfileResponse update(@Valid @RequestBody ProfileRequest req, Authentication auth) {
        User u = currentUser.get(auth);
        u.setName(req.name().trim());
        u.setDepartment(req.department());
        u.setBio(req.bio());
        return ProfileResponse.from(userRepository.save(u));
    }
}
