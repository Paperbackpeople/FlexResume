package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

/**
 * 这里把所有 internship 信息存到一条记录里
 * internshipData: 用于存每个 card 的数据
 */
@Document(collection = "internship")
public class InternshipDocument {
    @Id
    private String id;

    private String username;
    private int version;
    // 例如：{ "internship0": {...}, "internship1": {...}, ... }
    private Map<String, Object> internshipData;

    public InternshipDocument() {}

    public InternshipDocument(String username, int version, Map<String, Object> internshipData) {
        this.username = username;
        this.version = version;
        this.internshipData = internshipData;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) { this.id = id; }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) { this.username = username; }

    public int getVersion() {
        return version;
    }
    public void setVersion(int version) { this.version = version; }

    public Map<String, Object> getInternshipData() {
        return internshipData;
    }
    public void setInternshipData(Map<String, Object> internshipData) {
        this.internshipData = internshipData;
    }
} 