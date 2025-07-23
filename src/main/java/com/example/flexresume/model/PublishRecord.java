package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.Map;

@Document(collection = "publish_record")
public class PublishRecord {
    @Id
    private String id;
    private String userId;
    private int version;
    private Date publishTime;
    private Map<String, Object> snapshot;

    public PublishRecord() {}

    public PublishRecord(String userId, int version, Date publishTime) {
        this.userId = userId;
        this.version = version;
        this.publishTime = publishTime;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }
    public Date getPublishTime() { return publishTime; }
    public void setPublishTime(Date publishTime) { this.publishTime = publishTime; }
    public Map<String, Object> getSnapshot() { return snapshot; }
    public void setSnapshot(Map<String, Object> snapshot) { this.snapshot = snapshot; }
} 