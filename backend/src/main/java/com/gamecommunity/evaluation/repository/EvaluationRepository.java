package com.gamecommunity.evaluation.repository;

import com.gamecommunity.evaluation.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    boolean existsByEvaluatorIdAndMatchId(Long evaluatorId, Long matchId);
    Optional<Evaluation> findByEvaluatorIdAndMatchId(Long evaluatorId, Long matchId);
}
