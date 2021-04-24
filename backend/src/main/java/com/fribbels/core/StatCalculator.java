package com.fribbels.core;

import com.fribbels.enums.StatType;
import com.fribbels.model.AugmentedStats;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;

import java.util.Map;

public class StatCalculator {

    public static boolean SETTING_RAGE_SET = true;

    private static float atkSetBonus;
    private static float hpSetBonus;
    private static float defSetBonus;
    private static float speedSetBonus;
    private static float revengeSetBonus;

    private static float bonusBaseAtk;
    private static float bonusBaseHp;
    private static float bonusBaseDef;

    private static float bonusMaxAtk;
    private static float bonusMaxHp;
    private static float bonusMaxDef;


    public static void setBaseValues(final HeroStats base, final Hero hero) {
        atkSetBonus = 0.35f * base.atk;
        hpSetBonus = 0.15f * base.hp;
        defSetBonus = 0.15f * base.def;
        speedSetBonus = 0.25f * base.spd;
        revengeSetBonus = 0.1f * base.spd;

        bonusBaseAtk = base.atk + base.atk * (hero.bonusAtkPercent + hero.aeiAtkPercent) / 100f + hero.bonusAtk + hero.aeiAtk;
        bonusBaseHp = base.hp + base.hp * (hero.bonusHpPercent + hero.aeiHpPercent) / 100f + hero.bonusHp + hero.aeiHp;
        bonusBaseDef = base.def + base.def * (hero.bonusDefPercent + hero.aeiDefPercent) / 100f + hero.bonusDef + hero.aeiDef;

        bonusMaxAtk = 1 + base.bonusMaxAtkPercent/100f;
        bonusMaxHp = 1 + base.bonusMaxHpPercent/100f;
        bonusMaxDef = 1 + base.bonusMaxDefPercent/100f;
    }

    public static HeroStats addAccumulatorArrsToHero(final HeroStats base,
                                                     final float[][] accs,
                                                     final int[] sets,
                                                     final Hero hero,
                                                     final int upgrades,
                                                     final int conversions,
                                                     final int priority) {
        final float[] accs0 = accs[0];
        final float[] accs1 = accs[1];
        final float[] accs2 = accs[2];
        final float[] accs3 = accs[3];
        final float[] accs4 = accs[4];
        final float[] accs5 = accs[5];

        final float atk =  ((bonusBaseAtk  + accs0[0]+accs1[0]+accs2[0]+accs3[0]+accs4[0]+accs5[0] + (sets[2] > 3 ? atkSetBonus : 0)) * bonusMaxAtk);
        final float hp =   ((bonusBaseHp   + accs0[1]+accs1[1]+accs2[1]+accs3[1]+accs4[1]+accs5[1] + (sets[0] > 1 ? sets[0] / 2 * hpSetBonus : 0)) * bonusMaxHp);
        final float def =  ((bonusBaseDef  + accs0[2]+accs1[2]+accs2[2]+accs3[2]+accs4[2]+accs5[2] + (sets[1] > 1 ? sets[1] / 2 * defSetBonus : 0)) * bonusMaxDef);
        final float cr =         (base.cr  + accs0[6]+accs1[6]+accs2[6]+accs3[6]+accs4[6]+accs5[6] + (sets[4] > 1 ? sets[4] / 2 * 12 : 0) + hero.bonusCr + hero.aeiCr);
        final int cd =   (int) (base.cd    + accs0[7]+accs1[7]+accs2[7]+accs3[7]+accs4[7]+accs5[7] + (sets[6] > 3 ? 40 : 0) + hero.bonusCd + hero.aeiCd);
        final int eff =  (int) (base.eff   + accs0[8]+accs1[8]+accs2[8]+accs3[8]+accs4[8]+accs5[8] + (sets[5] > 1 ? sets[5] / 2 * 20 : 0) + hero.bonusEff + hero.aeiEff);
        final int res =  (int) (base.res   + accs0[9]+accs1[9]+accs2[9]+accs3[9]+accs4[9]+accs5[9] + (sets[9] > 1 ? sets[9] / 2 * 20 : 0) + hero.bonusRes + hero.aeiRes);
        final int spd =  (int) (base.spd   + accs0[10]+accs1[10]+accs2[10]+accs3[10]+accs4[10]+accs5[10] + (sets[3] > 3 ? speedSetBonus : 0) + (sets[14] > 3 ? revengeSetBonus : 0) + hero.bonusSpeed + hero.aeiSpeed);

//        final int atk = (int) (((base.atk + mapAccumulatorArrsToFloat(0, accs)  + (sets[2] > 1 ? sets[2] / 4 * 0.35f * base.atk : 0) + base.atk * hero.bonusAtkPercent / 100f) + hero.bonusAtk) * (1 + base.bonusMaxAtkPercent/100f));
//        final int hp = (int) (((base.hp   + mapAccumulatorArrsToFloat(1, accs)  + (sets[0] > 1 ? sets[0] / 2 * 0.15f * base.hp : 0) + base.hp * hero.bonusHpPercent / 100f) + hero.bonusHp) * (1 + base.bonusMaxHpPercent/100f));
//        final int def = (int) (((base.def + mapAccumulatorArrsToFloat(2, accs)  + (sets[1] > 1 ? sets[1] / 2 * 0.15f * base.def : 0) + base.def * hero.bonusDefPercent / 100f) + hero.bonusDef) * (1 + base.bonusMaxDefPercent/100f));
//        final float cr = (base.cr + mapAccumulatorArrsToFloat(6, accs)  + (sets[4] > 1 ? sets[4] / 2 * 12 : 0)) + hero.bonusCr;
//        final int cd = (int) (base.cd   + mapAccumulatorArrsToFloat(7, accs)  + (sets[6] > 1 ? sets[6] / 4 * 40 : 0)) + (int) hero.bonusCd;
//        final int eff = (int) (base.eff + mapAccumulatorArrsToFloat(8, accs)  + (sets[5] > 1 ? sets[5] / 2 * 20 : 0)) + (int) hero.bonusEff;
//        final int res = (int) (base.res + mapAccumulatorArrsToFloat(9, accs)  + (sets[9] > 1 ? sets[9] / 2 * 20 : 0)) + (int) hero.bonusRes;
//        final int spd = (int) (base.spd + mapAccumulatorArrsToFloat(10, accs) + (sets[3] > 1 ? sets[3] / 4 * 0.25f * base.spd : 0) + (sets[14] > 1 ? sets[14] / 4 * 0.1f * base.spd : 0)) + hero.bonusSpeed;

        //        int dac = base.getDac() + sets[10] / 2 * 4;

        final float critRate;
        if (cr > 100) {
            critRate = 1;
        } else {
            critRate = cr / 100f;
        }

        final float critDamage;
        if (cd > 350) {
            critDamage = 3.5f;
        } else {
            critDamage = cd / 100f;
        }

        final int cp = (int) (((atk * 1.6f + atk * 1.6f * critRate * critDamage) * (1.0 + (spd - 45f) * 0.02f) + hp + def * 9.3f) * (1f + (res/100f + eff/100f) / 4f));

        final float rageMultiplier = SETTING_RAGE_SET && sets[11] > 3 ? 1.3f : 1;
        final float spdDiv1000 = (float)spd/1000;

        final int ehp = (int) (hp * (def/300 + 1));
        final int hpps = (int) (hp*spdDiv1000);
        final int ehpps = (int) ((float)ehp*spdDiv1000);
        final int dmg = (int) (((critRate * atk * critDamage) + (1-critRate) * atk) * rageMultiplier);
        final int dmgps = (int) ((float)dmg*spdDiv1000);
        final int mcdmg = (int) (atk * critDamage * rageMultiplier);
        final int mcdmgps = (int) ((float)mcdmg*spdDiv1000);
        final int dmgh = (int) ((cd * hp)/1000);

        final int score = (int) (accs0[11]+accs1[11]+accs2[11]+accs3[11]+accs4[11]+accs5[11]);

        return new HeroStats((int)atk, (int)hp, (int)def, (int) cr, cd, eff, res, 0, spd, cp, ehp, hpps, ehpps, dmg, dmgps, mcdmg, mcdmgps, dmgh, upgrades, conversions, score, priority,
                base.bonusMaxAtkPercent, base.bonusMaxDefPercent, base.bonusMaxHpPercent, sets, null, null, null, null, null, null);
    }

    public static float[] getStatAccumulatorArr(final HeroStats base,
                                                final Item item,
                                                final Map<String, float[]> accumulatorsByItemId,
                                                final boolean useReforgeStats) {
        if (accumulatorsByItemId.containsKey(item.modId)) {
            return accumulatorsByItemId.get(item.modId);
        }

        final float[] accumulator = buildStatAccumulatorArr(base, item, useReforgeStats);
        accumulatorsByItemId.put(item.getModId(), accumulator);
        return accumulator;
    }

    public static float[] buildStatAccumulatorArr(final HeroStats base, final Item item, final boolean useReforgeStats) {
        final AugmentedStats stats;
        if (useReforgeStats) {
            stats = item.getReforgedStats();
        } else {
            stats = item.getAugmentedStats();
        }

        final float[] statAccumulatorArr = new float[15];

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
        final int mainTypeIndex = mainType.getIndex();

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

        // Add scores
        statAccumulatorArr[11] += useReforgeStats ? item.getReforgedWss() : item.getWss();

        return statAccumulatorArr;
    }

    public static int[] buildSetsArr(final Item[] items) {
        final int[] sets = new int[16];
        sets[items[0].set.index]++;
        sets[items[1].set.index]++;
        sets[items[2].set.index]++;
        sets[items[3].set.index]++;
        sets[items[4].set.index]++;
        sets[items[5].set.index]++;
        return sets;
    }
}
