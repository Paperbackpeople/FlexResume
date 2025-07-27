package com.example.flexresume.repository;

import com.example.flexresume.model.ProjectDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProjectRepository extends MongoRepository<ProjectDocument, String> {
    Optional<ProjectDocument> findByUsernameAndVersion(String username, int version);
    ProjectDocument findByUsername(String username);
}