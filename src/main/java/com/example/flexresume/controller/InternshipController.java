package com.example.flexresume.controller;

import com.example.flexresume.model.InternshipDocument;
import com.example.flexresume.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internship-info")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    // 保存实习信息
    @PostMapping
    public InternshipDocument saveInternship(@RequestBody InternshipDocument internship) {
        // 根据 username 查询是否已存在
        InternshipDocument existingInternship = internshipRepository.findByUsername(internship.getUsername());

        if (existingInternship != null) {
            // 如果用户存在，检查版本是否已存在
            if (existingInternship.getVersion() == internship.getVersion()) {
                // 更新已存在版本的内容
                existingInternship.setInternshipData(internship.getInternshipData());
            } else {
                // 如果是新版本，只需要更新版本号和相关信息
                existingInternship.setVersion(internship.getVersion());
                existingInternship.setInternshipData(internship.getInternshipData());
            }
            return internshipRepository.save(existingInternship);
        }

        // 如果用户不存在，插入新记录
        return internshipRepository.save(internship);
    }

    // 根据用户名和版本号获取实习信息
    @GetMapping
    public ResponseEntity<InternshipDocument> getInternshipByUsernameAndVersion(
            @RequestParam String username,
            @RequestParam int version) {
        InternshipDocument internship = internshipRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (internship == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(internship);
    }
} 