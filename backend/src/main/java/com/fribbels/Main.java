package com.fribbels;

import com.aparapi.Kernel;
import com.aparapi.internal.kernel.KernelManager;
import com.fribbels.core.StatCalculator;
import com.fribbels.db.*;
import com.fribbels.handler.HeroesRequestHandler;
import com.fribbels.handler.ItemsRequestHandler;
import com.fribbels.handler.OptimizationRequestHandler;
import com.fribbels.handler.SystemRequestHandler;
import com.sun.net.httpserver.HttpServer;

import java.net.BindException;
import java.net.InetSocketAddress;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;



public class Main {

  public static final ArtifactStatsDb artifactStatsDb = new ArtifactStatsDb();
  private static final BaseStatsDb baseStatsDb = new BaseStatsDb();
  private static final HeroDb heroDb = new HeroDb(baseStatsDb);
  private static final ItemDb itemDb = new ItemDb(heroDb);
  private static final OptimizationDb optimizationDb = new OptimizationDb();
  public static boolean interrupt = false;
  public static int THREADS = 10;
  public static long BEST_DEVICE_ID = 0;
  private static HttpServer server;
  private static ExecutorService executorService;

  public static void main(String[] args) throws Exception {
    try {
      final int threadsToUse = Runtime.getRuntime().availableProcessors() * 2;
      if (threadsToUse > THREADS) {
        THREADS = threadsToUse;
      }
    } catch (final RuntimeException e) {
      System.err.println("Error setting number of threads, defaulting to 10" + e);
    }

    System.out.println("START");

    Logger.getLogger("com.aparapi").setLevel(Level.SEVERE);

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


    final HeroesRequestHandler heroesRequestHandler = new HeroesRequestHandler(heroDb, baseStatsDb, artifactStatsDb, itemDb, new StatCalculator());

    server.createContext("/system", new SystemRequestHandler());
    server.createContext("/items", new ItemsRequestHandler(itemDb, heroDb, baseStatsDb, heroesRequestHandler));
    server.createContext("/optimization", new OptimizationRequestHandler(baseStatsDb, heroDb, itemDb));
    server.createContext("/heroes", heroesRequestHandler);

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
