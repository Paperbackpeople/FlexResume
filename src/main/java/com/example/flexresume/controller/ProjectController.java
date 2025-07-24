package com.example.flexresume.controller;

import com.example.flexresume.model.ProjectDocument;
import com.example.flexresume.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/project-info")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    // 保存项目信息，添加用户身份验证
    @PostMapping
    public ResponseEntity<?> saveProject(@RequestBody ProjectDocument project, HttpServletRequest request) {
        // 获取JWT验证过的用户ID
        String authenticatedUserId = (String) request.getAttribute("userId");
        if (authenticatedUserId == null) {
            return ResponseEntity.status(401).body("未授权访问");
        }
        
        // 验证请求的用户名是否与当前登录用户一致
        if (!authenticatedUserId.equals(project.getUsername())) {
            return ResponseEntity.status(403).body("无权限访问其他用户的数据");
        }

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
            return ResponseEntity.ok(projectRepository.save(existingProject));
        }

        // 如果用户不存在，插入新记录
        return ResponseEntity.ok(projectRepository.save(project));
    }

    // 根据用户名和版本号获取项目信息，添加用户身份验证
    @GetMapping
    public ResponseEntity<?> getProjectByUsernameAndVersion(
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
        
        ProjectDocument project = projectRepository.findByUsernameAndVersion(username, version).orElse(null);
        if (project == null) {
            // 返回空的ProjectDocument对象而不是404
            ProjectDocument emptyProject = new ProjectDocument();
            emptyProject.setUsername(username);
            emptyProject.setVersion(version);
            emptyProject.setProjectData(new java.util.HashMap<>()); // 空的项目数据Map
            return ResponseEntity.ok(emptyProject);
        }
        return ResponseEntity.ok(project);
    }
}