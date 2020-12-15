package com.fribbels.db;

import com.fribbels.model.HeroStats;

import java.util.HashMap;
import java.util.Map;

public class BaseStatsDb {

    private Map<String, HeroStats> baseStatsByName;

    public BaseStatsDb() {
        baseStatsByName = new HashMap<>();
    }

    public HeroStats getBaseStatsByName(final String name) {
        if (!baseStatsByName.containsKey(name)) {
            return null;
        }

        final HeroStats baseStats = baseStatsByName.get(name);
        return HeroStats.builder()
                .atk(baseStats.getAtk())
                .hp(baseStats.getHp())
                .def(baseStats.getDef())
                .cr(baseStats.getCr())
                .cd(baseStats.getCd())
                .eff(baseStats.getEff())
                .res(baseStats.getRes())
                .dac(baseStats.getDac())
                .spd(baseStats.getSpd())
                .cp(baseStats.getCp())
                .ehp(baseStats.getEhp())
                .hpps(baseStats.getHpps())
                .ehpps(baseStats.getEhpps())
                .dmg(baseStats.getDmg())
                .dmgps(baseStats.getDmgps())
                .mcdmg(baseStats.getMcdmg())
                .mcdmgps(baseStats.getMcdmgps())
                .build();
    }

    public void setBaseStatsByName(final Map<String, HeroStats> baseStatsByName) {
        this.baseStatsByName = baseStatsByName;
    }
}

