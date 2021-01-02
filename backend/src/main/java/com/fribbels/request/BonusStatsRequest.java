package com.fribbels.request;

import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class BonusStatsRequest extends Request {

    private int atk;
    private int def;
    private int hp;
    private float atkPercent;
    private float defPercent;
    private float hpPercent;
    private int speed;
    private float cr;
    private float cd;
    private float eff;
    private float res;
    private String heroId;
}

