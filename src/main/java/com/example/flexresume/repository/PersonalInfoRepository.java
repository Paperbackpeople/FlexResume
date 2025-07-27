package com.example.flexresume.repository;

import com.example.flexresume.model.PersonalInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional; // 引入 Optional

@Repository
public interface PersonalInfoRepository extends MongoRepository<PersonalInfo, String> {
    Optional<PersonalInfo> findByUsernameAndVersion(String username, int version);
    PersonalInfo findByUsername(String username);
    java.util.List<PersonalInfo> findAllByUsernameAndVersion(String username, int version);
}