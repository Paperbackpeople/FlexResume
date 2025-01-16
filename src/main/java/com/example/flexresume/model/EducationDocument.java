package com.example.flexresume.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

@Data
@Document(collection = "education_info")
public class EducationDocument {

    @Id
    private String id; // MongoDB 自动生成

    private String username; // 用于区分用户
    private int version;     // 用于区分版本

    // education: 形如 { "education1": { school: "...", ... }, "education2": {...} }
    private Map<String, EducationItem> education;

    @Data
    public static class EducationItem {
        private String school;
        private String degree;
        private String location;
        private String fieldOfStudy;
        private String startDate;
        private String graduationYear;
        private String honours;
        private String gpa;
        private String logo;
        private java.util.List<Course> courses;
        private java.util.List<Award> awards;
    }

    @Data
    public static class Course {
        private String name;
    }

    @Data
    public static class Award {
        private String time;
        private String name;
    }
}