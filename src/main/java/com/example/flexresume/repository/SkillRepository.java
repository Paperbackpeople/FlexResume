package com.example.flexresume.repository;


import com.example.flexresume.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {
    Skill findByUsernameAndVersion(String username, int version);
}
