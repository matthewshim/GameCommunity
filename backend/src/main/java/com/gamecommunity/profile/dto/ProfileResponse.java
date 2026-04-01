package com.gamecommunity.profile.dto;

import com.gamecommunity.profile.entity.GamerProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String nickname;
    private String profileImage;
    private Double mannerScore;
    private String mannerTier;

    // RO 특화
    private String serverName;
    private String serverType;
    private String serverRegion;
    private String jobClass;
    private String jobTier;
    private Integer baseLevel;
    private String role;
    private List<String> contentPreference;
    private String lookingFor;
    private String experienceLevel;
    private String guildName;
    private String voiceChat;
    private String playTimeStart;
    private String playTimeEnd;
    private String bio;

    public static ProfileResponse from(GamerProfile profile) {
        var user = profile.getUser();
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .mannerScore(user.getMannerScore())
                .mannerTier(user.getMannerTier())
                .serverName(profile.getServerName())
                .serverType(profile.getServerType())
                .serverRegion(profile.getServerRegion())
                .jobClass(profile.getJobClass())
                .jobTier(profile.getJobTier())
                .baseLevel(profile.getBaseLevel())
                .role(profile.getRole())
                .contentPreference(
                    profile.getContentPreference() != null
                        ? Arrays.asList(profile.getContentPreference().split(","))
                        : List.of()
                )
                .lookingFor(profile.getLookingFor())
                .experienceLevel(profile.getExperienceLevel())
                .guildName(profile.getGuildName())
                .voiceChat(profile.getVoiceChat())
                .playTimeStart(profile.getPlayTimeStart())
                .playTimeEnd(profile.getPlayTimeEnd())
                .bio(profile.getBio())
                .build();
    }
}
