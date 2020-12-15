package com.fribbels.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
@AllArgsConstructor
public class MiniOptimizationResponse {

    private List<Integer> stats;
    private List<Integer> ids;
}
