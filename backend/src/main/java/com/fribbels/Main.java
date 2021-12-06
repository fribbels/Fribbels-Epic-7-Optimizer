package com.fribbels;

import com.aparapi.Kernel;
import com.aparapi.ProfileInfo;
import com.aparapi.ProfileReport;
import com.aparapi.Range;
import com.aparapi.device.Device;
import com.aparapi.exception.QueryFailedException;
import com.aparapi.internal.kernel.KernelManager;
import com.fribbels.core.StatCalculator;
import com.fribbels.db.BaseStatsDb;
import com.fribbels.db.HeroDb;
import com.fribbels.db.ItemDb;
import com.fribbels.db.OptimizationDb;
import com.fribbels.handler.HeroesRequestHandler;
import com.fribbels.handler.ItemsRequestHandler;
import com.fribbels.handler.OcrRequestHandler;
import com.fribbels.handler.OptimizationRequestHandler;
import com.fribbels.handler.SystemRequestHandler;
import com.sun.net.httpserver.HttpServer;

import java.net.BindException;
import java.net.InetSocketAddress;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {

    private static HttpServer server;
    private static ExecutorService executorService;
    private static final HeroDb heroDb = new HeroDb();
    private static final ItemDb itemDb = new ItemDb(heroDb);
    private static final BaseStatsDb baseStatsDb = new BaseStatsDb();
    private static final OptimizationDb optimizationDb = new OptimizationDb();

    public static boolean interrupt = false;
    public static int THREADS = 10;


    public static int signum(int i) {
        // HD, Section 2-7
        return (i >> 31) | (-i >>> 31);
    }
    public static void main1(String[] args) throws QueryFailedException {
        int size = 1;
        final int result[] = new int[size];
        final int inA[] = new int[size];
        inA[0] = 234;


        Kernel kernel = new Kernel() {
            @Override
            public void run() {
                result[0] = ((inA[0] ^ 1) >> 31) * -1;
            }
        };

        kernel.execute(1);


        System.out.println(result[0]);
    }

    public static void main2(String[] args) throws QueryFailedException {
        int size = 20_000_000;
        final float inA[] = new float[size];
        final float inB[] = new float[size];

        for (int i = 0; i < size; i++) {
            inA[i] = i;
            inB[i] = size - i;
        }

        assert (inA.length == inB.length);
        final float result[] = new float[size];


        Kernel kernel = new Kernel() {
            @Override
            public void run() {
//                int i = getGlobalId();
//                result[i] += inA[i] / inB[i] / 1235f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1238f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1239f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1230f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1231f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1233f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1234f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1236f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1237f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1238f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 1239f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 12323f * (inB[i] / inA[i]);
//                result[i] += inA[i] / inB[i] / 12354f * (inB[i] / inA[i]);
            }
        };

        kernel.setExplicit(true);


//        for (int i = 0; i < 20; i++) {
//            long startTime = System.currentTimeMillis();
//            Range range = Range.create(512);
//
//            int maxLocalSize = kernel.getKernelMaxWorkGroupSize(kernel.getTargetDevice());
//            final Range r = kernel.getTargetDevice().createRange(512, 256);
//
//            kernel.execute(r);
//            System.out.printf("time taken: %s ms%n", System.currentTimeMillis() - startTime);
//
//            List<ProfileInfo> profileInfo = kernel.getProfileInfo();
//            //
//            for (final ProfileInfo p : profileInfo) {
//                System.out.print(" " + p.getType() + " " + p.getLabel() + " " + (p.getStart() / 1000) + " .. "
//                        + (p.getEnd() / 1000) + " " + ((p.getEnd() - p.getStart()) / 1000) + "us");
//                System.out.println("-----");
//            }
//        }





        System.out.printf("===============");


        long startTime2 = System.currentTimeMillis();
        for (int i = 0; i < size; i++) {
            result[i] += inA[i] / inB[i] / 1235f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1238f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1239f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1230f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1231f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1233f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1234f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1236f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1237f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1238f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 1239f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 12323f * (inB[i] / inA[i]);
            result[i] += inA[i] / inB[i] / 12354f * (inB[i] / inA[i]);
        }
        System.out.printf("time taken: %s ms%n", System.currentTimeMillis() - startTime2);
        System.out.println(result[10]);

    }

//    public static void main(String[] args) {
//
//        System.out.println(Device.bestGPU().getMaxWorkGroupSize());
//    }

    public static void main(String[] args) throws Exception {
        try {
            int threadsToUse = Runtime.getRuntime().availableProcessors() * 2;
            if (threadsToUse > THREADS) {
                THREADS = threadsToUse;
            }
        } catch (final RuntimeException e) {
            System.err.println("Error setting number of threads, defaulting to 10" + e);
        }

        try {
            Kernel kernel = new Kernel() {
                @Override
                public void run() {

                }
            };

            System.err.println("Not an error - just debugging:\nBest device: " + KernelManager.instance().bestDevice());
            System.err.println("Not an error - just debugging:\nWork group size: " + kernel.getKernelMaxWorkGroupSize(KernelManager.instance().bestDevice()));
        } catch (final RuntimeException e) {
            System.err.println("Error setting up GPU");
        }

        System.out.println("START");
        System.out.println("===============");
        long startTime2 = System.currentTimeMillis();




        /*

    @SerializedName("HealthSet")      HEALTH      (0, 2, new int[]{2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{0, 0}, "HealthSet"),
    @SerializedName("DefenseSet")     DEFENSE     (1, 2, new int[]{0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{1, 1}, "DefenseSet"),
    @SerializedName("AttackSet")      ATTACK      (2, 4, new int[]{0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{2, 2, 2, 2}, "AttackSet"),
    @SerializedName("SpeedSet")       SPEED       (3, 4, new int[]{0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{3, 3, 3, 3}, "SpeedSet"),
    @SerializedName("CriticalSet")    CRIT        (4, 2, new int[]{0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{4, 4}, "CriticalSet"),
    @SerializedName("HitSet")         HIT         (5, 2, new int[]{0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{5, 5}, "HitSet"),
    @SerializedName("DestructionSet") DESTRUCTION (6, 4, new int[]{0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{6, 6, 6, 6}, "DestructionSet"),
    @SerializedName("LifestealSet")   LIFESTEAL   (7, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{7, 7, 7, 7}, "LifestealSet"),
    @SerializedName("CounterSet")     COUNTER     (8, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0}, new int[]{8, 8, 8, 8}, "CounterSet"),
    @SerializedName("ResistSet")      RESIST      (9, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0}, new int[]{9, 9}, "ResistSet"),
    @SerializedName("UnitySet")       UNITY       (10, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0}, new int[]{10, 10}, "UnitySet"),
    @SerializedName("RageSet")        RAGE        (11, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0}, new int[]{11, 11, 11, 11}, "RageSet"),
    @SerializedName("ImmunitySet")    IMMUNITY    (12, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0}, new int[]{12, 12}, "ImmunitySet"),
    @SerializedName("PenetrationSet") PENETRATION (13, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0}, new int[]{13, 13}, "PenetrationSet"),
    @SerializedName("RevengeSet")     REVENGE     (14, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0}, new int[]{14, 14, 14, 14}, "RevengeSet"),
    @SerializedName("InjurySet")      INJURY      (15, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4}, new int[]{15, 15, 15, 15}, "InjurySet");

         */
//        524416.0
//        524416.0
//        524416.0
//        524416.0
//        524416.0
//        128.0
//        128.0
//        128.0

        // 0 hp3
        // 1 hp2
        // 2 hp1
        // 3 def3
        // 4 def2
        // 5 def1
        // 6 atk
        // 7 speed
        // 8 crit3
        // 9 crit2
        // 10 crit1
        // 11 hit3
        // 12 hit2
        // 13 hit1
        // 14 destr
        // 15 lifesteal
        // 16 counter
        // 17 res3
        // 18 res2
        // 19 res1

        long value = 524416;
        for (int i = 0; i < 30; i++) {
            long mask = 1 << i;

            System.out.println(i + " " + (value & mask));
        }


//        for (int a = 0; a < 16; a++) {
//            for (int b = 0; b < 16; b++) {
//                for (int c = 0; c < 16; c++) {
//                    for (int d = 0; d < 16; d++) {
//                        for (int e = 0; e < 16; e++) {
//                            for (int f = 0; f < 16; f++) {
//                                long l = 0;
//                                l = l << 1;
//                            }
//                        }
//                    }
//
//                }
//            }
//        }
//
//        long[] longSetMasks = new long[16777216];
//
//        int count = 0;
//        for (int a = 0; a < 16; a++) {
//            for (int b = 0; b < 16; b++) {
//                for (int c = 0; c < 16; c++) {
//                    for (int d = 0; d < 16; d++) {
//                        for (int e = 0; e < 16; e++) {
//                            for (int f = 0; f < 16; f++) {
//                                int[] sets = new int[]{a, b, c, d, e, f};
//                                int[] counters = convertSetsArrayIntoIndexArray(sets);
//
//                                long l = 0;
//
//                                l += counters[15]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[14]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[13]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[12]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[11]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[10]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[9]/2 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[9]/2 - 1 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[9]/2 - 2 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[8]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[7]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[6]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[5]/2 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[5]/2 - 1 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[5]/2 - 2 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[4]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[4]/2 - 1 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[4]/2 - 2 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[3]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[2]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[1]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[1]/2 - 1 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[1]/2 - 2 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[0]/4 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[0]/2 - 1 > 0 ? 1 : 0;
//                                l <<= 1;
//                                l += counters[0]/2 - 2 > 0 ? 1 : 0;
//
//                                longSetMasks[count] = l;
//                                count++;
//                            }
//                        }
//                    }
//                }
//            }
//        }


        System.out.printf("time taken: %s ms%n", System.currentTimeMillis() - startTime2);

        executorService = Executors.newFixedThreadPool(THREADS);
        start();
    }

    public static int[] convertSetsArrayIntoIndexArray(final int[] sets) {
        final int[] output = new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

        for (int i = 0; i < sets.length; i++) {
            output[sets[i]]++;
        }

        return output;
    }


    public static void start() throws Exception {
        try {
            server = HttpServer.create(new InetSocketAddress("localhost", 8130), 0);
        } catch (BindException e) {
            // Likely because the service already exists on that port
            System.out.println(e);
            System.exit(0);
            return;
        }

        final HeroesRequestHandler heroesRequestHandler = new HeroesRequestHandler(heroDb, baseStatsDb, itemDb, new StatCalculator());

        server.createContext("/system", new SystemRequestHandler());
        server.createContext("/items", new ItemsRequestHandler(itemDb, heroDb, baseStatsDb, heroesRequestHandler));
        server.createContext("/optimization", new OptimizationRequestHandler(baseStatsDb, heroDb));
        server.createContext("/heroes", heroesRequestHandler);
        server.createContext("/ocr", new OcrRequestHandler());

        System.out.println("START BACKEND WITH " + THREADS + " THREADS");

        server.setExecutor(executorService);
        server.start();
    }
}
