package com.example.flexresume.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        // 使用String序列化器作为key序列化器
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        
        // 使用JSON序列化器作为value序列化器
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // 默认缓存配置 - 5分钟过期
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(5))
                .serializeKeysWith(org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(org.springframework.data.redis.serializer.RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        // 针对不同类型数据的缓存策略
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // 个人信息：缓存10分钟（变更频率较低）
        cacheConfigurations.put("personalInfo", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // 教育信息：缓存15分钟（相对稳定）
        cacheConfigurations.put("education", defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // 项目信息：缓存8分钟（可能频繁更新）
        cacheConfigurations.put("projects", defaultConfig.entryTtl(Duration.ofMinutes(8)));
        
        // 工作经历：缓存10分钟
        cacheConfigurations.put("workinternship", defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // 技能信息：缓存12分钟
        cacheConfigurations.put("skills", defaultConfig.entryTtl(Duration.ofMinutes(12)));
        
        // 发布记录：缓存30分钟（访问频繁但更新较少）
        cacheConfigurations.put("publish", defaultConfig.entryTtl(Duration.ofMinutes(30)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
} 