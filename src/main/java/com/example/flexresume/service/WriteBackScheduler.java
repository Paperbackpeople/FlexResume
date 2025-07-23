package com.example.flexresume.service;

import com.example.flexresume.model.*;
import com.example.flexresume.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class WriteBackScheduler {

    @Autowired
    private CacheService cacheService;

    @Autowired
    private PersonalInfoRepository personalInfoRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private WorkInternshipRepository workInternshipRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private PublishRecordRepository publishRecordRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 定期写回脏数据到数据库
     * 每5分钟执行一次，在资源充足时写回
     */
    @Scheduled(fixedRate = 300000) // 5分钟
    @Async
    public void writeBackDirtyData() {
        try {
            // 获取系统负载信息（简单实现）
            if (isSystemBusy()) {
                System.out.println("系统繁忙，跳过本次写回操作");
                return;
            }

            Set<String> dirtyKeys = cacheService.getDirtyKeys();
            System.out.println("开始写回脏数据，共 " + dirtyKeys.size() + " 个");

            for (String dirtyKey : dirtyKeys) {
                try {
                    String key = dirtyKey.replace("dirty:", "");
                    writeBackSingleData(key);
                } catch (Exception e) {
                    System.err.println("写回数据失败: " + dirtyKey + ", 错误: " + e.getMessage());
                }
            }

            System.out.println("写回任务完成");
        } catch (Exception e) {
            System.err.println("写回调度器发生错误: " + e.getMessage());
        }
    }

    /**
     * 立即写回指定key的数据（用于重要数据）
     */
    @Async
    public void immediateWriteBack(String key) {
        try {
            writeBackSingleData(key);
        } catch (Exception e) {
            System.err.println("立即写回失败: " + key + ", 错误: " + e.getMessage());
        }
    }

    /**
     * 写回单个数据项
     */
    private void writeBackSingleData(String key) throws Exception {
        Object cachedData = cacheService.getFromCache(key);
        if (cachedData == null) {
            cacheService.removeDirtyFlag(key);
            return;
        }

        String[] keyParts = key.split(":");
        if (keyParts.length < 3) {
            return;
        }

        String type = keyParts[0];
        String username = keyParts[1];
        int version = Integer.parseInt(keyParts[2]);

        switch (type) {
            case "personalInfo":
                writeBackPersonalInfo(username, version, cachedData);
                break;
            case "education":
                writeBackEducation(username, version, cachedData);
                break;
            case "projects":
                writeBackProjects(username, version, cachedData);
                break;
            case "workinternship":
                writeBackWorkInternship(username, version, cachedData);
                break;
            case "skills":
                writeBackSkills(username, version, cachedData);
                break;
            case "publish":
                writeBackPublish(username, version, cachedData);
                break;
        }

        // 写回成功后移除脏标记
        cacheService.removeDirtyFlag(key);
        System.out.println("成功写回数据: " + key);
    }

    private void writeBackPersonalInfo(String username, int version, Object data) throws Exception {
        PersonalInfo personalInfo = objectMapper.convertValue(data, PersonalInfo.class);
        personalInfo.setUsername(username);
        personalInfo.setVersion(version);
        personalInfoRepository.save(personalInfo);
    }

    private void writeBackEducation(String username, int version, Object data) throws Exception {
        EducationDocument educationDoc = objectMapper.convertValue(data, EducationDocument.class);
        educationDoc.setUsername(username);
        educationDoc.setVersion(version);
        educationRepository.save(educationDoc);
    }

    private void writeBackProjects(String username, int version, Object data) throws Exception {
        @SuppressWarnings("unchecked")
        Map<String, Object> projectData = (Map<String, Object>) data;
        ProjectDocument projectDoc = new ProjectDocument(username, version, projectData);
        projectRepository.save(projectDoc);
    }

    private void writeBackWorkInternship(String username, int version, Object data) throws Exception {
        @SuppressWarnings("unchecked")
        Map<String, Object> workData = (Map<String, Object>) data;
        WorkInternshipDocument workDoc = new WorkInternshipDocument(username, version, workData);
        workInternshipRepository.save(workDoc);
    }

    private void writeBackSkills(String username, int version, Object data) throws Exception {
        Skill skill = objectMapper.convertValue(data, Skill.class);
        skill.setUsername(username);
        skill.setVersion(version);
        skillRepository.save(skill);
    }

    private void writeBackPublish(String username, int version, Object data) throws Exception {
        PublishRecord publishRecord = objectMapper.convertValue(data, PublishRecord.class);
        publishRecord.setUserId(username);
        publishRecord.setVersion(version);
        publishRecordRepository.save(publishRecord);
    }

    /**
     * 简单的系统负载检测
     * 可以根据需要扩展更复杂的负载检测逻辑
     */
    private boolean isSystemBusy() {
        // 检查内存使用率
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        double memoryUsage = (double) (totalMemory - freeMemory) / totalMemory;
        
        // 如果内存使用率超过85%，认为系统繁忙
        return memoryUsage > 0.85;
    }

    /**
     * 手动触发写回所有脏数据（管理接口可用）
     */
    public void forceWriteBackAll() {
        writeBackDirtyData();
    }
} 