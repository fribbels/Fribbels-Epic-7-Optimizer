package com.fribbels.handler;

import com.fribbels.core.StatCalculator;
import com.fribbels.db.BaseStatsDb;
import com.fribbels.db.HeroDb;
import com.fribbels.db.ItemDb;
import com.fribbels.enums.Gear;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;
import com.fribbels.request.BaseStatsRequest;
import com.fribbels.request.BonusStatsRequest;
import com.fribbels.request.BuildsRequest;
import com.fribbels.request.EquipItemsOnHeroRequest;
import com.fribbels.request.GetAllHeroesRequest;
import com.fribbels.request.GetHeroByIdRequest;
import com.fribbels.request.HeroesRequest;
import com.fribbels.request.IdRequest;
import com.fribbels.request.IdsRequest;
import com.fribbels.response.GetAllHeroesResponse;
import com.fribbels.response.GetHeroByIdResponse;
import com.fribbels.response.HeroStatsResponse;
import com.google.common.collect.Iterables;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@AllArgsConstructor
public class HeroesRequestHandler extends RequestHandler implements HttpHandler {

    private final HeroDb heroDb;
    private final BaseStatsDb baseStatsDb;
    private final ItemDb itemDb;

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        System.out.println("===================== HeroesRequestHandler =====================");
        final String path = exchange.getRequestURI().getPath();

        System.out.println("Path: " + path);
        try {
            switch(path) {
                case "/heroes/addHeroes":
                    final HeroesRequest heroesRequest = parseRequest(exchange, HeroesRequest.class);
                    sendResponse(exchange, addHeroes(heroesRequest));
                    return;
                case "/heroes/setHeroes":
                    final HeroesRequest setHeroesRequest = parseRequest(exchange, HeroesRequest.class);
                    sendResponse(exchange, setHeroes(setHeroesRequest));
                    return;
                case "/heroes/getAllHeroes":
                    final GetAllHeroesRequest getAllHeroesRequest = parseRequest(exchange, GetAllHeroesRequest.class);
                    sendResponse(exchange, getAllHeroes(getAllHeroesRequest));
                    return;
                case "/heroes/removeHeroById":
                    final IdRequest removeHeroByIdRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, removeHeroById(removeHeroByIdRequest));
                    return;
                case "/heroes/unequipHeroById":
                    final IdRequest unequipHeroByIdRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, unequipHeroById(unequipHeroByIdRequest));
                    return;
                case "/heroes/unlockHeroById":
                    final IdRequest unlockHeroByIdRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, toggleLockHeroById(unlockHeroByIdRequest, false));
                    return;
                case "/heroes/lockHeroById":
                    final IdRequest lockHeroByIdRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, toggleLockHeroById(lockHeroByIdRequest, true));
                    return;
                case "/heroes/unequipItems":
                    final IdsRequest unequipItemsRequest = parseRequest(exchange, IdsRequest.class);
                    sendResponse(exchange, unequipItems(unequipItemsRequest));
                    return;
                case "/heroes/getHeroById":
                    final GetHeroByIdRequest getHeroByIdRequest = parseRequest(exchange, GetHeroByIdRequest.class);
                    sendResponse(exchange, getHeroById(getHeroByIdRequest));
                    return;
                case "/heroes/getBaseStats":
                    final IdRequest getBaseStatsRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, getBaseStats(getBaseStatsRequest));
                    return;
                case "/heroes/equipItemsOnHero":
                    final EquipItemsOnHeroRequest equipItemsOnHeroRequest = parseRequest(exchange, EquipItemsOnHeroRequest.class);
                    sendResponse(exchange, equipItemsOnHero(equipItemsOnHeroRequest));
                    return;
                case "/heroes/setBaseStats":
                    final BaseStatsRequest baseStatsRequest = parseRequest(exchange, BaseStatsRequest.class);
                    sendResponse(exchange, setBaseStats(baseStatsRequest));
                    return;
                case "/heroes/setBonusStats":
                    final BonusStatsRequest bonusStatsRequest = parseRequest(exchange, BonusStatsRequest.class);
                    sendResponse(exchange, setBonusStats(bonusStatsRequest));
                    return;
                case "/heroes/addBuild":
                    final BuildsRequest addBuildRequest = parseRequest(exchange, BuildsRequest.class);
                    sendResponse(exchange, addBuild(addBuildRequest));
                    return;
                case "/heroes/editBuild":
                    final BuildsRequest editBuildRequest = parseRequest(exchange, BuildsRequest.class);
                    sendResponse(exchange, editBuild(editBuildRequest));
                    return;
                case "/heroes/removeBuild":
                    final BuildsRequest removeBuildRequest = parseRequest(exchange, BuildsRequest.class);
                    sendResponse(exchange, removeBuild(removeBuildRequest));
                    return;

                default:
                    System.out.println("No handler found for " + path);
            }

            sendResponse(exchange, "ERROR");
        } catch (final Exception e) {
            e.printStackTrace();
            throw (e);
        }
    }

    public String addBuild(final BuildsRequest request) {
        heroDb.addBuildToHero(request.getHeroId(), request.getBuild());

        return "";
    }

    public String editBuild(final BuildsRequest request) {
        final HeroStats build = request.getBuild();
        final List<HeroStats> builds = heroDb.getBuildsForHero(request.getHeroId());
        if (builds == null || build == null) return "";

        final String buildHash = build.getBuildHash();
        final HeroStats matchingBuild = builds.stream()
                .filter(x -> StringUtils.equals(x.getBuildHash(), buildHash))
                .findFirst()
                .orElse(null);

        if (matchingBuild == null) return "";

        matchingBuild.setName(build.getName());

        return "";
    }

    public String removeBuild(final BuildsRequest request) {
        final HeroStats build = request.getBuild();
        final Hero hero = heroDb.getHeroById(request.getHeroId());
        final List<HeroStats> builds = heroDb.getBuildsForHero(request.getHeroId());
        if (builds == null || build == null || hero == null) return "";

        final String buildHash = build.getBuildHash();
        final List<HeroStats> changedBuilds = builds.stream()
                .filter(x -> !StringUtils.equals(x.getBuildHash(), buildHash))
                .collect(Collectors.toList());

        hero.setBuilds(changedBuilds);

        return "";
    }

    public String setBaseStats(final BaseStatsRequest request) {
        baseStatsDb.setBaseStatsByName(request.getBaseStatsByName());

        return "";
    }

    public String setBonusStats(final BonusStatsRequest request) {
        final Hero hero = heroDb.getHeroById(request.getHeroId());
        if (hero == null) return "";

        hero.setBonusStats(request);

        return "";
    }

    public String addHeroes(final HeroesRequest request) {
        heroDb.addHeroes(request.getHeroes());
        return "";
    }

    public String setHeroes(final HeroesRequest request) {
        heroDb.setHeroes(request.getHeroes());
        return "";
    }

    public String getAllHeroes(final GetAllHeroesRequest request) {
        final List<Hero> heroes = heroDb.getAllHeroes();
        System.out.println("Heroes" + heroes);

        for (final Hero hero : heroes) {
            addStatsToHero(hero, request.isUseReforgeStats());
        }

        final GetAllHeroesResponse response = GetAllHeroesResponse.builder()
                .heroes(heroes)
                .build();

        return toJson(response);
    }

    private void addStatsToHero(final Hero hero, final boolean useReforgeStats) {
        final HeroStats baseStats = baseStatsDb.getBaseStatsByName(hero.getName());

        // Update equipment
        final Map<Gear, Item> equipment = hero.getEquipment();
        equipment.entrySet()
                 .stream()
                 .forEach(x -> {
                     final Item item = itemDb.getItemById(x.getValue().getId());
                     if (item == null) return;

                     equipment.put(x.getKey(), item);
                 });

        if (equipment == null || equipment.values().size() != 6) {
            hero.setStats(new HeroStats());
            return;
        }

        final Item[] items = Iterables.toArray(equipment.values(), Item.class);

        final int[] setsArr = StatCalculator.buildSetsArr(items);
        final List<float[]> statAccumulators = equipment.values()
                .stream()
                .map(item -> StatCalculator.buildStatAccumulatorArr(baseStats, item, useReforgeStats))
                .collect(Collectors.toList());
        final float[][] statAccumulatorArrs = Iterables.toArray(statAccumulators, float[].class);

        final HeroStats finalStats = StatCalculator.addAccumulatorArrsToHero(baseStats, statAccumulatorArrs, setsArr, hero);
        hero.setStats(finalStats);

        final List<HeroStats> builds = hero.getBuilds();
        for (final HeroStats build : builds) {
            addStatsToBuild(hero, baseStats, build, useReforgeStats);
        }
    }

    private void addStatsToBuild(final Hero hero, final HeroStats baseStats, final HeroStats build, final boolean useReforgeStats) {
        final List<String> itemIds = build.getItems();
        final List<Item> items = itemDb.getItemsById(itemIds);

        final int[] setsArr = StatCalculator.buildSetsArr(items.toArray(new Item[0]));
        final List<float[]> statAccumulators = items
                .stream()
                .map(item -> StatCalculator.buildStatAccumulatorArr(baseStats, item, useReforgeStats))
                .collect(Collectors.toList());
        final float[][] statAccumulatorArrs = Iterables.toArray(statAccumulators, float[].class);

        final HeroStats finalStats = StatCalculator.addAccumulatorArrsToHero(baseStats, statAccumulatorArrs, setsArr, hero);
        build.setAtk(finalStats.getAtk());
        build.setHp(finalStats.getHp());
        build.setDef(finalStats.getDef());
        build.setCr(finalStats.getCr());
        build.setCd(finalStats.getCd());
        build.setEff(finalStats.getEff());
        build.setRes(finalStats.getRes());
        build.setSpd(finalStats.getSpd());
        build.setCp(finalStats.getCp());
        build.setEhp(finalStats.getEhp());
        build.setHpps(finalStats.getHpps());
        build.setEhpps(finalStats.getEhpps());
        build.setDmg(finalStats.getDmg());
        build.setDmgps(finalStats.getDmgps());
        build.setMcdmg(finalStats.getMcdmg());
        build.setMcdmgps(finalStats.getMcdmgps());
    }

    public String getHeroById(final GetHeroByIdRequest request) {
        if (request.getId() == null) return "";

        final Hero hero = heroDb.getHeroById(request.getId());
        if (hero == null) return "";

        addStatsToHero(hero, request.isUseReforgeStats());
        final GetHeroByIdResponse response = GetHeroByIdResponse.builder()
                .hero(hero)
                .build();

        return toJson(response);
    }

    public String getBaseStats(final IdRequest request) {
        if (request.getId() == null) return "";

        final HeroStats baseStats = baseStatsDb.getBaseStatsByName(request.getId());

        if (baseStats == null) return "";

        final HeroStatsResponse response = HeroStatsResponse.builder()
                .heroStats(baseStats)
                .build();

        return toJson(response);
    }

    public String removeHeroById(final IdRequest request) {
        System.out.println(request);
        final String id = request.getId();
        final Hero hero = heroDb.getHeroById(id);

        if (hero == null) return "";

        // Unlink hero from equipments
        if (hero.getEquipment() != null) {
            final Item[] equipment = hero.getEquipment().values().toArray(new Item[0]);
            for (int i = 0; i < equipment.length; i++) {
                final Item previousItem = equipment[i];

                if (previousItem == null) {
                    continue;
                }

                final Item dbItem = itemDb.getItemById(previousItem.getId());

                dbItem.setEquippedById(null);
                dbItem.setEquippedByName(null);
            }
            hero.setEquipment(new HashMap<>());
        }

        // Remove the hero from db
        final List<Hero> heroes = heroDb.getAllHeroes();
        final List<Hero> newHeroes = heroes.stream()
                .filter(x -> !StringUtils.equals(x.getId(), request.getId()))
                .collect(Collectors.toList());
        heroDb.setHeroes(newHeroes);

        final GetAllHeroesResponse response = GetAllHeroesResponse.builder()
                .heroes(newHeroes)
                .build();

        return toJson(response);
    }

    public String unequipHeroById(final IdRequest request) {
        System.out.println(request);
        final String id = request.getId();
        final Hero hero = heroDb.getHeroById(id);

        if (hero == null) return "";

        if (hero.getEquipment() != null) {
            // Unlink the gear from the hero
            final Item[] equipment = hero.getEquipment().values().toArray(new Item[0]);
            for (int i = 0; i < equipment.length; i++) {
                final Item previousItem = equipment[i];

                if (previousItem == null) {
                    continue;
                }

                final Item dbItem = itemDb.getItemById(previousItem.getId());

                dbItem.setEquippedById(null);
                dbItem.setEquippedByName(null);
            }
            hero.setEquipment(new HashMap<>());
        }

        return "";
    }

    public String toggleLockHeroById(final IdRequest request, final boolean locked) {
        System.out.println(request);
        final String id = request.getId();
        final Hero hero = heroDb.getHeroById(id);

        if (hero == null) return "";

        if (hero.getEquipment() != null) {
            final Item[] equipment = hero.getEquipment().values().toArray(new Item[0]);
            for (int i = 0; i < equipment.length; i++) {
                final Item item = equipment[i];

                if (item == null) {
                    continue;
                }

                final Item dbItem = itemDb.getItemById(item.getId());
                dbItem.setLocked(locked);
            }
        }

        return "";
    }

    public String unequipItems(final IdsRequest request) {
        System.out.println(request);
        final List<Item> items = itemDb.getItemsById(request.getIds());
        for (final Item item : items) {
            itemDb.unequipItem(item.getId());
        }

        return "";
    }

    public String equipItemsOnHero(final EquipItemsOnHeroRequest request) {
        final String heroId = request.getHeroId();
        if (heroDb.getHeroById(heroId) == null) return "";

        final List<String> itemIds = request.getItemIds();
        final List<Item> items = itemIds.stream()
                .map(itemDb::getItemById)
                .collect(Collectors.toList());

        for (final Item item : items) {
            itemDb.equipItemOnHero(item.getId(), heroId);
        }

        return "";
    }
}
