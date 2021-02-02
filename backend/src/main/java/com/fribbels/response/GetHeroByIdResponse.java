package com.fribbels.response;

import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class GetHeroByIdResponse extends Response {

    private Hero hero;
    private HeroStats baseStats;

}
