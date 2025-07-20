package com.example.flexresume.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // 注册/登录接口放行
                .anyRequest().permitAll() // 其它接口可根据需要调整
            )
            .httpBasic(httpBasic -> httpBasic.disable()) // 禁用Basic Auth
            .formLogin(form -> form.disable()); // 禁用表单登录
        return http.build();
    }
} 