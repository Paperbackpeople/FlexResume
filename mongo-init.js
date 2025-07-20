// 切换到resume_builder数据库
db = db.getSiblingDB('resume_builder');

// 创建集合（如果不存在）
db.createCollection('personal_info');
db.createCollection('education_info');
db.createCollection('workexperience');
db.createCollection('project');
db.createCollection('internship');
db.createCollection('skills');

// 创建索引
db.personal_info.createIndex({ "username": 1, "version": 1 });
db.education_info.createIndex({ "username": 1, "version": 1 });
db.workexperience.createIndex({ "username": 1, "version": 1 });
db.project.createIndex({ "username": 1, "version": 1 });
db.internship.createIndex({ "username": 1, "version": 1 });
db.skills.createIndex({ "username": 1, "version": 1 });

print('MongoDB initialization completed successfully!'); 