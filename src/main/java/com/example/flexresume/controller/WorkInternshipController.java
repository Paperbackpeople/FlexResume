package com.example.flexresume.controller;

import com.example.flexresume.model.WorkInternshipDocument;
import com.example.flexresume.repository.WorkInternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workinternship-info")
public class WorkInternshipController {

    @Autowired
    private WorkInternshipRepository workInternshipRepository;

    // 保存工作与实习信息
    @PostMapping
    public WorkInternshipDocument saveWorkInternship(@RequestBody WorkInternshipDocument workInternship) {
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
            return workInternshipRepository.save(existing);
        }

        // 如果用户不存在，插入新记录
        return workInternshipRepository.save(workInternship);
    }

    // 根据用户名和版本号获取工作与实习信息
    @GetMapping
    public ResponseEntity<WorkInternshipDocument> getWorkInternshipByUsernameAndVersion(
            @RequestParam String username,
            @RequestParam int version) {
        WorkInternshipDocument doc = workInternshipRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (doc == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(doc);
    }
}