package com.example.flexresume.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.flexresume.model.PersonalInfo;

@Repository
public interface PersonalInfoRepository extends MongoRepository<PersonalInfo, String> {
}
