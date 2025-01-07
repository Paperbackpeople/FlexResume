package com.example.flexresume.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "personal_info") // MongoDB 集合名称
public class PersonalInfo {
    @Id
    private String id; // MongoDB 自动生成的 ID
    private String title; // 对应“个人信息”标题
    private List<Field> fields; // 包含标题和输入值的列表

    @Data
    public static class Field {
        private String label; // 输入框标题
        private String value; // 输入框内容
    }
}