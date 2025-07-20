package com.example.flexresume.repository;

import com.example.flexresume.model.InternshipDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface InternshipRepository extends MongoRepository<InternshipDocument, String> {
    // 根据 username 和 version 查找
    Optional<InternshipDocument> findByUsernameAndVersion(String username, int version);
    // 根据 username 查找（用于保存时检查是否存在记录）
    InternshipDocument findByUsername(String username);
} 