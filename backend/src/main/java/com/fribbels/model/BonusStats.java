package com.fribbels.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BonusStats {

    public int bonusMaxAtkPercent;
    public int bonusMaxDefPercent;
    public int bonusMaxHpPercent;
    public int overrideAtk;
    public int overrideHp;
    public int overrideDef;
    public int overrideAdditionalCr;
    public int overrideAdditionalCd;
    public int overrideAdditionalSpd;
    public int overrideAdditionalEff;
    public int overrideAdditionalRes;
}
