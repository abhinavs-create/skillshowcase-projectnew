package com.portal.skillshowcase.repository;

import com.portal.skillshowcase.model.Skill;
import com.portal.skillshowcase.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUser(User user);
}
