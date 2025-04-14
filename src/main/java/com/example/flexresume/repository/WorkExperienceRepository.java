package com.example.flexresume.repository;

import com.example.flexresume.model.WorkExperienceDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WorkExperienceRepository extends MongoRepository<WorkExperienceDocument, String> {
    Optional<WorkExperienceDocument> findByUsernameAndVersion(String username, int version);
} 