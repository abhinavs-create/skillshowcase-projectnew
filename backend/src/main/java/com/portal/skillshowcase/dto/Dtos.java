package com.portal.skillshowcase.dto;

import com.portal.skillshowcase.model.Project;
import com.portal.skillshowcase.model.Skill;
import com.portal.skillshowcase.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** All request/response shapes in one place (the JSON the frontend sends and receives). */
public class Dtos {

    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, message = "must be at least 6 characters") String password,
            String department) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record AuthResponse(String token, Long id, String name, String email, String role) {}

    public record ProjectRequest(
            @NotBlank String title,
            @NotBlank @Size(max = 2000) String description,
            String techStack, String githubLink, String liveLink) {}

    public record ProjectResponse(Long id, String title, String description, String techStack,
                                  String githubLink, String liveLink, Long ownerId,
                                  String ownerName, String createdAt) {
        public static ProjectResponse from(Project p) {
            return new ProjectResponse(p.getId(), p.getTitle(), p.getDescription(), p.getTechStack(),
                    p.getGithubLink(), p.getLiveLink(), p.getUser().getId(), p.getUser().getName(),
                    p.getCreatedAt() == null ? null : p.getCreatedAt().toString());
        }
    }

    public record SkillRequest(@NotBlank String name, @NotBlank String level) {}

    public record SkillResponse(Long id, String name, String level) {
        public static SkillResponse from(Skill s) {
            return new SkillResponse(s.getId(), s.getName(), s.getLevel());
        }
    }

    public record ProfileRequest(@NotBlank String name, String department,
                                 @Size(max = 500) String bio) {}

    public record ProfileResponse(Long id, String name, String email, String department,
                                  String bio, String role) {
        public static ProfileResponse from(User u) {
            return new ProfileResponse(u.getId(), u.getName(), u.getEmail(), u.getDepartment(),
                    u.getBio(), u.getRole().name());
        }
    }
}
