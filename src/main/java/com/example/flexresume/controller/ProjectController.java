package com.example.flexresume.controller;

import com.example.flexresume.model.ProjectDocument;
import com.example.flexresume.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/project-info")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * 保存或更新 Project 数据
     * 要求：同一 username + version 只能有一条记录
     * 如果已存在则更新，否则插入
     * 并且若数据为空则不存
     */
    @PostMapping
    public ProjectDocument saveProject(@RequestBody ProjectDocument doc) {
        // 先校验空数据
        if (doc.getProjectData() == null || doc.getProjectData().isEmpty()) {
            System.out.println("前端提交的数据为空，不进行保存。");
            return null; // 或者返回一个自定义异常/状态
        }

        // 检查是否已存在
        Optional<ProjectDocument> existingOpt =
                projectRepository.findByUsernameAndVersion(doc.getUsername(), doc.getVersion());

        if (existingOpt.isPresent()) {
            ProjectDocument existingDoc = existingOpt.get();
            // 只更新 projectData
            existingDoc.setProjectData(doc.getProjectData());
            return projectRepository.save(existingDoc);
        } else {
            // 新插入
            return projectRepository.save(doc);
        }
    }

    /**
     * 获取某个 username + version 的 project 数据
     */
    @GetMapping
    public ProjectDocument getProject(
            @RequestParam("username") String username,
            @RequestParam("version") int version
    ) {
        Optional<ProjectDocument> existingOpt =
                projectRepository.findByUsernameAndVersion(username, version);
        return existingOpt.orElse(null);
    }
}