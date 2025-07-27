package com.example.flexresume.repository;

import com.example.flexresume.model.PublishRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional; // 引入 Optional


public interface PublishRecordRepository extends MongoRepository<PublishRecord, String> {
    Optional<PublishRecord> findByUserIdAndVersion(String userId, int version);
    Optional<PublishRecord> findByUserId(String userId);
}