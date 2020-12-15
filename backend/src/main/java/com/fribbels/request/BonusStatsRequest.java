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
    private int atkPercent;
    private int defPercent;
    private int hpPercent;
    private int speed;
    private int cr;
    private int cd;
    private int eff;
    private int res;
    private String heroId;
}

