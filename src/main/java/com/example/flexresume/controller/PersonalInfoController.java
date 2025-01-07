package com.example.flexresume.controller;

import com.example.flexresume.model.PersonalInfo;
import com.example.flexresume.repository.PersonalInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        return personalInfoRepository.save(personalInfo);
    }

    // 获取所有个人信息
    @GetMapping
    public List<PersonalInfo> getAllPersonalInfo() {
        return personalInfoRepository.findAll();
    }

    // 根据 ID 获取个人信息
    @GetMapping("/{id}")
    public PersonalInfo getPersonalInfoById(@PathVariable String id) {
        return personalInfoRepository.findById(id).orElse(null);
    }
}

