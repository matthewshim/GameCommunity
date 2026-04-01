package com.gamecommunity.user.entity;

import com.gamecommunity.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 30)
    private String nickname;

    @Column(length = 500)
    private String profileImage;

    @Column(length = 20)
    @Builder.Default
    private String provider = "LOCAL";  // LOCAL, GOOGLE, DISCORD

    private String providerId;

    @Builder.Default
    private Double mannerScore = 50.0;  // 0~100, 초기값 50

    @Column(length = 20)
    @Builder.Default
    private String mannerTier = "GOLD";  // BRONZE~DIAMOND

    @Column(length = 10)
    @Builder.Default
    private String language = "en";

    private String timezone;

    @Column(length = 20)
    @Builder.Default
    private String role = "USER";  // USER, ADMIN

    @Column(length = 20)
    @Builder.Default
    private String status = "ACTIVE";  // ACTIVE, INACTIVE, BANNED, SHADOW_BANNED

    @Builder.Default
    private Boolean hasProfile = false;
}
