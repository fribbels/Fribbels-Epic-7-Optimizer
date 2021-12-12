package com.fribbels.handler;

import com.fribbels.Main;
import com.fribbels.core.StatCalculator;
import com.fribbels.request.BuildsRequest;
import com.fribbels.request.HeroesRequest;
import com.fribbels.request.SetSettingsRequest;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.OutputStream;

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
        Main.interrupt = true;
        OptimizationRequestHandler.inProgress = false;
        System.out.println("INTERRUPT MAIN");
        return "";
    }

    private String setSettings(final SetSettingsRequest request) {
        System.out.println(request);
        HeroesRequestHandler.SETTING_UNLOCK_ON_UNEQUIP = request.isSettingUnlockOnUnequip();
        StatCalculator.SETTING_RAGE_SET = request.isSettingRageSet();
        StatCalculator.SETTING_PEN_SET = request.isSettingPenSet();
        OptimizationRequestHandler.SETTING_GPU = request.isSettingGpu();

        if (request.getSettingMaxResults() != null) {
            final int max = Math.max(Math.min(request.getSettingMaxResults(), 100_000_000), 10_000);
            OptimizationRequestHandler.SETTING_MAXIMUM_RESULTS = max;
        }

        if (request.getSettingPenDefense() != null) {
            final int max = Math.max(Math.min(request.getSettingPenDefense(), 10_000), 0);
            StatCalculator.SETTING_PEN_DEFENSE = max;
        }

        return "";
    }
}
