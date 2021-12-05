package com.fribbels.handler;

import com.aparapi.Kernel;
import com.aparapi.ProfileInfo;
import com.aparapi.ProfileReport;
import com.aparapi.Range;
import com.aparapi.device.Device;
import com.fribbels.Main;
import com.fribbels.aparapi.GpuOptimizer;
import com.fribbels.core.StatCalculator;
import com.fribbels.db.BaseStatsDb;
import com.fribbels.db.HeroDb;
import com.fribbels.db.OptimizationDb;
import com.fribbels.enums.Gear;
import com.fribbels.enums.Set;
import com.fribbels.model.AugmentedStats;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;
import com.fribbels.request.EditResultRowsRequest;
import com.fribbels.request.GetResultRowsRequest;
import com.fribbels.request.IdRequest;
import com.fribbels.request.OptimizationRequest;
import com.fribbels.response.GetInProgressResponse;
import com.fribbels.response.GetResultRowsResponse;
import com.fribbels.response.OptimizationResponse;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import lombok.Getter;
import lombok.SneakyThrows;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.fribbels.core.StatCalculator.SETTING_PEN_DEFENSE;

public class OptimizationRequestHandler extends RequestHandler implements HttpHandler {

    public static int SETTING_MAXIMUM_RESULTS = 5_000_000;

    private BaseStatsDb baseStatsDb;
    private Map<String, OptimizationDb> optimizationDbs;
    private HeroDb heroDb;
    private boolean inProgress = false;

    private static final Gson gson = new Gson();
    private static final int SET_COUNT = 16;
    @Getter
    private AtomicLong searchedCounter = new AtomicLong(0);
    private AtomicLong resultsCounter = new AtomicLong(0);

    public OptimizationRequestHandler(final BaseStatsDb baseStatsDb,
                                      final HeroDb heroDb) {
        this.baseStatsDb = baseStatsDb;
        this.heroDb = heroDb;
        optimizationDbs = new HashMap<>();
    }

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        System.out.println("===================== OptimizationRequestHandler =====================");
        final String path = exchange.getRequestURI().getPath();

        System.out.println("Path: " + path);

        try {
            switch (path) {
                case "/optimization/prepareExecution":
                    sendResponse(exchange, prepareExecution());
                    System.out.println("Sent response");
                    return;
                case "/optimization/deleteExecution":
                    final IdRequest deleteExecutionRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, deleteExecutionRequest(deleteExecutionRequest));
                    System.out.println("Sent response");
                case "/optimization/optimizationRequest":
                    Main.interrupt = false;
                    final OptimizationRequest optimizationRequest = parseRequest(exchange, OptimizationRequest.class);
                    sendResponse(exchange, handleOptimizationRequest(optimizationRequest));
                    System.out.println("Sent response");
                    return;
                case "/optimization/optimizationFilterRequest":
                    final OptimizationRequest optimizationFilterRequest = parseRequest(exchange, OptimizationRequest.class);
                    sendResponse(exchange, handleOptimizationFilterRequest(optimizationFilterRequest));
                    System.out.println("Sent response");
                    return;
                case "/optimization/getResultRows":
                    final GetResultRowsRequest getResultRowsRequest = parseRequest(exchange, GetResultRowsRequest.class);
                    System.out.println(getResultRowsRequest);
                    sendResponse(exchange, handleGetResultRowsRequest(getResultRowsRequest));
                    System.out.println("Sent response");
                    return;
                case "/optimization/editResultRows":
                    final EditResultRowsRequest editResultRowsRequest = parseRequest(exchange, EditResultRowsRequest.class);
                    System.out.println(editResultRowsRequest);
                    sendResponse(exchange, handleEditResultRowsRequest(editResultRowsRequest));
                    System.out.println("Sent response");
                    return;
                case "/optimization/getProgress":
                    sendResponse(exchange, handleGetProgressRequest());
                    System.out.println("Sent response");
                    return;
                case "/optimization/inProgress":
                    sendResponse(exchange, handleInProgressRequest());
                    System.out.println("Sent response");
                    return;
                case "/optimization/getModItems":
                    final IdRequest getModItemsRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, handleGetModItemsRequest(getModItemsRequest));
                    System.out.println("Sent response");
                    return;
                default:
                    System.out.println("No handler found for " + path);
            }
        } catch (final RuntimeException e) {
            System.err.println(e);
            e.printStackTrace();
        } finally {
            Main.interrupt = false;
        }

        System.out.println("Sent error");
        sendResponse(exchange, "ERROR");
    }

    public String handleGetModItemsRequest(final IdRequest request) {
        return null;
    }

    public String handleInProgressRequest() {
        final GetInProgressResponse response = GetInProgressResponse.builder()
                .inProgress(inProgress)
                .build();

        return gson.toJson(response);
    }

    public String handleGetProgressRequest() {
        final OptimizationResponse response = OptimizationResponse.builder()
                .searched(searchedCounter.get())
                .results(resultsCounter.get())
                .build();

        return gson.toJson(response);
    }

    public String handleOptimizationFilterRequest(final OptimizationRequest request) {
        final OptimizationDb optimizationDb = optimizationDbs.get(request.getExecutionId());

        if (optimizationDb == null) {
            return "";
        }

        final boolean hasExcludedGearIds = CollectionUtils.isNotEmpty(request.getExcludedGearIds());
        final Map<String, String> excludedGearIds = new HashMap<>();
        if (hasExcludedGearIds) {
            for (final String gearId : request.getExcludedGearIds()) {
                excludedGearIds.put(gearId, gearId);
            }
        }

        heroDb.saveOptimizationRequest(request);
        final HeroStats[] heroStats = optimizationDb.getAllHeroStats();
        final int[] indices = new int[heroStats.length];
        final java.util.Set<String> ids = new HashSet<>();
        int count = 0;

        for (int i = 0; i < heroStats.length; i++) {
            final HeroStats heroStatsInstance = heroStats[i];
            if (passesUpdatedFilter(request, heroStatsInstance)) {
                boolean passesGearIdFilter = true;
                if (hasExcludedGearIds) {
                    for (final String gearId : heroStatsInstance.items) {
                        if (excludedGearIds.containsKey(gearId)) {
                            passesGearIdFilter = false;
                            break;
                        }
                    }
                }

                if (passesGearIdFilter) {
                    indices[count] = i;
                    ids.add(heroStatsInstance.getId());
                    count++;
                }
            }
        }

        System.out.println("Indices count: " + count);
        optimizationDb.setFilteredIds(ids, count);

        return "";
    }

    private boolean passesUpdatedFilter(final OptimizationRequest request, final HeroStats heroStats) {
        if (heroStats.getAtk() < request.getInputAtkMinLimit() || heroStats.getAtk() > request.getInputAtkMaxLimit()
                ||  heroStats.getHp()  < request.getInputHpMinLimit()  || heroStats.getHp() > request.getInputHpMaxLimit()
                ||  heroStats.getDef() < request.getInputDefMinLimit() || heroStats.getDef() > request.getInputDefMaxLimit()
                ||  heroStats.getSpd() < request.getInputSpdMinLimit() || heroStats.getSpd() > request.getInputSpdMaxLimit()
                ||  heroStats.getCr() < request.getInputCrMinLimit()   || heroStats.getCr() > request.getInputCrMaxLimit()
                ||  heroStats.getCd() < request.getInputCdMinLimit()   || heroStats.getCd() > request.getInputCdMaxLimit()
                ||  heroStats.getEff() < request.getInputEffMinLimit() || heroStats.getEff() > request.getInputEffMaxLimit()
                ||  heroStats.getRes() < request.getInputResMinLimit() || heroStats.getRes() > request.getInputResMaxLimit()
                ||  heroStats.getCp() < request.getInputMinCpLimit() || heroStats.getCp() > request.getInputMaxCpLimit()
                ||  heroStats.getHpps() < request.getInputMinHppsLimit() || heroStats.getHpps() > request.getInputMaxHppsLimit()
                ||  heroStats.getEhp() < request.getInputMinEhpLimit() || heroStats.getEhp() > request.getInputMaxEhpLimit()
                ||  heroStats.getEhpps() < request.getInputMinEhppsLimit() || heroStats.getEhpps() > request.getInputMaxEhppsLimit()
                ||  heroStats.getDmg() < request.getInputMinDmgLimit() || heroStats.getDmg() > request.getInputMaxDmgLimit()
                ||  heroStats.getDmgps() < request.getInputMinDmgpsLimit() || heroStats.getDmgps() > request.getInputMaxDmgpsLimit()
                ||  heroStats.getMcdmg() < request.getInputMinMcdmgLimit() || heroStats.getMcdmg() > request.getInputMaxMcdmgLimit()
                ||  heroStats.getMcdmgps() < request.getInputMinMcdmgpsLimit() || heroStats.getMcdmgps() > request.getInputMaxMcdmgpsLimit()
                ||  heroStats.getDmgh() < request.getInputMinDmgHLimit() || heroStats.getDmgh() > request.getInputMaxDmgHLimit()
                ||  heroStats.getScore() < request.getInputMinScoreLimit() || heroStats.getScore() > request.getInputMaxScoreLimit()
                ||  heroStats.getPriority() < request.getInputMinPriorityLimit() || heroStats.getPriority() > request.getInputMaxPriorityLimit()
                ||  heroStats.getUpgrades() < request.getInputMinUpgradesLimit() || heroStats.getUpgrades() > request.getInputMaxUpgradesLimit()
                ||  heroStats.getConversions() < request.getInputMinConversionsLimit() || heroStats.getConversions() > request.getInputMaxConversionsLimit()
        ) {
            return false;
        }
        return true;
    }

    public String prepareExecution() {
        final String executionId = UUID.randomUUID().toString();

        optimizationDbs.put(executionId, new OptimizationDb());

        return executionId;
    }

    public String deleteExecutionRequest(final IdRequest request) {
        if (request.getId() == null) {
            return "";
        }

        optimizationDbs.remove(request.getId());

        return "";
    }

    public String handleOptimizationRequest(final OptimizationRequest request) {
        try {
            heroDb.saveOptimizationRequest(request);
            System.gc();
            return optimize(request, HeroStats.builder()
                    .atk(request.getAtk())
                    .hp(request.getHp())
                    .spd(request.getSpd())
                    .def(request.getDef())
                    .cr(request.getCr())
                    .cd(request.getCd())
                    .eff(request.getEff())
                    .res(request.getRes())
                    .dac(request.getDac())
                    .build());
        } catch (final Exception e) {
            inProgress = false;
            throw new RuntimeException("Optimization request failed", e);
        }
    }

    private String handleGetResultRowsRequest(final GetResultRowsRequest request) {
        if (request.getExecutionId() == null) {
            final GetResultRowsResponse response = GetResultRowsResponse.builder()
                    .heroStats(new HeroStats[]{})
                    .maximum(0)
                    .build();
            return gson.toJson(response);
        }
        final OptimizationDb optimizationDb = optimizationDbs.get(request.getExecutionId());
        if (optimizationDb == null) {
            return "";
        }

        final String heroId = request.getOptimizationRequest().getHeroId();
        final List<HeroStats> builds = heroDb.getBuildsForHero(heroId);
        final java.util.Set<String> buildHashes = builds.stream()
                .map(HeroStats::getBuildHash)
                .collect(Collectors.toSet());

        optimizationDb.sort(request.getSortColumn(), request.getSortOrder());
        final HeroStats[] heroStats = optimizationDb.getRows(request.getStartRow(), request.getEndRow());

        if (heroStats != null) {
            for (final HeroStats build : heroStats) {
                if (build == null) {
                    continue;
                }
                final String hash = build.getBuildHash();
                if (buildHashes.contains(hash)) {
                    build.setProperty("star");
                } else {
                    build.setProperty("none");
                }
            }
        }

        final long maximum = optimizationDb.getMaximum();
        final GetResultRowsResponse response = GetResultRowsResponse.builder()
                .heroStats(heroStats)
                .maximum(maximum)
                .build();
        return gson.toJson(response);
    }

    private String handleEditResultRowsRequest(final EditResultRowsRequest request) {
        final OptimizationDb optimizationDb = optimizationDbs.get(request.getExecutionId());
        if (optimizationDb == null) {
            return "";
        }

        final HeroStats[] heroStats = optimizationDb.getRows(request.getIndex(), request.getIndex() + 1);
        if (heroStats.length == 0) {
            return "";
        }

        final HeroStats heroStat = heroStats[0];

        heroStat.setProperty(request.getProperty());
        System.out.println(heroStat);

        return "";
    }

    public void fillAccs(StatCalculator statCalculator, Item[] items, HeroStats base, Map<String, float[]> accumulatorArrsByItemId, boolean useReforgeStats) {
        for (int i = 0; i < items.length; i++) {
            items[i].tempStatAccArr = statCalculator.getNewStatAccumulatorArr(base, items[i], accumulatorArrsByItemId, useReforgeStats);
        }
    }

    public float[] flattenAccArrs(final Item[] items, final StatCalculator statCalculator) {
        final int argCount = 16;
        final int outputSize = items.length * argCount;
        final float[] output = new float[outputSize];

        for (int i = 0; i < items.length; i++) {
            final Item item = items[i];
            for (int j = 0; j < argCount - 4; j++) {
                output[i*argCount + j] = item.tempStatAccArr[j];
            }
            output[i*argCount + argCount - 4] = item.set.index;
            output[i*argCount + argCount - 3] = item.priority;
            output[i*argCount + argCount - 2] = item.upgradeable;
            output[i*argCount + argCount - 1] = item.convertable;

            // 0 atk
            // 1 hp
            // 2 def
            // 3 -
            // 4 -
            // 5 -
            // 6 cr
            // 7 cd
            // 8 eff
            // 9 res
            // 10 spd
            // 11 score
            // 12 set
            // 13 prio
            // 14 upg
            // 15 conv
        }

        return output;
    }

    @SneakyThrows
    public String optimize(final OptimizationRequest request, final HeroStats unused) {
        final StatCalculator statCalculator = new StatCalculator();
        final OptimizationDb optimizationDb = optimizationDbs.get(request.getExecutionId());
        if (optimizationDb == null) {
            return "";
        }

        inProgress = true;
        final HeroStats base = baseStatsDb.getBaseStatsByName(request.hero.name, request.hero.getStars());
        System.out.println("Started optimization request");
        addCalculatedFields(request);
        final boolean useReforgeStats = request.getInputPredictReforges();
        final List<Item> rawItems = request.getItems();

        final List<Set> firstSets = request.getInputSetsOne();
        rawItems.sort(Comparator.comparing(Item::getSet));
        final List<Item> priorityItems = new ArrayList<>();
        final List<Item> otherItems = new ArrayList<>();
        for (Item item : rawItems) {
            if (firstSets.contains(item.getSet())) {
                priorityItems.add(item);
            } else {
                otherItems.add(item);
            }
        }

        priorityItems.addAll(otherItems);
        final List<Item> items = priorityItems;

        final int MAXIMUM_RESULTS = SETTING_MAXIMUM_RESULTS;
        final HeroStats[] resultHeroStats = new HeroStats[MAXIMUM_RESULTS];
        final long[] resultInts = new long[MAXIMUM_RESULTS];
        System.out.println("Finished allocating memory");

        final Map<Gear, List<Item>> itemsByGear = buildItemsByGear(items);

        final Map<String, float[]> accumulatorArrsByItemId = new ConcurrentHashMap<>(new HashMap<>());
        final ExecutorService executorService = Executors.newFixedThreadPool(8);
        searchedCounter = new AtomicLong(0);
        resultsCounter = new AtomicLong(0);

        final int wSize = itemsByGear.get(Gear.WEAPON).size();
        final int hSize = itemsByGear.get(Gear.HELMET).size();
        final int aSize = itemsByGear.get(Gear.ARMOR).size();
        final int nSize = itemsByGear.get(Gear.NECKLACE).size();
        final int rSize = itemsByGear.get(Gear.RING).size();
        final int bSize = itemsByGear.get(Gear.BOOTS).size();

        final Item[] allweapons = itemsByGear.get(Gear.WEAPON).toArray(new Item[0]);
        final Item[] allhelmets = itemsByGear.get(Gear.HELMET).toArray(new Item[0]);
        final Item[] allarmors = itemsByGear.get(Gear.ARMOR).toArray(new Item[0]);
        final Item[] allnecklaces = itemsByGear.get(Gear.NECKLACE).toArray(new Item[0]);
        final Item[] allrings = itemsByGear.get(Gear.RING).toArray(new Item[0]);
        final Item[] allboots = itemsByGear.get(Gear.BOOTS).toArray(new Item[0]);

        fillAccs(statCalculator, allweapons, base, accumulatorArrsByItemId, useReforgeStats);
        fillAccs(statCalculator, allhelmets, base, accumulatorArrsByItemId, useReforgeStats);
        fillAccs(statCalculator, allarmors, base, accumulatorArrsByItemId, useReforgeStats);
        fillAccs(statCalculator, allnecklaces, base, accumulatorArrsByItemId, useReforgeStats);
        fillAccs(statCalculator, allrings, base, accumulatorArrsByItemId, useReforgeStats);
        fillAccs(statCalculator, allboots, base, accumulatorArrsByItemId, useReforgeStats);

        final AtomicInteger maxReached = new AtomicInteger();

        final boolean isShortCircuitable4PieceSet = request.getSetFormat() == 1 || request.getSetFormat() == 2;

        System.out.println("OUTPUTSTART");
//        StatCalculator.setBaseValues(base, request.hero);
        statCalculator.setBaseValues(base, request.hero);

        final float[] flattenedWeaponAccs = flattenAccArrs(allweapons, statCalculator);
        final float[] flattenedHelmetAccs = flattenAccArrs(allhelmets, statCalculator);
        final float[] flattenedArmorAccs = flattenAccArrs(allarmors, statCalculator);
        final float[] flattenedNecklaceAccs = flattenAccArrs(allnecklaces, statCalculator);
        final float[] flattenedRingAccs = flattenAccArrs(allrings, statCalculator);
        final float[] flattenedBootAccs = flattenAccArrs(allboots, statCalculator);



        final Hero hero = request.hero;

        final float atkSetBonus = 0.45f * base.atk;
        final float hpSetBonus = 0.20f * base.hp;
        final float defSetBonus = 0.20f * base.def;

        final float speedSetBonus = 0.25f * base.spd;
        final float revengeSetBonus = 0.12f * base.spd;

        float bonusBaseAtk = base.atk + base.atk * (hero.bonusAtkPercent + hero.aeiAtkPercent) / 100f + hero.bonusAtk + hero.aeiAtk;
        float bonusBaseHp = base.hp + base.hp * (hero.bonusHpPercent + hero.aeiHpPercent) / 100f + hero.bonusHp + hero.aeiHp;
        float bonusBaseDef = base.def + base.def * (hero.bonusDefPercent + hero.aeiDefPercent) / 100f + hero.bonusDef + hero.aeiDef;

        final float bonusMaxAtk;
        final float bonusMaxHp;
        final float bonusMaxDef;

        if (base.bonusStats == null) {
            bonusMaxAtk = 1;
            bonusMaxHp = 1;
            bonusMaxDef = 1;
        } else {
            bonusMaxAtk = 1 + base.bonusStats.bonusMaxAtkPercent/100f;
            bonusMaxHp = 1 + base.bonusStats.bonusMaxHpPercent/100f;
            bonusMaxDef = 1 + base.bonusStats.bonusMaxDefPercent/100f;
        }

        final float penSetDmgBonus = (StatCalculator.SETTING_PEN_DEFENSE/300f + 1) / (0.00283333f * StatCalculator.SETTING_PEN_DEFENSE + 1);

        final int SETTING_RAGE_SET = StatCalculator.SETTING_RAGE_SET ? 1 : 0;
        final int SETTING_PEN_SET = StatCalculator.SETTING_PEN_SET ? 1 : 0;

        long count = 0;
        //        int max = 65536;
        //        int max = 1048576;
        final int max = 2097152;
        final int argSize = 16;

        final GpuOptimizer kernel = new GpuOptimizer(
                request,
                flattenedWeaponAccs,
                flattenedHelmetAccs,
                flattenedArmorAccs,
                flattenedNecklaceAccs,
                flattenedRingAccs,
                flattenedBootAccs,
                bonusBaseAtk,
                bonusBaseDef,
                bonusBaseHp,
                atkSetBonus,
                hpSetBonus,
                defSetBonus,
                speedSetBonus,
                revengeSetBonus,
                penSetDmgBonus,
                bonusMaxAtk,
                bonusMaxDef,
                bonusMaxHp,
                SETTING_RAGE_SET,
                SETTING_PEN_SET,
                base,
                hero,
                argSize,
                wSize,
                hSize,
                aSize,
                nSize,
                rSize,
                bSize,
                max);

        kernel.setExecutionModeWithoutFallback(Kernel.EXECUTION_MODE.GPU);

        boolean exit = false;

        final long maxPerms = ((long)wSize) * hSize * aSize * nSize * rSize * bSize;
//
//        int maxLocalSize = kernel.getKernelMaxWorkGroupSize(kernel.getTargetDevice());
//        final Range range = kernel.getTargetDevice().createRange(maxPerms + (256 - maxPerms % 256), 256);
//
//        int outputArgs = 37;
////        float[] results = new float[maxPerms * outputArgs];
//        boolean[] passes = new boolean[maxPerms];
//
//        //        kernel.setResults(results);
//        kernel.setPasses(passes);
//
//        System.out.println("RANGE" + range + " " + range.getMaxWorkGroupSize());
//        kernel.execute(range);

//        System.out.println("ARRSIZE " + maxPerms);
//        System.out.println("ARRSIZE " + 1_048_576L);
//        System.out.println("ARRSIZE " + (maxPerms / 1_048_576L));
//        System.out.println("ARRSIZE " + ((int)(maxPerms / 1_048_576L)));
//        System.out.println("ARRSIZE " + ((int)(maxPerms / 1_048_576L)));
//        System.out.println("ARRSIZE " + (((int)(maxPerms / 1_048_576L))));
//        System.out.println("ARRSIZE " + (((int)(maxPerms / 1_048_576L)) + 1));

//        final boolean[][] passResults = new boolean[((int)(maxPerms / 1_048_576L)) + 1][1_048_576];

//

        for (int i = 0; i < maxPerms / max + 1; i++) {
            if (exit || Main.interrupt) break;
            final int finalI = i;
            final boolean[] passes = new boolean[max];

            final Range range = kernel.getTargetDevice().createRange(max, 256);

//            float[] debug = new float[max];
//            kernel.setDebug(debug);

            kernel.setIteration(finalI);
            kernel.setPasses(passes);
            kernel.execute(range);

            executorService.submit(() -> {
                searchedCounter.addAndGet(max);

                for (int j = 0; j < max; j++) {
                    final long iteration = ((long) finalI) * max + j;
                    if (iteration >= maxPerms)
                        break;

//                                    System.out.println(debug[j]);

                    if (passes[j]) {

                        final int b = (int)(iteration % bSize);
                        final int r = (int)((( iteration - b ) / bSize ) %  rSize);
                        final int n = (int)((( iteration - r * bSize - b ) / (bSize * rSize) ) % nSize);
                        final int a = (int)((( iteration - n * rSize * bSize - r * bSize - b ) / (bSize * rSize * nSize) ) % aSize);
                        final int h = (int)((( iteration - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize) ) % hSize);
                        final int w = (int)((( iteration - h * aSize * nSize * rSize * bSize - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize * hSize) ) % wSize);

                        //                    if (b < 0 || r < 0 || n < 0 || a < 0 || h < 0 || w < 0) {
                        //                        System.out.println("-----");
                        //                        System.out.println(iteration);
                        //                        System.out.println(i);
                        //                        System.out.println(j);
                        //                        System.out.println("-----");
                        //                        System.out.println(bSize);
                        //                        System.out.println(rSize);
                        //                        System.out.println(nSize);
                        //                        System.out.println(aSize);
                        //                        System.out.println(hSize);
                        //                        System.out.println(wSize);
                        //                        System.out.println("-----");
                        //                        System.out.println(b);
                        //                        System.out.println(r);
                        //                        System.out.println(n);
                        //                        System.out.println(a);
                        //                        System.out.println(h);
                        //                        System.out.println(w);
                        //                        System.out.println("-----");
                        //                    }
                        final Item weapon = allweapons[w];
                        final Item helmet = allhelmets[h];
                        final Item armor = allarmors[a];
                        final Item necklace = allnecklaces[n];
                        final Item ring = allrings[r];
                        final Item boots = allboots[b];

                        final Item[] collectedItems = new Item[]{weapon, helmet, armor, necklace, ring, boots};
                        final int[] collectedSets = statCalculator.buildSetsArr(collectedItems);

//                        count++;

                        final int reforges = weapon.upgradeable + helmet.upgradeable + armor.upgradeable + necklace.upgradeable + ring.upgradeable + boots.upgradeable;
                        final int conversions = weapon.convertable + helmet.convertable + armor.convertable + necklace.convertable + ring.convertable + boots.convertable;
                        final int priority = weapon.priority + helmet.priority + armor.priority + necklace.priority + ring.priority + boots.priority;
                        final HeroStats result = statCalculator.addAccumulatorArrsToHero(
                                base,
                                new float[][]{weapon.tempStatAccArr, helmet.tempStatAccArr, armor.tempStatAccArr, necklace.tempStatAccArr, ring.tempStatAccArr, boots.tempStatAccArr},
                                collectedSets,
                                request.hero,
                                reforges,
                                conversions,
                                priority);

                        result.setSets(collectedSets);
                        result.setItems(ImmutableList.of(allweapons[w].getId(), allhelmets[h].getId(), allarmors[a].getId(), allnecklaces[n].id, allrings[r].id, allboots[b].id));
                        result.setModIds(ImmutableList.of(allweapons[w].getModId(), allhelmets[h].getModId(), allarmors[a].getModId(), allnecklaces[n].modId, allrings[r].modId, allboots[b].modId));
                        result.setMods(Lists.newArrayList(allweapons[w].getMod(), allhelmets[h].getMod(), allarmors[a].getMod(), allnecklaces[n].getMod(), allrings[r].getMod(), allboots[b].getMod()));

                        final long resultsIndex = resultsCounter.getAndIncrement();
                        resultHeroStats[(int) resultsIndex] = result;
                        resultInts[(int) resultsIndex] = iteration;

                        if (resultsIndex == MAXIMUM_RESULTS - 1) {
                            maxReached.set(MAXIMUM_RESULTS - 1);
                        }
                    }
                }
            });
        }

        System.out.println("DONE");
        System.out.println("DONE");
        System.out.println("DONE");
        System.out.println("DONE");
        System.out.println("DONE");

//        long count = 0;
//        for (int i = 0; i < maxPerms / 1_048_576 + 1; i++) {
//            for (int j = 0; j < 1_048_576; j++) {
//                if (passResults[i][j]) {
//                    count++;
//                }
//            }
//        }

        System.out.println("PASS " + count);
//            final HeroStats result = new HeroStats((int) results[i * outputArgs + 0], (int) results[i * outputArgs + 1], (int) results[i * outputArgs + 2], (int) results[i * outputArgs + 3], (int) results[i * outputArgs + 4], (int) results[i * outputArgs + 5], (int) results[i * outputArgs + 6], 0, (int) results[i * outputArgs + 7], (int) results[i * outputArgs + 8], (int) results[i * outputArgs + 9], (int) results[i * outputArgs + 10], (int) results[i * outputArgs + 11], (int) results[i * outputArgs + 12], (int) results[i * outputArgs + 13], (int) results[i * outputArgs + 14], (int) results[i * outputArgs + 15], (int) results[i * outputArgs + 16], 6, 6, (int) results[i * outputArgs + 17], 6, base.bonusStats, null, null, null, null, null, null, null);
//
//            searchedCounter.getAndIncrement();
//
//            final int[] collectedSets = new int[]{(int) results[i * outputArgs + 21], (int) results[i * outputArgs + 22], (int) results[i * outputArgs + 23], (int) results[i * outputArgs + 24], (int) results[i * outputArgs + 25], (int) results[i * outputArgs + 26], (int) results[i * outputArgs + 27], (int) results[i * outputArgs + 28], (int) results[i * outputArgs + 29], (int) results[i * outputArgs + 30], (int) results[i * outputArgs + 31], (int) results[i * outputArgs + 32], (int) results[i * outputArgs + 33], (int) results[i * outputArgs + 34], (int) results[i * outputArgs + 35], (int) results[i * outputArgs + 36]};
//
//            //                            System.out.println(w + " " + h + " " + a + " " + (int)results[i * outputArgs + 18] + " " + (int)results[i * outputArgs + 19] + " " + (int)results[i * outputArgs + 20]);
//            //                            for (int x = 0; x < 16; x++) {
//            //                                System.out.println(Arrays.asList(collectedSets[x]));
//            //                            }
//
//            final boolean passesFilter = passesFilter(result, request, collectedSets);
//            result.setSets(collectedSets);
//            if (passesFilter) {
//                final long resultsIndex = resultsCounter.getAndIncrement();
//                if (resultsIndex < MAXIMUM_RESULTS) {
//                    result.setId("" + resultsIndex);
//
//                    final long index1D = i;
////                    final long index1D = finalW * hSize * aSize * nSize * rSize * bSize + h * aSize * nSize * rSize * bSize + a * nSize * rSize * bSize + (int) results[i * outputArgs + 18] * rSize * bSize + (int) results[i * outputArgs + 19] * bSize + (int) results[i * outputArgs + 20];
//
//                    final int bI = i % bSize;
//                    final int rI = ( ( i - bI ) / bSize ) %  rSize;
//                    final int nI = ( ( i - rI * bSize - bI ) / (bSize * rSize) ) % nSize;
//                    final int aI = ( ( i - nI * rSize * bSize - rI * bSize - bI ) / (bSize * rSize * nSize) ) % aSize;
//                    final int hI = ( ( i - aI * nSize * rSize * bSize - nI * rSize * bSize - rI * bSize - bI) / (bSize * rSize * nSize * aSize) ) % hSize;
//                    final int wI = ( ( i - hI * aSize * nSize * rSize * bSize - aI * nSize * rSize * bSize - nI * rSize * bSize - rI * bSize - bI) / (bSize * rSize * nSize * aSize * hSize) ) % wSize;
//
//
//                    result.setItems(ImmutableList.of(allweapons[wI].getId(), allhelmets[hI].getId(), allarmors[aI].getId(), allnecklaces[nI].id, allrings[rI].id, allboots[bI].id));
//                    result.setModIds(ImmutableList.of(allweapons[wI].getModId(), allhelmets[hI].getModId(), allarmors[aI].getModId(), allnecklaces[nI].modId, allrings[rI].modId, allboots[bI].modId));
//                    result.setMods(Lists.newArrayList(allweapons[wI].getMod(), allhelmets[hI].getMod(), allarmors[aI].getMod(), allnecklaces[nI].getMod(), allrings[rI].getMod(), allboots[bI].getMod()));
//
//                    resultHeroStats[(int) resultsIndex] = result;
//                    resultInts[(int) resultsIndex] = index1D;
//
//                    if (resultsIndex == MAXIMUM_RESULTS - 1) {
//                        maxReached.set(MAXIMUM_RESULTS - 1);
//                    }
//                } else {
//                    System.out.println("EXIT");
//                    exit = true;
//                    break;
//                }
//            }
//
//








            //        for (int w = 0; w < wSize; w++) {
            //            final Item weapon = allweapons[w];
            //            final long finalW = w;
            //
            //            try {
            //                final float[] weaponAccumulatorArr = weapon.tempStatAccArr;
            //
            //                for (int h = 0; h < hSize; h++) {
            //                    if (Main.interrupt || exit) {
            //                        break;
            //                    }
            //
            //
            //                    final Item helmet = allhelmets[h];
            //                    final float[] helmetAccumulatorArr = helmet.tempStatAccArr;
            //
            //                    for (int a = 0; a < aSize; a++) {
            //                        if (Main.interrupt || exit) {
            //                            break;
            //                        }
            //
            //                        final Item armor = allarmors[a];
            //                        final float[] armorAccumulatorArr = armor.tempStatAccArr;
            //
            //                        // For 4 piece sets, we can short circuit if the first 3 pieces don't match possible sets,
            //                        // but only if the items are sorted & prioritized by set.
            //                        if (isShortCircuitable4PieceSet) {
            //                            if (!(firstSets.contains(weapon.getSet())
            //                                    ||    firstSets.contains(helmet.getSet())
            //                                    ||    firstSets.contains(armor.getSet()))) {
            //                                // continue not return because other helmets may work
            //                                break;
            //                            }
            //                        }
            //
            //                        for (int n = 0; n < nSize; n++) {
            //                            final Item necklace = allnecklaces[n];
            //                            final float[] necklaceAccumulatorArr = necklace.tempStatAccArr;
            //
            //                            for (int r = 0; r < rSize; r++) {
            //                                if (Main.interrupt || exit) {
            //                                    break;
            //                                }
            //
            //                                final Item ring = allrings[r];
            //                                final float[] ringAccumulatorArr = ring.tempStatAccArr;
            //
            //                                int endSize = bSize;
            //                                int outputArgs = 37;
            //                                float[] results = new float[endSize * outputArgs];
            //
            //                                int argSize = 13;
            //
            //                                final float[] flattenedBootAccs = flattenAccArrs(allboots, statCalculator);
            //
            //                                final int wSet = weapon.set.index;
            //                                final int hSet = helmet.set.index;
            //                                final int aSet = armor.set.index;
            //                                final int nSet = necklace.set.index;
            //                                final int rSet = ring.set.index;
            //
            //                                kernel.setFlattenedBootAccs(flattenedBootAccs);
            //
            //                                kernel.setBSize(bSize);
            //
            //                                kernel.setWSet(wSet);
            //                                kernel.setHSet(hSet);
            //                                kernel.setASet(aSet);
            //                                kernel.setNSet(nSet);
            //                                kernel.setRSet(rSet);
            //
            //                                kernel.setArgSize(argSize);
            //                                kernel.setOutputArgs(outputArgs);
            //
            //                                kernel.setWeaponAccumulatorArr(weaponAccumulatorArr);
            //                                kernel.setHelmetAccumulatorArr(helmetAccumulatorArr);
            //                                kernel.setArmorAccumulatorArr(armorAccumulatorArr);
            //                                kernel.setNecklaceAccumulatorArr(necklaceAccumulatorArr);
            //                                kernel.setRingAccumulatorArr(ringAccumulatorArr);
            //
            //                                kernel.setResults(results);
            //
            //                                int localPermutations = allboots.length;
            //                                Range range = Range.create(localPermutations);
            //                                kernel.setExplicit(true);
            //                                kernel.execute(range);
            //
            //                                kernel.get(results);
            //
            //                                List<ProfileInfo> profileInfo = kernel.getProfileInfo();
            ////
            //                                for (final ProfileInfo p : profileInfo) {
            //                                    System.out.print(" " + p.getType() + " " + p.getLabel() + " " + (p.getStart() / 1000) + " .. "
            //                                            + (p.getEnd() / 1000) + " " + ((p.getEnd() - p.getStart()) / 1000) + "us");
            //                                    System.out.println("-----");
            //                                }
            //
            //                                for (int i = 0; i < endSize; i++) {
            //                                    final HeroStats result = new HeroStats(
            //                                            (int)results[i * outputArgs + 0],
            //                                            (int)results[i * outputArgs + 1],
            //                                            (int)results[i * outputArgs + 2],
            //                                            (int)results[i * outputArgs + 3],
            //                                            (int)results[i * outputArgs + 4],
            //                                            (int)results[i * outputArgs + 5],
            //                                            (int)results[i * outputArgs + 6],
            //                                            0,
            //                                            (int)results[i * outputArgs + 7],
            //                                            (int)results[i * outputArgs + 8],
            //                                            (int)results[i * outputArgs + 9],
            //                                            (int)results[i * outputArgs + 10],
            //                                            (int)results[i * outputArgs + 11],
            //                                            (int)results[i * outputArgs + 12],
            //                                            (int)results[i * outputArgs + 13],
            //                                            (int)results[i * outputArgs + 14],
            //                                            (int)results[i * outputArgs + 15],
            //                                            (int)results[i * outputArgs + 16],
            //                                            6,
            //                                            6,
            //                                            (int)results[i * outputArgs + 17],
            //                                            6,
            //                                            base.bonusStats, null, null, null, null, null, null, null);
            //
            //                                    searchedCounter.getAndIncrement();
            //
            //                                    final int[] collectedSets = new int[]{
            //                                            (int) results[i * outputArgs + 21],
            //                                            (int) results[i * outputArgs + 22],
            //                                            (int) results[i * outputArgs + 23],
            //                                            (int) results[i * outputArgs + 24],
            //                                            (int) results[i * outputArgs + 25],
            //                                            (int) results[i * outputArgs + 26],
            //                                            (int) results[i * outputArgs + 27],
            //                                            (int) results[i * outputArgs + 28],
            //                                            (int) results[i * outputArgs + 29],
            //                                            (int) results[i * outputArgs + 30],
            //                                            (int) results[i * outputArgs + 31],
            //                                            (int) results[i * outputArgs + 32],
            //                                            (int) results[i * outputArgs + 33],
            //                                            (int) results[i * outputArgs + 34],
            //                                            (int) results[i * outputArgs + 35],
            //                                            (int) results[i * outputArgs + 36]
            //                                    };
            //
            //                                    //                            System.out.println(w + " " + h + " " + a + " " + (int)results[i * outputArgs + 18] + " " + (int)results[i * outputArgs + 19] + " " + (int)results[i * outputArgs + 20]);
            //                                    //                            for (int x = 0; x < 16; x++) {
            //                                    //                                System.out.println(Arrays.asList(collectedSets[x]));
            //                                    //                            }
            //
            //                                    final boolean passesFilter = passesFilter(result, request, collectedSets);
            //                                    result.setSets(collectedSets);
            //                                    if (passesFilter) {
            //                                        final long resultsIndex = resultsCounter.getAndIncrement();
            //                                        if (resultsIndex < MAXIMUM_RESULTS) {
            //                                            result.setId("" + resultsIndex);
            //
            //                                            final long index1D = finalW * hSize * aSize * nSize * rSize * bSize + h * aSize * nSize * rSize * bSize + a * nSize * rSize * bSize + (int)results[i* outputArgs + 18] * rSize * bSize + (int)results[i* outputArgs + 19] * bSize + (int)results[i* outputArgs + 20];
            //
            //                                            result.setItems(ImmutableList.of(
            //                                                    weapon.getId(),
            //                                                    helmet.getId(),
            //                                                    armor.getId(),
            //                                                    necklace.id,
            //                                                    ring.id,
            //                                                    allboots[(int)results[i* outputArgs + 20]].id
            //                                            ));
            //                                            result.setModIds(ImmutableList.of(
            //                                                    weapon.getModId(),
            //                                                    helmet.getModId(),
            //                                                    armor.getModId(),
            //                                                    necklace.modId,
            //                                                    ring.modId,
            //                                                    allboots[(int)results[i* outputArgs + 20]].modId
            //                                            ));
            //                                            result.setMods(Lists.newArrayList(
            //                                                    weapon.getMod(),
            //                                                    helmet.getMod(),
            //                                                    armor.getMod(),
            //                                                    necklace.getMod(),
            //                                                    ring.getMod(),
            //                                                    allboots[(int)results[i* outputArgs + 20]].getMod()
            //                                            ));
            //
            //                                            resultHeroStats[(int) resultsIndex] = result;
            //                                            resultInts[(int) resultsIndex] = index1D;
            //
            //                                            if (resultsIndex == MAXIMUM_RESULTS-1) {
            //                                                maxReached.set(MAXIMUM_RESULTS-1);
            //                                            }
            //                                        } else {
            //                                            System.out.println("EXIT");
            //                                            exit = true;
            //                                            break;
            //                                        }
            //                                    }
            //                                }
            //                            }
            //                        }
            //
            ////                        int multipleOf128 = localPermutations + (128 - localPermutations % 128);
            //
            ////                        Range range = Range.create(localPermutations);
            ////                        kernel.execute(range);
            //
            //
            //
            //
            ////                        for (int n = 0; n < nSize; n++) {
            ////                            final Item necklace = allnecklaces[n];
            ////                            final float[] necklaceAccumulatorArr = necklace.tempStatAccArr;
            ////
            ////                            for (int r = 0; r < rSize; r++) {
            ////                                final Item ring = allrings[r];
            ////                                final float[] ringAccumulatorArr = ring.tempStatAccArr;
            ////
            ////                                for (int b = 0; b < bSize; b++) {
            ////                                    if (Main.interrupt) {
            ////                                        break;
            ////                                    }
            ////                                    if (exit) break;
            ////
            ////                                    final Item boots = allboots[b];
            ////                                    final float[] bootsAccumulatorArr = boots.tempStatAccArr;
            ////
            ////                                    //
            ////
            ////                                    final Item[] collectedItems = new Item[]{weapon, helmet, armor, necklace, ring, boots};
            ////                                    final int[] collectedSets = statCalculator.buildSetsArr(collectedItems);
            ////                                    final int reforges = weapon.upgradeable + helmet.upgradeable + armor.upgradeable + necklace.upgradeable + ring.upgradeable + boots.upgradeable;
            ////                                    final int conversions = weapon.convertable + helmet.convertable + armor.convertable + necklace.convertable + ring.convertable + boots.convertable;
            ////                                    final int priority = weapon.priority + helmet.priority + armor.priority + necklace.priority + ring.priority + boots.priority;
            ////                                    final HeroStats result = statCalculator.addAccumulatorArrsToHero(
            ////                                            base,
            ////                                            new float[][]{weaponAccumulatorArr, helmetAccumulatorArr, armorAccumulatorArr, necklaceAccumulatorArr, ringAccumulatorArr, bootsAccumulatorArr},
            ////                                            collectedSets,
            ////                                            request.hero,
            ////                                            reforges,
            ////                                            conversions,
            ////                                            priority);
            ////                                    searchedCounter.getAndIncrement();
            ////
            ////                                    final boolean passesFilter = passesFilter(result, request, collectedSets);
            ////                                    result.setSets(collectedSets);
            ////                                    if (passesFilter) {
            ////                                        final long resultsIndex = resultsCounter.getAndIncrement();
            ////                                        if (resultsIndex < MAXIMUM_RESULTS) {
            ////                                            result.setId("" + resultsIndex);
            ////
            ////                                            final long index1D = finalW * hSize * aSize * nSize * rSize * bSize + h * aSize * nSize * rSize * bSize + a * nSize * rSize * bSize + n * rSize * bSize + r * bSize + b;
            ////
            ////                                            result.setItems(ImmutableList.of(
            ////                                                    weapon.getId(),
            ////                                                    helmet.getId(),
            ////                                                    armor.getId(),
            ////                                                    necklace.getId(),
            ////                                                    ring.getId(),
            ////                                                    boots.getId()
            ////                                            ));
            ////                                            result.setModIds(ImmutableList.of(
            ////                                                    weapon.getModId(),
            ////                                                    helmet.getModId(),
            ////                                                    armor.getModId(),
            ////                                                    necklace.getModId(),
            ////                                                    ring.getModId(),
            ////                                                    boots.getModId()
            ////                                            ));
            ////                                            result.setMods(Lists.newArrayList(
            ////                                                    weapon.getMod(),
            ////                                                    helmet.getMod(),
            ////                                                    armor.getMod(),
            ////                                                    necklace.getMod(),
            ////                                                    ring.getMod(),
            ////                                                    boots.getMod()
            ////                                            ));
            ////
            ////                                            resultHeroStats[(int) resultsIndex] = result;
            ////                                            resultInts[(int) resultsIndex] = index1D;
            ////
            ////                                            if (resultsIndex == MAXIMUM_RESULTS-1) {
            ////                                                maxReached.set(MAXIMUM_RESULTS-1);
            ////                                            }
            ////                                        } else {
            ////                                            System.out.println("EXIT");
            ////                                            exit = true;
            ////                                            break;
            ////                                        }
            ////                                    }
            ////                                }
            ////                            }
            ////                        }
            //                    }
            //                }
            //            } catch (Exception e) {
            //                e.printStackTrace();
            //            }
            //        }


        try {
            executorService.shutdown();
            executorService.awaitTermination(50000000, TimeUnit.SECONDS);

            try {
                final long size = maxReached.get() == MAXIMUM_RESULTS-1 ? MAXIMUM_RESULTS : resultsCounter.get();
                System.out.println("MaxReached: " + size);

                optimizationDb.setResultHeroes(resultHeroStats, size);

                System.out.println("OPTIMIZATION_REQUEST_END");
                System.out.println("PROGRESS: [" + size + "]");
                OptimizationResponse response = OptimizationResponse.builder()
                        .searched(searchedCounter.get())
                        .results(resultsCounter.get())
                        .build();

                inProgress = false;
                return gson.toJson(response);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        inProgress = false;
        return "";
    }

    public int[] convertSetsArrayIntoIndexArray(final int[] sets) {
        final int[] output = new int[]{0, 0, 0, 0, 0, 0};
        int count = 0;

        for (int i = 0; i < SET_COUNT; i++) {
            if (sets[i] > 0) {
                for (int j = 0; j < sets[i]; j++) {
                    output[count] = i;
                    count++;
                }
            }
        }

        return output;
    }

    public boolean passesFilter(final HeroStats heroStats, final OptimizationRequest request, final int[] sets) {
        if (heroStats.atk < request.inputAtkMinLimit || heroStats.atk > request.inputAtkMaxLimit
                ||  heroStats.hp  < request.inputHpMinLimit  || heroStats.hp > request.inputHpMaxLimit
                ||  heroStats.def < request.inputDefMinLimit || heroStats.def > request.inputDefMaxLimit
                ||  heroStats.spd < request.inputSpdMinLimit || heroStats.spd > request.inputSpdMaxLimit
                ||  heroStats.cr < request.inputCrMinLimit   || heroStats.cr > request.inputCrMaxLimit
                ||  heroStats.cd < request.inputCdMinLimit   || heroStats.cd > request.inputCdMaxLimit
                ||  heroStats.eff < request.inputEffMinLimit || heroStats.eff > request.inputEffMaxLimit
                ||  heroStats.res < request.inputResMinLimit || heroStats.res > request.inputResMaxLimit
                ||  heroStats.cp < request.inputMinCpLimit || heroStats.cp > request.inputMaxCpLimit
                ||  heroStats.hpps < request.inputMinHppsLimit || heroStats.hpps > request.inputMaxHppsLimit
                ||  heroStats.ehp < request.inputMinEhpLimit || heroStats.ehp > request.inputMaxEhpLimit
                ||  heroStats.ehpps < request.inputMinEhppsLimit || heroStats.ehpps > request.inputMaxEhppsLimit
                ||  heroStats.dmg < request.inputMinDmgLimit || heroStats.dmg > request.inputMaxDmgLimit
                ||  heroStats.dmgps < request.inputMinDmgpsLimit || heroStats.dmgps > request.inputMaxDmgpsLimit
                ||  heroStats.mcdmg < request.inputMinMcdmgLimit || heroStats.mcdmg > request.inputMaxMcdmgLimit
                ||  heroStats.mcdmgps < request.inputMinMcdmgpsLimit || heroStats.mcdmgps > request.inputMaxMcdmgpsLimit
                ||  heroStats.dmgh < request.inputMinDmgHLimit || heroStats.dmgh > request.inputMaxDmgHLimit
                ||  heroStats.score < request.inputMinScoreLimit || heroStats.score > request.inputMaxScoreLimit
                ||  heroStats.priority < request.inputMinPriorityLimit || heroStats.priority > request.inputMaxPriorityLimit
                ||  heroStats.upgrades < request.inputMinUpgradesLimit || heroStats.upgrades > request.inputMaxUpgradesLimit
                ||  heroStats.conversions < request.inputMinConversionsLimit || heroStats.conversions > request.inputMaxConversionsLimit
        ) {
            return false;
        }

        final int[] indexArray = convertSetsArrayIntoIndexArray(sets);
        final int index = calculateSetIndex(indexArray);
        //        System.out.println(Arrays.toString(indexArray));

        if (request.boolArr[index] == false) {
            return false;
        }

        return true;
    }

    public Map<Gear, List<Item>> buildItemsByGear(final List<Item> items) {
        return ImmutableList.copyOf(Gear.values())
                .stream()
                .collect(Collectors.toMap(
                        Function.identity(),
                        gear -> items.stream()
                                .filter(x -> x.getGear() == gear)
                                .collect(Collectors.toList())));
    }

    public List<Set> getSetsOrElseAll(final List<Set> sets) {
        if (sets == null || sets.size() == 0) {
            return ImmutableList.of();
        }
        return sets;
    }

    private static final int POW_16_5 = 1048576;
    private static final int POW_16_4 = 65536;
    private static final int POW_16_3 = 4096;
    private static final int POW_16_2 = 256;
    private static final int POW_16_1 = 16;

    public int calculateSetIndex(final int[] indices) { // sorted, size 6, elements [0-15]
        return indices[0] * POW_16_5
                + indices[1] * POW_16_4
                + indices[2] * POW_16_3
                + indices[3] * POW_16_2
                + indices[4] * POW_16_1
                + indices[5];
    }

    // https://java2blog.com/permutations-array-java/
    public List<List<Integer>> permute(int[] arr) {
        List<List<Integer>> list = new ArrayList<>();
        permuteHelper(list, new ArrayList<>(), arr, new boolean[arr.length]);

        return list;
    }

    private void permuteHelper(List<List<Integer>> list, List<Integer> resultList, int [] arr, boolean [] used){

        // Base case
        if(resultList.size() == arr.length){
            list.add(new ArrayList<>(resultList));
        } else{
            for(int i = 0; i < arr.length; i++){
                if(used[i] || i > 0 && arr[i] == arr[i-1] && !used[i - 1])
                {
                    // If element is already used
                    continue;
                }
                // choose element
                used[i] = true;
                resultList.add(arr[i]);

                // Explore
                permuteHelper(list, resultList, arr, used);

                // Unchoose element
                used[i] = false;
                resultList.remove(resultList.size() - 1);
            }
        }
    }

    public void addCalculatedFields(OptimizationRequest request) {
        boolean[] permutations = new boolean[16777216];
        final List<Set> inputSets1 = getSetsOrElseAll(request.getInputSetsOne());
        final List<Set> inputSets2 = getSetsOrElseAll(request.getInputSetsTwo());
        final List<Set> inputSets3 = getSetsOrElseAll(request.getInputSetsThree());

        final int setFormat = request.getSetFormat();
        if (setFormat == 0) {
            // [0][0][0] All valid

            Arrays.fill(permutations, true);
        } else if (setFormat == 1) {
            // [4][2][0]

            for (Set set1 : inputSets1) {
                for (Set set2 : inputSets2) {
                    final int[] indices = ArrayUtils.addAll(set1.getIndices(), set2.getIndices());
                    Arrays.sort(indices);

                    List<List<Integer>> allSolutions = permute(indices);
                    System.out.println(allSolutions);
                    for (int i = 0; i < allSolutions.size(); i++) {
                        final int index1D = calculateSetIndex(allSolutions.get(i).stream().mapToInt(x->x).toArray());
                        permutations[index1D] = true;
                    }
//                    }
                    //                    System.out.println(Arrays.toString(indices));
                    //                    System.out.println(set1);
                    //                    System.out.println(set2);
                    //                    System.out.println(index1D);
                    //                    System.out.println("----");
                }
            }
        } else if (setFormat == 2) {
            // [4][0][0]

            final int[] missing = new int[]{0, 0};
            for (Set set1 : inputSets1) {
                final int[] indices = ArrayUtils.addAll(set1.getIndices(), missing);
                for (int a = 0; a < SET_COUNT; a++) {
                    for (int b = 0; b < SET_COUNT; b++) {
                        final int[] indicesInstance = ArrayUtils.clone(indices);
                        indicesInstance[4] = a;
                        indicesInstance[5] = b;

                        Arrays.sort(indicesInstance);

                        List<List<Integer>> allSolutions = permute(indices);
                        for (int i = 0; i < 720; i++) {
                            final int index1D = calculateSetIndex(allSolutions.get(i).stream().mapToInt(x->x).toArray());
                            permutations[index1D] = true;
                        }
                        //                        System.out.println(Arrays.toString(indicesInstance));
                        //                        System.out.println(set1);
                        //                        System.out.println(index1D);
                        //                        System.out.println("----");
                    }
                }
            }
        } else if (setFormat == 3) {
            // [2][0][0]

            final int[] missing = new int[]{0, 0, 0, 0};
            for (Set set1 : inputSets1) {
                final int[] indices = ArrayUtils.addAll(set1.getIndices(), missing);
                for (int a = 0; a < SET_COUNT; a++) {
                    for (int b = 0; b < SET_COUNT; b++) {
                        for (int c = 0; c < SET_COUNT; c++) {
                            for (int d = 0; d < SET_COUNT; d++) {
                                final int[] indicesInstance = ArrayUtils.clone(indices);
                                indicesInstance[2] = a;
                                indicesInstance[3] = b;
                                indicesInstance[4] = c;
                                indicesInstance[5] = d;

                                Arrays.sort(indicesInstance);

                                List<List<Integer>> allSolutions = permute(indices);
                                for (int i = 0; i < 720; i++) {
                                    final int index1D = calculateSetIndex(allSolutions.get(i).stream().mapToInt(x->x).toArray());
                                    permutations[index1D] = true;
                                }
                                //                                System.out.println(Arrays.toString(indicesInstance));
                                //                                System.out.println(set1);
                                //                                System.out.println(index1D);
                                //                                System.out.println("----");
                            }
                        }
                    }
                }
            }
        } else if (setFormat == 4) {
            // [2][2][0]

            final int[] missing = new int[]{0, 0};
            for (Set set1 : inputSets1) {
                for (Set set2 : inputSets2) {
                    final int[] indices = ArrayUtils.addAll(ArrayUtils.addAll(set1.getIndices(), set2.getIndices()), missing);
                    for (int a = 0; a < SET_COUNT; a++) {
                        for (int b = 0; b < SET_COUNT; b++) {
                            final int[] indicesInstance = ArrayUtils.clone(indices);
                            indicesInstance[4] = a;
                            indicesInstance[5] = b;

                            Arrays.sort(indicesInstance);

                            List<List<Integer>> allSolutions = permute(indices);
                            for (int i = 0; i < 720; i++) {
                                final int index1D = calculateSetIndex(allSolutions.get(i).stream().mapToInt(x->x).toArray());
                                permutations[index1D] = true;
                            }
                            //                            System.out.println(Arrays.toString(indicesInstance));
                            //                            System.out.println(set1);
                            //                            System.out.println(set2);
                            //                            System.out.println(index1D);
                            //                            System.out.println("----");
                        }
                    }
                }
            }
        } else if (setFormat == 5) {
            // [2][2][2]

            for (Set set1 : inputSets1) {
                for (Set set2 : inputSets2) {
                    for (Set set3 : inputSets3) {
                        final int[] indices = ArrayUtils.addAll(ArrayUtils.addAll(set1.getIndices(), set2.getIndices()), set3.getIndices());
                        Arrays.sort(indices);

                        List<List<Integer>> allSolutions = permute(indices);
                        for (int i = 0; i < 720; i++) {
                            final int index1D = calculateSetIndex(allSolutions.get(i).stream().mapToInt(x->x).toArray());
                            permutations[index1D] = true;
                        }
                        //                        System.out.println(Arrays.toString(indices));
                        //                        System.out.println(set1);
                        //                        System.out.println(set2);
                        //                        System.out.println(set3);
                        //                        System.out.println(index1D);
                        //                        System.out.println("----");
                    }
                }
            }
        } else {
            throw new RuntimeException("Invalid Set Format " + request.getSetFormat());
        }

        request.setBoolArr(permutations);
    }
}


//        System.out.println("DEBUG WEAPONS");
//
//        for (int i = 0; i < allweapons.length; i++) {
//            for (int j = 0; j < 16; j++) {
//                System.out.print(flattenedWeaponAccs[i * 16 + j] + "     ");
//            }
//            System.out.println();
//        }
//
//        System.out.println("DEBUG HELMETS");
//
//        for (int i = 0; i < allhelmets.length; i++) {
//            for (int j = 0; j < 16; j++) {
//                System.out.print(flattenedHelmetAccs[i * 16 + j] + "     ");
//            }
//            System.out.println();
//        }
//
//        System.out.println("DEBUG ARMORS");
//
//        for (int i = 0; i < allarmors.length; i++) {
//            for (int j = 0; j < 16; j++) {
//                System.out.print(flattenedArmorAccs[i * 16 + j] + "     ");
//            }
//            System.out.println();
//        }
//
//        System.out.println("DEBUG NECKLACES");
//
//        for (int i = 0; i < allnecklaces.length; i++) {
//            for (int j = 0; j < 16; j++) {
//                System.out.print(flattenedNecklaceAccs[i * 16 + j] + "     ");
//            }
//            System.out.println();
//        }
//
//        System.out.println("DEBUG RINGS");
//
//        for (int i = 0; i < allrings.length; i++) {
//            for (int j = 0; j < 16; j++) {
//                System.out.print(flattenedRingAccs[i * 16 + j] + "     ");
//            }
//            System.out.println();
//        }
//
//        System.out.println("DEBUG BOOTS");
//
//        for (int i = 0; i < allboots.length; i++) {
//            for (int j = 0; j < 16; j++) {
//                System.out.print(flattenedBootAccs[i * 16 + j] + "     ");
//            }
//            System.out.println();
//        }
