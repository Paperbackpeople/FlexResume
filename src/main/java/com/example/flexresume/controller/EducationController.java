package com.example.flexresume.controller;

import com.example.flexresume.model.EducationDocument;
import com.example.flexresume.repository.EducationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education-info")
public class EducationController {

    @Autowired
    private EducationRepository educationRepository;

    // 这里我们假设一次POST带上 { education: { education1: {...}, education2: {...} } }
    // 并存成一个新的 EducationDocument
    @PostMapping
    public EducationDocument saveEducation(@RequestBody EducationDocument doc) {
        // 如果不想每次都新建，也可以做更新逻辑
        // 这里直接 save，会插入新的文档
        return educationRepository.save(doc);
    }

    // 获取所有
    @GetMapping
    public List<EducationDocument> getAllEducations() {
        return educationRepository.findAll();
    }

    // 根据ID获取
    @GetMapping("/{id}")
    public EducationDocument getOne(@PathVariable String id) {
        return educationRepository.findById(id).orElse(null);
    }
}