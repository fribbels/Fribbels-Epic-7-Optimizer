package com.fribbels.db;

import com.fribbels.enums.Gear;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.request.OptimizationRequest;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class HeroDb {

    private final Map<String, Hero> heroesById;
    private final BaseStatsDb baseStatsDb;
    private List<Hero> heroes;

    public HeroDb(final BaseStatsDb baseStatsDb) {
        heroes = new ArrayList<>();
        heroesById = new HashMap<>();
        this.baseStatsDb = baseStatsDb;
    }

    public void addHeroes(final List<Hero> newHeroes) {
        newHeroes.forEach(hero -> {
            sanitizeHero(hero);
            hero.setIndex(heroes.size() + 1);
            heroesById.put(hero.getId(), hero);
        });
        heroes.addAll(newHeroes);
    }

    public void setHeroes(final List<Hero> newHeroes) {
        if (newHeroes.isEmpty()) {
            heroes = new ArrayList<>();
            heroesById.clear();
            return;
        }

        heroesById.clear();
        for (final Hero newHero : newHeroes) {
            newHero.setSkills(baseStatsDb.getBaseStatsByName(newHero.getName()).getSkills());
            sanitizeHero(newHero);
            heroesById.put(newHero.getId(), newHero);
        }

        heroes = newHeroes;
        setHeroIndexes(heroes);
    }

    public List<Hero> getAllHeroes() {
        return heroes
                .stream()
                .toList();
    }

    public Hero getHeroById(final String id) {
        return heroesById.get(id);
    }

    public void saveOptimizationRequest(final OptimizationRequest request) {
        if (request == null || request.getHero() == null || request.getHero().getId() == null)
            return;

        final String heroId = request.getHero().getId();
        final Hero hero = getHeroById(heroId);

        if (hero == null)
            return;
        hero.setOptimizationRequest(request
                .withHero(null)
                .withItems(null)
                .withBoolArr(null));
    }

    public List<HeroStats> getBuildsForHero(final String heroId) {
        if (heroId == null)
            return List.of();

        final Hero hero = getHeroById(heroId);

        if (hero == null)
            return List.of();

        if (hero.getBuilds() == null) {
            hero.setBuilds(new ArrayList<>());
        }

        return hero.getBuilds();
    }

    public void addBuildToHero(final String heroId, final HeroStats build) {
        if (heroId == null || build == null || build.getBuildHash() == null)
            return;

        final Hero hero = getHeroById(heroId);

        if (hero == null)
            return;

        if (hero.getBuilds() == null)
            hero.setBuilds(new ArrayList<>());

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

    private void sanitizeHero(final Hero hero) {
        if (hero.getEquipment() == null) {
            hero.setEquipment(new EnumMap<>(Gear.class));
        }
        if (hero.getBuilds() == null) {
            hero.setBuilds(new ArrayList<>());
        }
    }

    private void setHeroIndexes(final List<Hero> heroes) {
        for (int i = 0; i < heroes.size(); i++) {
            heroes.get(i).setIndex(i + 1);
        }
    }
}