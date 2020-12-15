package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum StatType {

    @SerializedName("Attack") ATTACK (0),
    @SerializedName("Health") HEALTH (1),
    @SerializedName("Defense") DEFENSE (2),
    @SerializedName("AttackPercent") ATTACKPERCENT (3),
    @SerializedName("HealthPercent") HEALTHPERCENT (4),
    @SerializedName("DefensePercent") DEFENSEPERCENT (5),
    @SerializedName("CriticalHitChancePercent") CRITRATE (6),
    @SerializedName("CriticalHitDamagePercent") CRITDAMAGE (7),
    @SerializedName("EffectivenessPercent") EFFECTIVENESS (8),
    @SerializedName("EffectResistancePercent") EFFECTRESISTANCE (9),
    @SerializedName("Speed") SPEED (10),
    @SerializedName("Dac") DAC (11);

    private int index;
}
