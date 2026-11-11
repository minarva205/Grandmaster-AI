package com.chess.ai.validator.controller;

import com.chess.ai.validator.model.User;
import com.chess.ai.validator.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String fullName = request.get("fullName");
        String email = request.get("email");
        String password = request.get("password");

        if (fullName == null || email == null || password == null || fullName.trim().isEmpty() || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "All fields are required."));
        }

        try {
            User user = userService.registerUser(fullName, email, password);
            return ResponseEntity.ok(Map.of("message", "User registered successfully!", "userId", user.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Registration failed."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required."));
        }

        return userService.loginUser(email, password)
                .map(user -> {
                    session.setAttribute("userId", user.getId());
                    session.setAttribute("userName", user.getFullName());
                    session.setAttribute("userEmail", user.getEmail());
                    return ResponseEntity.ok(Map.of(
                            "message", "Login successful!",
                            "userId", user.getId(),
                            "fullName", user.getFullName(),
                            "email", user.getEmail()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password.")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Not logged in."));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("userId", userId);
        userData.put("fullName", session.getAttribute("userName"));
        userData.put("email", session.getAttribute("userEmail"));
        return ResponseEntity.ok(userData);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully!"));
    }
}
