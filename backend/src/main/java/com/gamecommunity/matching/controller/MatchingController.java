package com.gamecommunity.matching.controller;

import com.gamecommunity.common.dto.ApiResponse;
import com.gamecommunity.matching.dto.*;
import com.gamecommunity.matching.service.MatchingService;
import com.gamecommunity.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    @GetMapping("/matching/candidates")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> getCandidates(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "20") int limit) {
        List<CandidateResponse> candidates = matchingService.getCandidates(user.getId(), limit);
        return ResponseEntity.ok(ApiResponse.ok(candidates));
    }

    @PostMapping("/swipe")
    public ResponseEntity<ApiResponse<SwipeResponse>> swipe(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody SwipeRequest request) {
        SwipeResponse response = matchingService.swipe(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response,
                response.isMatched() ? "🎉 GG! 매칭 성공!" : response.getMessage()));
    }

    @GetMapping("/matches")
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getMatches(
            @AuthenticationPrincipal User user) {
        List<MatchResponse> matches = matchingService.getMatches(user.getId());
        return ResponseEntity.ok(ApiResponse.ok(matches));
    }
}
