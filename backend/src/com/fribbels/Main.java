package com.fribbels;

import com.fribbels.db.BaseStatsDb;
import com.fribbels.handler.OcrRequestHandler;
import com.fribbels.handler.OptimizationRequestHandler;
import com.fribbels.db.HeroDb;
import com.fribbels.db.ItemDb;
import com.fribbels.db.OptimizationDb;
import com.fribbels.handler.SystemRequestHandler;
import com.fribbels.handler.HeroesRequestHandler;
import com.fribbels.handler.ItemsRequestHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
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

    public static void main(String[] args) throws IOException {
        executorService = Executors.newFixedThreadPool(10);
        start();
    }

    public static void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress("localhost", 8212), 0);

        server.createContext("/system", new SystemRequestHandler());
        server.createContext("/items", new ItemsRequestHandler(itemDb));
        server.createContext("/optimization", new OptimizationRequestHandler(optimizationDb));
        server.createContext("/heroes", new HeroesRequestHandler(heroDb, baseStatsDb, itemDb));
        server.createContext("/ocr", new OcrRequestHandler());

        System.out.println("START");
        server.setExecutor(executorService);
        server.start();
    }
}
