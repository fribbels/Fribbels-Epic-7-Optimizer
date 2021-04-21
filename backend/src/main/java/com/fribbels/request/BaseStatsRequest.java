package com.fribbels.request;

import com.fribbels.model.BaseStats;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Setter
@Getter
@Builder
@ToString
public class BaseStatsRequest extends Request {

    final Map<String, BaseStats> baseStatsByName;
}
