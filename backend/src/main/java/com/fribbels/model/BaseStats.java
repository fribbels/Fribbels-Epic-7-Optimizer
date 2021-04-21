package com.fribbels.model;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class BaseStats {

    private final HeroStats lv50FiveStarFullyAwakened;
    private final HeroStats lv60SixStarFullyAwakened;
}
