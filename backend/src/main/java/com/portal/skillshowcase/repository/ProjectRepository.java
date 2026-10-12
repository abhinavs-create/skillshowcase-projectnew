package com.portal.skillshowcase.repository;

import com.portal.skillshowcase.model.Project;
import com.portal.skillshowcase.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByCreatedAtDesc();
    List<Project> findByUserOrderByCreatedAtDesc(User user);
}
