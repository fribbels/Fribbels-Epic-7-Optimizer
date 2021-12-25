package com.fribbels.gpu;

import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.request.OptimizationRequest;

public class SetFormat000OptimizerKernel extends GpuOptimizerKernel {

    public SetFormat000OptimizerKernel(final OptimizationRequest request, final float[] flattenedWeaponAccs, final float[] flattenedHelmetAccs, final float[] flattenedArmorAccs, final float[] flattenedNecklaceAccs, final float[] flattenedRingAccs, final float[] flattenedBootAccs, final float bonusBaseAtk, final float bonusBaseDef, final float bonusBaseHp, final float atkSetBonus, final float hpSetBonus, final float defSetBonus, final float speedSetBonus, final float revengeSetBonus, final float penSetDmgBonus, final float bonusMaxAtk, final float bonusMaxDef, final float bonusMaxHp, final int SETTING_RAGE_SET, final int SETTING_PEN_SET, final HeroStats base, final Hero hero, final int argSize, final int wSize, final int hSize, final int aSize, final int nSize, final int rSize, final int bSize, final int max, final int[] setSolutionBitMasks) {
        super(request, flattenedWeaponAccs, flattenedHelmetAccs, flattenedArmorAccs, flattenedNecklaceAccs, flattenedRingAccs, flattenedBootAccs, bonusBaseAtk, bonusBaseDef, bonusBaseHp, atkSetBonus, hpSetBonus, defSetBonus, speedSetBonus, revengeSetBonus, penSetDmgBonus, bonusMaxAtk, bonusMaxDef, bonusMaxHp, SETTING_RAGE_SET, SETTING_PEN_SET, base, hero, argSize, wSize, hSize, aSize, nSize, rSize, bSize, max, setSolutionBitMasks);
    }

    @Override
    public void run() {
        final int id = getGlobalId();

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

            final int setIndex = iWset * 1048576
                    + iHset * 65536
                    + iAset * 4096
                    + iNset * 256
                    + iRset * 16
                    + iBset;

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
            final int dmgh = (int) ((cd * hp * penMultiplier)/1000);

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


            passes[id] = !(f1 || f2 || f3);
        }
    }
}
