package com.example.flexresume.repository;

import com.example.flexresume.model.EducationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface EducationRepository extends MongoRepository<EducationDocument, String> {
    Optional<EducationDocument> findByUsernameAndVersion(String username, int version);
}