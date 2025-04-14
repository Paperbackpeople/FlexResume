package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "workexperience")
public class WorkExperienceDocument {
    @Id
    private String id;

    private String username;
    private int version;
    private Map<String, Object> workExperienceData;

    public WorkExperienceDocument() {}

    public WorkExperienceDocument(String username, int version, Map<String, Object> workExperienceData) {
        this.username = username;
        this.version = version;
        this.workExperienceData = workExperienceData;
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

    public Map<String, Object> getWorkExperienceData() {
        return workExperienceData;
    }
    public void setWorkExperienceData(Map<String, Object> workExperienceData) {
        this.workExperienceData = workExperienceData;
    }
} 