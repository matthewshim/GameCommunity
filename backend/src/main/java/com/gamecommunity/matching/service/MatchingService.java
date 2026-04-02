package com.gamecommunity.matching.service;

import com.gamecommunity.matching.dto.*;
import com.gamecommunity.matching.entity.Match;
import com.gamecommunity.matching.entity.Swipe;
import com.gamecommunity.matching.repository.MatchRepository;
import com.gamecommunity.matching.repository.SwipeRepository;
import com.gamecommunity.profile.entity.GamerProfile;
import com.gamecommunity.profile.repository.GamerProfileRepository;
import com.gamecommunity.user.entity.User;
import com.gamecommunity.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final UserRepository userRepository;
    private final GamerProfileRepository profileRepository;
    private final SwipeRepository swipeRepository;
    private final MatchRepository matchRepository;

    // ── 역할 상보성 매트릭스 ──
    private static final Map<String, Set<String>> ROLE_SYNERGY = Map.of(
        "TANK",       Set.of("SUPPORT", "DPS_MAGIC"),
        "SUPPORT",    Set.of("TANK", "DPS_MELEE"),
        "DPS_MAGIC",  Set.of("TANK", "SUPPORT"),
        "DPS_MELEE",  Set.of("SUPPORT"),
        "DPS_RANGED", Set.of("SUPPORT", "TANK"),
        "UTILITY",    Set.of("TANK", "SUPPORT", "DPS_MAGIC", "DPS_MELEE", "DPS_RANGED")
    );

    /**
     * 매칭 후보 조회 — RO 특화 점수 알고리즘
     */
    @Transactional(readOnly = true)
    public List<CandidateResponse> getCandidates(Long userId, int limit) {
        GamerProfile myProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 먼저 설정해주세요."));

        // 이미 스와이프한 유저 IDs
        List<Long> swipedIds = swipeRepository.findSwipedUserIds(userId);
        Set<Long> excludeIds = new HashSet<>(swipedIds);
        excludeIds.add(userId);  // 자기 자신 제외

        // 프로필이 있는 Active 유저 조회
        List<User> allUsers = userRepository.findAll().stream()
                .filter(u -> !excludeIds.contains(u.getId()))
                .filter(u -> "ACTIVE".equals(u.getStatus()))
                .filter(u -> Boolean.TRUE.equals(u.getHasProfile()))
                .collect(Collectors.toList());

        // 각 후보에 대해 매칭 점수 계산
        List<CandidateResponse> candidates = new ArrayList<>();
        for (User candidate : allUsers) {
            Optional<GamerProfile> profileOpt = profileRepository.findByUserId(candidate.getId());
            if (profileOpt.isEmpty()) continue;

            GamerProfile candidateProfile = profileOpt.get();
            int score = calculateMatchScore(myProfile, candidateProfile, candidate);
            candidates.add(CandidateResponse.from(candidate, candidateProfile, score));
        }

        // 점수 높은 순 정렬 → limit
        candidates.sort((a, b) -> b.getMatchScore() - a.getMatchScore());
        return candidates.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * RO 특화 매칭 점수 계산
     */
    private int calculateMatchScore(GamerProfile my, GamerProfile other, User otherUser) {
        int score = 0;

        // 1. 동일 서버: +50점 ★ 최고 우선순위
        if (my.getServerName().equalsIgnoreCase(other.getServerName())) {
            score += 50;
        }

        // 2. 역할 상보성: +40점
        Set<String> synergies = ROLE_SYNERGY.getOrDefault(my.getRole(), Set.of());
        if (synergies.contains(other.getRole())) {
            score += 40;
        }

        // 3. 콘텐츠 선호 일치: +25점/일치항목
        if (my.getContentPreference() != null && other.getContentPreference() != null) {
            Set<String> myContents = Set.of(my.getContentPreference().split(","));
            Set<String> otherContents = Set.of(other.getContentPreference().split(","));
            long overlap = myContents.stream().filter(otherContents::contains).count();
            score += (int) (overlap * 25);
        }

        // 4. 레벨 범위 일치 (±15레벨): +20점
        if (Math.abs(my.getBaseLevel() - other.getBaseLevel()) <= 15) {
            score += 20;
        }

        // 5. 길드 모집↔길드 찾기: +35점
        if ("GUILD".equals(my.getLookingFor()) && other.getGuildName() != null && !other.getGuildName().isEmpty()) {
            score += 35;
        }
        if ("GUILD".equals(other.getLookingFor()) && my.getGuildName() != null && !my.getGuildName().isEmpty()) {
            score += 35;
        }

        // 6. 보이스챗 선호 일치: +10점
        if (my.getVoiceChat().equals(other.getVoiceChat())) {
            score += 10;
        }

        // 7. 플레이 시간대 겹침: +15점 (간소 비교)
        if (my.getPlayTimeStart() != null && other.getPlayTimeStart() != null
            && my.getPlayTimeStart().equals(other.getPlayTimeStart())) {
            score += 15;
        }

        // 8. 매너 온도 가산: +(매너점수/10)
        score += (int) (otherUser.getMannerScore() / 10);

        return score;
    }

    /**
     * 스와이프 처리 + 쌍방 매칭 감지
     */
    @Transactional
    public SwipeResponse swipe(Long userId, SwipeRequest request) {
        Long targetUserId = request.getTargetUserId();

        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("자기 자신에게 스와이프할 수 없습니다.");
        }

        if (swipeRepository.existsByFromUserIdAndToUserId(userId, targetUserId)) {
            throw new IllegalArgumentException("이미 스와이프한 유저입니다.");
        }

        User fromUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
        User toUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("대상 유저를 찾을 수 없습니다."));

        // 스와이프 저장
        Swipe swipe = Swipe.builder()
                .fromUser(fromUser)
                .toUser(toUser)
                .type(request.getType().toUpperCase())
                .build();
        swipeRepository.save(swipe);

        // PASS면 바로 리턴
        if ("PASS".equalsIgnoreCase(request.getType())) {
            return SwipeResponse.builder()
                    .matched(false).matchId(null)
                    .message("PASS")
                    .build();
        }

        // GG → 상대방도 나한테 GG 했는지 확인
        Optional<Swipe> reverseSwipe = swipeRepository.findByFromUserIdAndToUserId(targetUserId, userId);
        if (reverseSwipe.isPresent() && "GG".equalsIgnoreCase(reverseSwipe.get().getType())) {
            // 쌍방 GG → Match 생성!
            if (!matchRepository.existsActiveMatch(userId, targetUserId)) {
                Match match = Match.builder()
                        .user1(fromUser)
                        .user2(toUser)
                        .status("ACTIVE")
                        .build();
                matchRepository.save(match);

                log.info("🎉 Match created: User {} ↔ User {}", userId, targetUserId);

                return SwipeResponse.builder()
                        .matched(true)
                        .matchId(match.getId())
                        .message("GG! 매칭 성공!")
                        .build();
            }
        }

        return SwipeResponse.builder()
                .matched(false).matchId(null)
                .message("GG! 상대방의 응답을 기다리는 중...")
                .build();
    }

    /**
     * 내 매칭 목록 조회
     */
    @Transactional(readOnly = true)
    public List<MatchResponse> getMatches(Long userId) {
        List<Match> matches = matchRepository.findActiveMatchesByUserId(userId);
        return matches.stream()
                .map(m -> MatchResponse.from(m, userId))
                .collect(Collectors.toList());
    }
}
