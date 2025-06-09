package com.fribbels.core;

import java.util.function.IntConsumer;

import com.fribbels.model.HeroStats;

public class SpecialStats {
    private SpecialStats() {}

    public static HeroStats setScBonusStats(final HeroStats hero) {
        if (hero.getBonusStats() == null)
            return hero;

        applyOverride(hero.getBonusStats().getOverrideAtk(), hero::setAtk);
        applyOverride(hero.getBonusStats().getOverrideDef(), hero::setDef);
        applyOverride(hero.getBonusStats().getOverrideHp(), hero::setHp);
        applyAdditiveOverride(hero.getBonusStats().getOverrideAdditionalCr(), hero.getCr(), hero::setCr);
        applyAdditiveOverride(hero.getBonusStats().getOverrideAdditionalCd(), hero.getCd(), hero::setCd);
        applyAdditiveOverride(hero.getBonusStats().getOverrideAdditionalSpd(), hero.getSpd(), hero::setSpd);
        applyAdditiveOverride(hero.getBonusStats().getOverrideAdditionalEff(), hero.getEff(), hero::setEff);
        applyAdditiveOverride(hero.getBonusStats().getOverrideAdditionalRes(), hero.getRes(), hero::setRes);

        return hero;
    }

    private static void applyOverride(final int value, final IntConsumer setter) {
        if (value != 0)
            setter.accept(value);
    }

    private static void applyAdditiveOverride(final int value, final int base, IntConsumer setter) {
        if (value != 0)
            setter.accept(base + value);
    }
}
