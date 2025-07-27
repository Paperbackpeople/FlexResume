package com.example.flexresume.controller;

import com.example.flexresume.model.*;
import com.example.flexresume.repository.*;
import com.example.flexresume.service.CacheService;
import com.example.flexresume.service.WriteBackScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/publish")
public class PublishController {
    @Autowired private PublishRecordRepository publishRecordRepository;
    @Autowired private WriteBackScheduler writeBackScheduler;
    @Autowired private PersonalInfoRepository personalInfoRepository;
    @Autowired private EducationRepository educationRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private SkillRepository skillRepository;
    @Autowired private WorkInternshipRepository workInternshipRepository;
    @Autowired private CacheService cacheService;


    @PostMapping
    public Map<String, Object> publish(@RequestBody PublishRequest req) {
        String username = req.getUserId();
        int version = req.getVersion();
        
        try {
            writeBackScheduler.forceWriteBackUser(username, version);
            Thread.sleep(500);
        } catch (Exception e) {
            System.err.println("发布前强制写回用户数据失败: " + e.getMessage());
        }
        
        Map<String, Object> latestSnapshot = buildLatestSnapshot(username, version, req.getSnapshot());
        
        // --- FIX: Handle Optional from findByUserId ---
        Optional<PublishRecord> existingOpt = publishRecordRepository.findByUserId(req.getUserId());
        Date now = new Date();
        PublishRecord record;

        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            record.setVersion(req.getVersion());
            record.setPublishTime(now);
            record.setSnapshot(latestSnapshot);
        } else {
            record = new PublishRecord(req.getUserId(), req.getVersion(), now);
            record.setSnapshot(latestSnapshot);
        }
        publishRecordRepository.save(record);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "发布成功");
        result.put("publishId", record.getId());
        result.put("publishTime", record.getPublishTime());
        return result;
    }

    @GetMapping
    public Map<String, Object> getLatestPublish(@RequestParam String userId) {
        // --- FIX: Handle Optional from findByUserId ---
        Optional<PublishRecord> recordOpt = publishRecordRepository.findByUserId(userId);
        Map<String, Object> result = new HashMap<>();
        if (recordOpt.isPresent()) {
            PublishRecord record = recordOpt.get();
            result.put("version", record.getVersion());
            result.put("publishTime", record.getPublishTime());
            result.put("snapshot", record.getSnapshot());
        }
        return result;
    }

    private Map<String, Object> buildLatestSnapshot(String username, int version, Map<String, Object> fallbackSnapshot) {
        Map<String, Object> latestSnapshot = new HashMap<>();
        try {
            getDataFromCacheOrDb("personalInfo", username, version).ifPresent(data -> latestSnapshot.put("personalInfo", data));
            getDataFromCacheOrDb("education", username, version).ifPresent(data -> latestSnapshot.put("education", data));
            getDataFromCacheOrDb("projects", username, version).ifPresent(data -> latestSnapshot.put("projects", ((ProjectDocument)data).getProjectData()));
            getDataFromCacheOrDb("skills", username, version).ifPresent(data -> latestSnapshot.put("skills", data));
            getDataFromCacheOrDb("workinternship", username, version).ifPresent(data -> latestSnapshot.put("workinternship", ((WorkInternshipDocument)data).getWorkInternshipData()));
            System.out.println("获取用户 " + username + " 版本 " + version + " 的最新快照数据完成。");
        } catch (Exception e) {
            System.err.println("获取最新数据失败，使用原始快照: " + e.getMessage());
            return fallbackSnapshot;
        }
        return latestSnapshot;
    }

    private Optional<Object> getDataFromCacheOrDb(String type, String username, int version) {
        String cacheKey = cacheService.buildKey(type, username, version);
        Object cachedData = cacheService.getFromCache(cacheKey);
        if (cachedData != null) {
            return Optional.of(cachedData);
        }
        
        return switch (type) {
            case "personalInfo" -> personalInfoRepository.findByUsernameAndVersion(username, version).map(Object.class::cast);
            case "education" -> educationRepository.findByUsernameAndVersion(username, version).map(Object.class::cast);
            case "projects" -> projectRepository.findByUsernameAndVersion(username, version).map(Object.class::cast);
            case "skills" -> skillRepository.findByUsernameAndVersion(username, version).map(Object.class::cast);
            case "workinternship" -> workInternshipRepository.findByUsernameAndVersion(username, version).map(Object.class::cast);
            default -> Optional.empty();
        };
    }
    
    // PublishRequest inner class remains the same
    public static class PublishRequest {
        private String userId;
        private int version;
        private Map<String, Object> snapshot;
        // getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public int getVersion() { return version; }
        public void setVersion(int version) { this.version = version; }
        public Map<String, Object> getSnapshot() { return snapshot; }
        public void setSnapshot(Map<String, Object> snapshot) { this.snapshot = snapshot; }
    }
}