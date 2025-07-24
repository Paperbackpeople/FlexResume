package com.example.flexresume.controller;

import com.example.flexresume.model.WorkInternshipDocument;
import com.example.flexresume.repository.WorkInternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/workinternship-info")
public class WorkInternshipController {

    @Autowired
    private WorkInternshipRepository workInternshipRepository;

    // 保存工作与实习信息，添加用户身份验证
    @PostMapping
    public ResponseEntity<?> saveWorkInternship(@RequestBody WorkInternshipDocument workInternship, HttpServletRequest request) {
        // 获取JWT验证过的用户ID
        String authenticatedUserId = (String) request.getAttribute("userId");
        if (authenticatedUserId == null) {
            return ResponseEntity.status(401).body("未授权访问");
        }
        
        // 验证请求的用户名是否与当前登录用户一致
        if (!authenticatedUserId.equals(workInternship.getUsername())) {
            return ResponseEntity.status(403).body("无权限访问其他用户的数据");
        }

        // 根据 username 查询是否已存在
        WorkInternshipDocument existing = workInternshipRepository.findByUsername(workInternship.getUsername());

        if (existing != null) {
            // 如果用户存在，检查版本是否已存在
            if (existing.getVersion() == workInternship.getVersion()) {
                // 更新已存在版本的内容
                existing.setWorkInternshipData(workInternship.getWorkInternshipData());
            } else {
                // 如果是新版本，只需要更新版本号和相关信息
                existing.setVersion(workInternship.getVersion());
                existing.setWorkInternshipData(workInternship.getWorkInternshipData());
            }
            return ResponseEntity.ok(workInternshipRepository.save(existing));
        }

        // 如果用户不存在，插入新记录
        return ResponseEntity.ok(workInternshipRepository.save(workInternship));
    }

    // 根据用户名和版本号获取工作与实习信息，添加用户身份验证
    @GetMapping
    public ResponseEntity<?> getWorkInternshipByUsernameAndVersion(
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
        
        WorkInternshipDocument doc = workInternshipRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (doc == null) {
            // 返回空的WorkInternshipDocument对象而不是404
            WorkInternshipDocument emptyDoc = new WorkInternshipDocument();
            emptyDoc.setUsername(username);
            emptyDoc.setVersion(version);
            emptyDoc.setWorkInternshipData(new java.util.HashMap<>()); // 空的工作实习数据Map
            return ResponseEntity.ok(emptyDoc);
        }
        return ResponseEntity.ok(doc);
    }
}