package com.gamecommunity.profile.entity;

import com.gamecommunity.common.entity.BaseTimeEntity;
import com.gamecommunity.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gamer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamerProfile extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ── 서버 정보 ──
    @Column(nullable = false, length = 50)
    private String serverName;

    @Column(nullable = false, length = 20)
    private String serverType;  // OFFICIAL, PRIVATE

    @Column(length = 20)
    @Builder.Default
    private String serverRegion = "GLOBAL";  // GLOBAL, SEA, NA, EU, KR, JP

    // ── 캐릭터 정보 ──
    @Column(nullable = false, length = 50)
    private String jobClass;  // "Royal Guard", "Arch Bishop" 등

    @Column(nullable = false, length = 20)
    private String jobTier;  // FIRST, SECOND, TRANSCENDENT, THIRD, FOURTH

    @Column(nullable = false)
    @Builder.Default
    private Integer baseLevel = 1;

    @Column(nullable = false, length = 20)
    private String role;  // TANK, DPS_MELEE, DPS_RANGED, DPS_MAGIC, SUPPORT, UTILITY

    // ── 활동 정보 ──
    @Column(length = 200)
    private String contentPreference;  // 콤마 구분: "WOE,MVP_HUNT,INSTANCE_DUNGEON"

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String lookingFor = "BOTH";  // PARTY, GUILD, BOTH

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String experienceLevel = "VETERAN";  // NEWBIE, RETURNING, VETERAN

    @Column(length = 50)
    private String guildName;

    // ── 공통 정보 ──
    @Column(nullable = false, length = 20)
    @Builder.Default
    private String voiceChat = "OPTIONAL";  // REQUIRED, OPTIONAL, NONE

    @Column(length = 10)
    private String playTimeStart;  // "19:00"

    @Column(length = 10)
    private String playTimeEnd;  // "23:00"

    @Column(length = 200)
    private String bio;
}
