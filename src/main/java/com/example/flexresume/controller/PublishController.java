package com.example.flexresume.controller;

import com.example.flexresume.model.PublishRecord;
import com.example.flexresume.repository.PublishRecordRepository;
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

    @PostMapping
    public Map<String, Object> publish(@RequestBody PublishRequest req) {
        // 只查 userId
        PublishRecord existing = publishRecordRepository.findByUserId(req.getUserId());
        Date now = new Date();
        PublishRecord record;
        if (existing != null) {
            existing.setVersion(req.getVersion()); // 覆盖为最新 version
            existing.setPublishTime(now);
            existing.setSnapshot(req.getSnapshot());
            record = publishRecordRepository.save(existing);
        } else {
            record = new PublishRecord(req.getUserId(), req.getVersion(), now);
            record.setSnapshot(req.getSnapshot());
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