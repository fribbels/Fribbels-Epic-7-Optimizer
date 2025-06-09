package com.fribbels.gpu;

import com.aparapi.Kernel;
import com.fribbels.model.DamageMultipliers;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.request.OptimizationRequest;
import lombok.Setter;

@Setter
public class GpuOptimizerKernel extends Kernel {

    @Constant final float[] flattenedWeaponAccs;
    @Constant final float[] flattenedHelmetAccs;
    @Constant final float[] flattenedArmorAccs;
    @Constant final float[] flattenedNecklaceAccs;
    @Constant final float[] flattenedRingAccs;
    @Constant final float[] flattenedBootAccs;

    @Constant final long wSize;
    @Constant final long hSize;
    @Constant final long aSize;
    @Constant final long nSize;
    @Constant final long rSize;
    @Constant final long bSize;

    @Constant final long argSize;

    @Constant final float bonusBaseAtk;
    @Constant final float bonusBaseHp;
    @Constant final float bonusBaseDef;

    @Constant final float atkSetBonus;
    @Constant final float hpSetBonus;
    @Constant final float defSetBonus;
    @Constant final float speedSetBonus;
    @Constant final float revengeSetBonus;
    @Constant final float penSetDmgBonus;

    @Constant final float targetDefense;

    @Constant final float bonusMaxAtk;
    @Constant final float bonusMaxHp;
    @Constant final float bonusMaxDef;

    @Constant final int SETTING_RAGE_SET;
    @Constant final int SETTING_PEN_SET;

    @Constant final float baseAtk;
    @Constant final float baseHp;
    @Constant final float baseDef;
    @Constant final float baseCr;
    @Constant final float baseCd;
    @Constant final float baseEff;
    @Constant final float baseRes;
    @Constant final float baseSpeed;

    @Constant final float bonusCr;
    @Constant final float bonusCd;
    @Constant final float bonusEff;
    @Constant final float bonusRes;
    @Constant final float bonusSpeed;

    @Constant final float aeiCr;
    @Constant final float aeiCd;
    @Constant final float aeiEff;
    @Constant final float aeiRes;
    @Constant final float aeiSpeed;

    @Constant final boolean[] boolArr;
    @Constant final int[] setPermutationIndicesPlusOne;
    final int[] setSolutionCounters;
    @Constant final long max;

    @Constant final int inputAtkMinLimit;
    @Constant final int inputAtkMaxLimit;
    @Constant final int inputHpMinLimit;
    @Constant final int inputHpMaxLimit;
    @Constant final int inputDefMinLimit;
    @Constant final int inputDefMaxLimit;
    @Constant final int inputSpdMinLimit;
    @Constant final int inputSpdMaxLimit;
    @Constant final int inputCrMinLimit;
    @Constant final int inputCrMaxLimit;
    @Constant final int inputCdMinLimit;
    @Constant final int inputCdMaxLimit;
    @Constant final int inputEffMinLimit;
    @Constant final int inputEffMaxLimit;
    @Constant final int inputResMinLimit;
    @Constant final int inputResMaxLimit;
    @Constant final int inputMinCpLimit;
    @Constant final int inputMaxCpLimit;
    @Constant final int inputMinHppsLimit;
    @Constant final int inputMaxHppsLimit;
    @Constant final int inputMinEhpLimit;
    @Constant final int inputMaxEhpLimit;
    @Constant final int inputMinEhppsLimit;
    @Constant final int inputMaxEhppsLimit;
    @Constant final int inputMinDmgLimit;
    @Constant final int inputMaxDmgLimit;
    @Constant final int inputMinDmgpsLimit;
    @Constant final int inputMaxDmgpsLimit;
    @Constant final int inputMinMcdmgLimit;
    @Constant final int inputMaxMcdmgLimit;
    @Constant final int inputMinMcdmgpsLimit;
    @Constant final int inputMaxMcdmgpsLimit;

    @Constant final int inputMinDmgHLimit;
    @Constant final int inputMaxDmgHLimit;
    @Constant final int inputMinDmgDLimit;
    @Constant final int inputMaxDmgDLimit;

    @Constant final int inputMinS1Limit;
    @Constant final int inputMaxS1Limit;
    @Constant final int inputMinS2Limit;
    @Constant final int inputMaxS2Limit;
    @Constant final int inputMinS3Limit;
    @Constant final int inputMaxS3Limit;

    @Constant final float[] rate;
    @Constant final float[] pow;
    @Constant final int[] targets;

    @Constant final float[] selfHpScaling;
    @Constant final float[] selfAtkScaling;
    @Constant final float[] selfDefScaling;
    @Constant final float[] selfSpdScaling;
    @Constant final float[] constantValue;
    @Constant final float[] selfAtkConstantValue;
    @Constant final float[] increasedValue;
    @Constant final float[] defDiffPen;
    @Constant final float[] defDiffPenMax;
    @Constant final float[] atkDiffPen;
    @Constant final float[] atkDiffPenMax;
    @Constant final float[] spdDiffPen;
    @Constant final float[] spdDiffPenMax;
    @Constant final float[] penetration;
    @Constant final float[] atkIncrease;
    @Constant final float[] cdmgIncrease;
    @Constant final float[] crit;
    @Constant final float[] damage;
    @Constant final float[] support;
    @Constant final float[] hitMulti;

    @Constant final float[] extraSelfAtkScaling;
    @Constant final float[] extraSelfDefScaling;
    @Constant final float[] extraSelfHpScaling;

    @Constant final float artifactHealth;
    @Constant final float artifactAttack;

    @Constant final int inputMinUpgradesLimit;
    @Constant final int inputMaxUpgradesLimit;
    @Constant final int inputMinConversionsLimit;
    @Constant final int inputMaxConversionsLimit;
    @Constant final int inputMinEquippedLimit;
    @Constant final int inputMaxEquippedLimit;
    @Constant final int inputMinScoreLimit;
    @Constant final int inputMaxScoreLimit;
    @Constant final int inputMinBSLimit;
    @Constant final int inputMaxBSLimit;
    @Constant final int inputMinPriorityLimit;
    @Constant final int inputMaxPriorityLimit;

    float[] debug;

    int iteration;
    boolean[] passes;
    @Constant final int[] setSolutionBitMasks;

    public GpuOptimizerKernel(
            final OptimizationRequest request,
            final float[] flattenedWeaponAccs,
            final float[] flattenedHelmetAccs,
            final float[] flattenedArmorAccs,
            final float[] flattenedNecklaceAccs,
            final float[] flattenedRingAccs,
            final float[] flattenedBootAccs,
            final float bonusBaseAtk,
            final float bonusBaseDef,
            final float bonusBaseHp,
            final float atkSetBonus,
            final float hpSetBonus,
            final float defSetBonus,
            final float speedSetBonus,
            final float revengeSetBonus,
            final float penSetDmgBonus,
            final float targetDefense,
            final float bonusMaxAtk,
            final float bonusMaxDef,
            final float bonusMaxHp,
            final int SETTING_RAGE_SET,
            final int SETTING_PEN_SET,
            final HeroStats base,
            final Hero hero,
            final long argSize,
            final long wSize,
            final long hSize,
            final long aSize,
            final long nSize,
            final long rSize,
            final long bSize,
            final long max,
            final int[] setSolutionBitMasks
    ) {
        this.flattenedWeaponAccs = flattenedWeaponAccs;
        this.flattenedHelmetAccs = flattenedHelmetAccs;
        this.flattenedArmorAccs = flattenedArmorAccs;
        this.flattenedNecklaceAccs = flattenedNecklaceAccs;
        this.flattenedRingAccs = flattenedRingAccs;
        this.flattenedBootAccs = flattenedBootAccs;

        this.bonusBaseAtk = bonusBaseAtk;
        this.bonusBaseDef = bonusBaseDef;
        this.bonusBaseHp = bonusBaseHp;

        this.atkSetBonus = atkSetBonus;
        this.hpSetBonus = hpSetBonus;
        this.defSetBonus = defSetBonus;
        this.speedSetBonus = speedSetBonus;
        this.revengeSetBonus = revengeSetBonus;
        this.penSetDmgBonus = penSetDmgBonus;

        this.targetDefense = targetDefense;

        this.bonusMaxAtk = bonusMaxAtk;
        this.bonusMaxDef = bonusMaxDef;
        this.bonusMaxHp = bonusMaxHp;

        this.SETTING_RAGE_SET = SETTING_RAGE_SET;
        this.SETTING_PEN_SET = SETTING_PEN_SET;

        this.baseAtk = base.getAtk();
        this.baseHp = base.getHp();
        this.baseDef = base.getDef();
        this.baseCr = base.getCr();
        this.baseCd = base.getCd();
        this.baseEff = base.getEff();
        this.baseRes = base.getRes();
        this.baseSpeed = base.getSpd();

        this.bonusCr = hero.getBonusCr();
        this.bonusCd = hero.getBonusCd();
        this.bonusEff = hero.getBonusEff();
        this.bonusRes = hero.getBonusRes();
        this.bonusSpeed = hero.getBonusSpeed();

        this.aeiCr = hero.getAeiCr();
        this.aeiCd = hero.getAeiCd();
        this.aeiEff = hero.getAeiEff();
        this.aeiRes = hero.getAeiRes();
        this.aeiSpeed = hero.getAeiSpeed();

        this.argSize = argSize;
        this.wSize = wSize;
        this.hSize = hSize;
        this.aSize = aSize;
        this.nSize = nSize;
        this.rSize = rSize;
        this.bSize = bSize;

        inputAtkMinLimit = request.inputAtkMinLimit;
        inputAtkMaxLimit = request.inputAtkMaxLimit;
        inputDefMinLimit = request.inputDefMinLimit;
        inputDefMaxLimit = request.inputDefMaxLimit;
        inputHpMinLimit = request.inputHpMinLimit;
        inputHpMaxLimit = request.inputHpMaxLimit;
        inputSpdMinLimit = request.inputSpdMinLimit;
        inputSpdMaxLimit = request.inputSpdMaxLimit;
        inputCrMinLimit = request.inputCrMinLimit;
        inputCrMaxLimit = request.inputCrMaxLimit;
        inputCdMinLimit = request.inputCdMinLimit;
        inputCdMaxLimit = request.inputCdMaxLimit;
        inputEffMinLimit = request.inputEffMinLimit;
        inputEffMaxLimit = request.inputEffMaxLimit;
        inputResMinLimit = request.inputResMinLimit;
        inputResMaxLimit = request.inputResMaxLimit;
        inputMinCpLimit = request.inputMinCpLimit;
        inputMaxCpLimit = request.inputMaxCpLimit;
        inputMinHppsLimit = request.inputMinHppsLimit;
        inputMaxHppsLimit = request.inputMaxHppsLimit;
        inputMinEhpLimit = request.inputMinEhpLimit;
        inputMaxEhpLimit = request.inputMaxEhpLimit;
        inputMinEhppsLimit = request.inputMinEhppsLimit;
        inputMaxEhppsLimit = request.inputMaxEhppsLimit;
        inputMinDmgLimit = request.inputMinDmgLimit;
        inputMaxDmgLimit = request.inputMaxDmgLimit;
        inputMinDmgpsLimit = request.inputMinDmgpsLimit;
        inputMaxDmgpsLimit = request.inputMaxDmgpsLimit;
        inputMinMcdmgLimit = request.inputMinMcdmgLimit;
        inputMaxMcdmgLimit = request.inputMaxMcdmgLimit;
        inputMinMcdmgpsLimit = request.inputMinMcdmgpsLimit;
        inputMaxMcdmgpsLimit = request.inputMaxMcdmgpsLimit;

        inputMinDmgHLimit = request.inputMinDmgHLimit;
        inputMaxDmgHLimit = request.inputMaxDmgHLimit;
        inputMinDmgDLimit = request.inputMinDmgDLimit;
        inputMaxDmgDLimit = request.inputMaxDmgDLimit;

        inputMinS1Limit = request.inputMinS1Limit;
        inputMaxS1Limit = request.inputMaxS1Limit;
        inputMinS2Limit = request.inputMinS2Limit;
        inputMaxS2Limit = request.inputMaxS2Limit;
        inputMinS3Limit = request.inputMinS3Limit;
        inputMaxS3Limit = request.inputMaxS3Limit;

        artifactAttack = request.hero.getArtifactAttack();
        artifactHealth = request.hero.getArtifactHealth();

        inputMinUpgradesLimit = request.inputMinUpgradesLimit;
        inputMaxUpgradesLimit = request.inputMaxUpgradesLimit;
        inputMinConversionsLimit = request.inputMinConversionsLimit;
        inputMaxConversionsLimit = request.inputMaxConversionsLimit;
        inputMinEquippedLimit = request.inputMinEquippedLimit;
        inputMaxEquippedLimit = request.inputMaxEquippedLimit;
        inputMinScoreLimit = request.inputMinScoreLimit;
        inputMaxScoreLimit = request.inputMaxScoreLimit;
        inputMinBSLimit = request.inputMinBSLimit;
        inputMaxBSLimit = request.inputMaxBSLimit;
        inputMinPriorityLimit = request.inputMinPriorityLimit;
        inputMaxPriorityLimit = request.inputMaxPriorityLimit;

//        s1SelfSpdScaling = hero

        this.max = max;
        this.boolArr = request.boolArr;
        this.setPermutationIndicesPlusOne = request.setPermutationIndicesPlusOne;
        this.setSolutionCounters = request.setSolutionCounters;
        this.setSolutionBitMasks = setSolutionBitMasks;

        final DamageMultipliers dm = hero.getDamageMultipliers();

        this.rate = floatArr(dm.getRate());
        this.pow = floatArr(dm.getPow());
        this.targets = flattenTargets(dm.getTargets());
        this.selfHpScaling = floatArr(dm.getSelfHpScaling());
        this.selfAtkScaling = floatArr(dm.getSelfAtkScaling());
        this.selfDefScaling = floatArr(dm.getSelfDefScaling());
        this.selfSpdScaling = floatArr(dm.getSelfSpdScaling());
        this.constantValue = floatArr(dm.getConstantValue());
        this.selfAtkConstantValue = floatArr(dm.getSelfAtkConstantValue());
        this.increasedValue = floatArr(dm.getIncreasedValue());
        this.defDiffPen = floatArr(dm.getDefDiffPen());
        this.defDiffPenMax = floatArr(dm.getDefDiffPenMax());
        this.atkDiffPen = floatArr(dm.getAtkDiffPen());
        this.atkDiffPenMax = floatArr(dm.getAtkDiffPenMax());
        this.spdDiffPen = floatArr(dm.getSpdDiffPen());
        this.spdDiffPenMax = floatArr(dm.getSpdDiffPenMax());
        this.penetration = floatArr(dm.getPenetration());
        this.atkIncrease = floatArr(dm.getAtkIncrease());
        this.cdmgIncrease = floatArr(dm.getCdmgIncrease());
        this.crit = floatArr(dm.getCrit());
        this.damage = floatArr(dm.getDamage());
        this.support = floatArr(dm.getSupport());
        this.hitMulti = floatArr(dm.getHitMulti());
        this.extraSelfAtkScaling = floatArr(dm.getExtraSelfAtkScaling());
        this.extraSelfDefScaling = floatArr(dm.getExtraSelfDefScaling());
        this.extraSelfHpScaling = floatArr(dm.getExtraSelfHpScaling());
    }

    private float[] floatArr(final Float[] arr) {
        if (arr == null) {
            return new float[]{0, 0, 0};
        }
        return new float[]{arr[0], arr[1], arr[2]};
    }

    private int[] flattenTargets(final Integer[] arr) {
        if (arr == null) {
            return new int[]{0, 0, 0};
        }
        return new int[]{zeroOrOne(arr[0]), zeroOrOne(arr[1]), zeroOrOne(arr[2])};
    }

    private int zeroOrOne(final int i) {
        if (i == 1) {
            return 1;
        }
        return 0;
    }


    int oneIfNegativeElseZero(int a) {
        return ((a ^ 1) >> 31) * -1;
    }
    int negativeOneIfNegativeElseZero(int a) {
        return (a  ^ 1) >> 31;
    }

    @Override
    public void run() {
        final int id = getGlobalId();

        final long i = max * iteration + id;
        if (i < wSize * hSize * aSize * nSize * rSize * bSize) {
            final long b = i % bSize;
            final long r = ( ( i - b ) / bSize ) %  rSize;
            final long n = ( ( i - r * bSize - b ) / (bSize * rSize) ) % nSize;
            final long a = ( ( i - n * rSize * bSize - r * bSize - b ) / (bSize * rSize * nSize) ) % aSize;
            final long h = ( ( i - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize) ) % hSize;
            final long w = ( ( i - h * aSize * nSize * rSize * bSize - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize * hSize) ) % wSize;

            final int wargSize = (int)(w * argSize);
            final float wAtk =   flattenedWeaponAccs[wargSize];
            final float wHp =    flattenedWeaponAccs[wargSize + 1];
            final float wDef =   flattenedWeaponAccs[wargSize + 2];
            final float wCr =    flattenedWeaponAccs[wargSize + 6];
            final float wCd =    flattenedWeaponAccs[wargSize + 7];
            final float wEff =   flattenedWeaponAccs[wargSize + 8];
            final float wRes =   flattenedWeaponAccs[wargSize + 9];
            final float wSpeed = flattenedWeaponAccs[wargSize + 10];
            final float wScore = flattenedWeaponAccs[wargSize + 11];
            final float wSet =   flattenedWeaponAccs[wargSize + 12];
            final float wPrio =  flattenedWeaponAccs[wargSize + 13];
            final float wUpg =   flattenedWeaponAccs[wargSize + 14];
            final float wConv =  flattenedWeaponAccs[wargSize + 15];
            final float wEq =    flattenedWeaponAccs[wargSize + 16];

            final int hargSize = (int)(h * argSize);
            final float hAtk =   flattenedHelmetAccs[hargSize];
            final float hHp =    flattenedHelmetAccs[hargSize + 1];
            final float hDef =   flattenedHelmetAccs[hargSize + 2];
            final float hCr =    flattenedHelmetAccs[hargSize + 6];
            final float hCd =    flattenedHelmetAccs[hargSize + 7];
            final float hEff =   flattenedHelmetAccs[hargSize + 8];
            final float hRes =   flattenedHelmetAccs[hargSize + 9];
            final float hSpeed = flattenedHelmetAccs[hargSize + 10];
            final float hScore = flattenedHelmetAccs[hargSize + 11];
            final float hSet =   flattenedHelmetAccs[hargSize + 12];
            final float hPrio =  flattenedHelmetAccs[hargSize + 13];
            final float hUpg =   flattenedHelmetAccs[hargSize + 14];
            final float hConv =  flattenedHelmetAccs[hargSize + 15];
            final float hEq =    flattenedHelmetAccs[hargSize + 16];

            final int aargSize = (int)(a * argSize);
            final float aAtk =   flattenedArmorAccs[aargSize];
            final float aHp =    flattenedArmorAccs[aargSize + 1];
            final float aDef =   flattenedArmorAccs[aargSize + 2];
            final float aCr =    flattenedArmorAccs[aargSize + 6];
            final float aCd =    flattenedArmorAccs[aargSize + 7];
            final float aEff =   flattenedArmorAccs[aargSize + 8];
            final float aRes =   flattenedArmorAccs[aargSize + 9];
            final float aSpeed = flattenedArmorAccs[aargSize + 10];
            final float aScore = flattenedArmorAccs[aargSize + 11];
            final float aSet =   flattenedArmorAccs[aargSize + 12];
            final float aPrio =  flattenedArmorAccs[aargSize + 13];
            final float aUpg =   flattenedArmorAccs[aargSize + 14];
            final float aConv =  flattenedArmorAccs[aargSize + 15];
            final float aEq =    flattenedArmorAccs[aargSize + 16];

            final int nargSize = (int)(n * argSize);
            final float nAtk =   flattenedNecklaceAccs[nargSize];
            final float nHp =    flattenedNecklaceAccs[nargSize + 1];
            final float nDef =   flattenedNecklaceAccs[nargSize + 2];
            final float nCr =    flattenedNecklaceAccs[nargSize + 6];
            final float nCd =    flattenedNecklaceAccs[nargSize + 7];
            final float nEff =   flattenedNecklaceAccs[nargSize + 8];
            final float nRes =   flattenedNecklaceAccs[nargSize + 9];
            final float nSpeed = flattenedNecklaceAccs[nargSize + 10];
            final float nScore = flattenedNecklaceAccs[nargSize + 11];
            final float nSet =   flattenedNecklaceAccs[nargSize + 12];
            final float nPrio =  flattenedNecklaceAccs[nargSize + 13];
            final float nUpg =   flattenedNecklaceAccs[nargSize + 14];
            final float nConv =  flattenedNecklaceAccs[nargSize + 15];
            final float nEq =    flattenedNecklaceAccs[nargSize + 16];

            final int rargSize = (int)(r * argSize);
            final float rAtk =   flattenedRingAccs[rargSize];
            final float rHp =    flattenedRingAccs[rargSize + 1];
            final float rDef =   flattenedRingAccs[rargSize + 2];
            final float rCr =    flattenedRingAccs[rargSize + 6];
            final float rCd =    flattenedRingAccs[rargSize + 7];
            final float rEff =   flattenedRingAccs[rargSize + 8];
            final float rRes =   flattenedRingAccs[rargSize + 9];
            final float rSpeed = flattenedRingAccs[rargSize + 10];
            final float rScore = flattenedRingAccs[rargSize + 11];
            final float rSet =   flattenedRingAccs[rargSize + 12];
            final float rPrio =  flattenedRingAccs[rargSize + 13];
            final float rUpg =   flattenedRingAccs[rargSize + 14];
            final float rConv =  flattenedRingAccs[rargSize + 15];
            final float rEq =    flattenedRingAccs[rargSize + 16];

            final int bargSize = (int)(b * argSize);
            final float bAtk =   flattenedBootAccs[bargSize];
            final float bHp =    flattenedBootAccs[bargSize + 1];
            final float bDef =   flattenedBootAccs[bargSize + 2];
            final float bCr =    flattenedBootAccs[bargSize + 6];
            final float bCd =    flattenedBootAccs[bargSize + 7];
            final float bEff =   flattenedBootAccs[bargSize + 8];
            final float bRes =   flattenedBootAccs[bargSize + 9];
            final float bSpeed = flattenedBootAccs[bargSize + 10];
            final float bScore = flattenedBootAccs[bargSize + 11];
            final float bSet =   flattenedBootAccs[bargSize + 12];
            final float bPrio =  flattenedBootAccs[bargSize + 13];
            final float bUpg =   flattenedBootAccs[bargSize + 14];
            final float bConv =  flattenedBootAccs[bargSize + 15];
            final float bEq =    flattenedBootAccs[bargSize + 16];

            final int iWset = (int)wSet;
            final int iHset = (int)hSet;
            final int iAset = (int)aSet;
            final int iNset = (int)nSet;
            final int iRset = (int)rSet;
            final int iBset = (int)bSet;

            final int setIndex = iWset * 1889568
                    + iHset * 104976
                    + iAset * 5832
                    + iNset * 324
                    + iRset * 18
                    + iBset;

//            final int setIndex = iWset * 1048576
//                    + iHset * 65536
//                    + iAset * 4096
//                    + iNset * 256
//                    + iRset * 16
//                    + iBset;

            // 0 hp3
            // 1 hp2
            // 2 hp1
            // 3 def3
            // 4 def2
            // 5 def1
            // 6 atk
            // 7 speed
            // 8 crit3
            // 9 crit2
            // 10 crit1
            // 11 hit3
            // 12 hit2
            // 13 hit1
            // 14 destr
            // 15 lifesteal
            // 16 counter
            // 17 res3
            // 18 res2
            // 19 res1
            // 20 unity
            // 21 rage
            // 22 immu
            // 23 pen
            // 24 revenge
            // 25 injury

            //            debug[id] = min(1, longSetMasks[setIndex] & (1 << 7));

            final int hpSet = min(1, setSolutionBitMasks[setIndex] & (1)) + min(1, setSolutionBitMasks[setIndex] & (1 << 1)) + min(1, setSolutionBitMasks[setIndex] & (1 << 2));
            final int defSet = min(1, setSolutionBitMasks[setIndex] & (1 << 3)) + min(1, setSolutionBitMasks[setIndex] & (1 << 4)) + min(1, setSolutionBitMasks[setIndex] & (1 << 5));
            final int atkSet = min(1, setSolutionBitMasks[setIndex] & (1 << 6));
            final int speedSet = min(1, setSolutionBitMasks[setIndex] & (1 << 7));
            final int crSet = min(1, setSolutionBitMasks[setIndex] & (1 << 8)) + min(1, setSolutionBitMasks[setIndex] & (1 << 9)) + min(1, setSolutionBitMasks[setIndex] & (1 << 10));
            final int effSet = min(1, setSolutionBitMasks[setIndex] & (1 << 11)) + min(1, setSolutionBitMasks[setIndex] & (1 << 12)) + min(1, setSolutionBitMasks[setIndex] & (1 << 13));
            final int cdSet = min(1, setSolutionBitMasks[setIndex] & (1 << 14));
            final int resSet = min(1, setSolutionBitMasks[setIndex] & (1 << 17)) + min(1, setSolutionBitMasks[setIndex] & (1 << 18)) + min(1, setSolutionBitMasks[setIndex] & (1 << 19));
            final int rageSet = min(1, setSolutionBitMasks[setIndex] & (1 << 21));
            final int penSet = min(1, setSolutionBitMasks[setIndex] & (1 << 23));
            final int revengeSet = min(1, setSolutionBitMasks[setIndex] & (1 << 24));
//            final int protectionSet = min(1, setSolutionBitMasks[setIndex] & (1 << 25));
//            final int injurySet = min(1, setSolutionBitMasks[setIndex] & (1 << 26));
            final int torrentSet = min(1, setSolutionBitMasks[setIndex] & (1 << 27)) + min(1, setSolutionBitMasks[setIndex] & (1 << 28)) + min(1, setSolutionBitMasks[setIndex] & (1 << 29));

            final float atk =  ((bonusBaseAtk  + wAtk+hAtk+aAtk+nAtk+rAtk+bAtk + (atkSet * atkSetBonus)) * bonusMaxAtk);
            final float hp =   ((bonusBaseHp   + wHp+hHp+aHp+nHp+rHp+bHp + (hpSet * hpSetBonus + torrentSet * hpSetBonus/-2)) * bonusMaxHp);
            final float def =  ((bonusBaseDef  + wDef+hDef+aDef+nDef+rDef+bDef + (defSet * defSetBonus)) * bonusMaxDef);
            final int cr =     (int) (baseCr + wCr+hCr+aCr+nCr+rCr+bCr + (crSet * 12) + bonusCr + aeiCr);
            final int cd =     (int) (baseCd + wCd+hCd+aCd+nCd+rCd+bCd + (cdSet * 60) + bonusCd + aeiCd);
            final int eff =    (int) (baseEff   + wEff+hEff+aEff+nEff+rEff+bEff + (effSet * 20) + bonusEff + aeiEff);
            final int res =    (int) (baseRes   + wRes+hRes+aRes+nRes+rRes+bRes + (resSet * 20) + bonusRes + aeiRes);
            final int spd =    (int) (baseSpeed + wSpeed+hSpeed+aSpeed+nSpeed+rSpeed+bSpeed + (speedSet * speedSetBonus) + (revengeSet * revengeSetBonus) + bonusSpeed + aeiSpeed);

            final float critRate = min(100, cr) / 100f;
            final float critDamage = min(350, cd) / 100f;

            final int cp = (int) (((atk * 1.6f + atk * 1.6f * critRate * critDamage) * (1.0 + (spd - 45f) * 0.02f) + hp + def * 9.3f) * (1f + (res/100f + eff/100f) / 4f));

            final float penSetOn = min(penSet, 1);
            final float rageMultiplier = max(0, rageSet * SETTING_RAGE_SET * 0.3f);
            final float penMultiplier = max(1, penSetOn * SETTING_PEN_SET * penSetDmgBonus);
            final float torrentMultiplier = max(0, torrentSet * 0.1f);
            final float spdDiv1000 = (float)spd/1000;
            final float pctDmgMultiplier = 1 + rageMultiplier + torrentMultiplier;

            final int ehp = (int) (hp * (def/300 + 1));
            final int hpps = (int) (hp*spdDiv1000);
            final int ehpps = (int) (ehp*spdDiv1000);
            final int dmg = (int) (((critRate * atk * critDamage) + (1-critRate) * atk) * penMultiplier * pctDmgMultiplier);
            final int dmgps = (int) (dmg*spdDiv1000);
            final int mcdmg = (int) (atk * critDamage * penMultiplier * pctDmgMultiplier);
            final int mcdmgps = (int) (mcdmg*spdDiv1000);
            final int dmgh = (int) ((critDamage * hp * penMultiplier * pctDmgMultiplier)/10);
            final int dmgd = (int) ((critDamage * def * penMultiplier * pctDmgMultiplier));

            final int s1 = getSkillValue(0, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
            final int s2 = getSkillValue(1, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);
            final int s3 = getSkillValue(2, atk, def, hp, spd, critDamage, pctDmgMultiplier, penSetOn);

// {1.871 * [(ATK)(Atkmod)(Rate)+(FlatMod)]} * (pow!)(EnhanceMod)(HitTypeMod)(ElementMod)(DamageUpMod)(TargetDebuffMod)
            // flatmod

//            @Constant final float s1SelfHpScaling = 0;
//            @Constant final float s1SelfAtkScaling = 0;
//            @Constant final float s1SelfDefScaling = 0;
//            @Constant final float s1SelfSpdScaling = 0;

//            @Constant final float s1ConstantValue = 0;
//            @Constant final float s1SelfAtkConstantValue = 0;
//            @Constant final float s1ConditionalIncreasedValue = 0;
//            @Constant final float s1DefDiffPen = 0;
//            @Constant final float s1DefDiffPenMax = 0;
//            @Constant final float s1AtkDiffPen = 0;
//            @Constant final float s1AtkDiffPenMax = 0;
//            @Constant final float s1SpdDiffPen = 0;
//            @Constant final float s1SpdDiffPenMax = 0;
//            @Constant final float s1Penetration = 0;
//           x @Constant final float s1AtkIncrease = 0;

            final int score = (int) (wScore+hScore+aScore+nScore+rScore+bScore);
            final int priority = (int) (wPrio+hPrio+aPrio+nPrio+rPrio+bPrio);
            final int upgrades = (int) (wUpg+hUpg+aUpg+nUpg+rUpg+bUpg);
            final int conversions = (int) (wConv+hConv+aConv+nConv+rConv+bConv);
            final int eq = (int) (wEq+hEq+aEq+nEq+rEq+bEq);

            final float bsHp = (hp - baseHp - artifactHealth - (hpSet * hpSetBonus) + (torrentSet * hpSetBonus/2)) / baseHp * 100;
            final float bsAtk = (atk - baseAtk - artifactAttack - (atkSet * atkSetBonus)) / baseAtk * 100;
            final float bsDef = (def - baseDef - (defSet * defSetBonus)) / baseDef * 100;
            final float bsCr = (cr - baseCr - (crSet * 12));
            final float bsCd = (cd - baseCd - (cdSet * 60));
            final float bsEff = (eff - baseEff - (effSet * 20));
            final float bsRes = (res - baseRes - (resSet * 20));
            final float bsSpd = (spd - baseSpeed - (speedSet * speedSetBonus) - (revengeSet * revengeSetBonus));

//            final float atk =  ((bonusBaseAtk  + wAtk+hAtk+aAtk+nAtk+rAtk+bAtk + (atkSet * atkSetBonus)) * bonusMaxAtk);
//            final float hp =   ((bonusBaseHp   + wHp+hHp+aHp+nHp+rHp+bHp + (hpSet * hpSetBonus + torrentSet * hpSetBonus/-2)) * bonusMaxHp);
//            final float def =  ((bonusBaseDef  + wDef+hDef+aDef+nDef+rDef+bDef + (defSet * defSetBonus)) * bonusMaxDef);
//            final int cr =     (int) (baseCr + wCr+hCr+aCr+nCr+rCr+bCr + (crSet * 12) + bonusCr + aeiCr);
//            final int cd =     (int) (baseCd + wCd+hCd+aCd+nCd+rCd+bCd + (cdSet * 60) + bonusCd + aeiCd);
//            final int eff =    (int) (baseEff   + wEff+hEff+aEff+nEff+rEff+bEff + (effSet * 20) + bonusEff + aeiEff);
//            final int res =    (int) (baseRes   + wRes+hRes+aRes+nRes+rRes+bRes + (resSet * 20) + bonusRes + aeiRes);
//            final int spd =    (int) (baseSpeed + wSpeed+hSpeed+aSpeed+nSpeed+rSpeed+bSpeed + (speedSet * speedSetBonus) + (revengeSet * revengeSetBonus) + bonusSpeed + aeiSpeed);

            final int bs = (int) (bsHp + bsAtk + bsDef + bsCr*1.6f + bsCd*1.14f + bsEff + bsRes + bsSpd*2);

            final boolean f1 = atk < inputAtkMinLimit || atk > inputAtkMaxLimit
                    ||  hp  < inputHpMinLimit  || hp > inputHpMaxLimit
                    ||  def < inputDefMinLimit || def > inputDefMaxLimit
                    ||  spd < inputSpdMinLimit || spd > inputSpdMaxLimit
                    ||  cr < inputCrMinLimit   || cr > inputCrMaxLimit
                    ||  cd < inputCdMinLimit   || cd > inputCdMaxLimit
                    ||  eff < inputEffMinLimit || eff > inputEffMaxLimit
                    ||  res < inputResMinLimit || res > inputResMaxLimit
                    ||  cp < inputMinCpLimit || cp > inputMaxCpLimit;
            final boolean f2 = hpps < inputMinHppsLimit || hpps > inputMaxHppsLimit
                    ||  ehp < inputMinEhpLimit || ehp > inputMaxEhpLimit
                    ||  ehpps < inputMinEhppsLimit || ehpps > inputMaxEhppsLimit
                    ||  dmg < inputMinDmgLimit || dmg > inputMaxDmgLimit
                    ||  dmgps < inputMinDmgpsLimit || dmgps > inputMaxDmgpsLimit
                    ||  mcdmg < inputMinMcdmgLimit || mcdmg > inputMaxMcdmgLimit
                    ||  mcdmgps < inputMinMcdmgpsLimit || mcdmgps > inputMaxMcdmgpsLimit
                    ||  dmgh < inputMinDmgHLimit || dmgh > inputMaxDmgHLimit
                    ||  dmgd < inputMinDmgDLimit || dmgd > inputMaxDmgDLimit
                    ||  score < inputMinScoreLimit || score > inputMaxScoreLimit;
            final boolean f3 = priority < inputMinPriorityLimit || priority > inputMaxPriorityLimit
                    ||  upgrades < inputMinUpgradesLimit || upgrades > inputMaxUpgradesLimit
                    ||  conversions < inputMinConversionsLimit || conversions > inputMaxConversionsLimit
                    ||  eq < inputMinEquippedLimit || eq > inputMaxEquippedLimit
                    ||  s1 < inputMinS1Limit || s1 > inputMaxS1Limit
                    ||  s2 < inputMinS2Limit || s2 > inputMaxS2Limit
                    ||  s3 < inputMinS3Limit || s3 > inputMaxS3Limit
                    ||  bs < inputMinBSLimit || bs > inputMaxBSLimit;

//            if (true)
//                return;

            passes[id] = !(f1 || f2 || f3) && setPermutationIndicesPlusOne[setIndex] > 0;
//            passes[id] = setIndex >= 340122242;
        }
    }


    private int getSkillValue(final int s,
                              final float atk,
                              final float def,
                              final float hp,
                              final float spd,
                              final float critDamage,
                              final float pctDmgMultiplier,
                              final float penSetOn) {
//        final float effectiveDefense = targetDefense * targets[s] * penMultiplier
//        final float realDefense = targetDefense * (penSetOn * 0.12f + 0);
        final float realPenetration = (1 - penetration[s]) * (1 - penSetOn * 0.15f * targets[s]);
        final float statScalings =
                        selfHpScaling[s] *hp +
                        selfAtkScaling[s]*atk +
                        selfDefScaling[s]*def +
                        selfSpdScaling[s]*spd;
        final float hitTypeMultis = crit[s] * (critDamage+cdmgIncrease[s]) + hitMulti[s];
        final float increasedValueMulti = 1 + increasedValue[s];
        final float dmgUpMod = 1 + selfSpdScaling[s] * spd;
        final float extraDamage = (
                        extraSelfHpScaling[s] *hp +
                        extraSelfAtkScaling[s]*atk +
                        extraSelfDefScaling[s]*def) * 1.871f * 1f/(targetDefense*0.3f/300f + 1f);
        final float offensiveValue = (atk * rate[s] + statScalings) * 1.871f * pow[s] * increasedValueMulti * hitTypeMultis * dmgUpMod * pctDmgMultiplier;
        final float supportValue = selfHpScaling[s] * hp * support[s] + selfAtkScaling[s] * atk * support[s] + selfDefScaling[s] * def * support[s];
        final float defensiveValue = 1f/(targetDefense*max(0, realPenetration)/300f + 1f);
        return (int)(offensiveValue * defensiveValue + supportValue + extraDamage);
    }
}