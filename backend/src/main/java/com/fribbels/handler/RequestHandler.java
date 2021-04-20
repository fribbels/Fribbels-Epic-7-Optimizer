package com.fribbels.handler;

import com.fribbels.model.Request;
import com.fribbels.response.Response;
import com.google.common.base.Charsets;
import com.google.common.collect.ImmutableList;
import com.google.common.io.Files;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import org.apache.commons.io.IOUtils;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class RequestHandler {

    private static final Gson GSON = new Gson();

    public void handleRequest(final String filename) throws IOException {
        try {
            System.out.println("handleRequest");
            final String data = readFile(filename);
            final Request request = GSON.fromJson(data, Request.class);

            final String response = handleSpecificRequest(request, data);
//            writeFile(response);
        } catch (final IOException e) {
            writeFile(e.toString());
        }

        System.out.println("DONE");
    }

    private String handleSpecificRequest(final Request request, final String data) {
        System.out.println("handleSpecificRequest");
        final String requestType = request.getRequestType();

        throw new UnsupportedOperationException(requestType);
    }

    private String readFile(final String filename) throws IOException {
        final File requestFile = new File(filename);
        final String requestString = Files.toString(requestFile, Charsets.UTF_8);

        return requestString;
    }

    private void writeFile(final String data) throws IOException {
        final File responseFile = new File("response.txt");
        Files.write(data, responseFile, Charsets.UTF_8);
    }

    protected void sendResponse(final HttpExchange exchange, final String response) throws IOException {
        final OutputStream outputStream = exchange.getResponseBody();
        exchange.sendResponseHeaders(200, response.getBytes().length);
        exchange.getResponseHeaders().put("Content-Type", ImmutableList.of("application/json"));
        outputStream.write(response.getBytes());
        outputStream.flush();
        outputStream.close();

        System.out.println("Finished " + exchange.getRequestURI().getPath());
    }

    protected <T extends Request> T parseRequest(final HttpExchange exchange, final Class<T> type) throws IOException {
        final String body = IOUtils.toString(exchange.getRequestBody(), StandardCharsets.UTF_8);
        System.out.println(body);
        final T request = GSON.fromJson(body, type);

        return request;
    }

    protected String toJson(final Response response) {
        return GSON.toJson(response);
    }
}
