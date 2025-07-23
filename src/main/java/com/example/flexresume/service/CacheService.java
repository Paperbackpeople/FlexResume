package com.example.flexresume.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class CacheService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // 缓存key前缀
    private static final String CACHE_PREFIX = "resume:";
    
    // 脏数据标记前缀
    private static final String DIRTY_PREFIX = "dirty:";

    /**
     * 写入缓存（写回策略）
     * @param key 缓存键
     * @param data 数据
     * @param expireMinutes 过期时间（分钟）
     */
    public void writeToCache(String key, Object data, int expireMinutes) {
        String cacheKey = CACHE_PREFIX + key;
        redisTemplate.opsForValue().set(cacheKey, data, expireMinutes, TimeUnit.MINUTES);
        
        // 标记为脏数据，需要异步写回数据库
        markDirty(key);
    }

    /**
     * 从缓存读取数据
     */
    public Object getFromCache(String key) {
        String cacheKey = CACHE_PREFIX + key;
        return redisTemplate.opsForValue().get(cacheKey);
    }

    /**
     * 检查缓存是否存在
     */
    public boolean hasCache(String key) {
        String cacheKey = CACHE_PREFIX + key;
        return Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey));
    }

    /**
     * 删除缓存
     */
    public void evictCache(String key) {
        String cacheKey = CACHE_PREFIX + key;
        redisTemplate.delete(cacheKey);
        removeDirtyFlag(key);
    }

    /**
     * 标记数据为脏数据
     */
    private void markDirty(String key) {
        String dirtyKey = DIRTY_PREFIX + key;
        // 设置脏标记，30分钟后过期（确保有足够时间写回）
        redisTemplate.opsForValue().set(dirtyKey, System.currentTimeMillis(), 30, TimeUnit.MINUTES);
    }

    /**
     * 移除脏数据标记
     */
    public void removeDirtyFlag(String key) {
        String dirtyKey = DIRTY_PREFIX + key;
        redisTemplate.delete(dirtyKey);
    }

    /**
     * 检查是否为脏数据
     */
    public boolean isDirty(String key) {
        String dirtyKey = DIRTY_PREFIX + key;
        return Boolean.TRUE.equals(redisTemplate.hasKey(dirtyKey));
    }

    /**
     * 获取所有脏数据的key
     */
    public java.util.Set<String> getDirtyKeys() {
        return redisTemplate.keys(DIRTY_PREFIX + "*");
    }

    /**
     * 构建缓存key
     */
    public String buildKey(String type, String username, int version) {
        return String.format("%s:%s:%d", type, username, version);
    }

    /**
     * 异步预热缓存
     */
    @Async
    public void warmUpCache(String key, Object data, int expireMinutes) {
        String cacheKey = CACHE_PREFIX + key;
        redisTemplate.opsForValue().set(cacheKey, data, expireMinutes, TimeUnit.MINUTES);
    }
} 