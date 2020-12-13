package com.fribbels.db;

import com.fribbels.model.Hero;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class HeroDb {

    private List<Hero> heroes;

    public HeroDb() {
        heroes = new ArrayList<>();
    }

    public void addHeroes(final List<Hero> newHero) {
        heroes.addAll(newHero);
    }

    public List<Hero> getAllHeroes() {
        return heroes;
    }

    public void setHeroes(final List<Hero> newHeroes) {
        if (CollectionUtils.isEmpty(newHeroes)) {
            heroes = new ArrayList<>();
            return;
        }
        heroes = newHeroes;
    }

    public Hero getHeroById(final String id) {
        return heroes.stream()
                .filter(x -> StringUtils.equals(x.getId(), id))
                .findFirst()
                .orElse(null);
    }
}

// SetHeroes
// GetHeroById
// EquipGearOnHero
//
