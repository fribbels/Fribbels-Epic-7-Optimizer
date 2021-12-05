package com.fribbels.aparapi;

import com.aparapi.Kernel;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.request.OptimizationRequest;
import lombok.Setter;

@Setter
public class GpuOptimizer extends Kernel {

    @Constant private final float[] flattenedWeaponAccs;
    @Constant private final float[] flattenedHelmetAccs;
    @Constant private final float[] flattenedArmorAccs;
    @Constant private final float[] flattenedNecklaceAccs;
    @Constant private final float[] flattenedRingAccs;
    @Constant private final float[] flattenedBootAccs;

    @Constant private final int wSize;
    @Constant private final int hSize;
    @Constant private final int aSize;
    @Constant private final int nSize;
    @Constant private final int rSize;
    @Constant private final int bSize;

    @Constant private final int argSize;

    @Constant private final float bonusBaseAtk;
    @Constant private final float bonusBaseHp;
    @Constant private final float bonusBaseDef;

    @Constant private final float atkSetBonus;
    @Constant private final float hpSetBonus;
    @Constant private final float defSetBonus;
    @Constant private final float speedSetBonus;
    @Constant private final float revengeSetBonus;
    @Constant private final float penSetDmgBonus;

    @Constant private final float bonusMaxAtk;
    @Constant private final float bonusMaxHp;
    @Constant private final float bonusMaxDef;

    @Constant private final int SETTING_RAGE_SET;
    @Constant private final int SETTING_PEN_SET;

    @Constant private final float baseCr;
    @Constant private final float baseCd;
    @Constant private final float baseEff;
    @Constant private final float baseRes;
    @Constant private final float baseSpeed;

    @Constant private final float bonusCr;
    @Constant private final float bonusCd;
    @Constant private final float bonusEff;
    @Constant private final float bonusRes;
    @Constant private final float bonusSpeed;

    @Constant private final float aeiCr;
    @Constant private final float aeiCd;
    @Constant private final float aeiEff;
    @Constant private final float aeiRes;
    @Constant private final float aeiSpeed;

    @Constant private final boolean[] boolArr;
    @Constant private final int max;

    // Attempt at optimizing filters
    //    @Constant private final int[] sumValues = new int[] {0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}; // 21 values, one per filter
    //    @Constant private final int[] sumValues = new int[] {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}; // 21 values, one per filter
    //    @Constant private final boolean[] boolValues = new boolean[] {false, true, true}; // 21 values, one per filter
    //    @Constant private final int[] optimizerMinFilters;
    //    @Constant private final int[] optimizerMaxFilters;
    //    @Constant private final int[] optimizerFilterIndices;
    //    @Constant private final int optimizerFilterSize;
    //    @Constant private final int[] intArr;

    @Constant private final int inputAtkMinLimit;
    @Constant private final int inputAtkMaxLimit;
    @Constant private final int inputHpMinLimit;
    @Constant private final int inputHpMaxLimit;
    @Constant private final int inputDefMinLimit;
    @Constant private final int inputDefMaxLimit;
    @Constant private final int inputSpdMinLimit;
    @Constant private final int inputSpdMaxLimit;
    @Constant private final int inputCrMinLimit;
    @Constant private final int inputCrMaxLimit;
    @Constant private final int inputCdMinLimit;
    @Constant private final int inputCdMaxLimit;
    @Constant private final int inputEffMinLimit;
    @Constant private final int inputEffMaxLimit;
    @Constant private final int inputResMinLimit;
    @Constant private final int inputResMaxLimit;
    @Constant private final int inputMinCpLimit;
    @Constant private final int inputMaxCpLimit;
    @Constant private final int inputMinHppsLimit;
    @Constant private final int inputMaxHppsLimit;
    @Constant private final int inputMinEhpLimit;
    @Constant private final int inputMaxEhpLimit;
    @Constant private final int inputMinEhppsLimit;
    @Constant private final int inputMaxEhppsLimit;
    @Constant private final int inputMinDmgLimit;
    @Constant private final int inputMaxDmgLimit;
    @Constant private final int inputMinDmgpsLimit;
    @Constant private final int inputMaxDmgpsLimit;
    @Constant private final int inputMinMcdmgLimit;
    @Constant private final int inputMaxMcdmgLimit;
    @Constant private final int inputMinMcdmgpsLimit;
    @Constant private final int inputMaxMcdmgpsLimit;

    @Constant private final int inputMinDmgHLimit;
    @Constant private final int inputMaxDmgHLimit;
    @Constant private final int inputMinUpgradesLimit;
    @Constant private final int inputMaxUpgradesLimit;
    @Constant private final int inputMinConversionsLimit;
    @Constant private final int inputMaxConversionsLimit;
    @Constant private final int inputMinScoreLimit;
    @Constant private final int inputMaxScoreLimit;
    @Constant private final int inputMinPriorityLimit;
    @Constant private final int inputMaxPriorityLimit;

    private float[] debug;

    private int iteration;
    private boolean[] passes;

    @Local final int[] localSetsBuffer = new int[256 * 16];
//    @Local final float[] localStatBuffer = new float[256 * 21];

    public GpuOptimizer(
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
            final float bonusMaxAtk,
            final float bonusMaxDef,
            final float bonusMaxHp,
            final int SETTING_RAGE_SET,
            final int SETTING_PEN_SET,
            final HeroStats base,
            final Hero hero,
            final int argSize,
            final int wSize,
            final int hSize,
            final int aSize,
            final int nSize,
            final int rSize,
            final int bSize,
            final int max
    ) {
        this.flattenedWeaponAccs = flattenedWeaponAccs;
        this.flattenedHelmetAccs = flattenedHelmetAccs;
        this.flattenedArmorAccs = flattenedArmorAccs;
        this.flattenedNecklaceAccs = flattenedNecklaceAccs;
        this.flattenedRingAccs = flattenedRingAccs;
        this.flattenedBootAccs = flattenedBootAccs;


        // Attempt at optimizing filters
        //        int[] minFilters = new int[] {
        //                request.inputAtkMinLimit,
        //                request.inputDefMinLimit,
        //                request.inputHpMinLimit,
        //                request.inputSpdMinLimit,
        //                request.inputCrMinLimit,
        //                request.inputCdMinLimit,
        //                request.inputEffMinLimit,
        //                request.inputResMinLimit,
        //                request.inputMinCpLimit,
        //                request.inputMinHppsLimit,
        //                request.inputMinEhpLimit,
        //                request.inputMinEhppsLimit,
        //                request.inputMinDmgLimit,
        //                request.inputMinDmgpsLimit,
        //                request.inputMinMcdmgLimit,
        //                request.inputMinMcdmgpsLimit,
        //                request.inputMinDmgHLimit,
        //                request.inputMinUpgradesLimit,
        //                request.inputMinConversionsLimit,
        //                request.inputMinScoreLimit,
        //                request.inputMinPriorityLimit,
        //        };
        //        int[] maxFilters = new int[] {
        //                request.inputAtkMaxLimit,
        //                request.inputDefMaxLimit,
        //                request.inputHpMaxLimit,
        //                request.inputSpdMaxLimit,
        //                request.inputCrMaxLimit,
        //                request.inputCdMaxLimit,
        //                request.inputEffMaxLimit,
        //                request.inputResMaxLimit,
        //                request.inputMaxCpLimit,
        //                request.inputMaxHppsLimit,
        //                request.inputMaxEhpLimit,
        //                request.inputMaxEhppsLimit,
        //                request.inputMaxDmgLimit,
        //                request.inputMaxDmgpsLimit,
        //                request.inputMaxMcdmgLimit,
        //                request.inputMaxMcdmgpsLimit,
        //                request.inputMaxDmgHLimit,
        //                request.inputMaxUpgradesLimit,
        //                request.inputMaxConversionsLimit,
        //                request.inputMaxScoreLimit,
        //                request.inputMaxPriorityLimit,
        //        };
        //        final List<Integer> filterIndexList = new ArrayList<>();
        //        for (int i = 0; i < 21; i++) {
        //            if (minFilters[i] != 0 || maxFilters[i] != Integer.MAX_VALUE) {
        //                filterIndexList.add(i);
        //            }
        //        }
        //
        //        final int size = filterIndexList.size();
        //        final int[] filterIndices = new int[size];
        //        final int[] finalMaxFilters = new int[size];
        //        final int[] finalMinFilters = new int[size];
        //
        //        for (int i = 0; i < size; i++) {
        //            filterIndices[i] = filterIndexList.get(i);
        //            finalMaxFilters[i] = maxFilters[filterIndexList.get(i)];
        //            finalMinFilters[i] = minFilters[filterIndexList.get(i)];
        //        }
        //
        //        optimizerFilterSize = size;
        //        optimizerFilterIndices = filterIndices;
        //        optimizerMaxFilters = finalMaxFilters;
        //        optimizerMinFilters = finalMinFilters;
        //
        //        intArr = new int[request.boolArr.length];
        //        for (int i = 0; i < request.boolArr.length; i++) {
        //            intArr[i] = request.boolArr[i] ? 1 : 0;
        //        }

        this.bonusBaseAtk = bonusBaseAtk;
        this.bonusBaseDef = bonusBaseDef;
        this.bonusBaseHp = bonusBaseHp;

        this.atkSetBonus = atkSetBonus;
        this.hpSetBonus = hpSetBonus;
        this.defSetBonus = defSetBonus;
        this.speedSetBonus = speedSetBonus;
        this.revengeSetBonus = revengeSetBonus;
        this.penSetDmgBonus = penSetDmgBonus;

        this.bonusMaxAtk = bonusMaxAtk;
        this.bonusMaxDef = bonusMaxDef;
        this.bonusMaxHp = bonusMaxHp;

        this.SETTING_RAGE_SET = SETTING_RAGE_SET;
        this.SETTING_PEN_SET = SETTING_PEN_SET;

        this.baseCr = base.cr;
        this.baseCd = base.cd;
        this.baseEff = base.eff;
        this.baseRes = base.res;
        this.baseSpeed = base.spd;

        this.bonusCr = hero.bonusCr;
        this.bonusCd = hero.bonusCd;
        this.bonusEff = hero.bonusEff;
        this.bonusRes = hero.bonusRes;
        this.bonusSpeed = hero.bonusSpeed;

        this.aeiCr = hero.aeiCr;
        this.aeiCd = hero.aeiCd;
        this.aeiEff = hero.aeiEff;
        this.aeiRes = hero.aeiRes;
        this.aeiSpeed = hero.aeiSpeed;

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
        inputMinUpgradesLimit = request.inputMinUpgradesLimit;
        inputMaxUpgradesLimit = request.inputMaxUpgradesLimit;
        inputMinConversionsLimit = request.inputMinConversionsLimit;
        inputMaxConversionsLimit = request.inputMaxConversionsLimit;
        inputMinScoreLimit = request.inputMinScoreLimit;
        inputMaxScoreLimit = request.inputMaxScoreLimit;
        inputMinPriorityLimit = request.inputMinPriorityLimit;
        inputMaxPriorityLimit = request.inputMaxPriorityLimit;

        this.max = max;
        this.boolArr = request.boolArr;
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
        final int localId = getLocalId();
        final int setJump = localId * 16;

        final long i = ((long)max) * iteration + id;
        if (i < ((long)(wSize)) * hSize * aSize * nSize * rSize * bSize) {
            final int b = (int)(i % bSize);
            final int r = (int)(( ( i - b ) / bSize ) %  rSize);
            final int n = (int)(( ( i - r * bSize - b ) / (bSize * rSize) ) % nSize);
            final int a = (int)(( ( i - n * rSize * bSize - r * bSize - b ) / (bSize * rSize * nSize) ) % aSize);
            final int h = (int)(( ( i - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize) ) % hSize);
            final int w = (int)(( ( i - h * aSize * nSize * rSize * bSize - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize * hSize) ) % wSize);

            final int wargSize = w * argSize;
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

            final int hargSize = h * argSize;
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

            final int aargSize = a * argSize;
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

            final int nargSize = n * argSize;
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

            final int rargSize = r * argSize;
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

            final int bargSize = b * argSize;
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

            localSetsBuffer[setJump] = 0;
            localSetsBuffer[setJump + 1] = 0;
            localSetsBuffer[setJump + 2] = 0;
            localSetsBuffer[setJump + 3] = 0;
            localSetsBuffer[setJump + 4] = 0;
            localSetsBuffer[setJump + 5] = 0;
            localSetsBuffer[setJump + 6] = 0;
            localSetsBuffer[setJump + 7] = 0;
            localSetsBuffer[setJump + 8] = 0;
            localSetsBuffer[setJump + 9] = 0;
            localSetsBuffer[setJump + 10] = 0;
            localSetsBuffer[setJump + 11] = 0;
            localSetsBuffer[setJump + 12] = 0;
            localSetsBuffer[setJump + 13] = 0;
            localSetsBuffer[setJump + 14] = 0;
            localSetsBuffer[setJump + 15] = 0;

            localSetsBuffer[(int)wSet + setJump] += 1;
            localSetsBuffer[(int)hSet + setJump] += 1;
            localSetsBuffer[(int)aSet + setJump] += 1;
            localSetsBuffer[(int)nSet + setJump] += 1;
            localSetsBuffer[(int)rSet + setJump] += 1;
            localSetsBuffer[(int)bSet + setJump] += 1;

            final int hpSet = localSetsBuffer[setJump] / 2;
            final int defSet = localSetsBuffer[setJump + 1] / 2;
            final int atkSet = localSetsBuffer[setJump + 2] / 4;
            final int speedSet = localSetsBuffer[setJump + 3] / 4;
            final int crSet = localSetsBuffer[setJump + 4] / 2;
            final int effSet = localSetsBuffer[setJump + 5] / 2;
            final int cdSet = localSetsBuffer[setJump + 6] / 4;
            final int resSet = localSetsBuffer[setJump + 9] / 2;
            final int rageSet = localSetsBuffer[setJump + 11] / 4;
            final int penSet = localSetsBuffer[setJump + 13] / 2;
            final int revengeSet = localSetsBuffer[setJump + 14] / 4;

            final float atk =  ((bonusBaseAtk  + wAtk+hAtk+aAtk+nAtk+rAtk+bAtk + (atkSet * atkSetBonus)) * bonusMaxAtk);
            final float hp =   ((bonusBaseHp   + wHp+hHp+aHp+nHp+rHp+bHp + (hpSet * hpSetBonus)) * bonusMaxHp);
            final float def =  ((bonusBaseDef  + wDef+hDef+aDef+nDef+rDef+bDef + (defSet * defSetBonus)) * bonusMaxDef);
            final int cr =     (int) (baseCr + wCr+hCr+aCr+nCr+rCr+bCr + (crSet * 12) + bonusCr + aeiCr);
            final int cd =     (int) (baseCd + wCd+hCd+aCd+nCd+rCd+bCd + (cdSet * 40) + bonusCd + aeiCd);
            final int eff =    (int) (baseEff   + wEff+hEff+aEff+nEff+rEff+bEff + (effSet * 20) + bonusEff + aeiEff);
            final int res =    (int) (baseRes   + wRes+hRes+aRes+nRes+rRes+bRes + (resSet * 20) + bonusRes + aeiRes);
            final int spd =    (int) (baseSpeed + wSpeed+hSpeed+aSpeed+nSpeed+rSpeed+bSpeed + (speedSet * speedSetBonus) + (revengeSet * revengeSetBonus) + bonusSpeed + aeiSpeed);

            final float critRate = min(100, cr) / 100f;
            final float critDamage = min(350, cd) / 100f;

            final int cp = (int) (((atk * 1.6f + atk * 1.6f * critRate * critDamage) * (1.0 + (spd - 45f) * 0.02f) + hp + def * 9.3f) * (1f + (res/100f + eff/100f) / 4f));

            final float rageMultiplier = max(1, rageSet * SETTING_RAGE_SET * 1.3f);
            final float penMultiplier = max(1, min(penSet, 1) * SETTING_PEN_SET * penSetDmgBonus);
            final float spdDiv1000 = (float)spd/1000;

            final int ehp = (int) (hp * (def/300 + 1));
            final int hpps = (int) (hp*spdDiv1000);
            final int ehpps = (int) ((float)ehp*spdDiv1000);
            final int dmg = (int) (((critRate * atk * critDamage) + (1-critRate) * atk) * rageMultiplier * penMultiplier);
            final int dmgps = (int) ((float)dmg*spdDiv1000);
            final int mcdmg = (int) (atk * critDamage * rageMultiplier * penMultiplier);
            final int mcdmgps = (int) ((float)mcdmg*spdDiv1000);
            final int dmgh = (int) ((cd * hp)/1000);

            final int score = (int) (wScore+hScore+aScore+nScore+rScore+bScore);
            final int priority = (int) (wPrio+hPrio+aPrio+nPrio+rPrio+bPrio);
            final int upgrades = (int) (wUpg+hUpg+aUpg+nUpg+rUpg+bUpg);
            final int conversions = (int) (wConv+hConv+aConv+nConv+rConv+bConv);

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
                    ||  score < inputMinScoreLimit || score > inputMaxScoreLimit;
            final boolean f3 = priority < inputMinPriorityLimit || priority > inputMaxPriorityLimit
                    ||  upgrades < inputMinUpgradesLimit || upgrades > inputMaxUpgradesLimit
                    ||  conversions < inputMinConversionsLimit || conversions > inputMaxConversionsLimit;

            final int iWset = (int)wSet;
            final int iHset = (int)hSet;
            final int iAset = (int)aSet;
            final int iNset = (int)nSet;
            final int iRset = (int)rSet;
            final int iBset = (int)bSet;

            final int index = iWset * 1048576
                    + iHset * 65536
                    + iAset * 4096
                    + iNset * 256
                    + iRset * 16
                    + iBset;

            //            debug[id] = critRate;
            passes[id] = !(f1 || f2 || f3) && boolArr[index];
        }
    }
}


//    public void setFilters(OptimizationRequest request) {
//        int filters = 21;
//        int[] minFilters = new int[] {
//            request.inputAtkMinLimit,
//            request.inputDefMinLimit,
//            request.inputHpMinLimit,
//            request.inputSpdMinLimit,
//            request.inputCrMinLimit,
//            request.inputCdMinLimit,
//            request.inputEffMinLimit,
//            request.inputResMinLimit,
//            request.inputMinCpLimit,
//            request.inputMinHppsLimit,
//            request.inputMinEhpLimit,
//            request.inputMinEhppsLimit,
//            request.inputMinDmgLimit,
//            request.inputMinDmgpsLimit,
//            request.inputMinMcdmgLimit,
//            request.inputMinMcdmgpsLimit,
//            request.inputMinDmgHLimit,
//            request.inputMinUpgradesLimit,
//            request.inputMinConversionsLimit,
//            request.inputMinScoreLimit,
//            request.inputMinPriorityLimit,
//        };
//        int[] maxFilters = new int[] {
//            request.inputAtkMaxLimit,
//            request.inputDefMaxLimit,
//            request.inputHpMaxLimit,
//            request.inputSpdMaxLimit,
//            request.inputCrMaxLimit,
//            request.inputCdMaxLimit,
//            request.inputEffMaxLimit,
//            request.inputResMaxLimit,
//            request.inputMaxCpLimit,
//            request.inputMaxHppsLimit,
//            request.inputMaxEhpLimit,
//            request.inputMaxEhppsLimit,
//            request.inputMaxDmgLimit,
//            request.inputMaxDmgpsLimit,
//            request.inputMaxMcdmgLimit,
//            request.inputMaxMcdmgpsLimit,
//            request.inputMaxDmgHLimit,
//            request.inputMaxUpgradesLimit,
//            request.inputMaxConversionsLimit,
//            request.inputMaxScoreLimit,
//            request.inputMaxPriorityLimit,
//        };
//
//        final List<Integer> filterIndexList = new ArrayList<>();
//        for (int i = 0; i < 21; i++) {
//            if (minFilters[i] != 0 || maxFilters[i] != Integer.MAX_VALUE) {
//                filterIndexList.add(i);
//            }
//        }
//
//        final int size = filterIndexList.size();
//        final int[] filterIndices = new int[size];
//        final int[] finalMaxFilters = new int[size];
//        final int[] finalMinFilters = new int[size];
//
//        for (int i = 0; i < size; i++) {
//            filterIndices[i] = filterIndexList.get(i);
//            finalMaxFilters[i] = maxFilters[filterIndexList.get(i)];
//            finalMinFilters[i] = minFilters[filterIndexList.get(i)];
//        }
//
////        optimizerFilterSize = size;
////        optimizerFilterIndices = filterIndices;
////        optimizerMaxFilters = finalMaxFilters;
////        optimizerMinFilters = finalMinFilters;
//
//        System.out.println("DEBUG");
//        System.out.println("DEBUG" + size);
//        System.out.println("DEBUG" + filterIndexList);
//        System.out.println("DEBUG" + Arrays.toString(optimizerFilterIndices));
//        System.out.println("DEBUG" + Arrays.toString(optimizerMinFilters));
//        System.out.println("DEBUG" + Arrays.toString(optimizerMaxFilters));
//
//
//
//        inputAtkMinLimit = request.inputAtkMinLimit;
//        inputAtkMaxLimit = request.inputAtkMaxLimit;
//        inputDefMinLimit = request.inputDefMinLimit;
//        inputDefMaxLimit = request.inputDefMaxLimit;
//        inputHpMinLimit = request.inputHpMinLimit;
//        inputHpMaxLimit = request.inputHpMaxLimit;
//        inputSpdMinLimit = request.inputSpdMinLimit;
//        inputSpdMaxLimit = request.inputSpdMaxLimit;
//        inputCrMinLimit = request.inputCrMinLimit;
//        inputCrMaxLimit = request.inputCrMaxLimit;
//        inputCdMinLimit = request.inputCdMinLimit;
//        inputCdMaxLimit = request.inputCdMaxLimit;
//        inputEffMinLimit = request.inputEffMinLimit;
//        inputEffMaxLimit = request.inputEffMaxLimit;
//        inputResMinLimit = request.inputResMinLimit;
//        inputResMaxLimit = request.inputResMaxLimit;
//        inputMinCpLimit = request.inputMinCpLimit;
//        inputMaxCpLimit = request.inputMaxCpLimit;
//        inputMinHppsLimit = request.inputMinHppsLimit;
//        inputMaxHppsLimit = request.inputMaxHppsLimit;
//        inputMinEhpLimit = request.inputMinEhpLimit;
//        inputMaxEhpLimit = request.inputMaxEhpLimit;
//        inputMinEhppsLimit = request.inputMinEhppsLimit;
//        inputMaxEhppsLimit = request.inputMaxEhppsLimit;
//        inputMinDmgLimit = request.inputMinDmgLimit;
//        inputMaxDmgLimit = request.inputMaxDmgLimit;
//        inputMinDmgpsLimit = request.inputMinDmgpsLimit;
//        inputMaxDmgpsLimit = request.inputMaxDmgpsLimit;
//        inputMinMcdmgLimit = request.inputMinMcdmgLimit;
//        inputMaxMcdmgLimit = request.inputMaxMcdmgLimit;
//        inputMinMcdmgpsLimit = request.inputMinMcdmgpsLimit;
//        inputMaxMcdmgpsLimit = request.inputMaxMcdmgpsLimit;
//
//        inputMinDmgHLimit = request.inputMinDmgHLimit;
//        inputMaxDmgHLimit = request.inputMaxDmgHLimit;
//        inputMinUpgradesLimit = request.inputMinUpgradesLimit;
//        inputMaxUpgradesLimit = request.inputMaxUpgradesLimit;
//        inputMinConversionsLimit = request.inputMinConversionsLimit;
//        inputMaxConversionsLimit = request.inputMaxConversionsLimit;
//        inputMinScoreLimit = request.inputMinScoreLimit;
//        inputMaxScoreLimit = request.inputMaxScoreLimit;
//        inputMinPriorityLimit = request.inputMinPriorityLimit;
//        inputMaxPriorityLimit = request.inputMaxPriorityLimit;
//    }

//            final float[] statArrs = new float[] {
//                    atk,
//                    hp,
//                    def,
//                    spd,
//                    cr,
//                    cd,
//                    eff,
//                    res,
//                    cp,
//                    hpps,
//                    ehp,
//                    ehpps,
//                    dmg,
//                    dmgps,
//                    mcdmg,
//                    mcdmgps,
//                    dmgh,
//                    score,
//                    priority,
//                    upgrades,
//                    conversions
//            };
//            localStatBuffer[statJump] = atk;
//            localStatBuffer[statJump + 1] = def;
//            localStatBuffer[statJump + 2] = hp;
//            localStatBuffer[statJump + 3] = spd;
//            localStatBuffer[statJump + 4] = cr;
//            localStatBuffer[statJump + 5] = cd;
//            localStatBuffer[statJump + 6] = eff;
//            localStatBuffer[statJump + 7] = res;
//            localStatBuffer[statJump + 8] = cp;
//            localStatBuffer[statJump + 9] = hpps;
//            localStatBuffer[statJump + 10] = ehp;
//            localStatBuffer[statJump + 11] = ehpps;
//            localStatBuffer[statJump + 12] = dmg;
//            localStatBuffer[statJump + 13] = dmgps;
//            localStatBuffer[statJump + 14] = mcdmg;
//            localStatBuffer[statJump + 15] = mcdmgps;
//            localStatBuffer[statJump + 16] = dmgh;
//            localStatBuffer[statJump + 17] = score;
//            localStatBuffer[statJump + 18] = priority;
//            localStatBuffer[statJump + 19] = upgrades;
//            localStatBuffer[statJump + 20] = conversions;

//
//            int sum = 0;
//            for (int x = 0; x < optimizerFilterSize; x++) {
//                final int index = optimizerFilterIndices[x];
////                pass = pass && localStatBuffer[statJump + index] <= optimizerMaxFilters[x] && localStatBuffer[statJump + index] >=  optimizerMinFilters[x];
//                sum += oneIfNegativeElseZero((int)(optimizerMaxFilters[x] - localStatBuffer[statJump + index]));
//                sum += oneIfNegativeElseZero((int)(localStatBuffer[statJump + index] - optimizerMinFilters[x]));
//            }
//            final int passInt = sumValues[sum];



//        final int wSize = iParams[3];
//        final int hSize = iParams[4];
//        final int aSize = iParams[5];
//        final int nSize = iParams[6];
//        final int rSize = iParams[7];
//        final int bSize = iParams[8];
//
//        final int argSize = iParams[2];
//
//        final float bonusBaseAtk = fParams[0];
//        final float bonusBaseDef = fParams[1];
//        final float bonusBaseHp = fParams[2];
//
//        final float atkSetBonus = fParams[3];
//        final float hpSetBonus = fParams[4];
//        final float defSetBonus = fParams[5];
//        final float speedSetBonus = fParams[6];
//        final float revengeSetBonus = fParams[7];
//        final float penSetDmgBonus = fParams[8];
//
//        final float bonusMaxAtk = fParams[9];
//        final float bonusMaxHp = fParams[10];
//        final float bonusMaxDef = fParams[11];
//
//        final int SETTING_RAGE_SET = iParams[0];
//        final int SETTING_PEN_SET = iParams[1];
//        final int max = iParams[9];
//
//        final float baseCr = fParams[12];
//        final float baseCd = fParams[13];
//        final float baseEff = fParams[14];
//        final float baseRes = fParams[15];
//        final float baseSpeed = fParams[16];
//
//        final float bonusCr = fParams[17];
//        final float bonusCd = fParams[18];
//        final float bonusEff = fParams[19];
//        final float bonusRes = fParams[20];
//        final float bonusSpeed = fParams[21];
//
//        final float aeiCr = fParams[22];
//        final float aeiCd = fParams[23];
//        final float aeiEff = fParams[24];
//        final float aeiRes = fParams[25];
//        final float aeiSpeed = fParams[26];
//
//        final int inputAtkMinLimit = iFilters[0];
//        final int inputAtkMaxLimit = iFilters[1];
//        final int inputHpMinLimit = iFilters[2];
//        final int inputHpMaxLimit = iFilters[3];
//        final int inputDefMinLimit = iFilters[4];
//        final int inputDefMaxLimit = iFilters[5];
//        final int inputSpdMinLimit = iFilters[6];
//        final int inputSpdMaxLimit = iFilters[7];
//        final int inputCrMinLimit = iFilters[8];
//        final int inputCrMaxLimit = iFilters[9];
//        final int inputCdMinLimit = iFilters[10];
//        final int inputCdMaxLimit = iFilters[11];
//        final int inputEffMinLimit = iFilters[12];
//        final int inputEffMaxLimit = iFilters[13];
//        final int inputResMinLimit = iFilters[14];
//        final int inputResMaxLimit = iFilters[15];
//        final int inputMinCpLimit = iFilters[16];
//        final int inputMaxCpLimit = iFilters[17];
//        final int inputMinHppsLimit = iFilters[18];
//        final int inputMaxHppsLimit = iFilters[19];
//        final int inputMinEhpLimit = iFilters[20];
//        final int inputMaxEhpLimit = iFilters[21];
//        final int inputMinEhppsLimit = iFilters[22];
//        final int inputMaxEhppsLimit = iFilters[23];
//        final int inputMinDmgLimit = iFilters[24];
//        final int inputMaxDmgLimit = iFilters[25];
//        final int inputMinDmgpsLimit = iFilters[26];
//        final int inputMaxDmgpsLimit = iFilters[27];
//        final int inputMinMcdmgLimit = iFilters[28];
//        final int inputMaxMcdmgLimit = iFilters[29];
//        final int inputMinMcdmgpsLimit = iFilters[30];
//        final int inputMaxMcdmgpsLimit = iFilters[31];
//
//        final int inputMinDmgHLimit = iFilters[32];
//        final int inputMaxDmgHLimit = iFilters[33];
//        final int inputMinUpgradesLimit = iFilters[34];
//        final int inputMaxUpgradesLimit = iFilters[35];
//        final int inputMinConversionsLimit = iFilters[36];
//        final int inputMaxConversionsLimit = iFilters[37];
//        final int inputMinScoreLimit = iFilters[38];
//        final int inputMaxScoreLimit = iFilters[39];
//        final int inputMinPriorityLimit = iFilters[40];
//        final int inputMaxPriorityLimit = iFilters[41];

//    @Constant private final int wSize;
//    @Constant private final int hSize;
//    @Constant private final int aSize;
//    @Constant private final int nSize;
//    @Constant private final int rSize;
//    @Constant private final int bSize;
//
//    @Constant private final int argSize;
//
//    @Constant private final float bonusBaseAtk;
//    @Constant private final float bonusBaseHp;
//    @Constant private final float bonusBaseDef;
//
//    @Constant private final float atkSetBonus;
//    @Constant private final float hpSetBonus;
//    @Constant private final float defSetBonus;
//    @Constant private final float speedSetBonus;
//    @Constant private final float revengeSetBonus;
//    @Constant private final float penSetDmgBonus;
//
//    @Constant private final float bonusMaxAtk;
//    @Constant private final float bonusMaxHp;
//    @Constant private final float bonusMaxDef;
//
//    @Constant private final int SETTING_RAGE_SET;
//    @Constant private final int SETTING_PEN_SET;
//
//    @Constant private final float baseCr;
//    @Constant private final float baseCd;
//    @Constant private final float baseEff;
//    @Constant private final float baseRes;
//    @Constant private final float baseSpeed;
//
//    @Constant private final float bonusCr;
//    @Constant private final float bonusCd;
//    @Constant private final float bonusEff;
//    @Constant private final float bonusRes;
//    @Constant private final float bonusSpeed;
//
//    @Constant private final float aeiCr;
//    @Constant private final float aeiCd;
//    @Constant private final float aeiEff;
//    @Constant private final float aeiRes;
//    @Constant private final float aeiSpeed;



//    @Constant private final float[] fParams;
//    @Constant private final int[] iParams;
//    @Constant private final int[] iFilters;



//        fParams = new float[] {
//                bonusBaseAtk,    // 0
//                bonusBaseDef,    // 1
//                bonusBaseHp,     // 2
//                atkSetBonus,     // 3
//                hpSetBonus,      // 4
//                defSetBonus,     // 5
//                speedSetBonus,   // 6
//                revengeSetBonus, // 7
//                penSetDmgBonus,  // 8
//                bonusMaxAtk,     // 9
//                bonusMaxDef,     // 10
//                bonusMaxHp,      // 11
//                base.cr,         // 12
//                base.cd,         // 13
//                base.eff,        // 14
//                base.res,        // 15
//                base.spd,        // 16
//                hero.bonusCr,    // 17
//                hero.bonusCd,    // 18
//                hero.bonusEff,   // 19
//                hero.bonusRes,   // 20
//                hero.bonusSpeed, // 21
//                hero.aeiCr,      // 22
//                hero.aeiCd,      // 23
//                hero.aeiEff,     // 24
//                hero.aeiRes,     // 25
//                hero.aeiSpeed,   // 26
//        };
//
//        iParams = new int[] {
//                SETTING_RAGE_SET, // 0
//                SETTING_PEN_SET,  // 1
//                argSize,          // 2
//                wSize,            // 3
//                hSize,            // 4
//                aSize,            // 5
//                nSize,            // 6
//                rSize,            // 7
//                bSize,            // 8
//                max,              // 9
//        };
//
//        iFilters = new int[] {
//                request.inputAtkMinLimit,           // 0
//                request.inputAtkMaxLimit,           // 1
//                request.inputHpMinLimit,            // 2
//                request.inputHpMaxLimit,            // 3
//                request.inputDefMinLimit,           // 4
//                request.inputDefMaxLimit,           // 5
//                request.inputSpdMinLimit,           // 6
//                request.inputSpdMaxLimit,           // 7
//                request.inputCrMinLimit,            // 8
//                request.inputCrMaxLimit,            // 9
//                request.inputCdMinLimit,            // 10
//                request.inputCdMaxLimit,            // 11
//                request.inputEffMinLimit,           // 12
//                request.inputEffMaxLimit,           // 13
//                request.inputResMinLimit,           // 14
//                request.inputResMaxLimit,           // 15
//                request.inputMinCpLimit,            // 16
//                request.inputMaxCpLimit,            // 17
//                request.inputMinHppsLimit,          // 18
//                request.inputMaxHppsLimit,          // 19
//                request.inputMinEhpLimit,           // 20
//                request.inputMaxEhpLimit,           // 21
//                request.inputMinEhppsLimit,         // 22
//                request.inputMaxEhppsLimit,         // 23
//                request.inputMinDmgLimit,           // 24
//                request.inputMaxDmgLimit,           // 25
//                request.inputMinDmgpsLimit,         // 26
//                request.inputMaxDmgpsLimit,         // 27
//                request.inputMinMcdmgLimit,         // 28
//                request.inputMaxMcdmgLimit,         // 29
//                request.inputMinMcdmgpsLimit,       // 30
//                request.inputMaxMcdmgpsLimit,       // 31
//
//                request.inputMinDmgHLimit,          // 32
//                request.inputMaxDmgHLimit,          // 33
//                request.inputMinUpgradesLimit,      // 34
//                request.inputMaxUpgradesLimit,      // 35
//                request.inputMinConversionsLimit,   // 36
//                request.inputMaxConversionsLimit,   // 37
//                request.inputMinScoreLimit,         // 38
//                request.inputMaxScoreLimit,         // 39
//                request.inputMinPriorityLimit,      // 40
//                request.inputMaxPriorityLimit,      // 41
//        };
