package com.scholarship.app.controller;

import com.scholarship.app.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Static thread-safe application storage simulation mapping blocks
    private static final Map<String, String> userDb = new ConcurrentHashMap<>();
    private static final Map<String, String> roleDb = new ConcurrentHashMap<>();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String role = request.get("role") != null ? request.get("role") : "ROLE_STUDENT";

        // Catch blank payloads coming out of misconfigured form instances
        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username or password cannot be empty."));
        }

        String standardizedUsername = username.trim().toLowerCase();

        if (userDb.containsKey(standardizedUsername)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username '" + username + "' is already taken."));
        }

        userDb.put(standardizedUsername, passwordEncoder.encode(password));
        roleDb.put(standardizedUsername, role);
        
        System.out.println("Successfully registered account: " + standardizedUsername + " with role: " + role);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Missing credentials"));
        }

        String standardizedUsername = username.trim().toLowerCase();

        if (!userDb.containsKey(standardizedUsername) || !passwordEncoder.matches(password, userDb.get(standardizedUsername))) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }

        String role = roleDb.get(standardizedUsername);
        String token = jwtUtil.generateToken(standardizedUsername, role);
        return ResponseEntity.ok(Map.of("token", token, "role", role, "username", standardizedUsername));
    }
}
