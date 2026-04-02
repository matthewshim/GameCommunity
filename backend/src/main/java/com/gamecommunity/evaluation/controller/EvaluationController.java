package com.gamecommunity.evaluation.controller;

import com.gamecommunity.common.dto.ApiResponse;
import com.gamecommunity.evaluation.dto.EvaluationRequest;
import com.gamecommunity.evaluation.dto.EvaluationResponse;
import com.gamecommunity.evaluation.service.EvaluationService;
import com.gamecommunity.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluation")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping
    public ResponseEntity<ApiResponse<EvaluationResponse>> evaluate(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody EvaluationRequest request) {
        EvaluationResponse response = evaluationService.evaluate(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response, "매너 평가가 완료되었습니다."));
    }

    @GetMapping("/{matchId}")
    public ResponseEntity<ApiResponse<EvaluationResponse>> getEvaluation(
            @AuthenticationPrincipal User user,
            @PathVariable Long matchId) {
        EvaluationResponse response = evaluationService.getEvaluation(user.getId(), matchId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
