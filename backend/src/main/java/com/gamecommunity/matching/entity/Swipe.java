package com.gamecommunity.matching.entity;

import com.gamecommunity.common.entity.BaseTimeEntity;
import com.gamecommunity.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "swipes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"from_user_id", "to_user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Swipe extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Column(nullable = false, length = 10)
    private String type;  // GG, PASS
}
