package com.example.flexresume.controller;

import com.example.flexresume.model.User;
import com.example.flexresume.repository.UserRepository;
import com.example.flexresume.util.JwtUtil;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()) != null) {
            // 返回 JSON
            Map<String, Object> result = new HashMap<>();
            result.put("error", "用户已存在");
            return ResponseEntity.badRequest().body(result);
        }
        String hash = passwordEncoder.encode(req.getPassword());
        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(hash);
        user.setVersion(1);
        userRepository.save(user);
        Map<String, Object> result = new HashMap<>();
        result.put("message", "注册成功");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) return ResponseEntity.status(401).body("用户不存在");
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("密码错误");
        }
        String token = jwtUtil.generateToken(user.getId());
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        return ResponseEntity.ok(result);
    }

    @Data
    public static class RegisterRequest {
        private String email;
        private String password;
    }
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
} 