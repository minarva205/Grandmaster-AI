package com.chess.ai.validator.service;

import com.chess.ai.validator.dto.MoveRequest;
import com.chess.ai.validator.dto.MoveResponse;
import com.chess.ai.validator.model.MoveRecord;
import com.chess.ai.validator.repository.MoveRecordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChessMoveService {

    private final MoveRecordRepository moveRecordRepository;

    public ChessMoveService(MoveRecordRepository moveRecordRepository) {
        this.moveRecordRepository = moveRecordRepository;
    }

    public MoveResponse validateMove(MoveRequest request, Long userId) {
        String piece = request.getPiece().toUpperCase();
        String from = request.getFromSquare().toLowerCase();
        String to = request.getToSquare().toLowerCase();

        // Basic input validation
        if (from.equals(to) || from.length() != 2 || to.length() != 2
                || from.charAt(0) < 'a' || from.charAt(0) > 'h'
                || to.charAt(0) < 'a' || to.charAt(0) > 'h'
                || from.charAt(1) < '1' || from.charAt(1) > '8'
                || to.charAt(1) < '1' || to.charAt(1) > '8') {
            MoveResponse response = new MoveResponse(false, "ILLEGAL", "0.00", "N/A",
                    "Invalid square input format or identical source and target squares.");
            logMove(request, response, userId);
            return response;
        }

        int fileDiff = Math.abs(from.charAt(0) - to.charAt(0));
        int rankDiff = Math.abs(from.charAt(1) - to.charAt(1));

        boolean isValid = validatePieceMovement(piece, fileDiff, rankDiff);

        MoveResponse response;
        if (isValid) {
            response = new MoveResponse(
                    true,
                    "BRILLIANT ⚡",
                    "+0.85",
                    "e2e4",
                    String.format("The move %s from %s to %s secures active central control and opens diagonal viewports for quick development.", piece, from, to)
            );
        } else {
            response = new MoveResponse(
                    false,
                    "BLUNDER ❌",
                    "-1.20",
                    "N/A",
                    String.format("Illegal movement trajectory for %s. Piece mechanics violate standard FIDE movement rules.", piece)
            );
        }

        logMove(request, response, userId);
        return response;
    }

    public List<MoveRecord> getUserMoveHistory(Long userId) {
        return moveRecordRepository.findByUserIdOrderByTimestampDesc(userId);
    }

    private boolean validatePieceMovement(String piece, int fileDiff, int rankDiff) {
        return switch (piece) {
            case "KNIGHT" -> (fileDiff == 1 && rankDiff == 2) || (fileDiff == 2 && rankDiff == 1);
            case "ROOK" -> (fileDiff == 0 || rankDiff == 0);
            case "BISHOP" -> (fileDiff == rankDiff) && fileDiff > 0;
            case "QUEEN" -> (fileDiff == 0 || rankDiff == 0) || (fileDiff == rankDiff);
            case "KING" -> (fileDiff <= 1 && rankDiff <= 1);
            case "PAWN" -> (fileDiff == 0 && (rankDiff == 1 || rankDiff == 2));
            default -> false;
        };
    }

    private void logMove(MoveRequest request, MoveResponse response, Long userId) {
        try {
            MoveRecord record = new MoveRecord(
                    userId,
                    request.getGameId(),
                    request.getPiece(),
                    request.getFromSquare(),
                    request.getToSquare(),
                    response.isValid(),
                    response.getQuality(),
                    response.getScore(),
                    response.getAiText()
            );
            moveRecordRepository.save(record);
        } catch (Exception e) {
            System.err.println("Failed to log move record: " + e.getMessage());
        }
    }
}
