package com.example.flexresume.repository;

import com.example.flexresume.model.PublishRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
 
public interface PublishRecordRepository extends MongoRepository<PublishRecord, String> {
    PublishRecord findByUserIdAndVersion(String userId, int version);
    PublishRecord findByUserId(String userId);
} 