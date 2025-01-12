package com.example.flexresume.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Map;

// 存放在 "education_info" 集合
@Data
@Document(collection = "education_info")
public class EducationDocument {
    @Id
    private String id; // MongoDB自动生成
    // "education" 字段是一个 Map，key=education1/2... value=真正的数据
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
        private String logo; // base64
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