#!/bin/bash
set -e

echo "开始 MongoDB 初始化..."

# 等待 MongoDB 启动
sleep 10

# 如果存在数据备份，则恢复数据
if [ -f "/docker-entrypoint-initdb.d/mongodb_dump.tar.gz" ]; then
    echo "发现数据备份文件，开始恢复数据..."
    
    # 解压备份文件
    cd /tmp
    tar -xzf /docker-entrypoint-initdb.d/mongodb_dump.tar.gz
    
    # 恢复数据到数据库（修正目录结构）
    if [ -d "/tmp/mongodb_dump" ]; then
        echo "正在恢复数据库..."
        mongorestore --host localhost --port 27017 \
                     --username $MONGO_INITDB_ROOT_USERNAME \
                     --password $MONGO_INITDB_ROOT_PASSWORD \
                     --authenticationDatabase admin \
                     --db $MONGO_INITDB_DATABASE \
                     /tmp/mongodb_dump/$MONGO_INITDB_DATABASE
        echo "数据恢复完成"
    else
        echo "未找到mongodb_dump目录，跳过数据恢复"
    fi
    
    # 清理临时文件
    rm -rf /tmp/mongodb_dump
else
    echo "未找到备份文件，执行基础初始化..."
    
    # 运行基础初始化脚本
    if [ -f "/docker-entrypoint-initdb.d/mongo-init.js" ]; then
        mongo --host localhost --port 27017 \
              --username $MONGO_INITDB_ROOT_USERNAME \
              --password $MONGO_INITDB_ROOT_PASSWORD \
              --authenticationDatabase admin \
              $MONGO_INITDB_DATABASE \
              /docker-entrypoint-initdb.d/mongo-init.js
        echo "基础初始化完成"
    fi
fi

echo "MongoDB 初始化完成！" 