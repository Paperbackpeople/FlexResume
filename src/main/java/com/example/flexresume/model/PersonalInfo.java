package com.example.flexresume.model;

import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;
import java.util.List;

@Data
@Document(collection = "personal_info")
public class PersonalInfo {
    @Id
    private String id;

    @Indexed(unique = true) // 全局唯一索引，确保 username 不重复
    private String username; // 用户名

    private int version; // 版本号，每个用户可以有多个版本

    private List<Field> fields; // 包含字段列表
    private String profilePhoto; // 个人照片

    @Data
    public static class Field {
        private String label; // 输入框标题
        private String value; // 输入框内容
    }
}