package com.example.flexresume.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.flexresume.model.PersonalInfo;

@Repository
public interface PersonalInfoRepository extends MongoRepository<PersonalInfo, String> {
    PersonalInfo findByUsername(String username); // 根据用户名查找
    PersonalInfo findByUsernameAndVersion(String username, int version); // 根据用户名和版本号查找
}