package com.chess.ai.validator.dto;

public class MoveRequest {

    private String gameId;
    private String piece;
    private String fromSquare;
    private String toSquare;
    private String currentBoardStateFen;

    // Default constructor
    public MoveRequest() {}

    public MoveRequest(String gameId, String piece, String fromSquare, String toSquare, String currentBoardStateFen) {
        this.gameId = gameId;
        this.piece = piece;
        this.fromSquare = fromSquare;
        this.toSquare = toSquare;
        this.currentBoardStateFen = currentBoardStateFen;
    }

    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }

    public String getPiece() { return piece; }
    public void setPiece(String piece) { this.piece = piece; }

    public String getFromSquare() { return fromSquare; }
    public void setFromSquare(String fromSquare) { this.fromSquare = fromSquare; }

    public String getToSquare() { return toSquare; }
    public void setToSquare(String toSquare) { this.toSquare = toSquare; }

    public String getCurrentBoardStateFen() { return currentBoardStateFen; }
    public void setCurrentBoardStateFen(String currentBoardStateFen) { this.currentBoardStateFen = currentBoardStateFen; }
}
