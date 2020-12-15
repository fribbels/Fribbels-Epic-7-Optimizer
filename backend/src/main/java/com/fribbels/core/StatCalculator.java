package com.fribbels.core;

import com.fribbels.enums.StatType;
import com.fribbels.model.AugmentedStats;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;

import java.util.Map;

public class StatCalculator {

    public static HeroStats addAccumulatorArrsToHero(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero) {
        int atk = (int) (base.getAtk() + mapAccumulatorArrsToFloat(0, accs)  + (sets[2] > 1 ? sets[2] / 4 * 0.35f * base.getAtk() : 0)) + hero.getBonusAtk();
        int hp = (int) (base.getHp()   + mapAccumulatorArrsToFloat(1, accs)  + (sets[0] > 1 ? sets[0] / 2 * 0.15f * base.getHp() : 0)) + hero.getBonusHp();
        int def = (int) (base.getDef() + mapAccumulatorArrsToFloat(2, accs)  + (sets[1] > 1 ? sets[1] / 2 * 0.15f * base.getDef() : 0)) + hero.getBonusDef();
        int spd = (int) (base.getSpd() + mapAccumulatorArrsToFloat(10, accs) + (sets[3] > 1 ? sets[3] / 4 * 0.25f * base.getSpd() : 0) + (sets[14] > 1 ? sets[14] / 4 * 0.1f * base.getSpd() : 0)) + hero.getBonusSpeed();
        int cr = (int) (base.getCr()   + mapAccumulatorArrsToFloat(6, accs)  + (sets[4] > 1 ? sets[4] / 2 * 12 : 0)) + hero.getBonusCr();
        int cd = (int) (base.getCd()   + mapAccumulatorArrsToFloat(7, accs)  + (sets[6] > 1 ? sets[6] / 4 * 40 : 0)) + hero.getBonusCd();
        int eff = (int) (base.getEff() + mapAccumulatorArrsToFloat(8, accs)  + (sets[5] > 1 ? sets[5] / 2 * 20 : 0)) + hero.getBonusEff();
        int res = (int) (base.getRes() + mapAccumulatorArrsToFloat(9, accs)  + (sets[9] > 1 ? sets[9] / 2 * 20 : 0)) + hero.getBonusRes();
        int dac = base.getDac() + sets[10] / 2 * 4;

        float critRate = (float)Math.min(cr, 100) / 100f;
        int cp = (int) (((atk * 1.6f + atk * 1.6f * critRate * cd/100f) * (1.0 + (spd - 45f) * 0.02f) + hp + def * 9.3f) * (1f + (res/100f + eff/100f) / 4f));


        int ehp = (int) (hp * ((float)def/300 + 1));
        int hpps = (int) ((float)hp*spd/100);
        int ehpps = (int) ((float)ehp*spd/100);
        int dmg = (int) ((critRate * atk * cd/100) + (1-critRate) * atk);
        int dmgps = (int) ((float)dmg*spd/100);
        int mcdmg = (int) ((float)atk * cd/100);
        int mcdmgps = (int) ((float)mcdmg*spd/100);

        return new HeroStats(atk, hp, def, cr, cd, eff, res, dac, spd, cp, ehp, hpps, ehpps, dmg, dmgps, mcdmg, mcdmgps, sets, null, null, null, null);
    }

    public static float mapAccumulatorArrsToFloat(final int index, final float[][] accs) {
        return accs[0][index]
                + accs[1][index]
                + accs[2][index]
                + accs[3][index]
                + accs[4][index]
                + accs[5][index];
    }

    public static float[] getStatAccumulatorArr(final HeroStats base, final Item item, final Map<Item, float[]> accumulatorsByItem) {
        if (accumulatorsByItem.containsKey(item)) {
            return accumulatorsByItem.get(item);
        }

        final float[] accumulator = buildStatAccumulatorArr(base, item);
        accumulatorsByItem.put(item, accumulator);
        return accumulator;
    }

    public static float[] buildStatAccumulatorArr(final HeroStats base, final Item item) {
        final AugmentedStats stats = item.getAugmentedStats();
        final float[] statAccumulatorArr = new float[12];

        // Add base
        statAccumulatorArr[0] += stats.getAttack() + stats.getAttackPercent()/100f * base.getAtk();
        statAccumulatorArr[1] += stats.getHealth() + stats.getHealthPercent()/100f * base.getHp();
        statAccumulatorArr[2] += stats.getDefense() + stats.getDefensePercent()/100f * base.getDef();

        statAccumulatorArr[10] += stats.getSpeed();
        statAccumulatorArr[6]  += stats.getCritRate();
        statAccumulatorArr[7]  += stats.getCritDamage();
        statAccumulatorArr[8]  += stats.getEffectiveness();
        statAccumulatorArr[9]  += stats.getEffectResistance();

        final StatType mainType = stats.getMainType();
        final int mainTypeIndex = stats.getMainType().getIndex();

        // Add percents
        if (mainTypeIndex == 3) {
            statAccumulatorArr[0] += stats.getMainValue()/100f * base.getAtk();
        } else if (mainType == StatType.HEALTHPERCENT) {
            statAccumulatorArr[1] += stats.getMainValue()/100f * base.getHp();
        } else if (mainType == StatType.DEFENSEPERCENT) {
            statAccumulatorArr[2] += stats.getMainValue()/100f * base.getDef();
        } else {
            statAccumulatorArr[mainTypeIndex] += stats.getMainValue();
        }

        return statAccumulatorArr;
    }

    public static int[] buildSetsArr(final Item[] items) {
        final int[] sets = new int[16];
        sets[items[0].getSet().getIndex()]++;
        sets[items[1].getSet().getIndex()]++;
        sets[items[2].getSet().getIndex()]++;
        sets[items[3].getSet().getIndex()]++;
        sets[items[4].getSet().getIndex()]++;
        sets[items[5].getSet().getIndex()]++;
        return sets;
    }
}
