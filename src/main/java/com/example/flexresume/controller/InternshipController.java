package com.example.flexresume.controller;

import com.example.flexresume.model.InternshipDocument;
import com.example.flexresume.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/internship-info")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    /**
     * 保存或更新 Internship 数据
     */
    @PostMapping
    public InternshipDocument saveInternship(@RequestBody InternshipDocument doc) {
        // 先校验空数据
        if (doc.getInternshipData() == null || doc.getInternshipData().isEmpty()) {
            System.out.println("前端提交的数据为空，不进行保存。");
            return null;
        }

        // 检查是否已存在
        Optional<InternshipDocument> existingOpt =
                internshipRepository.findByUsernameAndVersion(doc.getUsername(), doc.getVersion());

        if (existingOpt.isPresent()) {
            InternshipDocument existingDoc = existingOpt.get();
            // 只更新 internshipData
            existingDoc.setInternshipData(doc.getInternshipData());
            return internshipRepository.save(existingDoc);
        } else {
            // 新插入
            return internshipRepository.save(doc);
        }
    }

    /**
     * 获取某个 username + version 的 internship 数据
     */
    @GetMapping
    public InternshipDocument getInternship(
            @RequestParam("username") String username,
            @RequestParam("version") int version
    ) {
        Optional<InternshipDocument> existingOpt =
                internshipRepository.findByUsernameAndVersion(username, version);
        return existingOpt.orElse(null);
    }
} 