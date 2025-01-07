package com.example.flexresume.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.flexresume.model.PersonalInfo;
public interface PersonalInfoRepository extends MongoRepository<PersonalInfo, String> {
}
