package com.fribbels.handler;

import com.fribbels.db.ItemDb;
import com.fribbels.model.Item;
import com.fribbels.request.IdRequest;
import com.fribbels.request.IdsRequest;
import com.fribbels.request.ItemsRequest;
import com.fribbels.response.GetAllItemsResponse;
import com.fribbels.response.GetItemByIdResponse;
import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import lombok.AllArgsConstructor;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
public class ItemsRequestHandler extends RequestHandler implements HttpHandler {

    private final ItemDb itemDb;

    private static final Gson GSON = new Gson();

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        System.out.println("===================== ItemsRequestHandler =====================");
        final String path = exchange.getRequestURI().getPath();

        System.out.println("Path: " + path);

        try {
            switch (path) {
                case "/items/addItems":
                    final ItemsRequest addItemsRequest = parseRequest(exchange, ItemsRequest.class);
                    sendResponse(exchange, addItems(addItemsRequest));
                    return;
                case "/items/setItems":
                    final ItemsRequest setItemsRequest = parseRequest(exchange, ItemsRequest.class);
                    sendResponse(exchange, setItems(setItemsRequest));
                    return;
                case "/items/getAllItems":
                    sendResponse(exchange, getAllItems());
                    return;
                case "/items/getItemById":
                    final IdRequest getItemByIdRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, getItemById(getItemByIdRequest));
                    return;
                case "/items/lockItems":
                    final IdsRequest lockItemsRequest = parseRequest(exchange, IdsRequest.class);
                    sendResponse(exchange, lockItems(lockItemsRequest));
                    return;
                case "/items/unlockItems":
                    final IdsRequest unlockItemsRequest = parseRequest(exchange, IdsRequest.class);
                    sendResponse(exchange, unlockItems(unlockItemsRequest));
                    return;
                case "/items/deleteItems":
                    final IdsRequest deleteItemsRequest = parseRequest(exchange, IdsRequest.class);
                    sendResponse(exchange, deleteItems(deleteItemsRequest));
                    return;
                case "/items/editItems":
                    final ItemsRequest editItemsRequest = parseRequest(exchange, ItemsRequest.class);
                    sendResponse(exchange, editItems(editItemsRequest));
                    return;
                default:
                    System.out.println("No handler found for " + path);
            }
        } catch (final RuntimeException e) {
            e.printStackTrace();
        }

        sendResponse(exchange, "ERROR");
    }

    public String addItems(final ItemsRequest request) {
        itemDb.addItems(request.getItems());

        return "";
    }

    public String setItems(final ItemsRequest request) {
        itemDb.setItems(request.getItems());

        return "";
    }

    public String editItems(final ItemsRequest request) {
        final List<Item> items = request.getItems();
        for (final Item item : items) {
            final Item dbItem = itemDb.getItemById(item.getId());
            if (dbItem == null) {
                System.out.println("No dbitem matching:" + item.getId());
                continue;
            }

            dbItem.setEquippedByName(item.getEquippedByName());
            dbItem.setEquippedById(item.getEquippedById());
            dbItem.setLocked(item.isLocked());
            dbItem.setAugmentedStats(item.getAugmentedStats());
            dbItem.setEnhance(item.getEnhance());
            dbItem.setGear(item.getGear());
            dbItem.setLevel(item.getLevel());
            dbItem.setMain(item.getMain());
            dbItem.setRank(item.getRank());
            dbItem.setSet(item.getSet());
            dbItem.setSubstats(item.getSubstats());
            System.out.println("EDITED ITEM");
        }

        return "";
    }

    public String lockItems(final IdsRequest request) {
        System.out.println(request);
        final List<Item> items = itemDb.getItemsById(request.getIds());
        for (final Item item : items) {
            item.setLocked(true);
        }

        return "";
    }

    public String unlockItems(final IdsRequest request) {
        System.out.println(request);
        final List<Item> items = itemDb.getItemsById(request.getIds());
        for (final Item item : items) {
            item.setLocked(false);
        }

        return "";
    }

    public String deleteItems(final IdsRequest request) {
        System.out.println(request.getIds());
        final List<Item> items = itemDb.getItemsById(request.getIds());

        for (final Item item : items) {
            if (item == null)
                continue;

            System.out.println("Deleting: " + item);
            itemDb.deleteItem(item.getId());
        }

        return "";
    }

    public String getAllItems() {
        final List<Item> items = itemDb.getAllItems();
        final GetAllItemsResponse response = GetAllItemsResponse.builder()
                .items(items)
                .build();

        return toJson(response);
    }

    public String getItemById(final IdRequest request) {
        final Item item = itemDb.getItemById(request.getId());
        System.out.println(request);
        System.out.println(item);
        final GetItemByIdResponse response = GetItemByIdResponse.builder()
                .item(item)
                .build();

        return toJson(response);
    }
}
