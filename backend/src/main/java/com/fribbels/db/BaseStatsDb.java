package com.fribbels.db;

import com.fribbels.core.SpecialStats;
import com.fribbels.model.BaseStats;
import com.fribbels.model.HeroStats;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

public class BaseStatsDb {

    private Map<String, BaseStats> baseStatsByName;

    public BaseStatsDb() {
        baseStatsByName = new HashMap<>();
    }
    public BaseStats getBaseStatsByName(final String name) {
        return BaseStats.builder()
                .lv50FiveStarFullyAwakened(getBaseStatsByName(name, 5))
                .lv60SixStarFullyAwakened(getBaseStatsByName(name, 6))
                .build();
    }

    public HeroStats getBaseStatsByName(final String name, final int stars) {
        if (!baseStatsByName.containsKey(name)) {
            return null;
        }

        final BaseStats baseStats = baseStatsByName.get(name);
        final HeroStats heroStats = stars == 5 ? baseStats.getLv50FiveStarFullyAwakened()
                                               : baseStats.getLv60SixStarFullyAwakened();

        final HeroStats response  = HeroStats.builder()
                .atk(heroStats.getAtk())
                .hp(heroStats.getHp())
                .def(heroStats.getDef())
                .cr(heroStats.getCr())
                .cd(heroStats.getCd())
                .eff(heroStats.getEff())
                .res(heroStats.getRes())
                .dac(heroStats.getDac())
                .spd(heroStats.getSpd())
//                .cp(heroStats.getCp())
//                .ehp(heroStats.getEhp())
//                .hpps(heroStats.getHpps())
//                .ehpps(heroStats.getEhpps())
//                .dmg(heroStats.getDmg())
//                .dmgps(heroStats.getDmgps())
//                .mcdmg(heroStats.getMcdmg())
//                .mcdmgps(heroStats.getMcdmgps())
//                .dmgh(heroStats.getDmgh())
//                .upgrades(heroStats.getUpgrades())
//                .score(heroStats.getScore())
//                .conversions(heroStats.getConversions())
                .name(name)
                .build();

        SpecialStats.setScBonusStats(response);

        return response;
    }

    public void setBaseStatsByName(final Map<String, BaseStats> baseStatsByName) {
        this.baseStatsByName = baseStatsByName;
    }
}

