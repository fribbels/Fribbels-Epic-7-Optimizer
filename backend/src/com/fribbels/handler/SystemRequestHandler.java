package com.fribbels.handler;

import com.fribbels.Main;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.OutputStream;

public class SystemRequestHandler extends RequestHandler implements HttpHandler {

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        Main.interrupt = true;
        System.out.println("INTERRUPT MAIN");
        sendResponse(exchange, "");
    }
}
