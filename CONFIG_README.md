# FlexResume 配置管理说明

## 概述

本项目已将所有服务器地址、数据库地址等配置集中管理，换服务器时只需要修改一个配置文件即可。

## 核心文件

### 1. `config.env` - 主配置文件
包含所有的服务器、数据库配置信息：
- 服务器IP地址
- 域名配置
- 数据库连接信息
- 端口配置

### 2. `generate-configs.sh` - 配置生成脚本
根据 `config.env` 自动生成各个组件的配置文件。

## 使用方法

### 换服务器时的步骤

1. **修改主配置文件**
   ```bash
   vim config.env
   ```
   只需要修改以下几个关键配置：
   ```bash
   # 新服务器IP
   SERVER_IP=你的新服务器IP
   
   # 域名（如果有变化）
   DOMAIN_NAME=你的域名
   
   # 数据库地址（如果有变化）
   MONGODB_HOST=你的MongoDB服务器IP
   MONGODB_USERNAME=数据库用户名
   MONGODB_PASSWORD=数据库密码
   ```

2. **生成配置文件**
   ```bash
   ./generate-configs.sh
   ```

3. **部署应用**
   ```bash
   docker-compose up -d
   ```

### 开发环境配置

开发时如果需要本地运行：

1. 使用本地配置：
   ```bash
   # 临时修改config.env中的配置
   SERVER_IP=localhost
   DEV_BACKEND_HOST=localhost
   DEV_FRONTEND_HOST=localhost
   ```

2. 重新生成配置：
   ```bash
   ./generate-configs.sh
   ```

## 配置文件说明

### 自动生成的文件

运行 `generate-configs.sh` 后会自动生成/更新以下文件：

1. **`nginx.conf`** - Nginx反向代理配置
2. **`frontend/.env`** - 前端环境变量
3. **`frontend/src/setupProxy.js`** - 前端开发代理配置
4. **`.env.backend`** - 后端环境变量
5. **`frontend/package.json`** - 更新代理配置

### 涉及的配置位置

项目中以下文件已配置为使用环境变量：

#### 后端 Java 配置
- `src/main/resources/application.properties` - 数据库连接、端口配置
- `src/main/java/com/example/flexresume/config/WebConfig.java` - CORS配置

#### 前端配置
- `frontend/package.json` - 开发代理配置
- `frontend/src/setupProxy.js` - 代理中间件配置

#### Docker 配置
- `docker-compose.yml` - 容器环境变量配置
- `nginx.conf` - Nginx代理配置

#### 数据库配置
- MongoDB连接URI完全通过环境变量配置

## 注意事项

1. **安全性**：`config.env` 包含敏感信息（数据库密码等），请不要提交到Git仓库
2. **备份**：换服务器前请备份当前的 `config.env` 文件
3. **权限**：确保 `generate-configs.sh` 有执行权限
4. **测试**：配置修改后建议先在测试环境验证

## 快速部署新服务器

```bash
# 1. 克隆项目
git clone <项目地址>
cd FlexResume

# 2. 配置服务器信息
cp config.env.example config.env  # 如果有示例文件
vim config.env  # 修改为新服务器的配置

# 3. 生成配置文件
chmod +x generate-configs.sh
./generate-configs.sh

# 4. 启动服务
docker-compose up -d
```

## 配置项详解

### 必须配置项
- `SERVER_IP` - 服务器IP地址
- `MONGODB_HOST` - MongoDB服务器地址
- `MONGODB_USERNAME` - 数据库用户名
- `MONGODB_PASSWORD` - 数据库密码

### 可选配置项
- `DOMAIN_NAME` - 域名（如果有）
- `BACKEND_PORT` - 后端服务端口（默认8081）
- `FRONTEND_PORT` - 前端服务端口（默认8080）
- `NGINX_PORT` - Nginx端口（默认80）

## 故障排除

1. **配置生成失败**
   - 检查 `config.env` 文件格式
   - 确保脚本有执行权限

2. **服务无法访问**
   - 检查防火墙设置
   - 验证端口配置
   - 查看Docker容器日志

3. **数据库连接失败**
   - 验证MongoDB连接信息
   - 检查网络连通性 