package com.gamecommunity.evaluation.service;

import com.gamecommunity.evaluation.dto.EvaluationRequest;
import com.gamecommunity.evaluation.dto.EvaluationResponse;
import com.gamecommunity.evaluation.entity.Evaluation;
import com.gamecommunity.evaluation.repository.EvaluationRepository;
import com.gamecommunity.matching.entity.Match;
import com.gamecommunity.matching.repository.MatchRepository;
import com.gamecommunity.user.entity.User;
import com.gamecommunity.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EvaluationService {

    private static final double K = 32.0;

    private final EvaluationRepository evaluationRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @Transactional
    public EvaluationResponse evaluate(Long evaluatorId, EvaluationRequest request) {
        if (evaluationRepository.existsByEvaluatorIdAndMatchId(evaluatorId, request.getMatchId())) {
            throw new IllegalArgumentException("이미 평가를 완료한 매칭입니다.");
        }

        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("매칭을 찾을 수 없습니다."));

        // 상대방 식별
        Long targetId = match.getUser1().getId().equals(evaluatorId)
                ? match.getUser2().getId() : match.getUser1().getId();

        User evaluator = userRepository.findById(evaluatorId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        User target = userRepository.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("대상 유저를 찾을 수 없습니다."));

        // 평가 저장
        Evaluation eval = Evaluation.builder()
                .evaluator(evaluator)
                .target(target)
                .match(match)
                .communication(request.getCommunication())
                .teamwork(request.getTeamwork())
                .mentality(request.getMentality())
                .build();
        evaluationRepository.save(eval);

        // ELO 방식 매너 점수 업데이트
        double avgScore = (request.getCommunication() + request.getTeamwork() + request.getMentality()) / 3.0;
        double expected = target.getMannerScore() / 100.0;
        double actual = avgScore / 5.0;
        double newScore = target.getMannerScore() + K * (actual - expected);
        newScore = Math.max(0, Math.min(100, newScore));

        target.setMannerScore(Math.round(newScore * 10) / 10.0);
        target.setMannerTier(calculateTier(newScore));
        userRepository.save(target);

        log.info("📊 Evaluation: User {} → User {} | Score: {} → {} ({})",
                evaluatorId, targetId, target.getMannerScore(), newScore, target.getMannerTier());

        return EvaluationResponse.from(eval);
    }

    @Transactional(readOnly = true)
    public EvaluationResponse getEvaluation(Long evaluatorId, Long matchId) {
        return evaluationRepository.findByEvaluatorIdAndMatchId(evaluatorId, matchId)
                .map(EvaluationResponse::from)
                .orElse(null);
    }

    private String calculateTier(double score) {
        if (score >= 80) return "DIAMOND";
        if (score >= 60) return "PLATINUM";
        if (score >= 40) return "GOLD";
        if (score >= 20) return "SILVER";
        return "BRONZE";
    }
}
