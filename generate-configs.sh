#!/bin/bash

# ===========================================
# FlexResume 配置生成脚本（更新版）
# - 从 config.env 读取变量
# - 生成 nginx.conf / 前端配置
# - 不再生成 .env.backend
# - 改为写入 application.properties
# ===========================================

echo "开始生成配置文件..."

# 优雅加载环境变量（支持 KEY=VALUE，忽略注释/空行）
if [ -f "config.env" ]; then
    set -a
    # shellcheck disable=SC1091
    . ./config.env
    set +a
    echo "✓ 已加载 config.env"
else
    echo "❌ 未找到 config.env 文件"
    exit 1
fi

# 默认值
SERVER_IP=${SERVER_IP:-101.34.235.142}
DOMAIN_NAME=${DOMAIN_NAME:-www.flexresume.me}
BACKEND_PORT=${BACKEND_PORT:-8081}
FRONTEND_PORT=${FRONTEND_PORT:-8080}
NGINX_PORT=${NGINX_PORT:-80}
MONGODB_HOST=${MONGODB_HOST:-45.76.179.179}
REDIS_HOST=${REDIS_HOST:-localhost}

echo "使用配置:"
echo "  服务器IP: $SERVER_IP"
echo "  域名: $DOMAIN_NAME"
echo "  后端端口: $BACKEND_PORT"
echo "  前端端口: $FRONTEND_PORT"
echo "  MongoDB地址: $MONGODB_HOST"
echo "  Redis地址: $REDIS_HOST"

# 1) 生成 nginx.conf
echo "生成 nginx.conf..."
cat > nginx.conf << EOF

server {
    listen 443 ssl http2;
    server_name ${DOMAIN_NAME} ${SERVER_IP} www.${DOMAIN_NAME};

    client_max_body_size 20M;

    ssl_certificate     /etc/nginx/ssl/flexresume.me.pem;
    ssl_certificate_key /etc/nginx/ssl/flexresume.me.key;

    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location /api/ {
        proxy_pass http://backend:${BACKEND_PORT}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;  
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://frontend;                 
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

server {
    listen ${NGINX_PORT};
    server_name ${DOMAIN_NAME} ${SERVER_IP} www.${DOMAIN_NAME};
    return 301 https://$host$request_uri;
}



EOF

# 2) 更新前端 package.json 的 proxy（注意：如未使用 CRA 开发代理可忽略）
echo "更新 frontend/package.json..."
if [ -f "frontend/package.json" ]; then
    # 如后台不是 https，请改为 http
    sed -i.bak "s|\"proxy\": \".*\"|\"proxy\": \"http://${SERVER_IP}:${BACKEND_PORT}\"|g" frontend/package.json
    echo "✓ 已更新前端代理配置"
fi

# 3) 更新前端 setupProxy.js（开发模式代理）
echo "更新 frontend/src/setupProxy.js..."
mkdir -p frontend/src
cat > frontend/src/setupProxy.js << EOF
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.NODE_ENV === 'production' 
        ? 'http://backend:${BACKEND_PORT}' 
        : 'http://localhost:${BACKEND_PORT}',
      changeOrigin: true,
    })
  );
};
EOF

# 4) 生成前端环境变量文件
echo "生成 frontend/.env..."
cat > frontend/.env << EOF
# 前端环境变量配置
REACT_APP_API_URL=http://${SERVER_IP}:${BACKEND_PORT}
REACT_APP_SERVER_IP=${SERVER_IP}
REACT_APP_BACKEND_PORT=${BACKEND_PORT}
REACT_APP_FRONTEND_PORT=${FRONTEND_PORT}

# 生产环境标识
NODE_ENV=production
EOF

# 5) 写入 Spring Boot application.properties（取代 .env.backend）
echo "写入 Spring Boot application.properties..."
# 自动识别路径：优先 FlexResume/src/...，否则使用 src/...
BACKEND_RES_DIR="FlexResume/src/main/resources"
if [ ! -d "\$BACKEND_RES_DIR" ] && [ -d "src/main/resources" ]; then
  BACKEND_RES_DIR="src/main/resources"
fi
mkdir -p "\$BACKEND_RES_DIR"

# 用单引号 EOF，避免 shell 提前展开 ${...}，让 Spring 在运行时解析
cat > "\$BACKEND_RES_DIR/application.properties" << 'EOF'
spring.application.name=FlexResume

# 数据库配置 - 使用环境变量
spring.data.mongodb.uri=${MONGODB_URI:mongodb://resumedb:Wangzhaoyu011207@60.205.155.237:27017/resume_builder?authSource=admin}

# Redis 缓存配置
spring.data.redis.host=${REDIS_HOST:redis}
spring.data.redis.port=${REDIS_PORT:6379}
spring.data.redis.timeout=2000ms
spring.data.redis.lettuce.pool.max-active=8
spring.data.redis.lettuce.pool.max-idle=8
spring.data.redis.lettuce.pool.min-idle=0

# 缓存配置
spring.cache.type=redis
spring.cache.redis.time-to-live=300000
spring.cache.redis.cache-null-values=false

logging.level.org.springframework=INFO

# 服务器端口配置 - 使用环境变量
server.port=${SERVER_PORT:8081}

# CORS配置相关的环境变量
cors.allowed.origins=${FRONTEND_URL:http://60.205.155.237:8080},${DEV_FRONTEND_URL:http://localhost:3000},${DOMAIN_URL:http://www.flexresume.me}

# 文件上传配置
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# 服务器配置
server.max-http-header-size=1MB
EOF

echo ""
echo "🎉 配置完成！"
echo ""
echo "生成/更新的文件:"
echo "  ✓ nginx.conf"
echo "  ✓ frontend/.env"
echo "  ✓ frontend/src/setupProxy.js"
echo "  ✓ 更新了 frontend/package.json（已备份 .bak）"
echo "  ✓ \${BACKEND_RES_DIR}/application.properties"
echo ""
echo "现在可以运行: docker-compose up -d"
