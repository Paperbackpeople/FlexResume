package com.example.flexresume.controller;

import com.example.flexresume.model.PublishRecord;
import com.example.flexresume.repository.PublishRecordRepository;
import com.example.flexresume.repository.PersonalInfoRepository;
import com.example.flexresume.repository.EducationRepository;
import com.example.flexresume.repository.ProjectRepository;
import com.example.flexresume.repository.SkillRepository;
import com.example.flexresume.repository.WorkExperienceRepository;
import com.example.flexresume.repository.WorkInternshipRepository;
import com.example.flexresume.service.WriteBackScheduler;
import com.example.flexresume.service.CacheService;
import com.example.flexresume.model.ProjectDocument;
import com.example.flexresume.model.WorkInternshipDocument;
import com.example.flexresume.model.EducationDocument;
import com.example.flexresume.model.PersonalInfo;
import com.example.flexresume.model.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/publish")
public class PublishController {
    @Autowired
    private PublishRecordRepository publishRecordRepository;
    
    @Autowired
    private WriteBackScheduler writeBackScheduler;
    
    @Autowired
    private PersonalInfoRepository personalInfoRepository;
    
    @Autowired
    private EducationRepository educationRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private SkillRepository skillRepository;
    
    @Autowired
    private WorkExperienceRepository workExperienceRepository;
    
    @Autowired
    private WorkInternshipRepository workInternshipRepository;
    
    @Autowired
    private CacheService cacheService;

    @PostMapping
    public Map<String, Object> publish(@RequestBody PublishRequest req) {
        // 发布前立即刷新当前用户的缓存数据到数据库，确保数据是最新的
        String username = req.getUserId(); // 如果userId就是username
        int version = req.getVersion();
        
        try {
            writeBackScheduler.forceWriteBackUser(username, version);
            // 等待一小段时间确保写回完成
            Thread.sleep(500);
        } catch (Exception e) {
            System.err.println("发布前强制写回用户数据失败: " + e.getMessage());
            // 继续执行，不影响发布流程
        }
        
        // 优先从缓存获取最新数据，缓存没有则从数据库获取
        Map<String, Object> latestSnapshot = new HashMap<>();
        try {
            // 1. 先尝试从缓存获取各模块数据
            Object personalInfo = getDataFromCacheOrDb("personalInfo", username, version);
            if (personalInfo != null) {
                // 前端期望个人信息数据，不是包装的Document
                if (personalInfo instanceof PersonalInfo) {
                    PersonalInfo personalInfoObj = (PersonalInfo) personalInfo;
                    latestSnapshot.put("personalInfo", personalInfoObj);
                } else {
                    latestSnapshot.put("personalInfo", personalInfo);
                }
            }
            
            Object education = getDataFromCacheOrDb("education", username, version);
            if (education != null) {
                // 前端期望的是包装的EducationDocument结构（包含education字段）
                if (education instanceof EducationDocument) {
                    EducationDocument eduDoc = (EducationDocument) education;
                    latestSnapshot.put("education", eduDoc); // 保持完整的Document结构
                } else {
                    latestSnapshot.put("education", education);
                }
            }
            
            Object projects = getDataFromCacheOrDb("projects", username, version);
            if (projects != null) {
                // 前端期望直接的项目数据对象，不是包装的Document
                if (projects instanceof ProjectDocument) {
                    ProjectDocument projectDoc = (ProjectDocument) projects;
                    latestSnapshot.put("projects", projectDoc.getProjectData());
                } else {
                    latestSnapshot.put("projects", projects);
                }
            }
            
            Object skills = getDataFromCacheOrDb("skills", username, version);
            if (skills != null) {
                // 前端期望技能数据的内容，不是包装的Document
                if (skills instanceof Skill) {
                    Skill skillObj = (Skill) skills;
                    latestSnapshot.put("skills", skillObj);
                } else {
                    latestSnapshot.put("skills", skills);
                }
            }
            
            Object workInternship = getDataFromCacheOrDb("workinternship", username, version);
            if (workInternship != null) {
                // 前端期望的是 workinternship，而且需要提取内层数据
                if (workInternship instanceof WorkInternshipDocument) {
                    WorkInternshipDocument workDoc = (WorkInternshipDocument) workInternship;
                    latestSnapshot.put("workinternship", workDoc.getWorkInternshipData());
                } else {
                    latestSnapshot.put("workinternship", workInternship);
                }
            }
            
            System.out.println("获取用户 " + username + " 版本 " + version + 
                             " 的最新快照数据完成，包含 " + latestSnapshot.size() + " 个模块");
            
        } catch (Exception e) {
            System.err.println("获取最新数据失败，使用原始快照: " + e.getMessage());
            latestSnapshot = req.getSnapshot(); // 回退到原始数据
        }
        
        // 只查 userId
        PublishRecord existing = publishRecordRepository.findByUserId(req.getUserId());
        Date now = new Date();
        PublishRecord record;
        if (existing != null) {
            existing.setVersion(req.getVersion()); // 覆盖为最新 version
            existing.setPublishTime(now);
            existing.setSnapshot(latestSnapshot); // 使用最新数据库数据
            record = publishRecordRepository.save(existing);
        } else {
            record = new PublishRecord(req.getUserId(), req.getVersion(), now);
            record.setSnapshot(latestSnapshot); // 使用最新数据库数据
            publishRecordRepository.save(record);
        }
        Map<String, Object> result = new HashMap<>();
        result.put("message", "发布成功");
        result.put("publishId", record.getId());
        result.put("publishTime", record.getPublishTime());
        return result;
    }

    // 新增：获取快照内容
    @GetMapping
    public Map<String, Object> getLatestPublish(@RequestParam String userId) {
        PublishRecord record = publishRecordRepository.findByUserId(userId);
        Map<String, Object> result = new HashMap<>();
        if (record != null) {
            result.put("version", record.getVersion());
            result.put("publishTime", record.getPublishTime());
            result.put("snapshot", record.getSnapshot());
        }
        return result;
    }

    /**
     * 优先从缓存获取数据，缓存没有则从数据库获取
     */
    private Object getDataFromCacheOrDb(String type, String username, int version) {
        // 先尝试从缓存获取
        String cacheKey = cacheService.buildKey(type, username, version);
        Object cachedData = cacheService.getFromCache(cacheKey);
        
        if (cachedData != null) {
            System.out.println("从缓存获取 " + type + " 数据: " + cacheKey);
            return cachedData;
        }
        
        // 缓存没有，从数据库获取
        try {
            switch (type) {
                case "personalInfo":
                    var personalInfo = personalInfoRepository.findByUsernameAndVersion(username, version);
                    if (personalInfo != null) {
                        System.out.println("从数据库获取 " + type + " 数据: " + cacheKey);
                        return personalInfo;
                    }
                    break;
                case "education":
                    var education = educationRepository.findByUsernameAndVersion(username, version);
                    if (education.isPresent()) {
                        System.out.println("从数据库获取 " + type + " 数据: " + cacheKey);
                        return education.get();
                    }
                    break;
                case "projects":
                    var projects = projectRepository.findByUsernameAndVersion(username, version);
                    if (projects.isPresent()) {
                        System.out.println("从数据库获取 " + type + " 数据: " + cacheKey);
                        return projects.get();
                    }
                    break;
                case "skills":
                    var skills = skillRepository.findByUsernameAndVersion(username, version);
                    if (skills != null) {
                        System.out.println("从数据库获取 " + type + " 数据: " + cacheKey);
                        return skills;
                    }
                    break;
                case "workinternship":
                    var workInternship = workInternshipRepository.findByUsernameAndVersion(username, version);
                    if (workInternship.isPresent()) {
                        System.out.println("从数据库获取 " + type + " 数据: " + cacheKey);
                        return workInternship.get();
                    }
                    break;
            }
        } catch (Exception e) {
            System.err.println("从数据库获取 " + type + " 数据失败: " + e.getMessage());
        }
        
        return null;
    }

    public static class PublishRequest {
        private String userId;
        private int version;
        private Map<String, Object> snapshot;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public int getVersion() { return version; }
        public void setVersion(int version) { this.version = version; }
        public Map<String, Object> getSnapshot() { return snapshot; }
        public void setSnapshot(Map<String, Object> snapshot) { this.snapshot = snapshot; }
    }
} 