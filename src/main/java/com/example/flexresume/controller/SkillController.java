package com.example.flexresume.controller;

import com.example.flexresume.model.Skill;
import com.example.flexresume.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skill")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    // 保存技能信息
    @PostMapping
    public Skill saveSkill(@RequestBody Skill skill) {
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
            return skillRepository.save(existingSkill);
        }

        // 如果用户不存在，插入新记录
        return skillRepository.save(skill);
    }

    // 根据用户名和版本号获取技能信息
    @GetMapping("/{username}/{version}")
    public ResponseEntity<Skill> getSkillByUsernameAndVersion(
            @PathVariable String username,
            @PathVariable int version) {
        Skill skill = skillRepository.findByUsernameAndVersion(username, version);
        if (skill == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(skill);
    }
}