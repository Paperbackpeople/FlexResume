package com.example.flexresume.repository;

import com.example.flexresume.model.WorkInternshipDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface WorkInternshipRepository extends MongoRepository<WorkInternshipDocument, String> {
    // 根据 username 和 version 查找
    Optional<WorkInternshipDocument> findByUsernameAndVersion(String username, int version);
    // 根据 username 查找（用于保存时检查是否存在记录）
    WorkInternshipDocument findByUsername(String username);
}