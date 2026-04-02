package com.gamecommunity.evaluation.entity;

import com.gamecommunity.common.entity.BaseTimeEntity;
import com.gamecommunity.matching.entity.Match;
import com.gamecommunity.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"evaluator_id", "match_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_id", nullable = false)
    private User target;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @Column(nullable = false)
    private Integer communication;  // 1~5

    @Column(nullable = false)
    private Integer teamwork;  // 1~5

    @Column(nullable = false)
    private Integer mentality;  // 1~5
}
