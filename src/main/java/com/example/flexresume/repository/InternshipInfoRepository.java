package com.example.flexresume.repository;

import com.example.flexresume.model.InternshipInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface InternshipInfoRepository extends MongoRepository<InternshipInfo, String> {
    Optional<InternshipInfo> findByUsernameAndVersion(String username, Integer version);
} 