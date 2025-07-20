package com.example.flexresume.repository;

import com.example.flexresume.model.WorkExperienceDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WorkExperienceRepository extends MongoRepository<WorkExperienceDocument, String> {
    Optional<WorkExperienceDocument> findByUsernameAndVersion(String username, int version);
    // 根据 username 查找（用于保存时检查是否存在记录）
    WorkExperienceDocument findByUsername(String username);
} 