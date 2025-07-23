package com.example.flexresume.controller;

import com.example.flexresume.model.PersonalInfo;
import com.example.flexresume.repository.PersonalInfoRepository;
import com.example.flexresume.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/personal-info")
public class PersonalInfoController {

    @Autowired
    private PersonalInfoRepository personalInfoRepository;
    
    @Autowired
    private CacheService cacheService;

    // 保存个人信息 - 优先写入缓存
    @PostMapping
    public PersonalInfo savePersonalInfo(@RequestBody PersonalInfo personalInfo) {
        // 先写入缓存（写回策略）
        String cacheKey = cacheService.buildKey("personalInfo", personalInfo.getUsername(), personalInfo.getVersion());
        cacheService.writeToCache(cacheKey, personalInfo, 10); // 缓存10分钟
        
        // 返回数据给前端，数据库写入将异步进行
        return personalInfo;
    }

    // 获取所有个人信息
    @GetMapping
    public List<PersonalInfo> getAllPersonalInfo() {
        return personalInfoRepository.findAll();
    }

    // 根据用户名和版本号获取个人信息 - 优先从缓存读取
    @GetMapping("/{username}/{version}")
    public ResponseEntity<PersonalInfo> getPersonalInfoByUsernameAndVersion(
            @PathVariable String username,
            @PathVariable int version) {
        
        // 先尝试从缓存获取
        String cacheKey = cacheService.buildKey("personalInfo", username, version);
        Object cachedData = cacheService.getFromCache(cacheKey);
        
        if (cachedData != null) {
            PersonalInfo personalInfo = (PersonalInfo) cachedData;
            return ResponseEntity.ok(personalInfo);
        }
        
        // 缓存未命中，从数据库读取
        PersonalInfo personalInfo = personalInfoRepository.findByUsernameAndVersion(username, version);
        if (personalInfo == null) {
            return ResponseEntity.notFound().build();
        }
        
        // 预热缓存
        cacheService.warmUpCache(cacheKey, personalInfo, 10);
        
        return ResponseEntity.ok(personalInfo);
    }
}