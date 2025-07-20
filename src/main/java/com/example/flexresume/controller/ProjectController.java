package com.example.flexresume.controller;

import com.example.flexresume.model.ProjectDocument;
import com.example.flexresume.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project-info")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    // 保存项目信息
    @PostMapping
    public ProjectDocument saveProject(@RequestBody ProjectDocument project) {
        // 根据 username 查询是否已存在
        ProjectDocument existingProject = projectRepository.findByUsername(project.getUsername());

        if (existingProject != null) {
            // 如果用户存在，检查版本是否已存在
            if (existingProject.getVersion() == project.getVersion()) {
                // 更新已存在版本的内容
                existingProject.setProjectData(project.getProjectData());
            } else {
                // 如果是新版本，只需要更新版本号和相关信息
                existingProject.setVersion(project.getVersion());
                existingProject.setProjectData(project.getProjectData());
            }
            return projectRepository.save(existingProject);
        }

        // 如果用户不存在，插入新记录
        return projectRepository.save(project);
    }

    // 根据用户名和版本号获取项目信息
    @GetMapping
    public ResponseEntity<ProjectDocument> getProjectByUsernameAndVersion(
            @RequestParam String username,
            @RequestParam int version) {
        ProjectDocument project = projectRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(project);
    }
}