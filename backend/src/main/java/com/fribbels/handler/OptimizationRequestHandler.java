package com.fribbels.handler;

import com.fribbels.Main;
import com.fribbels.core.StatCalculator;
import com.fribbels.db.BaseStatsDb;
import com.fribbels.db.HeroDb;
import com.fribbels.db.OptimizationDb;
import com.fribbels.enums.Gear;
import com.fribbels.enums.Set;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
import com.fribbels.model.Item;
import com.fribbels.request.EditResultRowsRequest;
import com.fribbels.request.GetResultRowsRequest;
import com.fribbels.request.OptimizationRequest;
import com.fribbels.response.GetResultRowsResponse;
import com.fribbels.response.OptimizationResponse;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import lombok.Getter;
import org.apache.commons.lang3.ArrayUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.Function;
import java.util.stream.Collectors;

public class OptimizationRequestHandler extends RequestHandler implements HttpHandler {

    private OptimizationDb optimizationDb;
    private BaseStatsDb baseStatsDb;
    private HeroDb heroDb;

    private static final Gson gson = new Gson();
    private static final int SET_COUNT = 16;
    @Getter
    private AtomicLong searchedCounter = new AtomicLong(0);
    private AtomicLong resultsCounter = new AtomicLong(0);

    public OptimizationRequestHandler(final OptimizationDb optimizationDb,
                                      final BaseStatsDb baseStatsDb,
                                      final HeroDb heroDb) {
        this.optimizationDb = optimizationDb;
        this.baseStatsDb = baseStatsDb;
        this.heroDb = heroDb;
    }

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        System.out.println("===================== OptimizationRequestHandler =====================");
        final String path = exchange.getRequestURI().getPath();

        System.out.println("Path: " + path);

        try {
            switch (path) {
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

    public String handleGetProgressRequest() {
        final OptimizationResponse response = OptimizationResponse.builder()
                .searched(searchedCounter.get())
                .results(resultsCounter.get())
                .build();

        return gson.toJson(response);
    }

    public String handleOptimizationFilterRequest(final OptimizationRequest request) {
        heroDb.saveOptimizationRequest(request);
        final HeroStats[] heroStats = optimizationDb.getAllHeroStats();
        final int[] indices = new int[heroStats.length];
        final java.util.Set<String> ids = new HashSet<>();
        int count = 0;

        for (int i = 0; i < heroStats.length; i++) {
            final HeroStats heroStatsInstance = heroStats[i];
            if (passesUpdatedFilter(request, heroStatsInstance)) {
                indices[count] = i;
                ids.add(heroStatsInstance.getId());
                count++;
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
        ) {
            return false;
        }
        return true;
    }

    public String handleOptimizationRequest(final OptimizationRequest request) {
        optimizationDb = new OptimizationDb();
        heroDb.saveOptimizationRequest(request);
        System.gc();
        return test(request, HeroStats.builder()
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
    }

    private String handleGetResultRowsRequest(final GetResultRowsRequest request) {
        final String heroId = request.getOptimizationRequest().getHeroId();
        final List<HeroStats> builds = heroDb.getBuildsForHero(heroId);
        final java.util.Set<String> buildHashes = builds.stream()
                .map(HeroStats::getBuildHash)
                .collect(Collectors.toSet());

        optimizationDb.sort(request.getSortColumn(), request.getSortOrder());
        final HeroStats[] heroStats = optimizationDb.getRows(request.getStartRow(), request.getEndRow());

        if (heroStats != null) {
            for (final HeroStats build : heroStats) {
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
        final HeroStats[] heroStats = optimizationDb.getRows(request.getIndex(), request.getIndex() + 1);
        if (heroStats.length == 0) {
            return "";
        }

        final HeroStats heroStat = heroStats[0];

        heroStat.setProperty(request.getProperty());
        System.out.println(heroStat);

        return "";
    }

    public String test(final OptimizationRequest request, final HeroStats unused) {
        final HeroStats base = baseStatsDb.getBaseStatsByName(request.getHero().getName());
        System.out.println("REQUEST");
        //        final OptimizationRequest request = gson.fromJson(data, OptimizationRequest.class);
        addCalculatedFields(request);
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

        final int MAXIMUM_RESULTS = 5_000_000;
        final HeroStats[] resultHeroStats = new HeroStats[MAXIMUM_RESULTS];
        final long[] resultInts = new long[MAXIMUM_RESULTS];
        System.out.println("MEMORY");

        // 5/6/5/5/6/5
        final Map<Gear, List<Item>> itemsByGear = buildItemsByGear(items);
        //        Duplicate items
        //        itemsByGear.entrySet().forEach(x -> itemsByGear.get(x.getKey()).addAll(itemsByGear.get(x.getKey())));
        //        itemsByGear.entrySet().forEach(x -> itemsByGear.get(x.getKey()).addAll(itemsByGear.get(x.getKey())));
        //        itemsByGear.entrySet().forEach(x -> itemsByGear.get(x.getKey()).addAll(itemsByGear.get(x.getKey())));

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

        final AtomicInteger maxReached = new AtomicInteger();

        final boolean useReforgeStats = request.getInputPredictReforges();
        final boolean isShortCircuitable4PieceSet = request.getSetFormat() == 1 || request.getSetFormat() == 2;

        System.out.println("OUTPUTSTART");

        for (int w = 0; w < wSize; w++) {
            final Item weapon = itemsByGear.get(Gear.WEAPON).get(w);
            final long finalW = w;

            executorService.submit(() -> {
                boolean exit = false;
                try {

                    final float[] weaponAccumulatorArr = StatCalculator.getStatAccumulatorArr(base, weapon, accumulatorArrsByItemId, useReforgeStats);

                    for (int h = 0; h < hSize; h++) {
                        final Item helmet = itemsByGear.get(Gear.HELMET).get(h);
                        final float[] helmetAccumulatorArr = StatCalculator.getStatAccumulatorArr(base, helmet, accumulatorArrsByItemId, useReforgeStats);

                        for (int a = 0; a < aSize; a++) {
                            final Item armor = itemsByGear.get(Gear.ARMOR).get(a);
                            final float[] armorAccumulatorArr = StatCalculator.getStatAccumulatorArr(base, armor, accumulatorArrsByItemId, useReforgeStats);

                            // For 4 piece sets, we can short circuit if the first 3 pieces don't match possible sets,
                            // but only if the items are sorted & prioritized by set.
//                                System.out.println(weapon.getSet() + " " + helmet.getSet() + " " + armor.getSet());
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
                                final float[] necklaceAccumulatorArr = StatCalculator.getStatAccumulatorArr(base, necklace, accumulatorArrsByItemId, useReforgeStats);

                                for (int r = 0; r < rSize; r++) {
                                    final Item ring = itemsByGear.get(Gear.RING).get(r);
                                    final float[] ringAccumulatorArr = StatCalculator.getStatAccumulatorArr(base, ring, accumulatorArrsByItemId, useReforgeStats);

                                    for (int b = 0; b < bSize; b++) {
                                        if (Main.interrupt) {
                                            executorService.shutdownNow();
                                            return;
                                        }
                                        if (exit) return;

                                        final Item boots = itemsByGear.get(Gear.BOOTS).get(b);
                                        final float[] bootsAccumulatorArr = StatCalculator.getStatAccumulatorArr(base, boots, accumulatorArrsByItemId, useReforgeStats);

                                        final Item[] collectedItems = new Item[]{weapon, helmet, armor, necklace, ring, boots};
                                        final int[] collectedSets = StatCalculator.buildSetsArr(collectedItems);
                                        final HeroStats result = StatCalculator.addAccumulatorArrsToHero(base, new float[][]{weaponAccumulatorArr, helmetAccumulatorArr, armorAccumulatorArr, necklaceAccumulatorArr, ringAccumulatorArr, bootsAccumulatorArr}, collectedSets, request.getHero());
                                        final long index = searchedCounter.getAndIncrement();
                                        //                                        final boolean passesFilter = true;
                                        final boolean canReforge = weapon.getLevel() == 85 || helmet.getLevel() == 85 || armor.getLevel() == 85 || necklace.getLevel() == 85 || ring.getLevel() == 85 || boots.getLevel() == 85;
                                        final boolean passesFilter = passesFilter(result, request, collectedSets, canReforge);
                                        result.setSets(collectedSets);
                                        if (passesFilter) {
                                            final long resultsIndex = resultsCounter.getAndIncrement();
                                            if (resultsIndex < MAXIMUM_RESULTS) {
                                                result.setId("" + resultsIndex);

                                                long index1D = finalW * hSize * aSize * nSize * rSize * bSize + h * aSize * nSize * rSize * bSize + a * nSize * rSize * bSize + n * rSize * bSize + r * bSize + b;
                                                resultHeroStats[(int) resultsIndex] = result;
                                                resultInts[(int) resultsIndex] = index1D;

                                                result.setItems(ImmutableList.of(
                                                        weapon.getId(),
                                                        helmet.getId(),
                                                        armor.getId(),
                                                        necklace.getId(),
                                                        ring.getId(),
                                                        boots.getId()
                                                ));

                                                if (resultsIndex == MAXIMUM_RESULTS-1) {
                                                    maxReached.set(MAXIMUM_RESULTS-1);
                                                }
                                            } else {
                                                System.out.println("EXIT");
                                                exit = true;
                                                break;
                                            }
                                        }

                                        if (index % 1000000 == 1) {
                                            System.out.println("PROGRESS: [" + index + "]");
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        try {
            executorService.shutdown();
            executorService.awaitTermination(500, TimeUnit.SECONDS);

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

                return gson.toJson(response);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

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

    public boolean passesFilter(final HeroStats heroStats, final OptimizationRequest request, final int[] sets, final boolean canReforge) {
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
        ) {
            return false;
        }

        final int[] indexArray = convertSetsArrayIntoIndexArray(sets);
        final int index = calculateSetIndex(indexArray);
//        System.out.println(Arrays.toString(indexArray));

        if (request.getBoolArr()[index] == false) {
            return false;
        }

        if (request.getInputCanReforge() && !canReforge) {
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
                    final int index1D = calculateSetIndex(indices);
                    permutations[index1D] = true;
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
                        final int index1D = calculateSetIndex(indicesInstance);
                        permutations[index1D] = true;
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
                                final int index1D = calculateSetIndex(indicesInstance);
                                permutations[index1D] = true;
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
                            final int index1D = calculateSetIndex(indicesInstance);
                            permutations[index1D] = true;
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
                        final int index1D = calculateSetIndex(indices);
                        permutations[index1D] = true;
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
