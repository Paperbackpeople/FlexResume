# FlexResume 部署指南

## 🚀 快速部署

### 新服务器部署步骤

1. **克隆项目**
   ```bash
   git clone <项目地址>
   cd FlexResume
   ```

2. **配置服务器信息**
   ```bash
   # 复制配置模板
   cp config.env.example config.env
   
   # 编辑配置文件
   vim config.env
   ```

3. **修改必要配置**
   在 `config.env` 中修改：
   ```bash
   # 新服务器信息
   SERVER_IP=你的新服务器IP
   DOMAIN_NAME=你的域名（可选）
   
   # 数据库信息
   MONGODB_HOST=MongoDB服务器地址
   MONGODB_USERNAME=数据库用户名
   MONGODB_PASSWORD=数据库密码
   ```

4. **生成配置文件**
   ```bash
   chmod +x generate-configs.sh
   ./generate-configs.sh
   ```

5. **启动服务**
   ```bash
   docker-compose up -d
   ```

6. **验证部署**
   ```bash
   # 检查服务状态
   docker-compose ps
   
   # 查看日志
   docker-compose logs -f
   ```

## 📋 配置文件详解

### 主配置文件：config.env

```bash
# ===========================================
# FlexResume 项目统一配置文件
# ===========================================

# 必须配置项
SERVER_IP=101.34.235.142           # 服务器公网IP
MONGODB_HOST=45.76.179.179         # MongoDB服务器地址
MONGODB_USERNAME=resumedb          # 数据库用户名
MONGODB_PASSWORD=Wangzhaoyu011207  # 数据库密码

# 可选配置项
DOMAIN_NAME=www.flexresume.me      # 域名（如果有）
BACKEND_PORT=8081                  # 后端服务端口
FRONTEND_PORT=8080                 # 前端服务端口
NGINX_PORT=80                      # Nginx端口
```

### 自动生成的配置文件

运行 `./generate-configs.sh` 后会生成：

1. **nginx.conf** - Nginx反向代理配置
2. **frontend/.env** - 前端环境变量
3. **frontend/src/setupProxy.js** - 前端开发代理
4. **.env.backend** - 后端环境变量
5. **frontend/package.json** - 更新代理配置

## 🔧 高级配置

### 开发环境

如需本地开发：

```bash
# 临时修改config.env
SERVER_IP=localhost
DEV_BACKEND_HOST=localhost
DEV_FRONTEND_HOST=localhost

# 重新生成配置
./generate-configs.sh

# 启动开发服务
cd frontend && npm start  # 前端
./mvnw spring-boot:run    # 后端
```

### 生产环境

#### SSL/HTTPS 配置

1. **获取SSL证书**
   ```bash
   # 使用Let's Encrypt
   sudo certbot --nginx -d yourdomain.com
   ```

2. **更新nginx配置**
   ```nginx
   server {
       listen 443 ssl;
       server_name yourdomain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/private.key;
       
       # 其他配置...
   }
   ```

#### 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8081/tcp
sudo ufw enable
```

## 🗄️ 数据库配置

### MongoDB 设置

1. **创建数据库用户**
   ```javascript
   use admin
   db.createUser({
     user: "resumedb",
     pwd: "your-password",
     roles: [ { role: "readWrite", db: "resume_builder" } ]
   })
   ```

2. **初始化数据库**
   ```bash
   # 运行初始化脚本
   mongo resume_builder mongo-init.js
   ```

## 🔐 安全配置

### 发布页面安全

当前发布页面使用userId，存在安全风险。建议实施：

1. **实现Token分享机制**（详见 SECURITY_UPDATE.md）
2. **设置访问控制**
3. **添加访问日志**

### 数据库安全

1. **修改默认密码**
2. **启用认证**
3. **配置防火墙规则**
4. **定期备份数据**

## 🐳 Docker 部署

### 容器配置

项目包含3个主要容器：

1. **resume-backend**: Spring Boot应用
2. **resume-frontend**: React应用（Nginx服务）
3. **resume-nginx**: 反向代理

### 常用Docker命令

```bash
# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f [service-name]

# 重启特定服务
docker-compose restart backend

# 重新构建并启动
docker-compose up -d --build

# 停止所有服务
docker-compose down

# 清理容器和镜像
docker system prune -a
```

## 🔍 故障排除

### 常见问题

1. **容器启动失败**
   ```bash
   # 查看详细错误信息
   docker-compose logs [service-name]
   
   # 检查端口占用
   netstat -tulpn | grep :8081
   ```

2. **数据库连接失败**
   ```bash
   # 测试数据库连接
   mongo "mongodb://user:pass@host:port/database"
   
   # 检查网络连通性
   ping mongodb-server-ip
   ```

3. **前端无法访问后端**
   ```bash
   # 检查代理配置
   cat frontend/src/setupProxy.js
   
   # 验证后端API
   curl http://localhost:8081/api/health
   ```

4. **Nginx配置错误**
   ```bash
   # 验证配置语法
   nginx -t
   
   # 重新加载配置
   nginx -s reload
   ```

### 日志分析

```bash
# 后端日志
docker-compose logs backend | grep ERROR

# 前端构建日志
docker-compose logs frontend

# Nginx访问日志
docker-compose exec nginx tail -f /var/log/nginx/access.log
```

## 📈 性能优化

### 前端优化

1. **启用Gzip压缩**
2. **设置缓存策略**
3. **优化图片资源**
4. **代码分割**

### 后端优化

1. **数据库索引优化**
2. **连接池配置**
3. **缓存策略**
4. **JVM调优**

### 数据库优化

```javascript
// 创建索引
db.personal_info.createIndex({ "username": 1, "version": 1 });
db.project.createIndex({ "username": 1, "version": 1 });
db.education_info.createIndex({ "username": 1, "version": 1 });
```

## 🔄 更新部署

### 应用更新流程

1. **备份数据**
   ```bash
   mongodump --out backup-$(date +%Y%m%d)
   ```

2. **拉取最新代码**
   ```bash
   git pull origin main
   ```

3. **更新配置**（如有必要）
   ```bash
   ./generate-configs.sh
   ```

4. **重新部署**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### 零停机更新

```bash
# 使用滚动更新
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

## 📞 技术支持

### 监控和告警

1. **设置监控仪表板**
2. **配置错误告警**
3. **性能监控**
4. **日志聚合**

### 备份策略

1. **数据库定期备份**
2. **配置文件版本控制**
3. **容器镜像备份**
4. **恢复测试**

---

如有问题，请参考：
- [配置管理说明](CONFIG_README.md)
- [安全更新方案](SECURITY_UPDATE.md)
- 项目问题跟踪 