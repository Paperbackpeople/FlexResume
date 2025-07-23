package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

/**
 * 合并后的工作与实习信息存储
 * workInternshipData: 用于存每个 card 的数据
 */
@Document(collection = "workinternship")
public class WorkInternshipDocument {
    @Id
    private String id;

    private String username;
    private int version;
    // 例如：{ "work0": {...}, "work1": {...}, ... }
    private Map<String, Object> workInternshipData;

    public WorkInternshipDocument() {}

    public WorkInternshipDocument(String username, int version, Map<String, Object> workInternshipData) {
        this.username = username;
        this.version = version;
        this.workInternshipData = workInternshipData;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public Map<String, Object> getWorkInternshipData() { return workInternshipData; }
    public void setWorkInternshipData(Map<String, Object> workInternshipData) { this.workInternshipData = workInternshipData; }
}