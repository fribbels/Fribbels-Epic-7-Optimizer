package com.fribbels.aparapi;

import com.aparapi.Kernel;
import lombok.Setter;

@Setter
public class GpuOptimizer extends Kernel {

//    private float[] flattenedNecklaceAccs;
//    private float[] flattenedRingAccs;
    private float[] flattenedWeaponAccs;
    private float[] flattenedHelmetAccs;
    private float[] flattenedArmorAccs;
    private float[] flattenedNecklaceAccs;
    private float[] flattenedRingAccs;
    private float[] flattenedBootAccs;

    private int wSize;
    private int hSize;
    private int aSize;
    private int nSize;
    private int rSize;
    private int bSize;

    private int argSize;
    private int outputArgs;

//    private float[] weaponAccumulatorArr;
//    private float[] helmetAccumulatorArr;
//    private float[] armorAccumulatorArr;
//    private float[] necklaceAccumulatorArr;
//    private float[] ringAccumulatorArr;
//    private float[] bootAccumulatorArr;

    private float bonusBaseAtk;
    private float bonusBaseHp;
    private float bonusBaseDef;

    private float atkSetBonus;
    private float hpSetBonus;
    private float defSetBonus;
    private float speedSetBonus;
    private float revengeSetBonus;
    private float penSetDmgBonus;

    private float bonusMaxAtk;
    private float bonusMaxHp;
    private float bonusMaxDef;

    private int SETTING_RAGE_SET;
    private int SETTING_PEN_SET;

    private float baseCr;
    private float baseCd;
    private float baseEff;
    private float baseRes;
    private float baseSpeed;

    private float bonusCr;
    private float bonusCd;
    private float bonusEff;
    private float bonusRes;
    private float bonusSpeed;

    private float aeiCr;
    private float aeiCd;
    private float aeiEff;
    private float aeiRes;
    private float aeiSpeed;

//    private float[] results;
    private boolean[] passes;
    private int iteration;

    int minimum(int a, int b) {
        return b+((a-b)&((a-b)>>31));
    }

    int maximum(int a, int b) {
        return a-((a-b)&((a-b)>>31));
    }

    @Override
    public void run() {
        final int id = getGlobalId();
        final long i = 65536 * iteration + id;

        if (i < ((long)(wSize)) * hSize * aSize * nSize * rSize * bSize) {
            final int b = (int)(i % bSize);
            final int r = (int)(( ( i - b ) / bSize ) %  rSize);
            final int n = (int)(( ( i - r * bSize - b ) / (bSize * rSize) ) % nSize);
            final int a = (int)(( ( i - n * rSize * bSize - r * bSize - b ) / (bSize * rSize * nSize) ) % aSize);
            final int h = (int)(( ( i - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize) ) % hSize);
            final int w = (int)(( ( i - h * aSize * nSize * rSize * bSize - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize * hSize) ) % wSize);

            //            // accs3
            final float wAtk =   flattenedWeaponAccs[w * argSize + 0];
            final float wHp =    flattenedWeaponAccs[w * argSize + 1];
            final float wDef =   flattenedWeaponAccs[w * argSize + 2];
            final float wMain1 = flattenedWeaponAccs[w * argSize + 3];
            final float wMain2 = flattenedWeaponAccs[w * argSize + 4];
            final float wMain3 = flattenedWeaponAccs[w * argSize + 5];
            final float wCr =    flattenedWeaponAccs[w * argSize + 6];
            final float wCd =    flattenedWeaponAccs[w * argSize + 7];
            final float wEff =   flattenedWeaponAccs[w * argSize + 8];
            final float wRes =   flattenedWeaponAccs[w * argSize + 9];
            final float wSpeed = flattenedWeaponAccs[w * argSize + 10];
            final float wScore = flattenedWeaponAccs[w * argSize + 11];
            final float wSet =   flattenedWeaponAccs[w * argSize + 12];

            //            // accs3
            final float hAtk =   flattenedHelmetAccs[h * argSize + 0];
            final float hHp =    flattenedHelmetAccs[h * argSize + 1];
            final float hDef =   flattenedHelmetAccs[h * argSize + 2];
            final float hMain1 = flattenedHelmetAccs[h * argSize + 3];
            final float hMain2 = flattenedHelmetAccs[h * argSize + 4];
            final float hMain3 = flattenedHelmetAccs[h * argSize + 5];
            final float hCr =    flattenedHelmetAccs[h * argSize + 6];
            final float hCd =    flattenedHelmetAccs[h * argSize + 7];
            final float hEff =   flattenedHelmetAccs[h * argSize + 8];
            final float hRes =   flattenedHelmetAccs[h * argSize + 9];
            final float hSpeed = flattenedHelmetAccs[h * argSize + 10];
            final float hScore = flattenedHelmetAccs[h * argSize + 11];
            final float hSet =   flattenedHelmetAccs[h * argSize + 12];

            //            // accs3
            final float aAtk =   flattenedArmorAccs[a * argSize + 0];
            final float aHp =    flattenedArmorAccs[a * argSize + 1];
            final float aDef =   flattenedArmorAccs[a * argSize + 2];
            final float aMain1 = flattenedArmorAccs[a * argSize + 3];
            final float aMain2 = flattenedArmorAccs[a * argSize + 4];
            final float aMain3 = flattenedArmorAccs[a * argSize + 5];
            final float aCr =    flattenedArmorAccs[a * argSize + 6];
            final float aCd =    flattenedArmorAccs[a * argSize + 7];
            final float aEff =   flattenedArmorAccs[a * argSize + 8];
            final float aRes =   flattenedArmorAccs[a * argSize + 9];
            final float aSpeed = flattenedArmorAccs[a * argSize + 10];
            final float aScore = flattenedArmorAccs[a * argSize + 11];
            final float aSet =   flattenedArmorAccs[a * argSize + 12];

            //            // accs3
            final float nAtk =   flattenedNecklaceAccs[n * argSize + 0];
            final float nHp =    flattenedNecklaceAccs[n * argSize + 1];
            final float nDef =   flattenedNecklaceAccs[n * argSize + 2];
            final float nMain1 = flattenedNecklaceAccs[n * argSize + 3];
            final float nMain2 = flattenedNecklaceAccs[n * argSize + 4];
            final float nMain3 = flattenedNecklaceAccs[n * argSize + 5];
            final float nCr =    flattenedNecklaceAccs[n * argSize + 6];
            final float nCd =    flattenedNecklaceAccs[n * argSize + 7];
            final float nEff =   flattenedNecklaceAccs[n * argSize + 8];
            final float nRes =   flattenedNecklaceAccs[n * argSize + 9];
            final float nSpeed = flattenedNecklaceAccs[n * argSize + 10];
            final float nScore = flattenedNecklaceAccs[n * argSize + 11];
            final float nSet =   flattenedNecklaceAccs[n * argSize + 12];
//
//            // accs4
            final float rAtk =   flattenedRingAccs[r * argSize + 0];
            final float rHp =    flattenedRingAccs[r * argSize + 1];
            final float rDef =   flattenedRingAccs[r * argSize + 2];
            final float rMain1 = flattenedRingAccs[r * argSize + 3];
            final float rMain2 = flattenedRingAccs[r * argSize + 4];
            final float rMain3 = flattenedRingAccs[r * argSize + 5];
            final float rCr =    flattenedRingAccs[r * argSize + 6];
            final float rCd =    flattenedRingAccs[r * argSize + 7];
            final float rEff =   flattenedRingAccs[r * argSize + 8];
            final float rRes =   flattenedRingAccs[r * argSize + 9];
            final float rSpeed = flattenedRingAccs[r * argSize + 10];
            final float rScore = flattenedRingAccs[r * argSize + 11];
            final float rSet =   flattenedRingAccs[r * argSize + 12];

            // accs5
            final float bAtk =   flattenedBootAccs[b * argSize + 0];
            final float bHp =    flattenedBootAccs[b * argSize + 1];
            final float bDef =   flattenedBootAccs[b * argSize + 2];
            final float bMain1 = flattenedBootAccs[b * argSize + 3];
            final float bMain2 = flattenedBootAccs[b * argSize + 4];
            final float bMain3 = flattenedBootAccs[b * argSize + 5];
            final float bCr =    flattenedBootAccs[b * argSize + 6];
            final float bCd =    flattenedBootAccs[b * argSize + 7];
            final float bEff =   flattenedBootAccs[b * argSize + 8];
            final float bRes =   flattenedBootAccs[b * argSize + 9];
            final float bSpeed = flattenedBootAccs[b * argSize + 10];
            final float bScore = flattenedBootAccs[b * argSize + 11];
            final float bSet =   flattenedBootAccs[b * argSize + 12];

            int[] sets = new int[16];

            sets[(int)wSet] += 1;
            sets[(int)hSet] += 1;
            sets[(int)aSet] += 1;
            sets[(int)nSet] += 1;
            sets[(int)rSet] += 1;
            sets[(int)bSet] += 1;

            final int hpSet = (int)sets[0] / 2;
            final int defSet = (int)sets[1] / 2;
            final int atkSet = (int)sets[2] / 4;
            final int speedSet = (int)sets[3] / 4;
            final int crSet = (int)sets[4] / 2;
            final int effSet = (int)sets[5] / 2;
            final int cdSet = (int)sets[6] / 4;
            final int lifestealSet = (int)sets[7] / 4;
            final int counterSet = (int)sets[8] / 4;
            final int resSet = (int)sets[9] / 2;
            final int unitySet = (int)sets[10] / 2;
            final int rageSet = (int)sets[11] / 4;
            final int immunitySet = (int)sets[12] / 2;
            final int penSet = (int)sets[13] / 2;
            final int revengeSet = (int)sets[14] / 4;
            final int injurySet = (int)sets[15] / 4;

//            results[i * outputArgs + (int)wSet + 21]++;
//            results[i * outputArgs + (int)hSet + 21]++;
//            results[i * outputArgs + (int)aSet + 21]++;
//            results[i * outputArgs + (int)nSet + 21]++;
//            results[i * outputArgs + (int)rSet + 21]++;
//            results[i * outputArgs + (int)bSet + 21]++;

//            final int hpSet = (int)results[i * outputArgs + 0 + 21] / 2;
//            final int defSet = (int)results[i * outputArgs + 1 + 21] / 2;
//            final int atkSet = (int)results[i * outputArgs + 2 + 21] / 4;
//            final int speedSet = (int)results[i * outputArgs + 3 + 21] / 4;
//            final int crSet = (int)results[i * outputArgs + 4 + 21] / 2;
//            final int effSet = (int)results[i * outputArgs + 5 + 21] / 2;
//            final int cdSet = (int)results[i * outputArgs + 6 + 21] / 4;
//            final int lifestealSet = (int)results[i * outputArgs + 7 + 21] / 4;
//            final int counterSet = (int)results[i * outputArgs + 8 + 21] / 4;
//            final int resSet = (int)results[i * outputArgs + 9 + 21] / 2;
//            final int unitySet = (int)results[i * outputArgs + 10 + 21] / 2;
//            final int rageSet = (int)results[i * outputArgs + 11 + 21] / 4;
//            final int immunitySet = (int)results[i * outputArgs + 12 + 21] / 2;
//            final int penSet = (int)results[i * outputArgs + 13 + 21] / 2;
//            final int revengeSet = (int)results[i * outputArgs + 14 + 21] / 4;
//            final int injurySet = (int)results[i * outputArgs + 15 + 21] / 4;

            final float atk =  ((bonusBaseAtk  + wAtk+hAtk+aAtk+nAtk+rAtk+bAtk + (atkSet * atkSetBonus)) * bonusMaxAtk);
            final float hp =   ((bonusBaseHp   + wHp+hHp+aHp+nHp+rHp+bHp + (minimum(hpSet, 1) * hpSetBonus)) * bonusMaxHp);
            final float def =  ((bonusBaseDef  + wDef+hDef+aDef+nDef+rDef+bDef + (minimum(defSet, 1) * defSetBonus)) * bonusMaxDef);
            final float cr =   minimum(100, (int) (baseCr  + wCr+hCr+aCr+nCr+rCr+bCr + (minimum(crSet, 1) * 12) + bonusCr + aeiCr));
            final int cd =     minimum(350, (int) (baseCd  + wCd+hCd+aCd+nCd+rCd+bCd + (cdSet * 40) + bonusCd + aeiCd));
            final int eff =  (int) (baseEff   + wEff+hEff+aEff+nEff+rEff+bEff + (minimum(effSet, 1) * 20) + bonusEff + aeiEff);
            final int res =  (int) (baseRes   + wRes+hRes+aRes+nRes+rRes+bRes + (minimum(resSet, 1) * 20) + bonusRes + aeiRes);
            final int spd =  (int) (baseSpeed   + wSpeed+hSpeed+aSpeed+nSpeed+rSpeed+bSpeed + (speedSet * speedSetBonus) + (revengeSet * revengeSetBonus) + bonusSpeed + aeiSpeed);

            //        final int atk = (int) (((base.atk + mapAccumulatorArrsToFloat(0, accs)  + (sets[2] > 1 ? sets[2] / 4 * 0.35f * base.atk : 0) + base.atk * hero.bonusAtkPercent / 100f) + hero.bonusAtk) * (1 + base.bonusMaxAtkPercent/100f));
            //        final int hp = (int) (((base.hp   + mapAccumulatorArrsToFloat(1, accs)  + (sets[0] > 1 ? sets[0] / 2 * 0.15f * base.hp : 0) + base.hp * hero.bonusHpPercent / 100f) + hero.bonusHp) * (1 + base.bonusMaxHpPercent/100f));
            //        final int def = (int) (((base.def + mapAccumulatorArrsToFloat(2, accs)  + (sets[1] > 1 ? sets[1] / 2 * 0.15f * base.def : 0) + base.def * hero.bonusDefPercent / 100f) + hero.bonusDef) * (1 + base.bonusMaxDefPercent/100f));
            //        final float cr = (base.cr + mapAccumulatorArrsToFloat(6, accs)  + (sets[4] > 1 ? sets[4] / 2 * 12 : 0)) + hero.bonusCr;
            //        final int cd = (int) (base.cd   + mapAccumulatorArrsToFloat(7, accs)  + (sets[6] > 1 ? sets[6] / 4 * 40 : 0)) + (int) hero.bonusCd;
            //        final int eff = (int) (base.eff + mapAccumulatorArrsToFloat(8, accs)  + (sets[5] > 1 ? sets[5] / 2 * 20 : 0)) + (int) hero.bonusEff;
            //        final int res = (int) (base.res + mapAccumulatorArrsToFloat(9, accs)  + (sets[9] > 1 ? sets[9] / 2 * 20 : 0)) + (int) hero.bonusRes;
            //        final int spd = (int) (base.spd + mapAccumulatorArrsToFloat(10, accs) + (sets[3] > 1 ? sets[3] / 4 * 0.25f * base.spd : 0) + (sets[14] > 1 ? sets[14] / 4 * 0.1f * base.spd : 0)) + hero.bonusSpeed;

            //        int dac = base.getDac() + sets[10] / 2 * 4;

            final float critRate = cr / 100f;
            final float critDamage = cd / 100f;

            final int cp = (int) (((atk * 1.6f + atk * 1.6f * critRate * critDamage) * (1.0 + (spd - 45f) * 0.02f) + hp + def * 9.3f) * (1f + (res/100f + eff/100f) / 4f));

            final float rageMultiplier = rageSet * SETTING_RAGE_SET * 1.3f;
            final float penMultiplier = minimum(penSet, 1) * SETTING_PEN_SET * penSetDmgBonus;
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



            float hpMinFilter = 15000;
            float hpMaxFilter = 18000;

            float pass = min(max(hpMinFilter, hp), hpMaxFilter);
            boolean p = pass != hpMinFilter && pass != hpMaxFilter;

            passes[id] = p;
//            t = 10k, 20k, 30k | 15k 20k 25k



//            results[i * outputArgs + 0] = atk;
//            results[i * outputArgs + 1] = hp;
//            results[i * outputArgs + 2] = def;
//            results[i * outputArgs + 3] = cr;
//            results[i * outputArgs + 4] = cd;
//            results[i * outputArgs + 5] = eff;
//            results[i * outputArgs + 6] = res;
//            results[i * outputArgs + 7] = spd;
//            results[i * outputArgs + 8] = cp;
//            results[i * outputArgs + 9] = ehp;
//            results[i * outputArgs + 10] = hpps;
//            results[i * outputArgs + 11] = ehpps;
//            results[i * outputArgs + 12] = dmg;
//            results[i * outputArgs + 13] = dmgps;
//            results[i * outputArgs + 14] = mcdmg;
//            results[i * outputArgs + 15] = mcdmgps;
//            results[i * outputArgs + 16] = dmgh;
//            results[i * outputArgs + 17] = score;
//            // counts
////            results[i * outputArgs + 18] = n;
////            results[i * outputArgs + 19] = r;
//            results[i * outputArgs + 20] = b;
            // sets
            //                                results[i * outputArgs + 21] = wSet;
            //                                results[i * outputArgs + 22] = hSet;
            //                                results[i * outputArgs + 23] = aSet;
            //                                results[i * outputArgs + 24] = nSet;
            //                                results[i * outputArgs + 25] = rSet;
            //                                results[i * outputArgs + 26] = bSet;

            //                                results[i * outputArgs + 21] = hpSet;
            //                                results[i * outputArgs + 22] = defSet;
            //                                results[i * outputArgs + 23] = atkSet;
            //                                results[i * outputArgs + 24] = speedSet;
            //                                results[i * outputArgs + 25] = crSet;
            //                                results[i * outputArgs + 26] = effSet;
            //                                results[i * outputArgs + 27] = cdSet;
            //                                results[i * outputArgs + 28] = lifestealSet;
            //                                results[i * outputArgs + 29] = counterSet;
            //                                results[i * outputArgs + 30] = resSet;
            //                                results[i * outputArgs + 31] = unitySet;
            //                                results[i * outputArgs + 32] = rageSet;
            //                                results[i * outputArgs + 33] = immunitySet;
            //                                results[i * outputArgs + 34] = penSet;
            //                                results[i * outputArgs + 35] = revengeSet;
            //                                results[i * outputArgs + 36] = injurySet;

//            results[i * outputArgs + 21] = sets[0];
//            results[i * outputArgs + 22] = sets[1];
//            results[i * outputArgs + 23] = sets[2];
//            results[i * outputArgs + 24] = sets[3];
//            results[i * outputArgs + 25] = sets[4];
//            results[i * outputArgs + 26] = sets[5];
//            results[i * outputArgs + 27] = sets[6];
//            results[i * outputArgs + 28] = sets[7];
//            results[i * outputArgs + 29] = sets[8];
//            results[i * outputArgs + 30] = sets[9];
//            results[i * outputArgs + 31] = sets[10];
//            results[i * outputArgs + 32] = sets[11];
//            results[i * outputArgs + 33] = sets[12];
//            results[i * outputArgs + 34] = sets[13];
//            results[i * outputArgs + 35] = sets[14];
//            results[i * outputArgs + 36] = sets[15];
        }
    }
}
