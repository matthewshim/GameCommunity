package com.gamecommunity.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class SwipeResponse {
    private boolean matched;
    private Long matchId;
    private String message;
}
