package com.fribbels.handler;

import com.fribbels.Main;
import com.fribbels.core.StatCalculator;
import com.fribbels.request.SetSettingsRequest;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

public class SystemRequestHandler extends RequestHandler implements HttpHandler {

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        System.out.println("===================== HeroesRequestHandler =====================");
        final String path = exchange.getRequestURI().getPath();

        System.out.println("Path: " + path);
        try {
            switch (path) {
                case "/system/interrupt":
                    sendResponse(exchange, interrupt());
                    return;
                case "/system/setSettings":
                    final SetSettingsRequest setSettingsRequest = parseRequest(exchange, SetSettingsRequest.class);
                    sendResponse(exchange, setSettings(setSettingsRequest));
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

    private String interrupt() {
        Main.setInterrupt(true);
        OptimizationRequestHandler.inProgress = false;
        System.out.println("INTERRUPT MAIN");
        return "";
    }

    private String setSettings(final SetSettingsRequest request) {
        System.out.println(request);
        HeroesRequestHandler.setSettingUnlockOnUnequip(request.isSettingUnlockOnUnequip());
        StatCalculator.setSettingRageSet(request.isSettingRageSet());
        StatCalculator.setSettingPenSet(request.isSettingPenSet());
        OptimizationRequestHandler.instance.configureGpu(request.isSettingGpu());

        if (request.getSettingMaxResults() != null) {
            final int max = Math.clamp(request.getSettingMaxResults(), 10_000, 100_000_000);
            OptimizationRequestHandler.setSettingMaximumResults(max);
        }

        if (request.getSettingPenDefense() != null) {
            final int max = Math.clamp(request.getSettingPenDefense(), 0, 10_000);
            StatCalculator.setSettingPenDefense(max);
        }

        return "";
    }
}
