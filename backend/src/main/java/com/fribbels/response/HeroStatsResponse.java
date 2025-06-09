package com.fribbels.response;

import com.fribbels.model.HeroStats;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class HeroStatsResponse extends Response {

    private final HeroStats heroStats;
}
