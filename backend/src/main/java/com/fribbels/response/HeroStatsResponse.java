package com.fribbels.response;

import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@Builder
@ToString
public class HeroStatsResponse extends Response {

    private final HeroStats heroStats;
}
