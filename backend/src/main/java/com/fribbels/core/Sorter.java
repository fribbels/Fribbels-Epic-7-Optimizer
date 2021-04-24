package com.fribbels.core;

import com.fribbels.enums.OptimizationColumn;
import com.fribbels.enums.SortOrder;
import com.fribbels.model.HeroStats;

import java.util.Arrays;
import java.util.Comparator;

public class Sorter {

    public static void sortHeroes(final HeroStats[] data, final OptimizationColumn column, final SortOrder order) {
        System.out.println("SORTING HEROES BY " + column + " " + order);
        switch (order) {
            case ASC:
                switch (column) {
                    case ATK:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getAtk));
                        break;
                    case HP:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getHp));
                        break;
                    case DEF:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDef));
                        break;
                    case SPD:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getSpd));
                        break;
                    case CR:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getCr));
                        break;
                    case CD:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getCd));
                        break;
                    case EFF:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getEff));
                        break;
                    case RES:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getRes));
                        break;
                    case DAC:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDac));
                        break;
                    case CP:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getCp));
                        break;
                    case HPPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getHpps));
                        break;
                    case EHP:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getEhp));
                        break;
                    case EHPPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getEhpps));
                        break;
                    case DMG:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDmg));
                        break;
                    case DMGPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDmgps));
                        break;
                    case MCDMG:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getMcdmg));
                        break;
                    case MCDMGPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getMcdmgps));
                        break;
                    case DMGH:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDmgh));
                        break;
                    case UPGRADES:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getUpgrades));
                        break;
                    case SCORE:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getScore));
                        break;
                    case PRIORITY:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getPriority));
                        break;
                    case CONVERSIONS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getConversions));
                        break;
                    default:
                        System.err.println("INVALID COLUMN " + column);
                }
                break;

            case DESC:
                switch (column) {
                    case ATK:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getAtk).reversed());
                        break;
                    case HP:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getHp).reversed());
                        break;
                    case DEF:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDef).reversed());
                        break;
                    case SPD:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getSpd).reversed());
                        break;
                    case CR:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getCr).reversed());
                        break;
                    case CD:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getCd).reversed());
                        break;
                    case EFF:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getEff).reversed());
                        break;
                    case RES:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getRes).reversed());
                        break;
                    case DAC:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDac).reversed());
                        break;
                    case CP:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getCp).reversed());
                        break;
                    case HPPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getHpps).reversed());
                        break;
                    case EHP:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getEhp).reversed());
                        break;
                    case EHPPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getEhpps).reversed());
                        break;
                    case DMG:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDmg).reversed());
                        break;
                    case DMGPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDmgps).reversed());
                        break;
                    case MCDMG:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getMcdmg).reversed());
                        break;
                    case MCDMGPS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getMcdmgps).reversed());
                        break;
                    case DMGH:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getDmgh).reversed());
                        break;
                    case UPGRADES:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getUpgrades).reversed());
                        break;
                    case SCORE:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getScore).reversed());
                        break;
                    case PRIORITY:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getPriority).reversed());
                        break;
                    case CONVERSIONS:
                        Arrays.sort(data, Comparator.comparingInt(HeroStats::getConversions).reversed());
                        break;
                    default:
                        System.err.println("INVALID COLUMN " + column);
                }
                break;
            default:
                System.err.println("INVALID ORDER " + order);
        }
    }
}
