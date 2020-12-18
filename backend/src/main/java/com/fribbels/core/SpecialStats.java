package com.fribbels.core;

import com.fribbels.model.HeroStats;
import org.apache.commons.lang3.StringUtils;

public class SpecialStats {

    public static HeroStats setScBonusStats(final HeroStats hero) {
        if (StringUtils.equals("Angelic Montmorancy", hero.getName())) {
            hero.setRes(hero.getRes() + 40);
            hero.setHp(5312); // 4111 * (1.09 + 0.1) + (60*3 + 80*3)

            return hero;
        }

        if (StringUtils.equals("Captain Rikoris", hero.getName())) {
            hero.setHp(5985); // 4677 * (1.09 + 0.1) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 10);
            hero.setDef(1024); // 735 * (1.09 + 0.1) + (20*3 + 30*3)

            return hero;
        }

        if (StringUtils.equals("Chaos Inquisitor", hero.getName())) {
            hero.setHp(5609); // 4718 * (1.0 + 0.1) + (60*3 + 80*3)
            hero.setEff(hero.getEff() + 25);

            return hero;
        }

        if (StringUtils.equals("Chaos Sect Axe", hero.getName())) {
            hero.setHp(6192); // 4475 * (1.09 + 0.2) + (60*3 + 80*3)
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
            hero.setAtk(1137); // 816 * (1.09 + 0.12) + (20*3 + 30*3)
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
            hero.setEff(hero.getEff() + 12);
            hero.setHp(5590); // 4273 * (1.06 + 0.15) + (60*3 + 80*3)

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

        return hero;
    }
}
