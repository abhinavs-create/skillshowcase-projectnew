package com.portal.skillshowcase.controller;

import com.portal.skillshowcase.dto.Dtos.*;
import com.portal.skillshowcase.model.Project;
import com.portal.skillshowcase.model.Role;
import com.portal.skillshowcase.model.User;
import com.portal.skillshowcase.repository.ProjectRepository;
import com.portal.skillshowcase.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectRepository projectRepository;
    private final CurrentUser currentUser;

    /** Public: every student's projects, newest first. */
    @GetMapping
    public List<ProjectResponse> all() {
        return projectRepository.findAllByOrderByCreatedAtDesc().stream().map(ProjectResponse::from).toList();
    }

    @GetMapping("/mine")
    public List<ProjectResponse> mine(Authentication auth) {
        return projectRepository.findByUserOrderByCreatedAtDesc(currentUser.get(auth))
                .stream().map(ProjectResponse::from).toList();
    }

    @PostMapping
    public ProjectResponse create(@Valid @RequestBody ProjectRequest req, Authentication auth) {
        Project p = new Project();
        p.setUser(currentUser.get(auth));
        apply(p, req);
        return ProjectResponse.from(projectRepository.save(p));
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest req, Authentication auth) {
        Project p = owned(id, auth);
        apply(p, req);
        return ProjectResponse.from(projectRepository.save(p));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        projectRepository.delete(owned(id, auth));
    }

    /** Finds the project and makes sure the logged-in user owns it (admins may change any). */
    private Project owned(Long id, Authentication auth) {
        User u = currentUser.get(auth);
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        if (!p.getUser().getId().equals(u.getId()) && u.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only change your own projects");
        }
        return p;
    }

    private void apply(Project p, ProjectRequest r) {
        p.setTitle(r.title().trim());
        p.setDescription(r.description().trim());
        p.setTechStack(r.techStack());
        p.setGithubLink(r.githubLink());
        p.setLiveLink(r.liveLink());
    }
}
