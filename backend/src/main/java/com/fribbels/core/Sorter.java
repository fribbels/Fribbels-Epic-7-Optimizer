package com.fribbels.core;

import java.util.Arrays;
import java.util.Comparator;
import java.util.EnumMap;

import com.fribbels.enums.OptimizationColumn;
import com.fribbels.enums.SortOrder;
import com.fribbels.model.HeroStats;

public class Sorter {

    private static final EnumMap<OptimizationColumn, Comparator<HeroStats>> COMPARATORS;

    static {
        COMPARATORS = new EnumMap<>(OptimizationColumn.class);
        COMPARATORS.put(OptimizationColumn.ATK, Comparator.comparingInt(HeroStats::getAtk));
        COMPARATORS.put(OptimizationColumn.HP, Comparator.comparingInt(HeroStats::getHp));
        COMPARATORS.put(OptimizationColumn.DEF, Comparator.comparingInt(HeroStats::getDef));
        COMPARATORS.put(OptimizationColumn.SPD, Comparator.comparingInt(HeroStats::getSpd));
        COMPARATORS.put(OptimizationColumn.CR, Comparator.comparingInt(HeroStats::getCr));
        COMPARATORS.put(OptimizationColumn.CD, Comparator.comparingInt(HeroStats::getCd));
        COMPARATORS.put(OptimizationColumn.EFF, Comparator.comparingInt(HeroStats::getEff));
        COMPARATORS.put(OptimizationColumn.RES, Comparator.comparingInt(HeroStats::getRes));
        COMPARATORS.put(OptimizationColumn.DAC, Comparator.comparingInt(HeroStats::getDac));
        COMPARATORS.put(OptimizationColumn.CP, Comparator.comparingInt(HeroStats::getCp));
        COMPARATORS.put(OptimizationColumn.HPPS, Comparator.comparingInt(HeroStats::getHpps));
        COMPARATORS.put(OptimizationColumn.EHP, Comparator.comparingInt(HeroStats::getEhp));
        COMPARATORS.put(OptimizationColumn.EHPPS, Comparator.comparingInt(HeroStats::getEhpps));
        COMPARATORS.put(OptimizationColumn.DMG, Comparator.comparingInt(HeroStats::getDmg));
        COMPARATORS.put(OptimizationColumn.DMGPS, Comparator.comparingInt(HeroStats::getDmgps));
        COMPARATORS.put(OptimizationColumn.MCDMG, Comparator.comparingInt(HeroStats::getMcdmg));
        COMPARATORS.put(OptimizationColumn.MCDMGPS, Comparator.comparingInt(HeroStats::getMcdmgps));
        COMPARATORS.put(OptimizationColumn.DMGH, Comparator.comparingInt(HeroStats::getDmgh));
        COMPARATORS.put(OptimizationColumn.DMGD, Comparator.comparingInt(HeroStats::getDmgd));
        COMPARATORS.put(OptimizationColumn.S1, Comparator.comparingInt(HeroStats::getS1));
        COMPARATORS.put(OptimizationColumn.S2, Comparator.comparingInt(HeroStats::getS2));
        COMPARATORS.put(OptimizationColumn.S3, Comparator.comparingInt(HeroStats::getS3));
        COMPARATORS.put(OptimizationColumn.UPGRADES, Comparator.comparingInt(HeroStats::getUpgrades));
        COMPARATORS.put(OptimizationColumn.SCORE, Comparator.comparingInt(HeroStats::getScore));
        COMPARATORS.put(OptimizationColumn.BS, Comparator.comparingInt(HeroStats::getBs));
        COMPARATORS.put(OptimizationColumn.PRIORITY, Comparator.comparingInt(HeroStats::getPriority));
        COMPARATORS.put(OptimizationColumn.CONVERSIONS, Comparator.comparingInt(HeroStats::getConversions));
        COMPARATORS.put(OptimizationColumn.EQ, Comparator.comparingInt(HeroStats::getEq));
    }

    private Sorter() {}

    public static void sortHeroes(final HeroStats[] data, final OptimizationColumn column, final SortOrder order) {
        if (data.length <= 1) {
            return;
        }

        Comparator<HeroStats> comparator = Sorter.getComparator(column);

        if (order == SortOrder.DESC) {
            comparator = comparator.reversed();
        } else if (order != SortOrder.ASC) {
            throw new IllegalArgumentException("Invalid sort order: " + order);
        }

        System.out.println("The data is being sorted by " + column + " in " + order + " order. With a total of " + data.length + " heroes.");
        
        Arrays.parallelSort(data, comparator);
    }

    private static Comparator<HeroStats> getComparator(final OptimizationColumn column) {
    final Comparator<HeroStats> comparator = COMPARATORS.get(column);
    if (comparator == null) {
        throw new IllegalArgumentException("Unexpected value: " + column);
    }
    return comparator;
}


    // private static Comparator<HeroStats> getComparator(final OptimizationColumn column) {
    //     return switch (column) {
    //         case ATK -> Comparator.comparingInt(HeroStats::getAtk);
    //         case HP -> Comparator.comparingInt(HeroStats::getHp);
    //         case DEF -> Comparator.comparingInt(HeroStats::getDef);
    //         case SPD -> Comparator.comparingInt(HeroStats::getSpd);
    //         case CR -> Comparator.comparingInt(HeroStats::getCr);
    //         case CD -> Comparator.comparingInt(HeroStats::getCd);
    //         case EFF -> Comparator.comparingInt(HeroStats::getEff);
    //         case RES -> Comparator.comparingInt(HeroStats::getRes);
    //         case DAC -> Comparator.comparingInt(HeroStats::getDac);
    //         case CP -> Comparator.comparingInt(HeroStats::getCp);
    //         case HPPS -> Comparator.comparingInt(HeroStats::getHpps);
    //         case EHP -> Comparator.comparingInt(HeroStats::getEhp);
    //         case EHPPS -> Comparator.comparingInt(HeroStats::getEhpps);
    //         case DMG -> Comparator.comparingInt(HeroStats::getDmg);
    //         case DMGPS -> Comparator.comparingInt(HeroStats::getDmgps);
    //         case MCDMG -> Comparator.comparingInt(HeroStats::getMcdmg);
    //         case MCDMGPS -> Comparator.comparingInt(HeroStats::getMcdmgps);
    //         case DMGH -> Comparator.comparingInt(HeroStats::getDmgh);
    //         case DMGD -> Comparator.comparingInt(HeroStats::getDmgd);
    //         case S1 -> Comparator.comparingInt(HeroStats::getS1);
    //         case S2 -> Comparator.comparingInt(HeroStats::getS2);
    //         case S3 -> Comparator.comparingInt(HeroStats::getS3);
    //         case UPGRADES -> Comparator.comparingInt(HeroStats::getUpgrades);
    //         case SCORE -> Comparator.comparingInt(HeroStats::getScore);
    //         case BS -> Comparator.comparingInt(HeroStats::getBs);
    //         case PRIORITY -> Comparator.comparingInt(HeroStats::getPriority);
    //         case CONVERSIONS -> Comparator.comparingInt(HeroStats::getConversions);
    //         case EQ -> Comparator.comparingInt(HeroStats::getEq);
    //         default -> throw new IllegalStateException("Unexpected value: " + column);
    //     };
    // }
}