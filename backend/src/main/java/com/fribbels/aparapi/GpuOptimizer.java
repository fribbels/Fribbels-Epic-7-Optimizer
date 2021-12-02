package com.fribbels.aparapi;

import com.aparapi.Kernel;
import lombok.Setter;

@Setter
public class GpuOptimizer extends Kernel {

    private float[] flattenedNecklaceAccs;
    private float[] flattenedRingAccs;
    private float[] flattenedBootAccs;

    private int nSize;
    private int rSize;
    private int bSize;

    private int wSet;
    private int hSet;
    private int aSet;

    private int argSize;
    private int outputArgs;

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

    private float[] weaponAccumulatorArr;
    private float[] helmetAccumulatorArr;
    private float[] armorAccumulatorArr;

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

    private float[] results;

    int minimum(int a, int b) {
        return b+((a-b)&((a-b)>>31));
    }

    int maximum(int a, int b) {
        return a-((a-b)&((a-b)>>31));
    }

    @Override
    public void run() {
        final int i = getGlobalId();

        if (i < nSize * rSize * bSize) {
            final int n = i / (rSize * bSize);
            final int r = (i / bSize) % rSize;
            final int b = i % bSize;

            // accs3
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

            // accs4
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

//            final int[] sets = new int[16];
//            sets[wSet]++;
//            sets[hSet]++;
//            sets[aSet]++;
//            sets[(int)nSet]++;
//            sets[(int)rSet]++;
//            sets[(int)bSet]++;

            results[i * outputArgs + wSet + 21]++;
            results[i * outputArgs + hSet + 21]++;
            results[i * outputArgs + aSet + 21]++;
            results[i * outputArgs + (int)nSet + 21]++;
            results[i * outputArgs + (int)rSet + 21]++;
            results[i * outputArgs + (int)bSet + 21]++;

            final int hpSet = (int)results[i * outputArgs + 0 + 21] / 2;
            final int defSet = (int)results[i * outputArgs + 1 + 21] / 2;
            final int atkSet = (int)results[i * outputArgs + 2 + 21] / 4;
            final int speedSet = (int)results[i * outputArgs + 3 + 21] / 4;
            final int crSet = (int)results[i * outputArgs + 4 + 21] / 2;
            final int effSet = (int)results[i * outputArgs + 5 + 21] / 2;
            final int cdSet = (int)results[i * outputArgs + 6 + 21] / 4;
            final int lifestealSet = (int)results[i * outputArgs + 7 + 21] / 4;
            final int counterSet = (int)results[i * outputArgs + 8 + 21] / 4;
            final int resSet = (int)results[i * outputArgs + 9 + 21] / 2;
            final int unitySet = (int)results[i * outputArgs + 10 + 21] / 2;
            final int rageSet = (int)results[i * outputArgs + 11 + 21] / 4;
            final int immunitySet = (int)results[i * outputArgs + 12 + 21] / 2;
            final int penSet = (int)results[i * outputArgs + 13 + 21] / 2;
            final int revengeSet = (int)results[i * outputArgs + 14 + 21] / 4;
            final int injurySet = (int)results[i * outputArgs + 15 + 21] / 4;

            final float atk =  ((bonusBaseAtk  + weaponAccumulatorArr[0]+helmetAccumulatorArr[0]+armorAccumulatorArr[0]+nAtk+rAtk+bAtk + (atkSet * atkSetBonus)) * bonusMaxAtk);
            final float hp =   ((bonusBaseHp   + weaponAccumulatorArr[1]+helmetAccumulatorArr[1]+armorAccumulatorArr[1]+nHp+rHp+bHp + (minimum(hpSet, 1) * hpSetBonus)) * bonusMaxHp);
            final float def =  ((bonusBaseDef  + weaponAccumulatorArr[2]+helmetAccumulatorArr[2]+armorAccumulatorArr[2]+nDef+rDef+bDef + (minimum(defSet, 1) * defSetBonus)) * bonusMaxDef);
            final float cr =   minimum(100, (int) (baseCr  + weaponAccumulatorArr[6]+helmetAccumulatorArr[6]+armorAccumulatorArr[6]+nCr+rCr+nCr + (minimum(crSet, 1) * 12) + bonusCr + aeiCr));
            final int cd =     minimum(350, (int) (baseCd  + weaponAccumulatorArr[7]+helmetAccumulatorArr[7]+armorAccumulatorArr[7]+nCd+rCd+bCd + (cdSet * 40) + bonusCd + aeiCd));
            final int eff =  (int) (baseEff   + weaponAccumulatorArr[8]+helmetAccumulatorArr[8]+armorAccumulatorArr[8]+nEff+rEff+bEff + (minimum(effSet, 1) * 20) + bonusEff + aeiEff);
            final int res =  (int) (baseRes   + weaponAccumulatorArr[9]+helmetAccumulatorArr[9]+armorAccumulatorArr[9]+nRes+rRes+bRes + (minimum(resSet, 1) * 20) + bonusRes + aeiRes);
            final int spd =  (int) (baseSpeed   + weaponAccumulatorArr[10]+helmetAccumulatorArr[10]+armorAccumulatorArr[10]+nSpeed+rSpeed+bSpeed + (speedSet * speedSetBonus) + (revengeSet * revengeSetBonus) + bonusSpeed + aeiSpeed);

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

            final int score = (int) (weaponAccumulatorArr[11]+helmetAccumulatorArr[11]+armorAccumulatorArr[11]+nScore+rScore+bScore);
            results[i * outputArgs + 0] = atk;
            results[i * outputArgs + 1] = hp;
            results[i * outputArgs + 2] = def;
            results[i * outputArgs + 3] = cr;
            results[i * outputArgs + 4] = cd;
            results[i * outputArgs + 5] = eff;
            results[i * outputArgs + 6] = res;
            results[i * outputArgs + 7] = spd;
            results[i * outputArgs + 8] = cp;
            results[i * outputArgs + 9] = ehp;
            results[i * outputArgs + 10] = hpps;
            results[i * outputArgs + 11] = ehpps;
            results[i * outputArgs + 12] = dmg;
            results[i * outputArgs + 13] = dmgps;
            results[i * outputArgs + 14] = mcdmg;
            results[i * outputArgs + 15] = mcdmgps;
            results[i * outputArgs + 16] = dmgh;
            results[i * outputArgs + 17] = score;
            // counts
            results[i * outputArgs + 18] = n;
            results[i * outputArgs + 19] = r;
            results[i * outputArgs + 20] = b;
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
