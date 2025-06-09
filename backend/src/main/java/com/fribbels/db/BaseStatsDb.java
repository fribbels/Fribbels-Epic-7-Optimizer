package com.fribbels.db;

import com.fribbels.core.SpecialStats;
import com.fribbels.model.BaseStats;
import com.fribbels.model.HeroStats;

import java.util.HashMap;
import java.util.Map;

public class BaseStatsDb {

    private Map<String, BaseStats> baseStatsByName;

    public BaseStatsDb() {
        baseStatsByName = new HashMap<>();
    }

    public BaseStats getBaseStatsByName(final String name) {
        BaseStats baseStats = baseStatsByName.get(name);
        if (baseStats == null) {
            return null;
        }

        return BaseStats.builder()
                .lv50FiveStarFullyAwakened(getBaseStatsByName(name, 5))
                .lv60SixStarFullyAwakened(getBaseStatsByName(name, 6))
                .skills(baseStats.getSkills())
                .build();
    }

    public HeroStats getBaseStatsByName(final String name, final int stars) {
        BaseStats baseStats = baseStatsByName.get(name);

        if (baseStats == null) {
            return null;
        }

        HeroStats heroStats = stars == 5
                ? baseStats.getLv50FiveStarFullyAwakened()
                : baseStats.getLv60SixStarFullyAwakened();

        if (heroStats == null) {
            return null;
        }

        HeroStats response = HeroStats.builder()
                .atk(heroStats.getAtk())
                .hp(heroStats.getHp())
                .def(heroStats.getDef())
                .cr(heroStats.getCr())
                .cd(heroStats.getCd())
                .eff(heroStats.getEff())
                .res(heroStats.getRes())
                .dac(heroStats.getDac())
                .spd(heroStats.getSpd())
                .bonusStats(heroStats.getBonusStats())
                .name(name)
                .build();

        SpecialStats.setScBonusStats(response);
        return response;
    }

    public void setBaseStatsByName(final Map<String, BaseStats> baseStatsByName) {
        this.baseStatsByName = baseStatsByName;
    }
}
