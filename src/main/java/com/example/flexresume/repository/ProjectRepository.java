package com.example.flexresume.repository;

import com.example.flexresume.model.ProjectDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProjectRepository extends MongoRepository<ProjectDocument, String> {
    // 根据 username 和 version 查找
    Optional<ProjectDocument> findByUsernameAndVersion(String username, int version);
    // 根据 username 查找（用于保存时检查是否存在记录）
    ProjectDocument findByUsername(String username);
}