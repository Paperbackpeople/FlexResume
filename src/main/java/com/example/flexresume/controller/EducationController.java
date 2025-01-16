package com.example.flexresume.controller;

import com.example.flexresume.model.EducationDocument;
import com.example.flexresume.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/education-info")
public class EducationController {

    @Autowired
    private EducationRepository educationRepository;

    // 保存教育信息
    @PostMapping
    public EducationDocument saveEducation(@RequestBody EducationDocument doc) {
        // 检查是否已经存在相同的 username 和 version
        Optional<EducationDocument> existingDoc = educationRepository
                .findByUsernameAndVersion(doc.getUsername(), doc.getVersion());

        if (existingDoc.isPresent()) {
            // 更新已有记录
            EducationDocument existing = existingDoc.get();
            existing.setEducation(doc.getEducation());
            return educationRepository.save(existing);
        } else {
            // 插入新记录
            return educationRepository.save(doc);
        }
    }

    // 根据 username 和 version 查询教育信息
    @GetMapping
    public EducationDocument getEducationByUserAndVersion(
            @RequestParam("username") String username,
            @RequestParam("version") int version) {
        return educationRepository.findByUsernameAndVersion(username, version).orElse(null);
    }
}