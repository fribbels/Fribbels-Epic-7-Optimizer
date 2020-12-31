package com.fribbels.db;

import com.fribbels.core.SpecialStats;
import com.fribbels.model.Hero;
import com.fribbels.request.OptimizationRequest;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class HeroDb {

    private List<Hero> heroes;

    public HeroDb() {
        heroes = new ArrayList<>();
    }

    public void addHeroes(final List<Hero> newHero) {
        heroes.addAll(newHero);
    }

    public List<Hero> getAllHeroes() {
        return heroes
                .stream()
                .collect(Collectors.toList());
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

    public void saveOptimizationRequest(final OptimizationRequest request) {
        if (request.getHero() == null || request.getHero().getId() == null) return;

        final String heroId = request.getHero().getId();
        final Hero hero = getHeroById(heroId);

        if (hero == null) return;

        hero.setOptimizationRequest(request
                .withHero(null)
                .withItems(null)
                .withBoolArr(null));
    }
}


// SetHeroes
// GetHeroById
// EquipGearOnHero
//
