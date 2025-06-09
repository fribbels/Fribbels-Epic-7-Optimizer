package com.fribbels.handler;

import com.fribbels.model.Request;
import com.fribbels.response.Response;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class RequestHandler {

    private static final Gson GSON = new Gson();

    protected void sendResponse(final HttpExchange exchange, final String response) throws IOException {
        final OutputStream outputStream = exchange.getResponseBody();
        exchange.sendResponseHeaders(200, response.getBytes().length);
        exchange.getResponseHeaders().put("Content-Type", List.of("application/json"));
        outputStream.write(response.getBytes());
        outputStream.flush();
        outputStream.close();

        System.out.println("Finished " + exchange.getRequestURI().getPath());
    }

    protected <T extends Request> T parseRequest(final HttpExchange exchange, final Class<T> type) throws IOException {
        final String body = IOUtils.toString(exchange.getRequestBody(), StandardCharsets.UTF_8);
        System.out.println(body);
        return GSON.fromJson(body, type);
    }

    protected String toJson(final Response response) {
        return GSON.toJson(response);
    }
}
