package com.fribbels.core;

import com.fribbels.enums.StatType;
import com.fribbels.model.*;

import java.util.Map;

import static com.fribbels.handler.OptimizationRequestHandler.SET_COUNT;

public class StatCalculator {

    public static boolean SETTING_RAGE_SET = true;
    public static boolean SETTING_PEN_SET = true;
    public static int SETTING_PEN_DEFENSE = 1500;

    private float atkSetBonus;
    private float hpSetBonus;
    private float defSetBonus;
    private float speedSetBonus;
    private float revengeSetBonus;

    private float bonusBaseAtk;
    private float bonusBaseHp;
    private float bonusBaseDef;

    private float bonusMaxAtk;
    private float bonusMaxHp;
    private float bonusMaxDef;

    private float penSetDmgBonus;

    public StatCalculator() {

    }

    public void setBaseValues(final HeroStats base, final Hero hero) {
        atkSetBonus = 0.45f * base.atk;
        hpSetBonus = 0.20f * base.hp;
        defSetBonus = 0.20f * base.def;

        speedSetBonus = 0.25f * base.spd;
        revengeSetBonus = 0.12f * base.spd;

        bonusBaseAtk = base.atk + base.atk * (hero.bonusAtkPercent + hero.aeiAtkPercent) / 100f + hero.bonusAtk + hero.aeiAtk;
        bonusBaseHp = base.hp + base.hp * (hero.bonusHpPercent + hero.aeiHpPercent) / 100f + hero.bonusHp + hero.aeiHp;
        bonusBaseDef = base.def + base.def * (hero.bonusDefPercent + hero.aeiDefPercent) / 100f + hero.bonusDef + hero.aeiDef;

        if (base.bonusStats == null) {
            bonusMaxAtk = 1 + hero.finalAtkMultiplier / 100;
            bonusMaxHp = 1 + hero.finalHpMultiplier / 100;
            bonusMaxDef = 1 + hero.finalDefMultiplier / 100;
        } else {
            bonusMaxAtk = 1 + base.bonusStats.bonusMaxAtkPercent/100f + hero.finalAtkMultiplier / 100;
            bonusMaxHp = 1 + base.bonusStats.bonusMaxHpPercent/100f + hero.finalHpMultiplier / 100;
            bonusMaxDef = 1 + base.bonusStats.bonusMaxDefPercent/100f + hero.finalDefMultiplier / 100;
        }

        penSetDmgBonus = (SETTING_PEN_DEFENSE/300f + 1) / (0.00283333f * SETTING_PEN_DEFENSE + 1);
    }

    public float[] getNewStatAccumulatorArr(final HeroStats base,
                                            final Item item,
                                            final Map<String, float[]> accumulatorsByItemId,
                                            final boolean useReforgeStats) {

        final float[] accumulator = buildStatAccumulatorArr(base, item, useReforgeStats);
        item.tempStatAccArr = accumulator;
        return accumulator;
    }

    public HeroStats addAccumulatorArrsToHero(final HeroStats base,
                                                     final float[][] accs,
                                                     final int[] sets,
                                                     final Hero hero,
                                                     final int upgrades,
                                                     final int conversions,
                                                     final int alreadyEquipped,
                                                     final int priority) {
        final float[] accs0 = accs[0];
        final float[] accs1 = accs[1];
        final float[] accs2 = accs[2];
        final float[] accs3 = accs[3];
        final float[] accs4 = accs[4];
        final float[] accs5 = accs[5];

        final float atk =  ((bonusBaseAtk  + accs0[0]+accs1[0]+accs2[0]+accs3[0]+accs4[0]+accs5[0] + (sets[2] > 3 ? atkSetBonus : 0)) * bonusMaxAtk);
        final float hp =   ((bonusBaseHp   + accs0[1]+accs1[1]+accs2[1]+accs3[1]+accs4[1]+accs5[1] + (sets[0] > 1 ? sets[0] / 2 * hpSetBonus : 0) + (sets[17] > 1 ? sets[17] / 2 * hpSetBonus/-2 : 0)) * bonusMaxHp);
        final float def =  ((bonusBaseDef  + accs0[2]+accs1[2]+accs2[2]+accs3[2]+accs4[2]+accs5[2] + (sets[1] > 1 ? sets[1] / 2 * defSetBonus : 0)) * bonusMaxDef);
        final float cr =         (base.cr  + accs0[6]+accs1[6]+accs2[6]+accs3[6]+accs4[6]+accs5[6] + (sets[4] > 1 ? sets[4] / 2 * 12 : 0) + hero.bonusCr + hero.aeiCr);
        final int cd =   (int) (base.cd    + accs0[7]+accs1[7]+accs2[7]+accs3[7]+accs4[7]+accs5[7] + (sets[6] > 3 ? 60 : 0) + hero.bonusCd + hero.aeiCd);
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

        final float penSetOn = sets[13] > 1 ? 1 : 0;
        final float rageMultiplier = SETTING_RAGE_SET && sets[11] > 3 ? 0.3f : 0;
        final float penMultiplier = SETTING_PEN_SET && sets[13] > 1 ? penSetDmgBonus : 1;
        final float torrentMultiplier = sets[17] > 1 ? sets[17] / 2 * 0.1f : 0;
        final float spdDiv1000 = (float)spd/1000;
        final float pctDmgMultiplier = 1 + rageMultiplier + torrentMultiplier;

        final int ehp = (int) (hp * (def/300 + 1));
        final int hpps = (int) (hp*spdDiv1000);
        final int ehpps = (int) ((float)ehp*spdDiv1000);
        final int dmg = (int) (((critRate * atk * critDamage) + (1-critRate) * atk) * penMultiplier * pctDmgMultiplier);
        final int dmgps = (int) ((float)dmg*spdDiv1000);
        final int mcdmg = (int) (atk * critDamage * penMultiplier * pctDmgMultiplier);
        final int mcdmgps = (int) ((float)mcdmg*spdDiv1000);
        final int dmgh = (int) ((critDamage * hp)/10 * penMultiplier * pctDmgMultiplier);
        final int dmgd = (int) ((critDamage * def) * penMultiplier * pctDmgMultiplier);
/*

(increase dmg) * [(atk + bonus atk) * (pow * multi) * (cdmg)]

{[(ATK !!)(Atkmod)(Rate **)+(FlatMod)] * (1.871)+(Flat2Mod)} × (pow **)(a) +

a = (EnhanceMod)(HitTypeMod)(ElementMod)(DamageUpMod)(TargetDebuffMod)
rate -> scaling
flatmod -> max hp/def scaling
flat2mod -> ddj

 */
        DamageMultipliers multis = hero.getDamageMultipliers();
        if (multis == null) {
            multis = new DamageMultipliers();
        }
//        final int s1 = (int)(((atk * multis.getAtkMods()[0] * multis.getRates()[0] + getFlatMod(multis, 0, hp)) * getTypeMultiplier(multis, 0)) * multis.getPows()[0] * multis.getMultis()[0]);
//        final int s2 = (int)(((atk * multis.getAtkMods()[1] * multis.getRates()[1] + getFlatMod(multis, 1, hp)) * getTypeMultiplier(multis, 1)) * multis.getPows()[1] * multis.getMultis()[1]);
//        final int s3 = (int)(((atk * multis.getAtkMods()[2] * multis.getRates()[2] + getFlatMod(multis, 2, hp)) * getTypeMultiplier(multis, 2)) * multis.getPows()[2] * multis.getMultis()[2]);
        // (1 + multis.getAtkIncrease()[0])

        final int s1 = getSkillValue(multis, 0, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
        final int s2 = getSkillValue(multis, 1, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
        final int s3 = getSkillValue(multis, 2, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
//
        final int score = (int) (accs0[11]+accs1[11]+accs2[11]+accs3[11]+accs4[11]+accs5[11]);

//        final ArtifactStats artifactStats = Main.artifactStatsDb.getArtifactStats(hero.artifactName, Integer.parseInt(hero.getArtifactLevel()));
//        final float artifactHealth = artifactStats.getHealth();
//        final float artifactAttack = artifactStats.getAttack();

        final float bsHp = (hp - base.hp - hero.artifactHealth - (sets[0] > 1 ? sets[0] / 2 * hpSetBonus : 0) + (sets[17] > 1 ? sets[17] / 2 * hpSetBonus/2 : 0)) / base.hp * 100;
        final float bsAtk = (atk - base.atk - hero.artifactAttack - (sets[2] > 1 ? sets[2] / 4 * atkSetBonus : 0)) / base.atk * 100;
        final float bsDef = (def - base.def - (sets[1] > 1 ? sets[1] / 2 * defSetBonus : 0)) / base.def * 100;
        final float bsCr = (cr - base.cr - (sets[4] > 1 ? sets[4] / 2 * 12 : 0));
        final float bsCd = (cd - base.cd - (sets[6] > 3 ? 60 : 0));
        final float bsEff = (eff - base.eff - (sets[5] > 1 ? sets[5] / 2 * 20 : 0));
        final float bsRes = (res - base.res - (sets[9] > 1 ? sets[9] / 2 * 20 : 0));
        final float bsSpd = (spd - base.spd - (sets[3] > 3 ? speedSetBonus : 0) - (sets[14] > 3 ? revengeSetBonus : 0));

//        hp: (row.hp - base.hp - artiHp - bonusSetMaxHp/100*base.hp - bonusSetTorrent/100*base.hp) / base.hp * 100,
//                atk: (row.atk - base.atk - artiAtk - bonusSetAtt/100*base.atk) / base.atk * 100,
//                def: (row.def - base.def - bonusSetDef/100*base.def) / base.def * 100,
//                chc: (Math.min(100, row.chc) - base.chc*100 - bonusSetCri),
//                chd: (Math.min(350, row.chd) - base.chd*100 - bonusSetCriDmg),
//                eff: (row.eff - base.eff*100 - bonusSetAcc),
//                res: (row.efr - base.efr*100 - bonusSetRes),
//                spd: (row.spd - base.spd - bonusSetSpeed - bonusSetRevenge),

        final int bs = (int) (bsHp + bsAtk + bsDef + bsCr*1.6f + bsCd*1.14f + bsEff + bsRes + bsSpd*2);

        return new HeroStats((int)atk, (int)hp, (int)def, (int) cr, cd, eff, res, 0, spd, cp, ehp, hpps, ehpps,
                dmg, dmgps, mcdmg, mcdmgps, dmgh, dmgd, s1, s2, s3, upgrades, conversions, alreadyEquipped, score, bs, priority,
                base.bonusStats, null, null, null, null, null, null, null);
    }

    private int getSkillValue(final DamageMultipliers m,
                              final int s,
                              final float atk,
                              final float def,
                              final float hp,
                              final float spd,
                              final float critDamage,
                              final float pctDmgMultiplier,
                              final float penSetOn) {
        final int targets = m.getTargets()[s] == 1 ? 1 : 0;
        final float realPenetration = (1 - m.getPenetration()[s]) * (1 - penSetOn * 0.15f * targets);
        final float statScalings =
                        m.getSelfHpScaling()[s] *hp +
                        m.getSelfAtkScaling()[s]*atk +
                        m.getSelfDefScaling()[s]*def +
                        m.getSelfSpdScaling()[s]*spd;
        final float hitTypeMultis = m.getCrit()[s] * (critDamage+m.getCdmgIncrease()[s]) + m.getHitMulti()[s];
        final float increasedValue = 1 + m.getIncreasedValue()[s];
        final float dmgUpMod = 1 + m.getSelfSpdScaling()[s] * spd;
        final float extraDamage = (
                        m.getExtraSelfHpScaling()[s] *hp +
                        m.getExtraSelfAtkScaling()[s]*atk +
                        m.getExtraSelfDefScaling()[s]*def) * 1.871f * 1f/(StatCalculator.SETTING_PEN_DEFENSE*0.3f/300f + 1f);
        final float offensive = (atk * m.getRate()[s] + statScalings) * 1.871f * m.getPow()[s] * increasedValue * hitTypeMultis * dmgUpMod * pctDmgMultiplier;
        final float support = m.getSelfHpScaling()[s] * hp * m.getSupport()[s] + m.getSelfAtkScaling()[s] * atk * m.getSupport()[s] + m.getSelfDefScaling()[s] * def * m.getSupport()[s];
        final float defensive = 1f/(StatCalculator.SETTING_PEN_DEFENSE*Math.max(0, realPenetration)/300f + 1f);
        final int value = (int)(offensive * defensive + support + extraDamage);

//        System.out.println("S" + (s+1) + " " + value + " " + (hitTypeMultis) + " " + (1.871f * m.getPow()[s]));
//        System.out.println(m);

        return value;
    }

    private float getFlatMod(final DamageMultipliers damageMultipliers, final int skill, final float hp) {
        float value = 0;
//        if (damageMultipliers.getSelfHpScalings()[skill] != 0) {
//            value += damageMultipliers.getSelfHpScalings()[skill] * hp;
//        }

        return value;
    }

    public float[] getStatAccumulatorArr(final HeroStats base,
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

    public float[] buildStatAccumulatorArr(final HeroStats base, final Item item, final boolean useReforgeStats) {
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

    public int[] buildSetsArr(final Item[] items) {
        final int[] sets = new int[SET_COUNT];
        sets[items[0].set.index]++;
        sets[items[1].set.index]++;
        sets[items[2].set.index]++;
        sets[items[3].set.index]++;
        sets[items[4].set.index]++;
        sets[items[5].set.index]++;
        return sets;
    }
}
