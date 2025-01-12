package com.example.flexresume.controller;


import com.example.flexresume.model.Skill;
import com.example.flexresume.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skill")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    // 保存或更新技能数据
    @PostMapping
    public Skill saveSkill(@RequestBody Skill skill) {
        // 根据 username 和 version 查找是否已存在
        Skill existingSkill = skillRepository.findByUsernameAndVersion(skill.getUsername(), skill.getVersion());
        if (existingSkill != null) {
            existingSkill.setContent(skill.getContent());
            return skillRepository.save(existingSkill); // 更新已有记录
        }
        return skillRepository.save(skill); // 插入新记录
    }

    // 获取技能数据
    @GetMapping("/{username}/{version}")
    public Skill getSkill(@PathVariable String username, @PathVariable int version) {
        return skillRepository.findByUsernameAndVersion(username, version);
    }
}