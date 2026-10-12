package com.portal.skillshowcase.controller;

import com.portal.skillshowcase.dto.Dtos.*;
import com.portal.skillshowcase.model.Skill;
import com.portal.skillshowcase.model.User;
import com.portal.skillshowcase.repository.SkillRepository;
import com.portal.skillshowcase.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {
    private final SkillRepository skillRepository;
    private final CurrentUser currentUser;

    @GetMapping
    public List<SkillResponse> mine(Authentication auth) {
        return skillRepository.findByUser(currentUser.get(auth)).stream().map(SkillResponse::from).toList();
    }

    @PostMapping
    public SkillResponse add(@Valid @RequestBody SkillRequest req, Authentication auth) {
        Skill s = new Skill();
        s.setUser(currentUser.get(auth));
        s.setName(req.name().trim());
        s.setLevel(req.level());
        return SkillResponse.from(skillRepository.save(s));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        User u = currentUser.get(auth);
        Skill s = skillRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found"));
        if (!s.getUser().getId().equals(u.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only remove your own skills");
        }
        skillRepository.delete(s);
    }
}
