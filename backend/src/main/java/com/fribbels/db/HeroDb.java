package com.fribbels.db;

import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.request.OptimizationRequest;
import com.google.common.collect.ImmutableList;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

public class HeroDb {

    private List<Hero> heroes;

    public HeroDb() {
        heroes = new ArrayList<>();
    }

    public void addHeroes(final List<Hero> newHeroes) {
        newHeroes.forEach(this::sanitizeHero);
        heroes.addAll(newHeroes);
    }

    private void sanitizeHero(final Hero hero) {
        if (hero.getEquipment() == null) {
            hero.setEquipment(new HashMap<>());
        }
        if (hero.getBuilds() == null) {
            hero.setBuilds(new ArrayList<>());
        }
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
        newHeroes.forEach(this::sanitizeHero);
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

    public List<HeroStats> getBuildsForHero(final String heroId) {
        if (heroId == null) return ImmutableList.of();
        final Hero hero = getHeroById(heroId);
        if (hero == null) return ImmutableList.of();

        if (hero.getBuilds() == null) {
            hero.setBuilds(new ArrayList<>());
        }

        return hero.getBuilds();
    }

    public void addBuildToHero(final String heroId, final HeroStats build) {
        if (heroId == null || build == null || build.getBuildHash() == null) return;
        final Hero hero = getHeroById(heroId);
        if (hero == null) return;

        if (hero.getBuilds() == null) {
            hero.setBuilds(new ArrayList<>());
        }

        if (!hero.getBuilds()
                 .stream()
                 .map(HeroStats::getBuildHash)
                 .collect(Collectors.toSet())
                 .contains(build.getBuildHash())) {
            hero.getBuilds().add(build);
            System.out.println("Found new build. Adding to hero: " + hero);
        }

        System.out.println("Done adding");
    }
}


// SetHeroes
// GetHeroById
// EquipGearOnHero
//
