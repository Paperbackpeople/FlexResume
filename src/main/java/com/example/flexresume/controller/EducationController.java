package com.example.flexresume.controller;

import com.example.flexresume.model.EducationDocument;
import com.example.flexresume.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/education-info")
public class EducationController {

    @Autowired
    private EducationRepository educationRepository;

    // 保存教育信息
    @PostMapping
    public EducationDocument saveEducation(@RequestBody EducationDocument education) {
        EducationDocument existingEducation = educationRepository.findByUsername(education.getUsername());

        if (existingEducation != null) {
            if (existingEducation.getVersion() == education.getVersion()) {
                existingEducation.setEducation(education.getEducation());
            } else {
                existingEducation.setVersion(education.getVersion());
                existingEducation.setEducation(education.getEducation());
            }
            return educationRepository.save(existingEducation);
        }
        return educationRepository.save(education);
    }

    // 根据用户名和版本号获取教育信息
    @GetMapping
    public ResponseEntity<EducationDocument> getEducationByUsernameAndVersion(
            @RequestParam String username,
            @RequestParam int version) {
        EducationDocument education = educationRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (education == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(education);
    }
}