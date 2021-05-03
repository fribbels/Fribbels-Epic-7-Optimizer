package com.fribbels.core;

import com.fribbels.model.HeroStats;
import org.apache.commons.lang3.StringUtils;

public class SpecialStats {

    public static HeroStats setScBonusStats(final HeroStats hero, final int stars) {
        if (StringUtils.equals("Eaton", hero.getName())) {
            hero.setBonusMaxHpPercent(20);

            return hero;
        }

        if (StringUtils.equals("Gunther", hero.getName())) {
            hero.setBonusMaxAtkPercent(75);

            return hero;
        }

        if (StringUtils.equals("Lena", hero.getName())) {
            hero.setCr(hero.getCr() + 50);

            return hero;
        }

        if (StringUtils.equals("Apocalypse Ravi", hero.getName())) {
            hero.setCr(hero.getCr() + 30);

            return hero;
        }

        if (StringUtils.equals("Senya", hero.getName())) {
            hero.setBonusMaxAtkPercent(30);

            return hero;
        }

        if (stars == 5) {
            return setScBonusStatsFiveStar(hero);
        }

        if (stars == 6) {
            return setScBonusStatsSixStar(hero);
        }

        return hero;
    }

    public static HeroStats setScBonusStatsSixStar(final HeroStats hero) {
        if (StringUtils.equals("Angelic Montmorancy", hero.getName())) {
            hero.setRes(hero.getRes() + 40);
            hero.setHp(5312); // 4111 * (1.09 + 0.1) + (60*3 + 80*3)

            return hero;
        }

        if (StringUtils.equals("Captain Rikoris", hero.getName())) {
            hero.setHp(6453); // 4677 * (1.09 + 0.2) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 10);
            hero.setDef(665); // 550 * (1.06 + 0.15)

            return hero;
        }

        if (StringUtils.equals("Chaos Inquisitor", hero.getName())) {
            hero.setHp(5609); // 4718 * (1.0 + 0.1) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Chaos Sect Axe", hero.getName())) {
            hero.setHp(6013); // 4475 * (1.0 + 0.25) + (60*3 + 80*3)
            hero.setDef(624); // 543 * (1.0 + 0.15)
            hero.setCr(hero.getCr() + 5);

            return hero;
        }

        if (StringUtils.equals("Commander Lorina", hero.getName())) {
            hero.setAtk(1161); // 843 * (1.18 + 0.02) + (20*3 + 30*3)
            hero.setCd(hero.getCd() + 2);

            return hero;
        }

        if (StringUtils.equals("Falconer Kluri", hero.getName())) {
            hero.setDef(625); // 596 * (1.0 + 0.05) + 0
            hero.setSpd(hero.getSpd() + 9);

            return hero;
        }

        if (StringUtils.equals("Researcher Carrot", hero.getName())) {
            hero.setAtk(1243); // 816 * (1.09 + 0.25) + (20*3 + 30*3)
            hero.setHp(4801); // 3505 * (1.0 + 0.25) + (60*3 + 80*3)

            return hero;
        }

        if (StringUtils.equals("Righteous Thief Roozid", hero.getName())) {
            hero.setHp(5160); // 3950 * (1.0 + 0.2) + (60*3 + 80*3)
            hero.setSpd(hero.getSpd() + 8);

            return hero;
        }

        if (StringUtils.equals("Mercenary Helga", hero.getName())) {
            hero.setHp(5924); // 4475 * (1.03 + 0.2) + (60*3 + 80*3)
            hero.setAtk(1117); // 780 * (1.09 + 0.15) + (20*3 + 30*3)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Magic Scholar Doris", hero.getName())) {
            hero.setSpd(hero.getSpd() + 5);
            hero.setHp(5734); // 4152 * (1.18 + 0.1) + (60*3 + 80*3)
            hero.setRes(hero.getRes() + 25);

            return hero;
        }

        if (StringUtils.equals("All-Rounder Wanda", hero.getName())) {
            hero.setHp(5590); // 4273 * (1.06 + 0.15) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 12);

            return hero;
        }

        if (StringUtils.equals("Doll Maker Pearlhorizon", hero.getName())) {
            hero.setHp(5742); // 4435 * (1.0 + 0.2) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 15);

            return hero;
        }

        if (StringUtils.equals("Adventurer Ras", hero.getName())) {
            hero.setHp(6818); // 4960 * (1.09 + 0.2) + (60*3 + 80*3)
            hero.setSpd(hero.getSpd() + 6);
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Zealot Carmainerose", hero.getName())) {
            hero.setHp(4367); // 3262 * (1.06 + 0.15) + (60*3 + 80*3)
            hero.setDef(1152); // 666 * (1.00 + 0.1) + (60*3 + 80*3)
            hero.setCd(hero.getCd() + 10);

            return hero;
        }

        if (StringUtils.equals("Muse Rima", hero.getName())) {
            hero.setHp(5120); // 4273 * (1.00 + 0.1) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        return hero;
    }

    public static HeroStats setScBonusStatsFiveStar(final HeroStats hero) {
        if (StringUtils.equals("Angelic Montmorancy", hero.getName())) {
            hero.setRes(hero.getRes() + 40);
            hero.setHp(4231); // 3270 * (1.09 + 0.1) + (60*3 + 80*2)

            return hero;
        }

        if (StringUtils.equals("Captain Rikoris", hero.getName())) {
            hero.setHp(4915); // 3720* (1.03 + 0.2) + (60*3 + 80*2)
            hero.setEff(hero.getEff() + 10);
            hero.setDef(536); // 443 * (1.06 + 0.15)

            return hero;
        }

        if (StringUtils.equals("Chaos Inquisitor", hero.getName())) {
            hero.setHp(4467); // 3752 * (1.0 + 0.1) + (60*3 + 80*2)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Chaos Sect Axe", hero.getName())) {
            hero.setHp(4788); // 3559 * (1.0 + 0.25) + (60*3 + 80*2)
            hero.setDef(503); // 438 * (1.0 + 0.15)
            hero.setCr(hero.getCr() + 5);

            return hero;
        }

        if (StringUtils.equals("Commander Lorina", hero.getName())) {
            hero.setAtk(891); // 677 * (1.12 + 0.02) + (20*3 + 30*2)
            hero.setCd(hero.getCd() + 2);

            return hero;
        }

        if (StringUtils.equals("Falconer Kluri", hero.getName())) {
            hero.setDef(504); // 480 * (1.0 + 0.05) + 0
            hero.setSpd(hero.getSpd() + 9);

            return hero;
        }

        if (StringUtils.equals("Researcher Carrot", hero.getName())) {
            hero.setAtk(997); // 655 * (1.09 + 0.25) + (20*3 + 30*2)
            hero.setHp(3825); // 2788 * (1.0 + 0.25) + (60*3 + 80*2)

            return hero;
        }

        if (StringUtils.equals("Righteous Thief Roozid", hero.getName())) {
            hero.setHp(4109); // 3141 * (1.0 + 0.2) + (60*3 + 80*2)
            hero.setSpd(hero.getSpd() + 8);

            return hero;
        }

        if (StringUtils.equals("Mercenary Helga", hero.getName())) {
            hero.setHp(4717); // 3559 * (1.03 + 0.2) + (60*3 + 80*2)
            hero.setAtk(896); // 626 * (1.09 + 0.15) + (20*3 + 30*2)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Magic Scholar Doris", hero.getName())) {
            hero.setSpd(hero.getSpd() + 5);
            hero.setHp(4368); // 3302 * (1.12 + 0.1) + (60*3 + 80*2)
            hero.setRes(hero.getRes() + 25);

            return hero;
        }

        if (StringUtils.equals("All-Rounder Wanda", hero.getName())) {
            hero.setHp(4248); // 3399 * (1.0 + 0.15) + (60*3 + 80*2)
            hero.setEff(hero.getEff() + 12);

            return hero;
        }

        if (StringUtils.equals("Doll Maker Pearlhorizon", hero.getName())) {
            hero.setHp(4572); // 3527 * (1.0 + 0.2) + (60*3 + 80*2)
            hero.setEff(hero.getEff() + 15);

            return hero;
        }

        if (StringUtils.equals("Adventurer Ras", hero.getName())) {
            hero.setHp(5429); // 3945 * (1.09 + 0.2) + (60*3 + 80*2)
            hero.setSpd(hero.getSpd() + 6);
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Zealot Carmainerose", hero.getName())) {
            hero.setHp(3479); // 2595 * (1.06 + 0.15) + (60*3 + 80*2)
            hero.setDef(930); // 537 * (1.00 + 0.1) + (60*3 + 80*2)
            hero.setCd(hero.getCd() + 10);

            return hero;
        }

        if (StringUtils.equals("Muse Rima", hero.getName())) {
            hero.setHp(4078); // 3399 * (1.00 + 0.1) + (60*3 + 80*2)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        return hero;
    }
}
