package com.gamecommunity.evaluation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluationRequest {
    @NotNull
    private Long matchId;

    @NotNull @Min(1) @Max(5)
    private Integer communication;

    @NotNull @Min(1) @Max(5)
    private Integer teamwork;

    @NotNull @Min(1) @Max(5)
    private Integer mentality;
}
