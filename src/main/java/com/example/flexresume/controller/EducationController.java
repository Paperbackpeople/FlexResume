package com.example.flexresume.controller;

import com.example.flexresume.model.EducationDocument;
import com.example.flexresume.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/education-info")
public class EducationController {

    @Autowired
    private EducationRepository educationRepository;

    // 保存教育信息，添加用户身份验证
    @PostMapping
    public ResponseEntity<?> saveEducation(@RequestBody EducationDocument education, HttpServletRequest request) {
        try {
            // 获取JWT验证过的用户ID
            String authenticatedUserId = (String) request.getAttribute("userId");
            if (authenticatedUserId == null) {
                return ResponseEntity.status(401).body("未授权访问");
            }
            
            // 验证请求的用户名是否与当前登录用户一致
            if (!authenticatedUserId.equals(education.getUsername())) {
                return ResponseEntity.status(403).body("无权限访问其他用户的数据");
            }

            EducationDocument existingEducation = educationRepository.findByUsername(education.getUsername());

            if (existingEducation != null) {
                if (existingEducation.getVersion() == education.getVersion()) {
                    existingEducation.setEducation(education.getEducation());
                } else {
                    existingEducation.setVersion(education.getVersion());
                    existingEducation.setEducation(education.getEducation());
                }
                return ResponseEntity.ok(educationRepository.save(existingEducation));
            }
            return ResponseEntity.ok(educationRepository.save(education));
        } catch (Exception e) {
            System.err.println("教育信息保存错误: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("保存教育信息时出错: " + e.getMessage());
        }
    }

    // 根据用户名和版本号获取教育信息，添加用户身份验证
    @GetMapping
    public ResponseEntity<?> getEducationByUsernameAndVersion(
            @RequestParam String username,
            @RequestParam int version,
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
        
        EducationDocument education = educationRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (education == null) {
            // 返回空的EducationDocument对象而不是404
            EducationDocument emptyEducation = new EducationDocument();
            emptyEducation.setUsername(username);
            emptyEducation.setVersion(version);
            emptyEducation.setEducation(new java.util.HashMap<>()); // 空的教育经历Map
            return ResponseEntity.ok(emptyEducation);
        }
        return ResponseEntity.ok(education);
    }
}