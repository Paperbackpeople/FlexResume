package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "internship_info")
public class InternshipInfo {
    @Id
    private String id;
    private String username;
    private Integer version;
    private Object internshipData;  // 使用 Object 来存储动态的实习数据
} 