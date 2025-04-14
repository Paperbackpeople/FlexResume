package com.example.flexresume.controller;

import com.example.flexresume.model.WorkExperienceDocument;
import com.example.flexresume.repository.WorkExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/workexperience-info")
public class WorkExperienceController {

    @Autowired
    private WorkExperienceRepository workExperienceRepository;

    @PostMapping
    public WorkExperienceDocument saveWorkExperience(@RequestBody WorkExperienceDocument doc) {
        if (doc.getWorkExperienceData() == null || doc.getWorkExperienceData().isEmpty()) {
            System.out.println("前端提交的数据为空，不进行保存。");
            return null;
        }

        Optional<WorkExperienceDocument> existingOpt =
                workExperienceRepository.findByUsernameAndVersion(doc.getUsername(), doc.getVersion());

        if (existingOpt.isPresent()) {
            WorkExperienceDocument existingDoc = existingOpt.get();
            existingDoc.setWorkExperienceData(doc.getWorkExperienceData());
            return workExperienceRepository.save(existingDoc);
        } else {
            return workExperienceRepository.save(doc);
        }
    }

    @GetMapping
    public WorkExperienceDocument getWorkExperience(
            @RequestParam("username") String username,
            @RequestParam("version") int version
    ) {
        Optional<WorkExperienceDocument> existingOpt =
                workExperienceRepository.findByUsernameAndVersion(username, version);
        return existingOpt.orElse(null);
    }
} 