package com.example.flexresume.controller;

import com.example.flexresume.model.WorkExperienceDocument;
import com.example.flexresume.repository.WorkExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work-experience-info")
public class WorkExperienceController {

    @Autowired
    private WorkExperienceRepository workExperienceRepository;

    // 保存工作经验信息
    @PostMapping
    public WorkExperienceDocument saveWorkExperience(@RequestBody WorkExperienceDocument workExperience) {
        // 根据 username 查询是否已存在
        WorkExperienceDocument existingWorkExperience = workExperienceRepository.findByUsername(workExperience.getUsername());

        if (existingWorkExperience != null) {
            // 如果用户存在，检查版本是否已存在
            if (existingWorkExperience.getVersion() == workExperience.getVersion()) {
                // 更新已存在版本的内容
                existingWorkExperience.setWorkExperienceData(workExperience.getWorkExperienceData());
            } else {
                // 如果是新版本，只需要更新版本号和相关信息
                existingWorkExperience.setVersion(workExperience.getVersion());
                existingWorkExperience.setWorkExperienceData(workExperience.getWorkExperienceData());
            }
            return workExperienceRepository.save(existingWorkExperience);
        }

        // 如果用户不存在，插入新记录
        return workExperienceRepository.save(workExperience);
    }

    // 根据用户名和版本号获取工作经验信息
    @GetMapping
    public ResponseEntity<WorkExperienceDocument> getWorkExperienceByUsernameAndVersion(
            @RequestParam String username,
            @RequestParam int version) {
        WorkExperienceDocument workExperience = workExperienceRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (workExperience == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(workExperience);
    }
} 