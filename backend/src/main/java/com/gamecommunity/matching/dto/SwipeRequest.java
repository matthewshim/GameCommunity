package com.gamecommunity.matching.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SwipeRequest {
    @NotNull(message = "대상 유저를 선택해주세요.")
    private Long targetUserId;

    @NotBlank(message = "스와이프 타입을 선택해주세요.")
    private String type;  // GG, PASS
}
