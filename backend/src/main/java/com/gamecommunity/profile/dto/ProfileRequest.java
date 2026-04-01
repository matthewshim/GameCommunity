package com.gamecommunity.profile.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileRequest {

    @NotBlank(message = "서버를 선택해주세요.")
    private String serverName;

    @NotBlank(message = "서버 타입을 선택해주세요.")
    private String serverType;

    private String serverRegion;

    @NotBlank(message = "직업을 선택해주세요.")
    private String jobClass;

    @NotBlank(message = "직업 티어를 선택해주세요.")
    private String jobTier;

    @Min(value = 1, message = "레벨은 1 이상이어야 합니다.")
    private Integer baseLevel;

    @NotBlank(message = "역할을 선택해주세요.")
    private String role;

    private String contentPreference;

    private String lookingFor;
    private String experienceLevel;
    private String guildName;
    private String voiceChat;
    private String playTimeStart;
    private String playTimeEnd;

    @Size(max = 200, message = "자기소개는 200자 이내로 작성해주세요.")
    private String bio;
}
