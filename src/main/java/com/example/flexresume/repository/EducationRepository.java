package com.example.flexresume.repository;

import com.example.flexresume.model.EducationDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EducationRepository extends MongoRepository<EducationDocument, String> {
    // 可以添加自定义查询方法
}