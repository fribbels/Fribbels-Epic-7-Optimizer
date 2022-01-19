package com.fribbels.handler;

import com.aparapi.Kernel;
import com.aparapi.Range;
import com.aparapi.device.Device;
import com.aparapi.device.OpenCLDevice;
import com.aparapi.internal.kernel.KernelManager;
import com.aparapi.internal.opencl.OpenCLPlatform;
import com.fribbels.Main;
import com.fribbels.db.ItemDb;
import com.fribbels.gpu.GpuOptimizerKernel;
import com.fribbels.gpu.SetFormat000OptimizerKernel;
import com.fribbels.core.StatCalculator;
import com.fribbels.db.BaseStatsDb;
import com.fribbels.db.HeroDb;
import com.fribbels.db.OptimizationDb;
import com.fribbels.enums.Gear;
import com.fribbels.enums.Set;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;
import com.fribbels.model.PassesContainer;
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
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;
import java.util.stream.Collectors;

public class OptimizationRequestHandler extends RequestHandler implements HttpHandler {

    public static int SETTING_MAXIMUM_RESULTS = 5_000_000;
    public static boolean SETTING_GPU = true;

    private BaseStatsDb baseStatsDb;
    private Map<String, OptimizationDb> optimizationDbs;
    private HeroDb heroDb;
    private ItemDb itemDb;
    public static boolean inProgress = false;

    private static final Gson gson = new Gson();
    private static final int SET_COUNT = 16;
    @Getter
    private AtomicLong searchedCounter = new AtomicLong(0);
    private AtomicLong resultsCounter = new AtomicLong(0);

    private int[] setSolutionBitMasks;

    private boolean canUseGpu = true;

    private boolean[] permutations = new boolean[16777216];
    private int[] setPermutationIndicesPlusOne = new int[16777216];

    public OptimizationRequestHandler(final BaseStatsDb baseStatsDb,
                                      final HeroDb heroDb,
                                      final ItemDb itemDb) {
        this.baseStatsDb = baseStatsDb;
        this.heroDb = heroDb;
        this.itemDb = itemDb;
        optimizationDbs = new HashMap<>();

        ExecutorService t = Executors.newFixedThreadPool(3);

        t.execute(() -> {
            setSolutionBitMasks = new int[16777216];
            int count = 0;
            for (int a = 0; a < 16; a++) {
                for (int b = 0; b < 16; b++) {
                    for (int c = 0; c < 16; c++) {
                        for (int d = 0; d < 16; d++) {
                            for (int e = 0; e < 16; e++) {
                                for (int f = 0; f < 16; f++) {
                                    int[] sets = new int[]{a, b, c, d, e, f};
                                    int[] counters = convertSetsToSetCounters(sets);

                                    int l = 0;

                                    l += counters[15] / 4 > 0 ? 1 : 0; // injury
                                    l <<= 1;
                                    l += counters[14] / 4 > 0 ? 1 : 0; // revenge
                                    l <<= 1;
                                    l += counters[13] / 2 > 0 ? 1 : 0; // pen
                                    l <<= 1;
                                    l += counters[12] / 2 > 0 ? 1 : 0; // immunity
                                    l <<= 1;
                                    l += counters[11] / 4 > 0 ? 1 : 0; // rage
                                    l <<= 1;
                                    l += counters[10] / 2 > 0 ? 1 : 0; // unity - should be x3 but don't need it
                                    l <<= 1;
                                    l += counters[9] / 2 > 0 ? 1 : 0; // res1
                                    l <<= 1;
                                    l += counters[9] / 2 - 1 > 0 ? 1 : 0; // res2
                                    l <<= 1;
                                    l += counters[9] / 2 - 2 > 0 ? 1 : 0; // res3
                                    l <<= 1;
                                    l += counters[8] / 4 > 0 ? 1 : 0; // counter
                                    l <<= 1;
                                    l += counters[7] / 4 > 0 ? 1 : 0; // lifesteal
                                    l <<= 1;
                                    l += counters[6] / 4 > 0 ? 1 : 0; // destr
                                    l <<= 1;
                                    l += counters[5] / 2 > 0 ? 1 : 0; // hit1
                                    l <<= 1;
                                    l += counters[5] / 2 - 1 > 0 ? 1 : 0; // hit2
                                    l <<= 1;
                                    l += counters[5] / 2 - 2 > 0 ? 1 : 0; // hit3
                                    l <<= 1;
                                    l += counters[4] / 2 > 0 ? 1 : 0; // crit1
                                    l <<= 1;
                                    l += counters[4] / 2 - 1 > 0 ? 1 : 0; // crit2
                                    l <<= 1;
                                    l += counters[4] / 2 - 2 > 0 ? 1 : 0;  // crit3
                                    l <<= 1;
                                    l += counters[3] / 4 > 0 ? 1 : 0; // spd
                                    l <<= 1;
                                    l += counters[2] / 4 > 0 ? 1 : 0; // atk
                                    l <<= 1;
                                    l += counters[1] / 2 > 0 ? 1 : 0; // def1
                                    l <<= 1;
                                    l += counters[1] / 2 - 1 > 0 ? 1 : 0; // def2
                                    l <<= 1;
                                    l += counters[1] / 2 - 2 > 0 ? 1 : 0; // def3
                                    l <<= 1;
                                    l += counters[0] / 2 > 0 ? 1 : 0; // hp1
                                    l <<= 1;
                                    l += counters[0] / 2 - 1 > 0 ? 1 : 0; // hp2
                                    l <<= 1;
                                    l += counters[0] / 2 - 2 > 0 ? 1 : 0; // hp3

                                    setSolutionBitMasks[count] = l;
                                    count++;
                                }
                            }
                        }
                    }
                }
            }
        });

        t.execute(() -> {
            permutations = new boolean[16777216];
            setPermutationIndicesPlusOne = new int[16777216];
        });

        t.execute(() -> {
            try {
                final boolean isIntel = KernelManager
                        .instance()
                        .bestDevice()
                        .toString()
                        .toLowerCase()
                        .contains("intel");
                if (isIntel) {
                    System.out.println("Disabling GPU acceleration: Intel card detected");
                    canUseGpu = false;
                    return;
                }

                final Kernel testKernel = new Kernel() {
                    @Override
                    public void run() {

                    }
                };
                if (!testKernel.isRunningCL()) {
                    System.out.println("Disabling GPU acceleration: Non CL device detected");
                    canUseGpu = false;
                    return;
                }
                testKernel.dispose();

            } catch (final Exception e) {
                canUseGpu = false;
                System.out.println("Error detecting GPU");
            }
        });
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

    // Compute a power of two less than or equal to `n`
    public static int findPreviousPowerOf2(int n) {
        // set all bits after the last set bit
        n = n | (n >> 1);
        n = n | (n >> 2);
        n = n | (n >> 4);
        n = n | (n >> 8);
        n = n | (n >> 16);

        // drop all but the last set bit from `n`
        return n - (n >> 1);
    }

    @SneakyThrows
    public String optimize(final OptimizationRequest request, final HeroStats unused) {
        long startTime = System.currentTimeMillis();
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
        rawItems.forEach(x -> itemDb.calculateWss(x));

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
        System.out.println("Start allocating memory");
        final HeroStats[] resultHeroStats = new HeroStats[MAXIMUM_RESULTS];
//        final long[] resultInts = new long[MAXIMUM_RESULTS];
        System.out.println("Finished allocating memory");

        final Map<Gear, List<Item>> itemsByGear = buildItemsByGear(items);

        final Map<String, float[]> accumulatorArrsByItemId = new ConcurrentHashMap<>(new HashMap<>());
        final ExecutorService executorService = Executors.newFixedThreadPool(2);
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

        final float bonusBaseAtk = base.atk + base.atk * (hero.bonusAtkPercent + hero.aeiAtkPercent) / 100f + hero.bonusAtk + hero.aeiAtk;
        final float bonusBaseHp = base.hp + base.hp * (hero.bonusHpPercent + hero.aeiHpPercent) / 100f + hero.bonusHp + hero.aeiHp;
        final float bonusBaseDef = base.def + base.def * (hero.bonusDefPercent + hero.aeiDefPercent) / 100f + hero.bonusDef + hero.aeiDef;

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

        final long maxPerms = ((long)wSize) * hSize * aSize * nSize * rSize * bSize;

        final GpuOptimizerKernel kernel;

        if (SETTING_GPU && canUseGpu && maxPerms >= 20_000_000) {
            // GPU Optimize

//            final int max = 2097152;
            final int max = 1048576;
            final int argSize = 16;

            kernel = selectKernel(
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
                    max, setSolutionBitMasks
            );

            try {

                int maxWorkGroupSize = 64;

                try {
                    //                final Device bestDevice = KernelManager.instance().bestDevice();

                    List<OpenCLPlatform> platforms = OpenCLPlatform.getUncachedOpenCLPlatforms();
                    final Optional<OpenCLDevice> bestDevice = platforms.stream()
                            .flatMap(x -> x.getOpenCLDevices().stream())
                            .filter(x -> x.getDeviceId() == Main.BEST_DEVICE_ID)
                            .findFirst();

                    System.out.println(bestDevice);

                    final int kernelMaxWorkGroupSize = kernel.getKernelMaxWorkGroupSize(bestDevice.get());
                    System.out.println("Kernel max work group size: " + kernelMaxWorkGroupSize);

                    maxWorkGroupSize = kernelMaxWorkGroupSize;
                    System.out.println("Kernel max work group size power of 2: " + maxWorkGroupSize);
                } catch (final Exception e) {
                    e.printStackTrace();
                    System.out.println("Could not find max work group size. Defaulting.");
                }

                final int finalMaxWorkGroupSize = maxWorkGroupSize;

                kernel.setExecutionModeWithoutFallback(Kernel.EXECUTION_MODE.GPU);

                final AtomicBoolean exit = new AtomicBoolean(false);
                final AtomicInteger executionCounter = new AtomicInteger(0);

                final Map<String, PassesContainer> passesPool = new HashMap<>();

                for (int i = 0; i < maxPerms / max + 1; i++) {
                    if (exit.get() || Main.interrupt)
                        break;

                    final int finalI = i;

                    final boolean[] passes;
                    final String passesId;
                    final Optional<PassesContainer> containerOptional = passesPool.values()
                            .stream()
                            .filter(x -> !x.isLocked())
                            .findFirst();
                    if (containerOptional.isPresent()) {
                        final PassesContainer container = containerOptional.get();
                        passes = container.getPasses();
                        passesId = container.getId();
                        container.setLocked(true);
                    } else {
                        try {
                            passes = new boolean[max];
                            passesId = "" + finalI;
                            passesPool.put(passesId, PassesContainer.builder()
                                    .id(passesId)
                                    .passes(passes)
                                    .locked(true)
                                    .build());
                        } catch (final OutOfMemoryError e) {
                            e.printStackTrace();
                            inProgress = false;

                            break;
                        }
                    }

                    List<OpenCLPlatform> platforms = OpenCLPlatform.getUncachedOpenCLPlatforms();
                    final Optional<OpenCLDevice> bestDevice = platforms.stream()
                            .flatMap(x -> x.getOpenCLDevices().stream())
                            .filter(x -> x.getDeviceId() == Main.BEST_DEVICE_ID)
                            .findFirst();

                    while(executionCounter.get() > 1 && !exit.get() && !Main.interrupt) {
                        Thread.sleep(10);
                    }

                    executionCounter.incrementAndGet();

                    final Range range = bestDevice.get().createRange(max, finalMaxWorkGroupSize);
                    kernel.setIteration(finalI);
                    kernel.setPasses(passes);
                    try {
                        kernel.execute(range);
                    } catch (final Exception e) {
                        System.err.println("GPU error, please try again. " + e);
                        inProgress = false;
                        break;
                    }


                    executorService.submit(() -> {

                        searchedCounter.addAndGet(Math.min(max, maxPerms));

                        for (int j = 0; j < max; j++) {
                            final long iteration = ((long) finalI) * max + j;

                            //                    System.out.println(longSetMasks[0]);
                            //                    System.out.println(debug[j]);

                            if (passes[j]) {
                                if (iteration >= maxPerms) {
                                    break;
                                }
                                if (Main.interrupt || exit.get()) {
                                    break;
                                }

                                final int b = (int) (iteration % bSize);
                                final int r = (int) (((iteration - b) / bSize) % rSize);
                                final int n = (int) (((iteration - r * bSize - b) / (bSize * rSize)) % nSize);
                                final int a = (int) (((iteration - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize)) % aSize);
                                final int h = (int) (((iteration - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize)) % hSize);
                                final int w = (int) (((iteration - h * aSize * nSize * rSize * bSize - a * nSize * rSize * bSize - n * rSize * bSize - r * bSize - b) / (bSize * rSize * nSize * aSize * hSize)) % wSize);

                                final Item weapon = allweapons[w];
                                final Item helmet = allhelmets[h];
                                final Item armor = allarmors[a];
                                final Item necklace = allnecklaces[n];
                                final Item ring = allrings[r];
                                final Item boots = allboots[b];

                                final Item[] collectedItems = new Item[]{weapon, helmet, armor, necklace, ring, boots};
                                final int[] collectedSets = statCalculator.buildSetsArr(collectedItems);

                                final int reforges = weapon.upgradeable + helmet.upgradeable + armor.upgradeable + necklace.upgradeable + ring.upgradeable + boots.upgradeable;
                                final int conversions = weapon.convertable + helmet.convertable + armor.convertable + necklace.convertable + ring.convertable + boots.convertable;
                                final int priority = weapon.priority + helmet.priority + armor.priority + necklace.priority + ring.priority + boots.priority;
                                final HeroStats result = statCalculator.addAccumulatorArrsToHero(base, new float[][]{weapon.tempStatAccArr, helmet.tempStatAccArr, armor.tempStatAccArr, necklace.tempStatAccArr, ring.tempStatAccArr, boots.tempStatAccArr}, collectedSets, request.hero, reforges, conversions, priority);

                                result.setSets(collectedSets);
                                result.setItems(ImmutableList.of(allweapons[w].getId(), allhelmets[h].getId(), allarmors[a]
                                        .getId(), allnecklaces[n].id, allrings[r].id, allboots[b].id));
                                result.setModIds(ImmutableList.of(allweapons[w].getModId(), allhelmets[h].getModId(), allarmors[a]
                                        .getModId(), allnecklaces[n].modId, allrings[r].modId, allboots[b].modId));
                                result.setMods(Lists.newArrayList(allweapons[w].getMod(), allhelmets[h].getMod(), allarmors[a]
                                        .getMod(), allnecklaces[n].getMod(), allrings[r].getMod(), allboots[b].getMod()));

                                final long resultsIndex = resultsCounter.getAndIncrement();
                                result.setId("" + resultsIndex);
                                resultHeroStats[(int) resultsIndex] = result;

                                if (resultsIndex >= MAXIMUM_RESULTS - 1) {
                                    maxReached.set(MAXIMUM_RESULTS - 1);
                                    exit.set(true);
                                    break;
                                }
                            }
                        }

                        passesPool.get(passesId).setLocked(false);
                        executionCounter.decrementAndGet();
                    });

                }
            } finally {
                System.out.println("DISPOSE");
                kernel.dispose();
            }
        } else {
            // CPU Optimize

            for (int w = 0; w < wSize; w++) {
                final Item weapon = itemsByGear.get(Gear.WEAPON).get(w);
//                final long finalW = w;

                executorService.submit(() -> {
                    boolean exit = false;
                    try {

                        final float[] weaponAccumulatorArr = statCalculator.getStatAccumulatorArr(base, weapon, accumulatorArrsByItemId, useReforgeStats);

                        for (int h = 0; h < hSize; h++) {
                            final Item helmet = itemsByGear.get(Gear.HELMET).get(h);
                            final float[] helmetAccumulatorArr = statCalculator.getStatAccumulatorArr(base, helmet, accumulatorArrsByItemId, useReforgeStats);

                            for (int a = 0; a < aSize; a++) {
                                final Item armor = itemsByGear.get(Gear.ARMOR).get(a);
                                final float[] armorAccumulatorArr = statCalculator.getStatAccumulatorArr(base, armor, accumulatorArrsByItemId, useReforgeStats);

                                // For 4 piece sets, we can short circuit if the first 3 pieces don't match possible sets,
                                // but only if the items are sorted & prioritized by set.
                                if (isShortCircuitable4PieceSet) {
                                    if (!(firstSets.contains(weapon.getSet())
                                            ||    firstSets.contains(helmet.getSet())
                                            ||    firstSets.contains(armor.getSet()))) {
                                        // continue not return because other helmets may work
                                        break;
                                    }
                                }

                                for (int n = 0; n < nSize; n++) {
                                    final Item necklace = itemsByGear.get(Gear.NECKLACE).get(n);
                                    final float[] necklaceAccumulatorArr = statCalculator.getStatAccumulatorArr(base, necklace, accumulatorArrsByItemId, useReforgeStats);

                                    for (int r = 0; r < rSize; r++) {
                                        final Item ring = itemsByGear.get(Gear.RING).get(r);
                                        final float[] ringAccumulatorArr = statCalculator.getStatAccumulatorArr(base, ring, accumulatorArrsByItemId, useReforgeStats);

                                        for (int b = 0; b < bSize; b++) {
                                            if (Main.interrupt) {
                                                executorService.shutdownNow();
                                                return;
                                            }
                                            if (exit) return;

                                            final Item boots = itemsByGear.get(Gear.BOOTS).get(b);
                                            final float[] bootsAccumulatorArr = statCalculator.getStatAccumulatorArr(base, boots, accumulatorArrsByItemId, useReforgeStats);

                                            final Item[] collectedItems = new Item[]{weapon, helmet, armor, necklace, ring, boots};
                                            final int[] collectedSets = statCalculator.buildSetsArr(collectedItems);
                                            final int reforges = weapon.upgradeable + helmet.upgradeable + armor.upgradeable + necklace.upgradeable + ring.upgradeable + boots.upgradeable;
                                            final int conversions = weapon.convertable + helmet.convertable + armor.convertable + necklace.convertable + ring.convertable + boots.convertable;
                                            final int priority = weapon.priority + helmet.priority + armor.priority + necklace.priority + ring.priority + boots.priority;
                                            final HeroStats result = statCalculator.addAccumulatorArrsToHero(
                                                    base,
                                                    new float[][]{weaponAccumulatorArr, helmetAccumulatorArr, armorAccumulatorArr, necklaceAccumulatorArr, ringAccumulatorArr, bootsAccumulatorArr},
                                                    collectedSets,
                                                    request.hero,
                                                    reforges,
                                                    conversions,
                                                    priority);
                                            searchedCounter.getAndIncrement();
                                            //                                        final boolean passesFilter = true;

                                            final boolean passesFilter = passesFilter(result, request, collectedSets);
                                            result.setSets(collectedSets);
                                            if (passesFilter) {
                                                final long resultsIndex = resultsCounter.getAndIncrement();
                                                if (resultsIndex < MAXIMUM_RESULTS) {
                                                    result.setId("" + resultsIndex);

//                                                    final long index1D = finalW * hSize * aSize * nSize * rSize * bSize + h * aSize * nSize * rSize * bSize + a * nSize * rSize * bSize + n * rSize * bSize + r * bSize + b;

                                                    result.setItems(ImmutableList.of(
                                                            weapon.getId(),
                                                            helmet.getId(),
                                                            armor.getId(),
                                                            necklace.getId(),
                                                            ring.getId(),
                                                            boots.getId()
                                                    ));
                                                    result.setModIds(ImmutableList.of(
                                                            weapon.getModId(),
                                                            helmet.getModId(),
                                                            armor.getModId(),
                                                            necklace.getModId(),
                                                            ring.getModId(),
                                                            boots.getModId()
                                                    ));
                                                    result.setMods(Lists.newArrayList(
                                                            weapon.getMod(),
                                                            helmet.getMod(),
                                                            armor.getMod(),
                                                            necklace.getMod(),
                                                            ring.getMod(),
                                                            boots.getMod()
                                                    ));

                                                    resultHeroStats[(int) resultsIndex] = result;
//                                                    resultInts[(int) resultsIndex] = index1D;

                                                    if (resultsIndex == MAXIMUM_RESULTS-1) {
                                                        maxReached.set(MAXIMUM_RESULTS-1);
                                                    }
                                                } else {
                                                    System.out.println("EXIT");
                                                    exit = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (final Exception e) {
                        inProgress = false;
                        e.printStackTrace();
                    }
                });
            }
        }


        System.out.println("DONE");
        System.out.printf("*** Time taken: %s ms%n", System.currentTimeMillis() - startTime);

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
                        .searched(Math.min(searchedCounter.get(), maxPerms))
                        .results(resultsCounter.get())
                        .build();

                inProgress = false;

                return gson.toJson(response);
            } catch (final Exception e) {
                inProgress = false;
                e.printStackTrace();
            }
        } catch (final Exception e) {
            inProgress = false;
            e.printStackTrace();
        }

        inProgress = false;

        return "";
    }

    public void optimizeKernel() {

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

    public int[] convertSetsToSetCounters(final int[] sets) {
        final int[] output = new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

        for (int i = 0; i < sets.length; i++) {
            output[sets[i]]++;
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
        final List<List<Integer>> list = new ArrayList<>();
        permuteHelper(list, new ArrayList<>(), arr, new boolean[arr.length]);

        return list;
    }

    private void permuteHelper(final List<List<Integer>> list,
                               final List<Integer> resultList,
                               final int [] arr,
                               final boolean [] used) {

        // Base case
        if (resultList.size() == arr.length) {
            list.add(new ArrayList<>(resultList));
        } else {
            for (int i = 0; i < arr.length; i++) {
                if (used[i] || i > 0 && arr[i] == arr[i-1] && !used[i - 1]) {
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
//        final boolean[] permutations = new boolean[16777216];
//        final int[] setPermutationIndicesPlusOne = new int[16777216];
        Arrays.fill(permutations, false);
        Arrays.fill(setPermutationIndicesPlusOne, 0);
//        int[] setSolutionCounters;

//        setSolutionCounters = new int[1];

        final List<Set> inputSets1 = getSetsOrElseAll(request.getInputSetsOne());
        final List<Set> inputSets2 = getSetsOrElseAll(request.getInputSetsTwo());
        final List<Set> inputSets3 = getSetsOrElseAll(request.getInputSetsThree());

        final int setFormat = request.getSetFormat();
        if (setFormat == 0) {
            // [0][0][0] All valid

            Arrays.fill(permutations, true);
//            setSolutionCounters = new int[1];
            setPermutationIndicesPlusOne[0] = 1;
        } else if (setFormat == 1) {
            // [4][2][0]

            for (Set set1 : inputSets1) {
                for (Set set2 : inputSets2) {
                    final int[] indices = ArrayUtils.addAll(set1.getIndices(), set2.getIndices());

                    List<List<Integer>> allSolutions = permute(indices);

//                    setSolutionCounters = new int[allSolutions.size() * 16];
                    for (int i = 0; i < allSolutions.size(); i++) {
                        final int[] solution = allSolutions.get(i).stream().mapToInt(x->x).toArray();
                        final int index1D = calculateSetIndex(solution);

//                        int[] setSolutionCounter = convertSetsToSetCounters(solution);
//                        for (int j = 0; j < 16; j++) {
//                            setSolutionCounters[i*16 + j] = setSolutionCounter[j];
//                        }
//
                        permutations[index1D] = true;
                        setPermutationIndicesPlusOne[index1D] = i + 1;
                    }
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

                        List<List<Integer>> allSolutions = permute(indicesInstance);

//                        setSolutionCounters = new int[allSolutions.size() * 16];
                        for (int i = 0; i < allSolutions.size(); i++) {
                            final int[] solution = allSolutions.get(i).stream().mapToInt(x->x).toArray();
                            final int index1D = calculateSetIndex(solution);

//                            int[] setSolutionCounter = convertSetsToSetCounters(solution);
//                            for (int j = 0; j < 16; j++) {
//                                setSolutionCounters[i*16 + j] = setSolutionCounter[j];
//                            }
//
                            permutations[index1D] = true;
                            setPermutationIndicesPlusOne[index1D] = i + 1;
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

                                final List<List<Integer>> allSolutions = permute(indicesInstance);

//                                setSolutionCounters = new int[allSolutions.size() * 16];
                                for (int i = 0; i < allSolutions.size(); i++) {
                                    final int[] solution = allSolutions.get(i).stream().mapToInt(x->x).toArray();
                                    final int index1D = calculateSetIndex(solution);

//                                    int[] setSolutionCounter = convertSetsToSetCounters(solution);
//                                    for (int j = 0; j < 16; j++) {
//                                        setSolutionCounters[i*16 + j] = setSolutionCounter[j];
//                                    }
//
                                    permutations[index1D] = true;
                                    setPermutationIndicesPlusOne[index1D] = i + 1;
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

                            List<List<Integer>> allSolutions = permute(indicesInstance);

//                            setSolutionCounters = new int[allSolutions.size() * 16];
                            for (int i = 0; i < allSolutions.size(); i++) {
                                final int[] solution = allSolutions.get(i).stream().mapToInt(x->x).toArray();
                                final int index1D = calculateSetIndex(solution);

//                                int[] setSolutionCounter = convertSetsToSetCounters(solution);
//                                for (int j = 0; j < 16; j++) {
//                                    setSolutionCounters[i*16 + j] = setSolutionCounter[j];
//                                }
//
                                permutations[index1D] = true;
                                setPermutationIndicesPlusOne[index1D] = i + 1;
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

                        List<List<Integer>> allSolutions = permute(indices);

//                        setSolutionCounters = new int[allSolutions.size() * 16];
                        for (int i = 0; i < allSolutions.size(); i++) {
                            final int[] solution = allSolutions.get(i).stream().mapToInt(x->x).toArray();
                            final int index1D = calculateSetIndex(solution);

//                            int[] setSolutionCounter = convertSetsToSetCounters(solution);
//                            for (int j = 0; j < 16; j++) {
//                                setSolutionCounters[i*16 + j] = setSolutionCounter[j];
//                            }
//
                            permutations[index1D] = true;
                            setPermutationIndicesPlusOne[index1D] = i + 1;
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
        request.setSetPermutationIndicesPlusOne(setPermutationIndicesPlusOne);
//        request.setSetSolutionCounters(setSolutionCounters);

    }

    public static GpuOptimizerKernel selectKernel(
            final OptimizationRequest request,
            final float[] flattenedWeaponAccs,
            final float[] flattenedHelmetAccs,
            final float[] flattenedArmorAccs,
            final float[] flattenedNecklaceAccs,
            final float[] flattenedRingAccs,
            final float[] flattenedBootAccs,
            final float bonusBaseAtk,
            final float bonusBaseDef,
            final float bonusBaseHp,
            final float atkSetBonus,
            final float hpSetBonus,
            final float defSetBonus,
            final float speedSetBonus,
            final float revengeSetBonus,
            final float penSetDmgBonus,
            final float bonusMaxAtk,
            final float bonusMaxDef,
            final float bonusMaxHp,
            final int SETTING_RAGE_SET,
            final int SETTING_PEN_SET,
            final HeroStats base,
            final Hero hero,
            final int argSize,
            final int wSize,
            final int hSize,
            final int aSize,
            final int nSize,
            final int rSize,
            final int bSize,
            final int max,
            final int[] longSetMasks
    ) {
        if (request.getSetFormat() == 0) {
            return new SetFormat000OptimizerKernel(
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
                    max,
                    longSetMasks
            );
        }
        return new GpuOptimizerKernel(
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
                max,
                longSetMasks
        );
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
