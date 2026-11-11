package com.chess.ai.validator.dto;

public class MoveResponse {

    private boolean valid;
    private String quality;
    private String score;
    private String best;
    private String aiText;

    // Default constructor
    public MoveResponse() {}

    public MoveResponse(boolean valid, String quality, String score, String best, String aiText) {
        this.valid = valid;
        this.quality = quality;
        this.score = score;
        this.best = best;
        this.aiText = aiText;
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getQuality() { return quality; }
    public void setQuality(String quality) { this.quality = quality; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }

    public String getBest() { return best; }
    public void setBest(String best) { this.best = best; }

    public String getAiText() { return aiText; }
    public void setAiText(String aiText) { this.aiText = aiText; }
}
