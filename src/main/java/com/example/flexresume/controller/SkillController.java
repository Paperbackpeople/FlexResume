package com.example.flexresume.controller;

import com.example.flexresume.model.Skill;
import com.example.flexresume.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/skill")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    // 保存技能信息，添加用户身份验证
    @PostMapping
    public ResponseEntity<?> saveSkill(@RequestBody Skill skill, HttpServletRequest request) {
        // 获取JWT验证过的用户ID
        String authenticatedUserId = (String) request.getAttribute("userId");
        if (authenticatedUserId == null) {
            return ResponseEntity.status(401).body("未授权访问");
        }
        
        // 验证请求的用户名是否与当前登录用户一致
        if (!authenticatedUserId.equals(skill.getUsername())) {
            return ResponseEntity.status(403).body("无权限访问其他用户的数据");
        }

        // 根据 username 查询是否已存在
        Skill existingSkill = skillRepository.findByUsername(skill.getUsername());

        if (existingSkill != null) {
            // 如果用户存在，检查版本是否已存在
            if (existingSkill.getVersion() == skill.getVersion()) {
                // 更新已存在版本的内容
                existingSkill.setContent(skill.getContent());
            } else {
                // 如果是新版本，只需要更新版本号和相关信息
                existingSkill.setVersion(skill.getVersion());
                existingSkill.setContent(skill.getContent());
            }
            return ResponseEntity.ok(skillRepository.save(existingSkill));
        }

        // 如果用户不存在，插入新记录
        return ResponseEntity.ok(skillRepository.save(skill));
    }

    // 根据用户名和版本号获取技能信息，添加用户身份验证
    @GetMapping("/{username}/{version}")
    public ResponseEntity<?> getSkillByUsernameAndVersion(
            @PathVariable String username,
            @PathVariable int version,
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
        
        Skill skill = skillRepository.findByUsernameAndVersion(username, version);
        if (skill == null) {
            // 返回空的Skill对象而不是404
            Skill emptySkill = new Skill();
            emptySkill.setUsername(username);
            emptySkill.setVersion(version);
            emptySkill.setContent(""); // 空的技能内容
            return ResponseEntity.ok(emptySkill);
        }
        return ResponseEntity.ok(skill);
    }
}