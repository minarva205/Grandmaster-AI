package com.chess.ai.validator.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "move_records")
public class MoveRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Mapped to the user who made the move
    private String gameId;
    private String piece;
    private String fromSquare;
    private String toSquare;
    private boolean valid;
    private String quality;
    private String score;

    @Column(columnDefinition = "TEXT")
    private String aiText;

    private LocalDateTime timestamp;

    // Default constructor
    public MoveRecord() {
        this.timestamp = LocalDateTime.now();
    }

    public MoveRecord(Long userId, String gameId, String piece, String fromSquare, String toSquare,
                       boolean valid, String quality, String score, String aiText) {
        this.userId = userId;
        this.gameId = gameId;
        this.piece = piece;
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.valid = valid;
        this.quality = quality;
        this.score = score;
        this.aiText = aiText;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public String getPiece() { return piece; }
    public void setPiece(String piece) { this.piece = piece; }

    public String getFromSquare() { return fromSquare; }
    public void setFromSquare(String fromSquare) { this.fromSquare = fromSquare; }

    public String getToSquare() { return toSquare; }
    public void setToSquare(String toSquare) { this.toSquare = toSquare; }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }

    public String getAiText() { return aiText; }
    public void setAiText(String aiText) { this.aiText = aiText; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
