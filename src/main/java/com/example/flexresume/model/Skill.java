package com.example.flexresume.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "skills")
public class Skill {
    @Id
    private String id;          // 主键
    @Indexed(unique = true)     // 全局唯一索引，确保 username 不重复
    private String username;    // 用户名
    private int version;        // 版本号
    private String content;     // 技能内容，包含 HTML
}