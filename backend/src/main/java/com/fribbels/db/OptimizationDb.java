package com.fribbels.db;

import com.fribbels.core.Sorter;
import com.fribbels.enums.OptimizationColumn;
import com.fribbels.enums.SortOrder;
import com.fribbels.model.HeroStats;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class OptimizationDb {

    private HeroStats[] resultHeroStats;
    private int[] filteredIndices;
    private Set<String> filteredIds;

    private long maximum;
    private long filteredMaximum;
    private boolean filtered;

    private OptimizationColumn column;
    private SortOrder order;

    public OptimizationDb() {
        this.resultHeroStats = new HeroStats[0];
        this.filteredIndices = new int[0];
        this.filteredIds = new HashSet<>();
        this.maximum = 0;
        this.filteredMaximum = 0;
        this.filtered = false;
    }

    public void setResultHeroes(final HeroStats[] newResultHeroStats, final long newMaximum) {
        int limit = (int) newMaximum;
        this.resultHeroStats = Arrays.copyOfRange(newResultHeroStats, 0, limit);
        this.maximum = newMaximum;

        this.filteredMaximum = 0;
        this.filteredIds.clear();
        this.filteredIndices = new int[0];
        this.filtered = false;
    }

    public void setFilteredIds(final Set<String> newFilteredIds, final int newFilteredMaximum) {
        this.filtered = true;
        this.filteredIds = newFilteredIds;
        this.filteredMaximum = newFilteredMaximum;

        int[] indices = new int[newFilteredMaximum];
        int count = 0;

        for (int i = 0; i < maximum; i++) {
            if (filteredIds.contains(resultHeroStats[i].getId())) {
                indices[count++] = i;
            }
        }

        this.filteredIndices = indices;
    }

    public HeroStats[] getRows(final int startRow, final int endRow) {
        if (!filtered) {
            return Arrays.copyOfRange(resultHeroStats, startRow, Math.min(endRow, resultHeroStats.length));
        }

        List<HeroStats> results = new ArrayList<>();

        for (int i = startRow; i < endRow && i < filteredIndices.length; i++) {
            results.add(resultHeroStats[filteredIndices[i]]);
        }

        return results.toArray(new HeroStats[0]);
    }

    public HeroStats[] getAllHeroStats() {
        return resultHeroStats;
    }

    public long getMaximum() {
        return filtered ? filteredMaximum : maximum;
    }

    public void sort(final OptimizationColumn newColumn, final SortOrder newOrder) {
        if (newColumn == null || newOrder == null || (newColumn == column && newOrder == order)) {
            return;
        }

        Sorter.sortHeroes(resultHeroStats, newColumn, newOrder);

        if (filtered) {
            int[] sortedFilteredIndices = new int[(int) maximum];
            int count = 0;

            for (int i = 0; i < maximum; i++) {
                if (filteredIds.contains(resultHeroStats[i].getId())) {
                    sortedFilteredIndices[count++] = i;
                }
            }

            this.filteredIndices = Arrays.copyOf(sortedFilteredIndices, count);
        }

        this.column = newColumn;
        this.order = newOrder;
    }
}