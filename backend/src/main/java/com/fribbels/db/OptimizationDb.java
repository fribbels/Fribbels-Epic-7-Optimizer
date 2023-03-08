package com.fribbels.db;

import com.fribbels.core.Sorter;
import com.fribbels.enums.OptimizationColumn;
import com.fribbels.enums.SortOrder;
import com.fribbels.model.HeroStats;
import org.apache.commons.lang3.ArrayUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class OptimizationDb {

    private HeroStats[] resultHeroStats;
    private int[] filteredIndices;
    private Set<String> filteredIds;
    private long maximum;
    private long filteredMaximum;
    private boolean filtered = false;

    private OptimizationColumn column;
    private SortOrder order;

    public OptimizationDb() {
        resultHeroStats = new HeroStats[]{};
        filteredIndices = new int[]{};
        filteredIds = new HashSet<>();
        maximum = 0;
        filteredMaximum = 0;
        filtered = false;
    }

    public void setResultHeroes(final HeroStats[] newResultHeroStats, final long newMaximum) {
        resultHeroStats = ArrayUtils.subarray(newResultHeroStats, 0, Integer.parseInt("" + newMaximum));
        maximum = newMaximum;
        filteredMaximum = 0;
        filteredIds = new HashSet<>();
        filteredIndices = new int[]{};
        filtered = false;
    }

    public void setFilteredIds(final Set<String> newFilteredIds, final int newFilteredMaximum) {
        filtered = true;
        filteredIds = newFilteredIds;
        filteredMaximum = newFilteredMaximum;

        int count = 0;
        final int[] sortedFilteredIndices = new int[newFilteredMaximum];
        for (int i = 0; i < maximum; i++) {
            if (filteredIds.contains(resultHeroStats[i].getId())) {
                sortedFilteredIndices[count] = i;
                count++;
            }
        }

        filteredIndices = sortedFilteredIndices;
    }

    public HeroStats[] getRows(final int startRow, final int endRow) {
        System.out.println("Filtered indices.length " + filteredIndices.length);
        System.out.println("FilteredIds size " + filteredIds.size());

        if (filteredIds.size() == 0) {
            return ArrayUtils.subarray(resultHeroStats, startRow, endRow);
        }

        final List<HeroStats> results = new ArrayList<>();
        for (int i = startRow; i < endRow; i++) {
            if (i >= filteredIndices.length) {
                break;
            }
            final int index = filteredIndices[i];
            final HeroStats heroStats = resultHeroStats[index];
            results.add(heroStats);
        }

        final HeroStats[] resultsArray = new HeroStats[results.size()];
        return results.toArray(resultsArray);
    }

    public HeroStats[] getAllHeroStats() {
        return resultHeroStats;
    }

    public long getMaximum() {
        if (filtered)
            return filteredMaximum;
        return maximum;
    }

    public void sort(final OptimizationColumn newColumn, final SortOrder newOrder) {
        if (newColumn == null || newOrder == null || (newColumn == column && newOrder == order)) {
            return;
        }

//        System.out.println("START SORT");
//        Sorter.sortHeroes(resultHeroStats, newColumn, newOrder);
//        System.out.println("END SORT");

        int count = 0;
        final int[] sortedFilteredIndices = new int[Integer.parseInt("" + maximum)];
        for (int i = 0; i < maximum; i++) {
            if (filteredIds.contains(resultHeroStats[i].getId())) {
                sortedFilteredIndices[count] = i;
                count++;
            }
        }

        filteredIndices = sortedFilteredIndices;

        column = newColumn;
        order = newOrder;
    }
}
