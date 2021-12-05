package com.fribbels;

import com.aparapi.Kernel;
import com.aparapi.ProfileInfo;
import com.aparapi.ProfileReport;
import com.aparapi.Range;
import com.aparapi.device.Device;
import com.aparapi.exception.QueryFailedException;
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
            System.out.println("Error setting number of threads, defaulting to 10" + e);
        }

        executorService = Executors.newFixedThreadPool(THREADS);
        start();
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
