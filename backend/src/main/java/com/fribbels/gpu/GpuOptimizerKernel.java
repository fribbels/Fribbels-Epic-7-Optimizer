package com.fribbels.gpu;

import com.aparapi.Kernel;
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

    @Constant final int wSize;
    @Constant final int hSize;
    @Constant final int aSize;
    @Constant final int nSize;
    @Constant final int rSize;
    @Constant final int bSize;

    @Constant final int argSize;

    @Constant final float bonusBaseAtk;
    @Constant final float bonusBaseHp;
    @Constant final float bonusBaseDef;

    @Constant final float atkSetBonus;
    @Constant final float hpSetBonus;
    @Constant final float defSetBonus;
    @Constant final float speedSetBonus;
    @Constant final float revengeSetBonus;
    @Constant final float penSetDmgBonus;

    @Constant final float bonusMaxAtk;
    @Constant final float bonusMaxHp;
    @Constant final float bonusMaxDef;

    @Constant final int SETTING_RAGE_SET;
    @Constant final int SETTING_PEN_SET;

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
    @Constant final int max;

    // Attempt at optimizing filters
    //    @Constant final int[] sumValues = new int[] {0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1}; // 21 values, one per filter
    //    @Constant final int[] sumValues = new int[] {1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}; // 21 values, one per filter
    //    @Constant final boolean[] boolValues = new boolean[] {false, true, true}; // 21 values, one per filter
    //    @Constant final int[] optimizerMinFilters;
    //    @Constant final int[] optimizerMaxFilters;
    //    @Constant final int[] optimizerFilterIndices;
    //    @Constant final int optimizerFilterSize;
    //    @Constant final int[] intArr;

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
    @Constant final int inputMinUpgradesLimit;
    @Constant final int inputMaxUpgradesLimit;
    @Constant final int inputMinConversionsLimit;
    @Constant final int inputMaxConversionsLimit;
    @Constant final int inputMinScoreLimit;
    @Constant final int inputMaxScoreLimit;
    @Constant final int inputMinPriorityLimit;
    @Constant final int inputMaxPriorityLimit;

    float[] debug;

    int iteration;
    boolean[] passes;
    @Constant final int[] setSolutionBitMasks;

//    @Local int[] localSetsBuffer = new int[256 * 16];
//    @Local final float[] localStatBuffer = new float[256 * 21];

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
            final int max,
            final int[] setSolutionBitMasks
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
        inputMinDmgDLimit = request.inputMinDmgDLimit;
        inputMaxDmgDLimit = request.inputMaxDmgDLimit;
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
        this.setPermutationIndicesPlusOne = request.setPermutationIndicesPlusOne;
        this.setSolutionCounters = request.setSolutionCounters;
        this.setSolutionBitMasks = setSolutionBitMasks;
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
//        final int localId = getLocalId();

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
            final int torrentSet = min(1, setSolutionBitMasks[setIndex] & (1 << 26)) + min(1, setSolutionBitMasks[setIndex] & (1 << 27)) + min(1, setSolutionBitMasks[setIndex] & (1 << 28));


            // Set calculations using localbuffer instead off mask
//            localSetsBuffer[setJump] = 0;
//            localSetsBuffer[setJump + 1] = 0;
//            localSetsBuffer[setJump + 2] = 0;
//            localSetsBuffer[setJump + 3] = 0;
//            localSetsBuffer[setJump + 4] = 0;
//            localSetsBuffer[setJump + 5] = 0;
//            localSetsBuffer[setJump + 6] = 0;
//            localSetsBuffer[setJump + 7] = 0;
//            localSetsBuffer[setJump + 8] = 0;
//            localSetsBuffer[setJump + 9] = 0;
//            localSetsBuffer[setJump + 10] = 0;
//            localSetsBuffer[setJump + 11] = 0;
//            localSetsBuffer[setJump + 12] = 0;
//            localSetsBuffer[setJump + 13] = 0;
//            localSetsBuffer[setJump + 14] = 0;
//            localSetsBuffer[setJump + 15] = 0;

//            localSetsBuffer[(int)wSet + setJump] += 1;
//            localSetsBuffer[(int)hSet + setJump] += 1;
//            localSetsBuffer[(int)aSet + setJump] += 1;
//            localSetsBuffer[(int)nSet + setJump] += 1;
//            localSetsBuffer[(int)rSet + setJump] += 1;
//            localSetsBuffer[(int)bSet + setJump] += 1;

//            final int hpSet = localSetsBuffer[setJump + 0] / 2;
//            final int defSet = localSetsBuffer[setJump + 1] / 2;
//            final int atkSet = localSetsBuffer[setJump + 2] / 4;
//            final int speedSet = localSetsBuffer[setJump + 3] / 4;
//            final int crSet = localSetsBuffer[setJump + 4] / 2;
//            final int effSet = localSetsBuffer[setJump + 5] / 2;
//            final int cdSet = localSetsBuffer[setJump + 6] / 4;
//            final int resSet = localSetsBuffer[setJump + 9] / 2;
//            final int rageSet = localSetsBuffer[setJump + 11] / 4;
//            final int penSet = localSetsBuffer[setJump + 13] / 2;
//            final int revengeSet = localSetsBuffer[setJump + 14] / 4;

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

            final float rageMultiplier = max(1, rageSet * SETTING_RAGE_SET * 1.3f);
            final float penMultiplier = max(1, min(penSet, 1) * SETTING_PEN_SET * penSetDmgBonus);
            final float torrentMultiplier = max(1, torrentSet * 0.1f + 1);
            final float spdDiv1000 = (float)spd/1000;

            final int ehp = (int) (hp * (def/300 + 1));
            final int hpps = (int) (hp*spdDiv1000);
            final int ehpps = (int) ((float)ehp*spdDiv1000);
            final int dmg = (int) (((critRate * atk * critDamage) + (1-critRate) * atk) * rageMultiplier * penMultiplier * torrentMultiplier);
            final int dmgps = (int) ((float)dmg*spdDiv1000);
            final int mcdmg = (int) (atk * critDamage * rageMultiplier * penMultiplier * torrentMultiplier);
            final int mcdmgps = (int) ((float)mcdmg*spdDiv1000);
            final int dmgh = (int) ((critDamage * hp * rageMultiplier * penMultiplier * torrentMultiplier)/10);
            final int dmgd = (int) ((critDamage * def * rageMultiplier * penMultiplier * torrentMultiplier));

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
                    ||  dmgd < inputMinDmgDLimit || dmgd > inputMaxDmgDLimit
                    ||  score < inputMinScoreLimit || score > inputMaxScoreLimit;
            final boolean f3 = priority < inputMinPriorityLimit || priority > inputMaxPriorityLimit
                    ||  upgrades < inputMinUpgradesLimit || upgrades > inputMaxUpgradesLimit
                    ||  conversions < inputMinConversionsLimit || conversions > inputMaxConversionsLimit;



//            if (true)
//                return;

            passes[id] = !(f1 || f2 || f3) && setPermutationIndicesPlusOne[setIndex] > 0;
//            passes[id] = setIndex >= 340122242;
        }
    }
}

/*
Compiled opencl OUTDATED


#pragma OPENCL EXTENSION cl_khr_fp64 : enable

typedef struct This_s{
   int max;
   int iteration;
   int wSize;
   int hSize;
   int aSize;
   int nSize;
   int rSize;
   int bSize;
   int argSize;
   __constant float *flattenedWeaponAccs;
   __constant float *flattenedHelmetAccs;
   __constant float *flattenedArmorAccs;
   __constant float *flattenedNecklaceAccs;
   __constant float *flattenedRingAccs;
   __constant float *flattenedBootAccs;
   __local int *localSetsBuffer;
   float bonusBaseAtk;
   float atkSetBonus;
   float bonusMaxAtk;
   float bonusBaseHp;
   float hpSetBonus;
   float bonusMaxHp;
   float bonusBaseDef;
   float defSetBonus;
   float bonusMaxDef;
   float baseCr;
   float bonusCr;
   float aeiCr;
   float baseCd;
   float bonusCd;
   float aeiCd;
   float baseEff;
   float bonusEff;
   float aeiEff;
   float baseRes;
   float bonusRes;
   float aeiRes;
   float baseSpeed;
   float speedSetBonus;
   float revengeSetBonus;
   float bonusSpeed;
   float aeiSpeed;
   int SETTING_RAGE_SET;
   int SETTING_PEN_SET;
   float penSetDmgBonus;
   int inputAtkMinLimit;
   int inputAtkMaxLimit;
   int inputHpMinLimit;
   int inputHpMaxLimit;
   int inputDefMinLimit;
   int inputDefMaxLimit;
   int inputSpdMinLimit;
   int inputSpdMaxLimit;
   int inputCrMinLimit;
   int inputCrMaxLimit;
   int inputCdMinLimit;
   int inputCdMaxLimit;
   int inputEffMinLimit;
   int inputEffMaxLimit;
   int inputResMinLimit;
   int inputResMaxLimit;
   int inputMinCpLimit;
   int inputMaxCpLimit;
   int inputMinHppsLimit;
   int inputMaxHppsLimit;
   int inputMinEhpLimit;
   int inputMaxEhpLimit;
   int inputMinEhppsLimit;
   int inputMaxEhppsLimit;
   int inputMinDmgLimit;
   int inputMaxDmgLimit;
   int inputMinDmgpsLimit;
   int inputMaxDmgpsLimit;
   int inputMinMcdmgLimit;
   int inputMaxMcdmgLimit;
   int inputMinMcdmgpsLimit;
   int inputMaxMcdmgpsLimit;
   int inputMinDmgHLimit;
   int inputMaxDmgHLimit;
   int inputMinScoreLimit;
   int inputMaxScoreLimit;
   int inputMinPriorityLimit;
   int inputMaxPriorityLimit;
   int inputMinUpgradesLimit;
   int inputMaxUpgradesLimit;
   int inputMinConversionsLimit;
   int inputMaxConversionsLimit;
   __global char  *passes;
   __constant char  *boolArr;
   int passid;
}This;
int get_pass_id(This *this){
   return this->passid;
}
__kernel void run(
   int max,
   int iteration,
   int wSize,
   int hSize,
   int aSize,
   int nSize,
   int rSize,
   int bSize,
   int argSize,
   __constant float *flattenedWeaponAccs,
   __constant float *flattenedHelmetAccs,
   __constant float *flattenedArmorAccs,
   __constant float *flattenedNecklaceAccs,
   __constant float *flattenedRingAccs,
   __constant float *flattenedBootAccs,
   __local int *localSetsBuffer,
   float bonusBaseAtk,
   float atkSetBonus,
   float bonusMaxAtk,
   float bonusBaseHp,
   float hpSetBonus,
   float bonusMaxHp,
   float bonusBaseDef,
   float defSetBonus,
   float bonusMaxDef,
   float baseCr,
   float bonusCr,
   float aeiCr,
   float baseCd,
   float bonusCd,
   float aeiCd,
   float baseEff,
   float bonusEff,
   float aeiEff,
   float baseRes,
   float bonusRes,
   float aeiRes,
   float baseSpeed,
   float speedSetBonus,
   float revengeSetBonus,
   float bonusSpeed,
   float aeiSpeed,
   int SETTING_RAGE_SET,
   int SETTING_PEN_SET,
   float penSetDmgBonus,
   int inputAtkMinLimit,
   int inputAtkMaxLimit,
   int inputHpMinLimit,
   int inputHpMaxLimit,
   int inputDefMinLimit,
   int inputDefMaxLimit,
   int inputSpdMinLimit,
   int inputSpdMaxLimit,
   int inputCrMinLimit,
   int inputCrMaxLimit,
   int inputCdMinLimit,
   int inputCdMaxLimit,
   int inputEffMinLimit,
   int inputEffMaxLimit,
   int inputResMinLimit,
   int inputResMaxLimit,
   int inputMinCpLimit,
   int inputMaxCpLimit,
   int inputMinHppsLimit,
   int inputMaxHppsLimit,
   int inputMinEhpLimit,
   int inputMaxEhpLimit,
   int inputMinEhppsLimit,
   int inputMaxEhppsLimit,
   int inputMinDmgLimit,
   int inputMaxDmgLimit,
   int inputMinDmgpsLimit,
   int inputMaxDmgpsLimit,
   int inputMinMcdmgLimit,
   int inputMaxMcdmgLimit,
   int inputMinMcdmgpsLimit,
   int inputMaxMcdmgpsLimit,
   int inputMinDmgHLimit,
   int inputMaxDmgHLimit,
   int inputMinScoreLimit,
   int inputMaxScoreLimit,
   int inputMinPriorityLimit,
   int inputMaxPriorityLimit,
   int inputMinUpgradesLimit,
   int inputMaxUpgradesLimit,
   int inputMinConversionsLimit,
   int inputMaxConversionsLimit,
   __global char  *passes,
   __constant char  *boolArr,
   int passid
){
   This thisStruct;
   This* this=&thisStruct;
   this->max = max;
   this->iteration = iteration;
   this->wSize = wSize;
   this->hSize = hSize;
   this->aSize = aSize;
   this->nSize = nSize;
   this->rSize = rSize;
   this->bSize = bSize;
   this->argSize = argSize;
   this->flattenedWeaponAccs = flattenedWeaponAccs;
   this->flattenedHelmetAccs = flattenedHelmetAccs;
   this->flattenedArmorAccs = flattenedArmorAccs;
   this->flattenedNecklaceAccs = flattenedNecklaceAccs;
   this->flattenedRingAccs = flattenedRingAccs;
   this->flattenedBootAccs = flattenedBootAccs;
   this->localSetsBuffer = localSetsBuffer;
   this->bonusBaseAtk = bonusBaseAtk;
   this->atkSetBonus = atkSetBonus;
   this->bonusMaxAtk = bonusMaxAtk;
   this->bonusBaseHp = bonusBaseHp;
   this->hpSetBonus = hpSetBonus;
   this->bonusMaxHp = bonusMaxHp;
   this->bonusBaseDef = bonusBaseDef;
   this->defSetBonus = defSetBonus;
   this->bonusMaxDef = bonusMaxDef;
   this->baseCr = baseCr;
   this->bonusCr = bonusCr;
   this->aeiCr = aeiCr;
   this->baseCd = baseCd;
   this->bonusCd = bonusCd;
   this->aeiCd = aeiCd;
   this->baseEff = baseEff;
   this->bonusEff = bonusEff;
   this->aeiEff = aeiEff;
   this->baseRes = baseRes;
   this->bonusRes = bonusRes;
   this->aeiRes = aeiRes;
   this->baseSpeed = baseSpeed;
   this->speedSetBonus = speedSetBonus;
   this->revengeSetBonus = revengeSetBonus;
   this->bonusSpeed = bonusSpeed;
   this->aeiSpeed = aeiSpeed;
   this->SETTING_RAGE_SET = SETTING_RAGE_SET;
   this->SETTING_PEN_SET = SETTING_PEN_SET;
   this->penSetDmgBonus = penSetDmgBonus;
   this->inputAtkMinLimit = inputAtkMinLimit;
   this->inputAtkMaxLimit = inputAtkMaxLimit;
   this->inputHpMinLimit = inputHpMinLimit;
   this->inputHpMaxLimit = inputHpMaxLimit;
   this->inputDefMinLimit = inputDefMinLimit;
   this->inputDefMaxLimit = inputDefMaxLimit;
   this->inputSpdMinLimit = inputSpdMinLimit;
   this->inputSpdMaxLimit = inputSpdMaxLimit;
   this->inputCrMinLimit = inputCrMinLimit;
   this->inputCrMaxLimit = inputCrMaxLimit;
   this->inputCdMinLimit = inputCdMinLimit;
   this->inputCdMaxLimit = inputCdMaxLimit;
   this->inputEffMinLimit = inputEffMinLimit;
   this->inputEffMaxLimit = inputEffMaxLimit;
   this->inputResMinLimit = inputResMinLimit;
   this->inputResMaxLimit = inputResMaxLimit;
   this->inputMinCpLimit = inputMinCpLimit;
   this->inputMaxCpLimit = inputMaxCpLimit;
   this->inputMinHppsLimit = inputMinHppsLimit;
   this->inputMaxHppsLimit = inputMaxHppsLimit;
   this->inputMinEhpLimit = inputMinEhpLimit;
   this->inputMaxEhpLimit = inputMaxEhpLimit;
   this->inputMinEhppsLimit = inputMinEhppsLimit;
   this->inputMaxEhppsLimit = inputMaxEhppsLimit;
   this->inputMinDmgLimit = inputMinDmgLimit;
   this->inputMaxDmgLimit = inputMaxDmgLimit;
   this->inputMinDmgpsLimit = inputMinDmgpsLimit;
   this->inputMaxDmgpsLimit = inputMaxDmgpsLimit;
   this->inputMinMcdmgLimit = inputMinMcdmgLimit;
   this->inputMaxMcdmgLimit = inputMaxMcdmgLimit;
   this->inputMinMcdmgpsLimit = inputMinMcdmgpsLimit;
   this->inputMaxMcdmgpsLimit = inputMaxMcdmgpsLimit;
   this->inputMinDmgHLimit = inputMinDmgHLimit;
   this->inputMaxDmgHLimit = inputMaxDmgHLimit;
   this->inputMinScoreLimit = inputMinScoreLimit;
   this->inputMaxScoreLimit = inputMaxScoreLimit;
   this->inputMinPriorityLimit = inputMinPriorityLimit;
   this->inputMaxPriorityLimit = inputMaxPriorityLimit;
   this->inputMinUpgradesLimit = inputMinUpgradesLimit;
   this->inputMaxUpgradesLimit = inputMaxUpgradesLimit;
   this->inputMinConversionsLimit = inputMinConversionsLimit;
   this->inputMaxConversionsLimit = inputMaxConversionsLimit;
   this->passes = passes;
   this->boolArr = boolArr;
   this->passid = passid;
   {
      int id = get_global_id(0);
      int localId = get_local_id(0);
      int setJump = localId * 16;
      long i = ((long)this->max * (long)this->iteration) + (long)id;
      if ((i - ((((((long)this->wSize * (long)this->hSize) * (long)this->aSize) * (long)this->nSize) * (long)this->rSize) * (long)this->bSize))<0){
         int b = (int)(i % (long)this->bSize);
         int r = (int)(((i - (long)b) / (long)this->bSize) % (long)this->rSize);
         int n = (int)((((i - (long)(r * this->bSize)) - (long)b) / (long)(this->bSize * this->rSize)) % (long)this->nSize);
         int a = (int)(((((i - (long)((n * this->rSize) * this->bSize)) - (long)(r * this->bSize)) - (long)b) / (long)((this->bSize * this->rSize) * this->nSize)) % (long)this->aSize);
         int h = (int)((((((i - (long)(((a * this->nSize) * this->rSize) * this->bSize)) - (long)((n * this->rSize) * this->bSize)) - (long)(r * this->bSize)) - (long)b) / (long)(((this->bSize * this->rSize) * this->nSize) * this->aSize)) % (long)this->hSize);
         int w = (int)(((((((i - (long)((((h * this->aSize) * this->nSize) * this->rSize) * this->bSize)) - (long)(((a * this->nSize) * this->rSize) * this->bSize)) - (long)((n * this->rSize) * this->bSize)) - (long)(r * this->bSize)) - (long)b) / (long)((((this->bSize * this->rSize) * this->nSize) * this->aSize) * this->hSize)) % (long)this->wSize);
         int wargSize = w * this->argSize;
         float wAtk = this->flattenedWeaponAccs[wargSize];
         float wHp = this->flattenedWeaponAccs[(wargSize + 1)];
         float wDef = this->flattenedWeaponAccs[(wargSize + 2)];
         float wCr = this->flattenedWeaponAccs[(wargSize + 6)];
         float wCd = this->flattenedWeaponAccs[(wargSize + 7)];
         float wEff = this->flattenedWeaponAccs[(wargSize + 8)];
         float wRes = this->flattenedWeaponAccs[(wargSize + 9)];
         float wSpeed = this->flattenedWeaponAccs[(wargSize + 10)];
         float wScore = this->flattenedWeaponAccs[(wargSize + 11)];
         float wSet = this->flattenedWeaponAccs[(wargSize + 12)];
         float wPrio = this->flattenedWeaponAccs[(wargSize + 13)];
         float wUpg = this->flattenedWeaponAccs[(wargSize + 14)];
         float wConv = this->flattenedWeaponAccs[(wargSize + 15)];
         int hargSize = h * this->argSize;
         float hAtk = this->flattenedHelmetAccs[hargSize];
         float hHp = this->flattenedHelmetAccs[(hargSize + 1)];
         float hDef = this->flattenedHelmetAccs[(hargSize + 2)];
         float hCr = this->flattenedHelmetAccs[(hargSize + 6)];
         float hCd = this->flattenedHelmetAccs[(hargSize + 7)];
         float hEff = this->flattenedHelmetAccs[(hargSize + 8)];
         float hRes = this->flattenedHelmetAccs[(hargSize + 9)];
         float hSpeed = this->flattenedHelmetAccs[(hargSize + 10)];
         float hScore = this->flattenedHelmetAccs[(hargSize + 11)];
         float hSet = this->flattenedHelmetAccs[(hargSize + 12)];
         float hPrio = this->flattenedHelmetAccs[(hargSize + 13)];
         float hUpg = this->flattenedHelmetAccs[(hargSize + 14)];
         float hConv = this->flattenedHelmetAccs[(hargSize + 15)];
         int aargSize = a * this->argSize;
         float aAtk = this->flattenedArmorAccs[aargSize];
         float aHp = this->flattenedArmorAccs[(aargSize + 1)];
         float aDef = this->flattenedArmorAccs[(aargSize + 2)];
         float aCr = this->flattenedArmorAccs[(aargSize + 6)];
         float aCd = this->flattenedArmorAccs[(aargSize + 7)];
         float aEff = this->flattenedArmorAccs[(aargSize + 8)];
         float aRes = this->flattenedArmorAccs[(aargSize + 9)];
         float aSpeed = this->flattenedArmorAccs[(aargSize + 10)];
         float aScore = this->flattenedArmorAccs[(aargSize + 11)];
         float aSet = this->flattenedArmorAccs[(aargSize + 12)];
         float aPrio = this->flattenedArmorAccs[(aargSize + 13)];
         float aUpg = this->flattenedArmorAccs[(aargSize + 14)];
         float aConv = this->flattenedArmorAccs[(aargSize + 15)];
         int nargSize = n * this->argSize;
         float nAtk = this->flattenedNecklaceAccs[nargSize];
         float nHp = this->flattenedNecklaceAccs[(nargSize + 1)];
         float nDef = this->flattenedNecklaceAccs[(nargSize + 2)];
         float nCr = this->flattenedNecklaceAccs[(nargSize + 6)];
         float nCd = this->flattenedNecklaceAccs[(nargSize + 7)];
         float nEff = this->flattenedNecklaceAccs[(nargSize + 8)];
         float nRes = this->flattenedNecklaceAccs[(nargSize + 9)];
         float nSpeed = this->flattenedNecklaceAccs[(nargSize + 10)];
         float nScore = this->flattenedNecklaceAccs[(nargSize + 11)];
         float nSet = this->flattenedNecklaceAccs[(nargSize + 12)];
         float nPrio = this->flattenedNecklaceAccs[(nargSize + 13)];
         float nUpg = this->flattenedNecklaceAccs[(nargSize + 14)];
         float nConv = this->flattenedNecklaceAccs[(nargSize + 15)];
         int rargSize = r * this->argSize;
         float rAtk = this->flattenedRingAccs[rargSize];
         float rHp = this->flattenedRingAccs[(rargSize + 1)];
         float rDef = this->flattenedRingAccs[(rargSize + 2)];
         float rCr = this->flattenedRingAccs[(rargSize + 6)];
         float rCd = this->flattenedRingAccs[(rargSize + 7)];
         float rEff = this->flattenedRingAccs[(rargSize + 8)];
         float rRes = this->flattenedRingAccs[(rargSize + 9)];
         float rSpeed = this->flattenedRingAccs[(rargSize + 10)];
         float rScore = this->flattenedRingAccs[(rargSize + 11)];
         float rSet = this->flattenedRingAccs[(rargSize + 12)];
         float rPrio = this->flattenedRingAccs[(rargSize + 13)];
         float rUpg = this->flattenedRingAccs[(rargSize + 14)];
         float rConv = this->flattenedRingAccs[(rargSize + 15)];
         int bargSize = b * this->argSize;
         float bAtk = this->flattenedBootAccs[bargSize];
         float bHp = this->flattenedBootAccs[(bargSize + 1)];
         float bDef = this->flattenedBootAccs[(bargSize + 2)];
         float bCr = this->flattenedBootAccs[(bargSize + 6)];
         float bCd = this->flattenedBootAccs[(bargSize + 7)];
         float bEff = this->flattenedBootAccs[(bargSize + 8)];
         float bRes = this->flattenedBootAccs[(bargSize + 9)];
         float bSpeed = this->flattenedBootAccs[(bargSize + 10)];
         float bScore = this->flattenedBootAccs[(bargSize + 11)];
         float bSet = this->flattenedBootAccs[(bargSize + 12)];
         float bPrio = this->flattenedBootAccs[(bargSize + 13)];
         float bUpg = this->flattenedBootAccs[(bargSize + 14)];
         float bConv = this->flattenedBootAccs[(bargSize + 15)];
         this->localSetsBuffer[setJump]  = 0;
         this->localSetsBuffer[setJump + 1]  = 0;
         this->localSetsBuffer[setJump + 2]  = 0;
         this->localSetsBuffer[setJump + 3]  = 0;
         this->localSetsBuffer[setJump + 4]  = 0;
         this->localSetsBuffer[setJump + 5]  = 0;
         this->localSetsBuffer[setJump + 6]  = 0;
         this->localSetsBuffer[setJump + 7]  = 0;
         this->localSetsBuffer[setJump + 8]  = 0;
         this->localSetsBuffer[setJump + 9]  = 0;
         this->localSetsBuffer[setJump + 10]  = 0;
         this->localSetsBuffer[setJump + 11]  = 0;
         this->localSetsBuffer[setJump + 12]  = 0;
         this->localSetsBuffer[setJump + 13]  = 0;
         this->localSetsBuffer[setJump + 14]  = 0;
         this->localSetsBuffer[setJump + 15]  = 0;
         this->localSetsBuffer[(int)wSet + setJump]  = this->localSetsBuffer[(int)wSet + setJump] + 1;
         this->localSetsBuffer[(int)hSet + setJump]  = this->localSetsBuffer[(int)hSet + setJump] + 1;
         this->localSetsBuffer[(int)aSet + setJump]  = this->localSetsBuffer[(int)aSet + setJump] + 1;
         this->localSetsBuffer[(int)nSet + setJump]  = this->localSetsBuffer[(int)nSet + setJump] + 1;
         this->localSetsBuffer[(int)rSet + setJump]  = this->localSetsBuffer[(int)rSet + setJump] + 1;
         this->localSetsBuffer[(int)bSet + setJump]  = this->localSetsBuffer[(int)bSet + setJump] + 1;
         int hpSet = this->localSetsBuffer[setJump] / 2;
         int defSet = this->localSetsBuffer[(setJump + 1)] / 2;
         int atkSet = this->localSetsBuffer[(setJump + 2)] / 4;
         int speedSet = this->localSetsBuffer[(setJump + 3)] / 4;
         int crSet = this->localSetsBuffer[(setJump + 4)] / 2;
         int effSet = this->localSetsBuffer[(setJump + 5)] / 2;
         int cdSet = this->localSetsBuffer[(setJump + 6)] / 4;
         int resSet = this->localSetsBuffer[(setJump + 9)] / 2;
         int rageSet = this->localSetsBuffer[(setJump + 11)] / 4;
         int penSet = this->localSetsBuffer[(setJump + 13)] / 2;
         int revengeSet = this->localSetsBuffer[(setJump + 14)] / 4;
         float atk = (((((((this->bonusBaseAtk + wAtk) + hAtk) + aAtk) + nAtk) + rAtk) + bAtk) + ((float)atkSet * this->atkSetBonus)) * this->bonusMaxAtk;
         float hp = (((((((this->bonusBaseHp + wHp) + hHp) + aHp) + nHp) + rHp) + bHp) + ((float)hpSet * this->hpSetBonus)) * this->bonusMaxHp;
         float def = (((((((this->bonusBaseDef + wDef) + hDef) + aDef) + nDef) + rDef) + bDef) + ((float)defSet * this->defSetBonus)) * this->bonusMaxDef;
         int cr = (int)(((((((((this->baseCr + wCr) + hCr) + aCr) + nCr) + rCr) + bCr) + (float)(crSet * 12)) + this->bonusCr) + this->aeiCr);
         int cd = (int)(((((((((this->baseCd + wCd) + hCd) + aCd) + nCd) + rCd) + bCd) + (float)(cdSet * 40)) + this->bonusCd) + this->aeiCd);
         int eff = (int)(((((((((this->baseEff + wEff) + hEff) + aEff) + nEff) + rEff) + bEff) + (float)(effSet * 20)) + this->bonusEff) + this->aeiEff);
         int res = (int)(((((((((this->baseRes + wRes) + hRes) + aRes) + nRes) + rRes) + bRes) + (float)(resSet * 20)) + this->bonusRes) + this->aeiRes);
         int spd = (int)((((((((((this->baseSpeed + wSpeed) + hSpeed) + aSpeed) + nSpeed) + rSpeed) + bSpeed) + ((float)speedSet * this->speedSetBonus)) + ((float)revengeSet * this->revengeSetBonus)) + this->bonusSpeed) + this->aeiSpeed);
         float critRate = (float)min(100, cr) / 100.0f;
         float critDamage = (float)min(350, cd) / 100.0f;
         int cp = (int)(((((double)((atk * 1.6f) + (((atk * 1.6f) * critRate) * critDamage)) * (1.0 + (double)(((float)spd - 45.0f) * 0.02f))) + (double)hp) + (double)(def * 9.3f)) * (double)(1.0f + ((((float)res / 100.0f) + ((float)eff / 100.0f)) / 4.0f)));
         float rageMultiplier = fmax(1.0f, ((float)(rageSet * this->SETTING_RAGE_SET) * 1.3f));
         float penMultiplier = fmax(1.0f, ((float)(min(penSet, 1) * this->SETTING_PEN_SET) * this->penSetDmgBonus));
         float spdDiv1000 = (float)spd / 1000.0f;
         int ehp = (int)(hp * ((def / 300.0f) + 1.0f));
         int hpps = (int)(hp * spdDiv1000);
         int ehpps = (int)((float)ehp * spdDiv1000);
         int dmg = (int)(((((critRate * atk) * critDamage) + ((1.0f - critRate) * atk)) * rageMultiplier) * penMultiplier);
         int dmgps = (int)((float)dmg * spdDiv1000);
         int mcdmg = (int)(((atk * critDamage) * rageMultiplier) * penMultiplier);
         int mcdmgps = (int)((float)mcdmg * spdDiv1000);
         int dmgh = (int)(((float)cd * hp) / 1000.0f);
         int score = (int)(((((wScore + hScore) + aScore) + nScore) + rScore) + bScore);
         int priority = (int)(((((wPrio + hPrio) + aPrio) + nPrio) + rPrio) + bPrio);
         int upgrades = (int)(((((wUpg + hUpg) + aUpg) + nUpg) + rUpg) + bUpg);
         int conversions = (int)(((((wConv + hConv) + aConv) + nConv) + rConv) + bConv);
         char f1 = (atk<(float)this->inputAtkMinLimit || atk>(float)this->inputAtkMaxLimit || hp<(float)this->inputHpMinLimit || hp>(float)this->inputHpMaxLimit || def<(float)this->inputDefMinLimit || def>(float)this->inputDefMaxLimit || spd<this->inputSpdMinLimit || spd>this->inputSpdMaxLimit || cr<this->inputCrMinLimit || cr>this->inputCrMaxLimit || cd<this->inputCdMinLimit || cd>this->inputCdMaxLimit || eff<this->inputEffMinLimit || eff>this->inputEffMaxLimit || res<this->inputResMinLimit || res>this->inputResMaxLimit || cp<this->inputMinCpLimit || cp>this->inputMaxCpLimit)?1:0;
         char f2 = (hpps<this->inputMinHppsLimit || hpps>this->inputMaxHppsLimit || ehp<this->inputMinEhpLimit || ehp>this->inputMaxEhpLimit || ehpps<this->inputMinEhppsLimit || ehpps>this->inputMaxEhppsLimit || dmg<this->inputMinDmgLimit || dmg>this->inputMaxDmgLimit || dmgps<this->inputMinDmgpsLimit || dmgps>this->inputMaxDmgpsLimit || mcdmg<this->inputMinMcdmgLimit || mcdmg>this->inputMaxMcdmgLimit || mcdmgps<this->inputMinMcdmgpsLimit || mcdmgps>this->inputMaxMcdmgpsLimit || dmgh<this->inputMinDmgHLimit || dmgh>this->inputMaxDmgHLimit || score<this->inputMinScoreLimit || score>this->inputMaxScoreLimit)?1:0;
         char f3 = (priority<this->inputMinPriorityLimit || priority>this->inputMaxPriorityLimit || upgrades<this->inputMinUpgradesLimit || upgrades>this->inputMaxUpgradesLimit || conversions<this->inputMinConversionsLimit || conversions>this->inputMaxConversionsLimit)?1:0;
         int iWset = (int)wSet;
         int iHset = (int)hSet;
         int iAset = (int)aSet;
         int iNset = (int)nSet;
         int iRset = (int)rSet;
         int iBset = (int)bSet;
         int index = (((((iWset * 1048576) + (iHset * 65536)) + (iAset * 4096)) + (iNset * 256)) + (iRset * 16)) + iBset;
         this->passes[id]  = (f1==0 && f2==0 && f3==0 && this->boolArr[index]!=0)?1:0;
      }
      return;
   }
}


 */



















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
