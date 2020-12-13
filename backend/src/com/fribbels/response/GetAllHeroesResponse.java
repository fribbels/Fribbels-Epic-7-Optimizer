package com.fribbels.response;

import com.fribbels.model.Hero;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@Builder
@ToString
public class GetAllHeroesResponse extends Response {

    private final List<Hero> heroes;
}
