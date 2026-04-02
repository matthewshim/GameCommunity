package com.gamecommunity.matching.dto;

import com.gamecommunity.matching.entity.Match;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class MatchResponse {
    private Long matchId;
    private Long partnerId;
    private String partnerNickname;
    private String partnerProfileImage;
    private String partnerJobClass;
    private String partnerServerName;
    private String status;
    private LocalDateTime matchedAt;

    public static MatchResponse from(Match match, Long myUserId) {
        var partner = match.getUser1().getId().equals(myUserId) ? match.getUser2() : match.getUser1();
        return MatchResponse.builder()
                .matchId(match.getId())
                .partnerId(partner.getId())
                .partnerNickname(partner.getNickname())
                .partnerProfileImage(partner.getProfileImage())
                .status(match.getStatus())
                .matchedAt(match.getCreatedAt())
                .build();
    }
}
