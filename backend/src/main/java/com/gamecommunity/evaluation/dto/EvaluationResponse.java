package com.gamecommunity.evaluation.dto;

import com.gamecommunity.evaluation.entity.Evaluation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class EvaluationResponse {
    private Long id;
    private Long matchId;
    private Long targetId;
    private Integer communication;
    private Integer teamwork;
    private Integer mentality;
    private Double averageScore;

    public static EvaluationResponse from(Evaluation eval) {
        double avg = (eval.getCommunication() + eval.getTeamwork() + eval.getMentality()) / 3.0;
        return EvaluationResponse.builder()
                .id(eval.getId())
                .matchId(eval.getMatch().getId())
                .targetId(eval.getTarget().getId())
                .communication(eval.getCommunication())
                .teamwork(eval.getTeamwork())
                .mentality(eval.getMentality())
                .averageScore(Math.round(avg * 10) / 10.0)
                .build();
    }
}
