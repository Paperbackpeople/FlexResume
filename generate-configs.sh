#!/bin/bash

# ===========================================
# FlexResume 配置生成脚本
# 根据config.env生成所需的配置文件
# ===========================================

echo "开始生成配置文件..."

# 加载环境变量
if [ -f "config.env" ]; then
    export $(cat config.env | grep -v '#' | awk '/=/ {print $1}')
    echo "✓ 已加载 config.env"
else
    echo "❌ 未找到 config.env 文件"
    exit 1
fi

# 设置默认值
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

# 1. 生成nginx配置
echo "生成 nginx.conf..."
cat > nginx.conf << EOF
server {
    client_max_body_size 20M;
    listen 80;
    server_name ${DOMAIN_NAME} ${SERVER_IP};

    location /api/ {
        proxy_pass http://backend:${BACKEND_PORT}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        root /usr/share/nginx/html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

# 2. 更新前端package.json的proxy配置
echo "更新 frontend/package.json..."
if [ -f "frontend/package.json" ]; then
    # 使用sed替换proxy配置
    sed -i.bak "s|\"proxy\": \".*\"|\"proxy\": \"https://${SERVER_IP}:${BACKEND_PORT}\"|g" frontend/package.json
    echo "✓ 已更新前端代理配置"
fi

# 3. 更新前端setupProxy.js
echo "更新 frontend/src/setupProxy.js..."
cat > frontend/src/setupProxy.js << EOF
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: process.env.NODE_ENV === 'production' 
        ? 'http://backend:${BACKEND_PORT}' 
        : 'http://localhost:${BACKEND_PORT}',
      changeOrigin: true,
    })
  );
};
EOF

# 4. 生成前端环境变量文件
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

# 5. 生成后端环境变量文件 (如果需要)
echo "生成 .env.backend..."
cat > .env.backend << EOF
# 后端环境变量配置
MONGODB_URI=${MONGODB_URI}
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT:-6379}
SERVER_PORT=${BACKEND_PORT}
FRONTEND_URL=http://${SERVER_IP}:${FRONTEND_PORT}
DOMAIN_NAME=${DOMAIN_NAME}
CORS_ALLOWED_ORIGINS=http://${SERVER_IP}:${FRONTEND_PORT},http://localhost:3000,http://${DOMAIN_NAME}
EOF

echo ""
echo "🎉 配置文件生成完成!"
echo ""
echo "生成的文件:"
echo "  ✓ nginx.conf"
echo "  ✓ frontend/.env"
echo "  ✓ frontend/src/setupProxy.js"
echo "  ✓ .env.backend"
echo "  ✓ 更新了 frontend/package.json"
echo ""
echo "现在可以运行: docker-compose up -d" 