package com.example.flexresume.repository;

import com.example.flexresume.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; 

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {
    Optional<Skill> findByUsernameAndVersion(String username, int version);
    Skill findByUsername(String username);
}