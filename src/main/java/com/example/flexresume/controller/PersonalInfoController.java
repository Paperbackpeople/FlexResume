package com.example.flexresume.controller;

import com.example.flexresume.model.PersonalInfo;
import com.example.flexresume.repository.PersonalInfoRepository;
import com.example.flexresume.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/personal-info")
public class PersonalInfoController {

    @Autowired
    private PersonalInfoRepository personalInfoRepository;
    
    @Autowired
    private CacheService cacheService;

    @PostMapping
    public ResponseEntity<?> savePersonalInfo(@RequestBody PersonalInfo personalInfo, HttpServletRequest request) {
        String authenticatedUserId = (String) request.getAttribute("userId");
        if (authenticatedUserId == null) {
            return ResponseEntity.status(401).body("未授权访问");
        }
        
        if (!authenticatedUserId.equals(personalInfo.getUsername())) {
            return ResponseEntity.status(403).body("无权限访问其他用户的数据");
        }
        
        String cacheKey = cacheService.buildKey("personalInfo", personalInfo.getUsername(), personalInfo.getVersion());
        cacheService.writeToCache(cacheKey, personalInfo, 10); // 缓存10分钟
        
        // 返回数据给前端，数据库写入将异步进行
        return ResponseEntity.ok(personalInfo);
    }

    // 获取所有个人信息
    @GetMapping
    public List<PersonalInfo> getAllPersonalInfo() {
        return personalInfoRepository.findAll();
    }

    // 根据用户名和版本号获取个人信息 - 优先从缓存读取，添加用户身份验证
    @GetMapping("/{username}/{version}")
    public ResponseEntity<?> getPersonalInfoByUsernameAndVersion(
            @PathVariable String username,
            @PathVariable int version,
            HttpServletRequest request) {
        
        // 获取JWT验证过的用户ID
        String authenticatedUserId = (String) request.getAttribute("userId");
        if (authenticatedUserId == null) {
            return ResponseEntity.status(401).body("未授权访问");
        }
        
        // 验证请求的用户名是否与当前登录用户一致
        if (!authenticatedUserId.equals(username)) {
            return ResponseEntity.status(403).body("无权限访问其他用户的数据");
        }
        
        // 先尝试从缓存获取
        String cacheKey = cacheService.buildKey("personalInfo", username, version);
        try {
            Object cachedData = cacheService.getFromCache(cacheKey);
            if (cachedData != null) {
                PersonalInfo personalInfo = (PersonalInfo) cachedData;
                return ResponseEntity.ok(personalInfo);
            }
        } catch (Exception e) {
            // 缓存反序列化失败，清理该缓存键
            System.err.println("Cache deserialization failed for key: " + cacheKey + ", error: " + e.getMessage());
            cacheService.evictCache(cacheKey);
        }
        
        PersonalInfo personalInfo = null;
        try {
            personalInfo = personalInfoRepository.findByUsernameAndVersion(username, version).orElse(null);
        } catch (org.springframework.dao.IncorrectResultSizeDataAccessException e) {
            System.err.println("Found duplicate records for username: " + username + ", version: " + version + ". Using the first one."); 
            java.util.List<PersonalInfo> personalInfoList = personalInfoRepository.findAllByUsernameAndVersion(username, version);
            if (!personalInfoList.isEmpty()) {
                personalInfo = personalInfoList.get(0);
            }
        }
        
        if (personalInfo == null) {
            // 返回空的PersonalInfo对象而不是404
            PersonalInfo emptyPersonalInfo = new PersonalInfo();
            emptyPersonalInfo.setUsername(username);
            emptyPersonalInfo.setVersion(version);
            return ResponseEntity.ok(emptyPersonalInfo);
        }
        
        // 预热缓存
        cacheService.warmUpCache(cacheKey, personalInfo, 10);
        
        return ResponseEntity.ok(personalInfo);
    }
}