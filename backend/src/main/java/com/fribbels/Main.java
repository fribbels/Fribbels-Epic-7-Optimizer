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

    public static void main(String[] args) throws Exception {
        System.out.println(KernelManager.instance().bestDevice().getType());

        try {
            final int threadsToUse = Runtime.getRuntime().availableProcessors() * 2;
            if (threadsToUse > THREADS) {
                THREADS = threadsToUse;
            }
        } catch (final RuntimeException e) {
            System.err.println("Error setting number of threads, defaulting to 10" + e);
        }

        System.out.println("START");

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
        server.createContext("/optimization", new OptimizationRequestHandler(baseStatsDb, heroDb, itemDb));
        server.createContext("/heroes", heroesRequestHandler);
        server.createContext("/ocr", new OcrRequestHandler());

        System.out.println("START BACKEND WITH " + THREADS + " THREADS");

        server.setExecutor(executorService);
        server.start();
    }

    public static void mainGpuDebugger(String[] args) throws Exception {
        System.out.println("** GPU DEBUGGER **");

        System.out.println("** Best device: **\n" + KernelManager.instance().bestDevice());

        try {
            Kernel kernel = new Kernel() {
                @Override
                public void run() {

                }
            };

            System.out.println("** Target device: **\n" + kernel.getTargetDevice());
            System.out.println("** OpenCl enabled: **" + kernel.isRunningCL());
        } catch (final Exception e) {
            System.out.println("** Error running OpenCl: **\n" + e);
        }

    }
}
