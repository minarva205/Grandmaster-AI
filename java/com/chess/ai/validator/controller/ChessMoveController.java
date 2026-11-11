package com.chess.ai.validator.controller;

import com.chess.ai.validator.dto.MoveRequest;
import com.chess.ai.validator.dto.MoveResponse;
import com.chess.ai.validator.service.ChessMoveService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chess")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ChessMoveController {

    private final ChessMoveService chessMoveService;

    public ChessMoveController(ChessMoveService chessMoveService) {
        this.chessMoveService = chessMoveService;
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateMove(@RequestBody MoveRequest request, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to validate moves.");
        }
        MoveResponse response = chessMoveService.validateMove(request, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMoveHistory(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You must be logged in to view move history.");
        }
        return ResponseEntity.ok(chessMoveService.getUserMoveHistory(userId));
    }
}
