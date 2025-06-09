package com.fribbels;

import java.net.BindException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.fribbels.core.StatCalculator;
import com.fribbels.db.ArtifactStatsDb;
import com.fribbels.db.BaseStatsDb;
import com.fribbels.db.HeroDb;
import com.fribbels.db.ItemDb;
import com.fribbels.handler.HeroesRequestHandler;
import com.fribbels.handler.ItemsRequestHandler;
import com.fribbels.handler.OcrRequestHandler;
import com.fribbels.handler.OptimizationRequestHandler;
import com.fribbels.handler.SystemRequestHandler;
import com.sun.net.httpserver.HttpServer;

public class Main {

    private static final ExecutorService EXECUTOR_SERVICE = Executors.newVirtualThreadPerTaskExecutor();

    public static final ArtifactStatsDb artifactStatsDb = new ArtifactStatsDb();
    private static final BaseStatsDb baseStatsDb = new BaseStatsDb();
    private static final HeroDb heroDb = new HeroDb(baseStatsDb);
    private static final ItemDb itemDb = new ItemDb(heroDb);

    private static volatile boolean interrupt = false;
    private static final String HOST = "localhost";
    private static final int PORT = 8130;

    public static void main(final String[] args) throws Exception {
        System.out.println("START");

        // EXECUTOR_SERVICE = Executors.newCachedThreadPool(); Trying over Executors.newVirtualThreadPerTaskExecutor to allow for more efficient handling of requests

        start();
    }

    public static boolean isInterrupt() {
        return interrupt;
    }

    public static void setInterrupt(final boolean interrupt) {
        Main.interrupt = interrupt;
    }

    private static void start() throws Exception {
        HttpServer server;
        try {
            server = HttpServer.create(new InetSocketAddress(HOST, PORT), 0);
        } catch (final BindException e) {
            // Likely because the service already exists on that port
            System.out.println(e);
            System.exit(0);
            return;
        }

        final HeroesRequestHandler heroesRequestHandler = new HeroesRequestHandler(heroDb, baseStatsDb, artifactStatsDb, itemDb, new StatCalculator());

        server.createContext("/system", new SystemRequestHandler());
        server.createContext("/items", new ItemsRequestHandler(itemDb, heroDb, heroesRequestHandler));
        server.createContext("/optimization", new OptimizationRequestHandler(baseStatsDb, heroDb, itemDb));
        server.createContext("/heroes", heroesRequestHandler);
        server.createContext("/ocr", new OcrRequestHandler());

        server.setExecutor(EXECUTOR_SERVICE);
        server.start();

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            if (EXECUTOR_SERVICE != null && !EXECUTOR_SERVICE.isShutdown()) {
                EXECUTOR_SERVICE.shutdown();
            }
        }));
    }
}