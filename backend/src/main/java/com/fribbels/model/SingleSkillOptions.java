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
public class SingleSkillOptions {

    public Float attackImprintPercent;
    public Float attackIncreasePercent;
    public Float damageIncreasePercent;
    public Boolean elementalAdvantageEnabled;
    public Boolean decreasedAttackBuffEnabled;
    public Boolean attackBuffEnabled;
    public Boolean greaterAttackBuffEnabled;
    public Boolean critDamageBuffEnabled;
    public Boolean vigorAttackBuffEnabled;

    public Boolean applyToAllSkills;

    public Integer targetDefense;
    public Float targetDefenseIncreasePercent;
    public Float targetDamageReductionPercent;
    public Float targetDamageTransferPercent;
    public Boolean targetDefenseBuffEnabled;
    public Boolean targetVigorDefenseBuffEnabled;
    public Boolean targetDefenseBreakBuffEnabled;
    public Boolean targetTargetBuffEnabled;
}
