package com.example.flexresume.service;

import com.example.flexresume.model.*;
import com.example.flexresume.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
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
    @Scheduled(fixedRate = 300000) // 5分钟
    @Async
    public void writeBackDirtyData() {
        try {
            if (isSystemBusy()) {
                System.out.println("系统繁忙，跳过本次写回操作");
                return;
            }
            Set<String> dirtyKeys = cacheService.getDirtyKeys();
            for (String dirtyKey : dirtyKeys) {
                try {
                    String key = dirtyKey.replace("dirty:", "");
                    writeBackSingleData(key);
                } catch (Exception e) {
                    System.err.println("写回数据失败: " + dirtyKey + ", 错误: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("写回调度器发生错误: " + e.getMessage());
        }
    }

    @Async
    public void immediateWriteBack(String key) {
        try {
            writeBackSingleData(key);
        } catch (Exception e) {
            System.err.println("立即写回失败: " + key + ", 错误: " + e.getMessage());
        }
    }

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
        cacheService.removeDirtyFlag(key);
    }

    // --- FIX: 以下是最终的、健壮的写回方法 ---

    private void writeBackPersonalInfo(String username, int version, Object data) throws Exception {
        PersonalInfo docToSave = objectMapper.convertValue(data, PersonalInfo.class);
        
        // 查找现有文档，如果存在，则将其 ID 赋给新文档以触发更新
        Optional<PersonalInfo> existingDoc = personalInfoRepository.findByUsernameAndVersion(username, version);
        existingDoc.ifPresent(personalInfo -> docToSave.setId(personalInfo.getId()));

        docToSave.setUsername(username);
        docToSave.setVersion(version);
        personalInfoRepository.save(docToSave);
    }

    private void writeBackEducation(String username, int version, Object data) throws Exception {
        EducationDocument docToSave = objectMapper.convertValue(data, EducationDocument.class);

        Optional<EducationDocument> existingDoc = educationRepository.findByUsernameAndVersion(username, version);
        existingDoc.ifPresent(educationDocument -> docToSave.setId(educationDocument.getId()));

        docToSave.setUsername(username);
        docToSave.setVersion(version);
        educationRepository.save(docToSave);
    }

    private void writeBackProjects(String username, int version, Object data) throws Exception {
        @SuppressWarnings("unchecked")
        Map<String, Object> projectData = (Map<String, Object>) data;
        ProjectDocument docToSave = new ProjectDocument(username, version, projectData);

        Optional<ProjectDocument> existingDoc = projectRepository.findByUsernameAndVersion(username, version);
        existingDoc.ifPresent(projectDocument -> docToSave.setId(projectDocument.getId()));
        
        projectRepository.save(docToSave);
    }

    private void writeBackWorkInternship(String username, int version, Object data) throws Exception {
        @SuppressWarnings("unchecked")
        Map<String, Object> workData = (Map<String, Object>) data;
        WorkInternshipDocument docToSave = new WorkInternshipDocument(username, version, workData);

        Optional<WorkInternshipDocument> existingDoc = workInternshipRepository.findByUsernameAndVersion(username, version);
        existingDoc.ifPresent(workInternshipDocument -> docToSave.setId(workInternshipDocument.getId()));

        workInternshipRepository.save(docToSave);
    }

    private void writeBackSkills(String username, int version, Object data) throws Exception {
        Skill docToSave = objectMapper.convertValue(data, Skill.class);

        Optional<Skill> existingDoc = skillRepository.findByUsernameAndVersion(username, version);
        existingDoc.ifPresent(skill -> docToSave.setId(skill.getId()));

        docToSave.setUsername(username);
        docToSave.setVersion(version);
        skillRepository.save(docToSave);
    }

    private void writeBackPublish(String username, int version, Object data) throws Exception {
        PublishRecord docToSave = objectMapper.convertValue(data, PublishRecord.class);

        // 注意：根据你的Repository，这里使用 findByUserIdAndVersion
        Optional<PublishRecord> existingDoc = publishRecordRepository.findByUserIdAndVersion(username, version);
        existingDoc.ifPresent(publishRecord -> docToSave.setId(publishRecord.getId()));

        docToSave.setUserId(username);
        docToSave.setVersion(version);
        publishRecordRepository.save(docToSave);
    }

    // --- 你原来的其他方法保持不变 ---
    private boolean isSystemBusy() {
        Runtime runtime = Runtime.getRuntime();
        long totalMemory = runtime.totalMemory();
        long freeMemory = runtime.freeMemory();
        double memoryUsage = (double) (totalMemory - freeMemory) / totalMemory;
        return memoryUsage > 0.85;
    }

    public void forceWriteBackAll() {
        try {
            Set<String> dirtyKeys = cacheService.getDirtyKeys();
            for (String dirtyKey : dirtyKeys) {
                try {
                    String key = dirtyKey.replace("dirty:", "");
                    writeBackSingleData(key);
                } catch (Exception e) {
                    System.err.println("强制写回失败: " + dirtyKey + ", 错误: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("强制写回过程发生错误: " + e.getMessage());
        }
    }

    public void forceWriteBackUser(String username, int version) {
        try {
            System.out.println("发布触发：开始强制写回用户 " + username + " 版本 " + version + " 的数据...");
            Set<String> dirtyKeys = cacheService.getDirtyKeys();
            int userDataCount = 0;
            int writtenCount = 0;
            for (String dirtyKey : dirtyKeys) {
                try {
                    String key = dirtyKey.replace("dirty:", "");
                    if (isUserData(key, username, version)) {
                        userDataCount++;
                        writeBackSingleData(key);
                        writtenCount++;
                    }
                } catch (Exception e) {
                    System.err.println("强制写回用户数据失败: " + dirtyKey + ", 错误: " + e.getMessage());
                }
            }
            System.out.println("发布触发：用户 " + username + " 版本 " + version + 
                             " 发现 " + userDataCount + " 个脏数据，成功写回 " + writtenCount + " 个");
        } catch (Exception e) {
            System.err.println("强制写回用户数据过程发生错误: " + e.getMessage());
        }
    }

    private boolean isUserData(String key, String username, int version) {
        String[] keyParts = key.split(":");
        if (keyParts.length < 3) return false;
        String keyUsername = keyParts[1];
        String keyVersionStr = keyParts[2];
        try {
            int keyVersion = Integer.parseInt(keyVersionStr);
            return username.equals(keyUsername) && version == keyVersion;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}