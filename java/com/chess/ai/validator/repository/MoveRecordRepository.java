package com.chess.ai.validator.repository;

import com.chess.ai.validator.model.MoveRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MoveRecordRepository extends JpaRepository<MoveRecord, Long> {
    List<MoveRecord> findByUserIdOrderByTimestampDesc(Long userId);
}
