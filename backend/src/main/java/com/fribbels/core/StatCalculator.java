package com.fribbels.core;

import java.util.Map;

import com.fribbels.enums.StatType;
import com.fribbels.handler.OptimizationRequestHandler;
import com.fribbels.model.AugmentedStats;
import com.fribbels.model.DamageMultipliers;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;

public class StatCalculator {

    private static boolean settingRageSet = true;
    private static boolean settingPenSet = true;
    private static int settingPenDefense = 1500;
    
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

    public static boolean isSettingRageSet() {
        return StatCalculator.settingRageSet;
    }
    public static void setSettingRageSet(final boolean settingRageSet) {
        StatCalculator.settingRageSet = settingRageSet;
    }
    public static boolean isSettingPenSet() {
        return StatCalculator.settingPenSet;
    }
    public static void setSettingPenSet(final boolean settingPenSet) {
        StatCalculator.settingPenSet = settingPenSet;
    }
    public static int getSettingPenDefense() {
        return StatCalculator.settingPenDefense;
    }

    public static void setSettingPenDefense(final int settingPenDefense) {
        StatCalculator.settingPenDefense = settingPenDefense;
    }

    public void setBaseValues(final HeroStats base, final Hero hero) {
        this.atkSetBonus = 0.45f * base.getAtk();
        this.hpSetBonus = 0.20f * base.getHp();
        this.defSetBonus = 0.20f * base.getDef();

        this.speedSetBonus = 0.25f * base.getSpd();
        this.revengeSetBonus = 0.12f * base.getSpd();

        this.bonusBaseAtk = base.getAtk() + base.getAtk() * (hero.getBonusAtkPercent() + hero.getAeiAtkPercent()) / 100f + hero.getBonusAtk()
                + hero.getAeiAtk();
        this.bonusBaseHp = base.getHp() + base.getHp() * (hero.getBonusHpPercent() + hero.getAeiHpPercent()) / 100f + hero.getBonusHp() + hero.getAeiHp();
        this.bonusBaseDef = base.getDef() + base.getDef() * (hero.getBonusDefPercent() + hero.getAeiDefPercent()) / 100f + hero.getBonusDef()
                + hero.getAeiDef();

        if (base.getBonusStats() == null) {
            this.bonusMaxAtk = 1 + hero.getFinalAtkMultiplier() / 100;
            this.bonusMaxHp = 1 + hero.getFinalHpMultiplier() / 100;
            this.bonusMaxDef = 1 + hero.getFinalDefMultiplier() / 100;
        } else {
            this.bonusMaxAtk = 1 + base.getBonusStats().getBonusMaxAtkPercent() / 100f + hero.getFinalAtkMultiplier() / 100;
            this.bonusMaxHp = 1 + base.getBonusStats().getBonusMaxHpPercent() / 100f + hero.getFinalHpMultiplier() / 100;
            this.bonusMaxDef = 1 + base.getBonusStats().getBonusMaxDefPercent() / 100f + hero.getFinalDefMultiplier() / 100;
        }

        this.penSetDmgBonus = (StatCalculator.settingPenDefense / 300f + 1) / (0.00283333f * StatCalculator.settingPenDefense + 1);
    }

    public float[] getNewStatAccumulatorArr(final HeroStats base, final Item item, final boolean useReforgeStats) {
        final float[] accumulator = this.buildStatAccumulatorArr(base, item, useReforgeStats);
        item.setTempStatAccArr(accumulator);
        return accumulator;
    }

    public HeroStats addAccumulatorArrsToHero(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero, final int upgrades, final int conversions, final int alreadyEquipped, final int priority) {
        final float atk = this.calculateAtk(accs, sets);
        final float hp = this.calculateHp(accs, sets);
        final float def = this.calculateDef(accs, sets);
        final float cr = this.calculateCr(base, accs, sets, hero);
        final int cd = (int) this.calculateCd(base, accs, sets, hero);
        final int eff = (int) this.calculateEff(base, accs, sets, hero);
        final int res = (int) this.calculateRes(base, accs, sets, hero);
        final int spd = (int) this.calculateSpd(base, accs, sets, hero);

        final float critRate = Math.min(cr, 100f) / 100f;
        final float critDamage = Math.min(cd, 350f) / 100f;        

        final int cp = (int) this.calculateCp(atk, hp, def, spd, critRate, critDamage, eff, res);

        final float penSetOn = sets[13] > 1 ? 1 : 0;
        final float rageMultiplier = StatCalculator.settingRageSet && sets[11] > 3 ? 0.3f : 0;
        final float penMultiplier = StatCalculator.settingPenSet && sets[13] > 1 ? this.penSetDmgBonus : 1;
        final float torrentMultiplier = sets[17] > 1 ? sets[17] / 2f * 0.1f : 0;
        final float pctDmgMultiplier = 1 + rageMultiplier + torrentMultiplier;

        final int ehp = this.calculateEhp(hp, def);
        final int hpps = this.calculateHpps(hp, spd);
        final int ehpps = this.calculateEhpps(ehp, spd);
        final int dmg = this.calculateDmg(atk, critRate, critDamage, penMultiplier, pctDmgMultiplier);
        final int dmgps = this.calculateDmgps(dmg, spd);
        final int mcdmg = this.calculateMcdmg(atk, critDamage, penMultiplier, pctDmgMultiplier);
        final int mcdmgps = this.calculateMcdmgps(mcdmg, spd);
        final int dmgh = this.calculateDmgh(hp, critDamage, penMultiplier, pctDmgMultiplier);
        final int dmgd = this.calculateDmgd(def, critDamage, penMultiplier, pctDmgMultiplier);
        /*
         * 
         * (increase dmg) * [(atk + bonus atk) * (pow * multi) * (cdmg)]
         * 
         * {[(ATK !!)(Atkmod)(Rate **)+(FlatMod)] * (1.871)+(Flat2Mod)} × (pow **)(a) +
         * 
         * a = (EnhanceMod)(HitTypeMod)(ElementMod)(DamageUpMod)(TargetDebuffMod)
         * rate -> scaling
         * flatmod -> max hp/def scaling
         * flat2mod -> ddj
         * 
         */
        DamageMultipliers multis = hero.getDamageMultipliers();
        if (multis == null) {
            multis = new DamageMultipliers();
        }

        final int s1 = this.getSkillValue(multis, 0, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
        final int s2 = this.getSkillValue(multis, 1, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
        final int s3 = this.getSkillValue(multis, 2, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);

        final int score = (int) this.sumStatAtIndex(accs, 11);

        final float bsHp = (hp - base.getHp() - hero.getArtifactHealth() - (sets[0] > 1 ? sets[0] / 2f * this.hpSetBonus : 0) + (sets[17] > 1 ? sets[17] / 2f * this.hpSetBonus / 2 : 0)) / base.getHp() * 100;
        final float bsAtk = (atk - base.getAtk() - hero.getArtifactAttack() - (sets[2] > 1 ? sets[2] / 4f * this.atkSetBonus : 0)) / base.getAtk() * 100;
        final float bsDef = (def - base.getDef() - (sets[1] > 1 ? sets[1] / 2f * this.defSetBonus : 0)) / base.getDef() * 100;
        final float bsCr = (cr - base.getCr() - (sets[4] > 1 ? sets[4] / 2f * 12 : 0));
        final float bsCd = (cd - base.getCd() - (sets[6] > 3 ? 60 : 0));
        final float bsEff = (eff - base.getEff() - (sets[5] > 1 ? sets[5] / 2 * 20 : 0));
        final float bsRes = (res - base.getRes() - (sets[9] > 1 ? sets[9] / 2 * 20 : 0));
        final float bsSpd = (spd - base.getSpd() - (sets[3] > 3 ? this.speedSetBonus : 0) - (sets[14] > 3 ? this.revengeSetBonus : 0));

        // hp: (row.hp - base.getHp() - artiHp - bonusSetMaxHp/100*base.getHp() -
        // bonusSetTorrent/100*base.getHp()) / base.getHp() * 100,
        // atk: (row.atk - base.getAtk() - artiAtk - bonusSetAtt/100*base.getAtk()) / base.getAtk() *
        // 100,
        // def: (row.def - base.getDef() - bonusSetDef/100*base.getDef()) / base.getDef() * 100,
        // chc: (Math.min(100, row.chc) - base.chc*100 - bonusSetCri),
        // chd: (Math.min(350, row.chd) - base.chd*100 - bonusSetCriDmg),
        // eff: (row.eff - base.getEff()*100 - bonusSetAcc),
        // res: (row.efr - base.efr*100 - bonusSetRes),
        // spd: (row.spd - base.getSpd() - bonusSetSpeed - bonusSetRevenge),

        final int bs = (int) (bsHp + bsAtk + bsDef + bsCr * 1.6f + bsCd * 1.14f + bsEff + bsRes + bsSpd * 2);

        return new HeroStats((int) atk, (int) hp, (int) def, (int) cr, cd, eff, res, 0, spd, cp, ehp, hpps, ehpps, dmg,
                dmgps, mcdmg, mcdmgps, dmgh, dmgd, s1, s2, s3, upgrades, conversions, alreadyEquipped, score, bs,
                priority, base.getBonusStats(), null, null, null, null, null, null, null);
    }

    public float[] getStatAccumulatorArr(final HeroStats base, final Item item, final Map<String, float[]> accumulatorsByItemId, final boolean useReforgeStats) {
        if (accumulatorsByItemId.containsKey(item.getModId())) {
            return accumulatorsByItemId.get(item.getModId());
        }

        final float[] accumulator = this.buildStatAccumulatorArr(base, item, useReforgeStats);
        accumulatorsByItemId.put(item.getModId(), accumulator);
        return accumulator;
    }

    public float[] buildStatAccumulatorArr(final HeroStats base, final Item item, final boolean useReforgeStats) {
        final AugmentedStats stats = useReforgeStats ? item.getReforgedStats() : item.getAugmentedStats();

        final float[] statAccumulatorArr = new float[15];

        // Add base
        statAccumulatorArr[0] += stats.getAttack() + stats.getAttackPercent() / 100f * base.getAtk();
        statAccumulatorArr[1] += stats.getHealth() + stats.getHealthPercent() / 100f * base.getHp();
        statAccumulatorArr[2] += stats.getDefense() + stats.getDefensePercent() / 100f * base.getDef();

        statAccumulatorArr[10] += stats.getSpeed();
        statAccumulatorArr[6] += stats.getCritRate();
        statAccumulatorArr[7] += stats.getCritDamage();
        statAccumulatorArr[8] += stats.getEffectiveness();
        statAccumulatorArr[9] += stats.getEffectResistance();

        final StatType mainType = stats.getMainType();
        final int mainTypeIndex = mainType.getIndex();

        // Add percents
        if (mainTypeIndex == 3) {
            statAccumulatorArr[0] += stats.getMainValue() / 100f * base.getAtk();
        } else if (mainType == StatType.HEALTHPERCENT) {
            statAccumulatorArr[1] += stats.getMainValue() / 100f * base.getHp();
        } else if (mainType == StatType.DEFENSEPERCENT) {
            statAccumulatorArr[2] += stats.getMainValue() / 100f * base.getDef();
        } else {
            statAccumulatorArr[mainTypeIndex] += stats.getMainValue();
        }

        // Add scores
        statAccumulatorArr[11] += useReforgeStats ? item.getReforgedWss() : item.getWss();

        return statAccumulatorArr;
    }
    

    public int[] buildSetsArr(final Item[] items) {
        final int[] sets = new int[OptimizationRequestHandler.SET_COUNT];
        sets[items[0].getSet().getIndex()]++;
        sets[items[1].getSet().getIndex()]++;
        sets[items[2].getSet().getIndex()]++;
        sets[items[3].getSet().getIndex()]++;
        sets[items[4].getSet().getIndex()]++;
        sets[items[5].getSet().getIndex()]++;
        return sets;
    }

    private float sumStatAtIndex(final float[][] accs, final int index) {
        float sum = 0;
        for (final float[] acc : accs) {
            sum += acc[index];
        }
        return sum;
    }

    private int calculateEhp(final float hp, final float def) {
        return (int) (hp * (def / 300 + 1));
    }

    private int calculateHpps(final float hp, final float spd) {
        return (int) (hp * (spd / 1000));
    }

    private int calculateEhpps(final int ehp, final float spd) {
        return (int) (ehp * (spd / 1000));
    }

    private int calculateDmg(final float atk, final float critRate, final float critDamage, final float penMultiplier, final float pctDmgMultiplier) {
        return (int) (((critRate * atk * critDamage) + (1 - critRate) * atk) * penMultiplier * pctDmgMultiplier);
    }

    private int calculateDmgps(final int dmg, final float spd) {
        return (int) (dmg * (spd / 1000));
    }

    private int calculateMcdmg(final float atk, final float critDamage, final float penMultiplier, final float pctDmgMultiplier) {
        return (int) (atk * critDamage * penMultiplier * pctDmgMultiplier);
    }

    private int calculateMcdmgps(final int mcdmg, final float spd) {
        return (int) (mcdmg * (spd / 1000));
    }

    private int calculateDmgh(final float hp, final float critDamage, final float penMultiplier, final float pctDmgMultiplier) {
        return (int) ((critDamage * hp) / 10 * penMultiplier * pctDmgMultiplier);
    }

    private int calculateDmgd(final float def, final float critDamage, final float penMultiplier, final float pctDmgMultiplier) {
        return (int) ((critDamage * def) * penMultiplier * pctDmgMultiplier);
    }

    private int getSkillValue(final DamageMultipliers m, final int s, final float atk, final float def, final float hp, final float spd, final float critDamage, final float pctDmgMultiplier, final float penSetOn) {
        final int targets = m.getTargets()[s] == 1 ? 1 : 0;
        final float realPenetration = (1 - m.getPenetration()[s]) * (1 - penSetOn * 0.15f * targets);
        final float statScalings = m.getSelfHpScaling()[s] * hp + m.getSelfAtkScaling()[s] * atk + m.getSelfDefScaling()[s] * def + m.getSelfSpdScaling()[s] * spd;
        final float hitTypeMultis = m.getCrit()[s] * (critDamage + m.getCdmgIncrease()[s]) + m.getHitMulti()[s];
        final float increasedValue = 1 + m.getIncreasedValue()[s];
        final float dmgUpMod = 1 + m.getSelfSpdScaling()[s] * spd;
        final float extraDamage = (m.getExtraSelfHpScaling()[s] * hp + m.getExtraSelfAtkScaling()[s] * atk + m.getExtraSelfDefScaling()[s] * def) * 1.871f * 1f / (StatCalculator.settingPenDefense * 0.3f / 300f + 1f);
        final float offensive = (atk * m.getRate()[s] + statScalings) * 1.871f * m.getPow()[s] * increasedValue * hitTypeMultis * dmgUpMod * pctDmgMultiplier;
        final float support = m.getSelfHpScaling()[s] * hp * m.getSupport()[s] + m.getSelfAtkScaling()[s] * atk * m.getSupport()[s] + m.getSelfDefScaling()[s] * def * m.getSupport()[s];
        final float defensive = 1f / (StatCalculator.settingPenDefense * Math.max(0, realPenetration) / 300f + 1f);
        return (int) (offensive * defensive + support + extraDamage);
    }
    
    private float calculateAtk(final float[][] accs, final int[] sets) {
        return (this.bonusBaseAtk + this.sumStatAtIndex(accs, 0) + (sets[2] > 3 ? this.atkSetBonus : 0)) * this.bonusMaxAtk;
    }

    private float calculateHp(final float[][] accs, final int[] sets) {
        return (this.bonusBaseHp + this.sumStatAtIndex(accs, 1) + (sets[0] > 1 ? sets[0] / 2f * this.hpSetBonus : 0) + (sets[17] > 1 ? sets[17] / 2f * this.hpSetBonus / -2 : 0)) * this.bonusMaxHp;
    }

    private float calculateDef(final float[][] accs, final int[] sets) {
        return (this.bonusBaseDef + this.sumStatAtIndex(accs, 2) + (sets[1] > 1 ? sets[1] / 2f * this.defSetBonus : 0)) * this.bonusMaxDef;
    }

    private float calculateCr(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero) {
        return (base.getCr() + this.sumStatAtIndex(accs, 6) + (sets[4] > 1 ? sets[4] / 2f * 12 : 0) + hero.getBonusCr() + hero.getAeiCr());
    }

    private float calculateCd(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero) {
        return (base.getCd() + this.sumStatAtIndex(accs, 7) + (sets[6] > 3 ? 60 : 0) + hero.getBonusCd() + hero.getAeiCd());
    }

    private float calculateEff(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero) {
        return (base.getEff() + this.sumStatAtIndex(accs, 8) + (sets[5] > 1 ? sets[5] / 2f * 20 : 0) + hero.getBonusEff() + hero.getAeiEff());
    }

    private float calculateRes(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero) {
        return (base.getRes() + this.sumStatAtIndex(accs, 9) + (sets[9] > 1 ? sets[9] / 2f * 20 : 0) + hero.getBonusRes() + hero.getAeiRes());
    }

    private float calculateSpd(final HeroStats base, final float[][] accs, final int[] sets, final Hero hero) {
        return (base.getSpd() + this.sumStatAtIndex(accs, 10) + (sets[3] > 3 ? this.speedSetBonus : 0) + (sets[14] > 3 ? this.revengeSetBonus : 0) + hero.getBonusSpeed() + hero.getAeiSpeed());
    }

    private float calculateCp(final float atk, final float hp, final float def, final float spd, final float cr, final float cd, final float eff, final float res) {
        return (int) (((atk * 1.6f + atk * 1.6f * cr * cd) * (1.0 + (spd - 45f) * 0.02f) + hp + def * 9.3f) * (1f + (res / 100f + eff / 100f) / 4f));
    }
}
