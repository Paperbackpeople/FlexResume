package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

/**
 * 这里假设你想把所有 project 信息存到一条记录里
 * projectData: 用于存每个 card 的数据
 */
@Document(collection = "project")
public class ProjectDocument {
    @Id
    private String id;

    private String username;
    private int version;
    // 例如：{ "project0": {...}, "project1": {...}, ... }
    private Map<String, Object> projectData;

    // Getter 和 Setter 略

    public ProjectDocument() {}

    public ProjectDocument(String username, int version, Map<String, Object> projectData) {
        this.username = username;
        this.version = version;
        this.projectData = projectData;
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

    public Map<String, Object> getProjectData() {
        return projectData;
    }
    public void setProjectData(Map<String, Object> projectData) {
        this.projectData = projectData;
    }
}