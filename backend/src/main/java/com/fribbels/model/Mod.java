package com.fribbels.model;

import com.fribbels.enums.StatType;
import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode
public class Mod {

    private StatType originalType;
    private StatType type;
    private Integer originalValue;
    private Integer value;
    private Integer index;

    public String toString() {
        System.out.println(new Gson().toJson(this));
        return new Gson().toJson(this);
    }

    public void modifyAugmentedStats(final AugmentedStats stats) {
        // Clear old stat
        if (originalType == StatType.ATTACK) {
            stats.setAttack(0);
        }
        if (originalType == StatType.ATTACKPERCENT) {
            stats.setAttackPercent(0);
        }
        if (originalType == StatType.CRITRATE) {
            stats.setCritRate(0);
        }
        if (originalType == StatType.CRITDAMAGE) {
            stats.setCritDamage(0);
        }
        if (originalType == StatType.DEFENSE) {
            stats.setDefense(0);
        }
        if (originalType == StatType.DEFENSEPERCENT) {
            stats.setDefensePercent(0);
        }
        if (originalType == StatType.EFFECTRESISTANCE) {
            stats.setEffectResistance(0);
        }
        if (originalType == StatType.EFFECTIVENESS) {
            stats.setEffectiveness(0);
        }
        if (originalType == StatType.HEALTH) {
            stats.setHealth(0);
        }
        if (originalType == StatType.HEALTHPERCENT) {
            stats.setHealthPercent(0);
        }
        if (originalType == StatType.SPEED) {
            stats.setSpeed(0);
        }

        // New stats
        if (type == StatType.ATTACK) {
            stats.setAttack(value);
        }
        if (type == StatType.ATTACKPERCENT) {
            stats.setAttackPercent(value);
        }
        if (type == StatType.CRITRATE) {
            stats.setCritRate(value);
        }
        if (type == StatType.CRITDAMAGE) {
            stats.setCritDamage(value);
        }
        if (type == StatType.DEFENSE) {
            stats.setDefense(value);
        }
        if (type == StatType.DEFENSEPERCENT) {
            stats.setDefensePercent(value);
        }
        if (type == StatType.EFFECTRESISTANCE) {
            stats.setEffectResistance(value);
        }
        if (type == StatType.EFFECTIVENESS) {
            stats.setEffectiveness(value);
        }
        if (type == StatType.HEALTH) {
            stats.setHealth(value);
        }
        if (type == StatType.HEALTHPERCENT) {
            stats.setHealthPercent(value);
        }
        if (type == StatType.SPEED) {
            stats.setSpeed(value);
        }

        System.out.println("Finished modding, " + stats);
    }
}
