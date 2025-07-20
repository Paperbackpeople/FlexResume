package com.example.flexresume.controller;

import com.example.flexresume.model.PersonalInfo;
import com.example.flexresume.repository.PersonalInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/personal-info")
public class PersonalInfoController {

    @Autowired
    private PersonalInfoRepository personalInfoRepository;

    // 保存个人信息
    @PostMapping
    public PersonalInfo savePersonalInfo(@RequestBody PersonalInfo personalInfo) {
        // 根据 username 查询是否已存在
        PersonalInfo existingInfo = personalInfoRepository.findByUsername(personalInfo.getUsername());

        if (existingInfo != null) {
            // 如果用户存在，检查版本是否已存在
            if (existingInfo.getVersion() == personalInfo.getVersion()) {
                // 更新已存在版本的内容
                existingInfo.setFields(personalInfo.getFields());
                existingInfo.setProfilePhoto(personalInfo.getProfilePhoto());
            } else {
                // 如果是新版本，只需要更新版本号和相关信息
                existingInfo.setVersion(personalInfo.getVersion());
                existingInfo.setFields(personalInfo.getFields());
                existingInfo.setProfilePhoto(personalInfo.getProfilePhoto());
            }
            return personalInfoRepository.save(existingInfo);
        }

        // 如果用户不存在，插入新记录
        return personalInfoRepository.save(personalInfo);
    }

    // 获取所有个人信息
    @GetMapping
    public List<PersonalInfo> getAllPersonalInfo() {
        return personalInfoRepository.findAll();
    }

    // 根据用户名和版本号获取个人信息
    @GetMapping("/{username}/{version}")
    public ResponseEntity<PersonalInfo> getPersonalInfoByUsernameAndVersion(
            @PathVariable String username,
            @PathVariable int version) {
        PersonalInfo personalInfo = personalInfoRepository.findByUsernameAndVersion(username, version);
        if (personalInfo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(personalInfo);
    }
}