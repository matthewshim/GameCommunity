package com.gamecommunity.matching.entity;

import com.gamecommunity.common.entity.BaseTimeEntity;
import com.gamecommunity.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Match extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";  // ACTIVE, ENDED, BLOCKED
}
