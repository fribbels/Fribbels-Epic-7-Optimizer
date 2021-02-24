package com.fribbels.handler;

import com.fribbels.db.HeroDb;
import com.fribbels.db.ItemDb;
import com.fribbels.enums.Gear;
import com.fribbels.model.Hero;
import com.fribbels.model.HeroStats;
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
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
public class ItemsRequestHandler extends RequestHandler implements HttpHandler {

    private final ItemDb itemDb;
    private final HeroDb heroDb;

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
                case "/items/mergeItems":
                    final ItemsRequest mergeItemsRequest = parseRequest(exchange, ItemsRequest.class);
                    sendResponse(exchange, mergeItems(mergeItemsRequest));
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
                case "/items/getItemsByIds":
                    final IdsRequest getItemsByIdsRequest = parseRequest(exchange, IdsRequest.class);
                    sendResponse(exchange, getItemsByIds(getItemsByIdsRequest));
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

    public String mergeItems(final ItemsRequest request) {
        final List<Item> newItems = request.getItems();
        final List<Item> existingItems = itemDb.getAllItems();

        final Map<Integer, List<Item>> itemsByHash = new HashMap<>();

        // Note down matching items
        for (final Item item : existingItems) {
            final int hash = item.getHash();

            if (itemsByHash.containsKey(hash)) {
                final List<Item> matchingItems = itemsByHash.get(hash);
                matchingItems.add(item);
            } else {
                itemsByHash.put(hash, new ArrayList<>(Collections.singletonList(item)));
            }
        }

        // Replace matching new items with their existing versions
        for (int i = 0; i < newItems.size(); i++) {
            final Item item = newItems.get(i);
            final int hash = item.getHash();

            if (itemsByHash.containsKey(hash)) {
                final List<Item> matchingItems = itemsByHash.get(hash);

                if (!matchingItems.isEmpty()) {
                    final Item removedItem = matchingItems.remove(0);
                    newItems.set(i, removedItem);
                }
            }
        }

        System.out.println(itemsByHash);
        System.out.println(itemsByHash.size());

        // Go through heroes and unequip unmatched items
        final List<Hero> allHeroes = heroDb.getAllHeroes();
        final Set<String> newItemIds = newItems.stream().map(Item::getId).collect(Collectors.toSet());

        for (final Hero hero : allHeroes) {
            final Map<Gear, Item> equipment = hero.getEquipment();
            unequipIfNotExists(equipment, newItemIds, Gear.WEAPON);
            unequipIfNotExists(equipment, newItemIds, Gear.HELMET);
            unequipIfNotExists(equipment, newItemIds, Gear.ARMOR);
            unequipIfNotExists(equipment, newItemIds, Gear.NECKLACE);
            unequipIfNotExists(equipment, newItemIds, Gear.RING);
            unequipIfNotExists(equipment, newItemIds, Gear.BOOTS);

            final List<HeroStats> builds = hero.getBuilds();
            if (builds == null) continue;

            // Clean up builds
            final List<HeroStats> buildsToRemove = new ArrayList<>();
            for (final HeroStats build : hero.getBuilds()) {
                final List<String> buildItems = build.getItems();
                for (final String itemId : buildItems) {
                    if (!newItemIds.contains(itemId)) {
                        buildsToRemove.add(build);
                    }
                }
            }
            builds.removeAll(buildsToRemove);
        }

        for (final Item item : newItems) {
            final String equippedBy = item.getEquippedById();
            final Hero hero = heroDb.getHeroById(equippedBy);

            if (hero == null) {
                item.setEquippedByName(null);
                item.setEquippedById(null);
                continue;
            }

            final Map<Gear, Item> equipment = hero.getEquipment();
            if (!equipment.containsKey(item.getGear())) {
                item.setEquippedByName(null);
                item.setEquippedById(null);
                continue;
            }

            final Item equippedItem = equipment.get(item.getGear());
            if (!StringUtils.equals(equippedItem.getId(), item.getId())) {
                item.setEquippedByName(null);
                item.setEquippedById(null);
                continue;
            }
        }

        itemDb.setItems(newItems);

        return "";
    }

    private void unequipIfNotExists(final Map<Gear, Item> equipment, final Set<String> newItemIds, final Gear gear) {
        if (equipment.containsKey(gear)) {
            final Item item = equipment.get(gear);
            if (!newItemIds.contains(item.getId())) {
                equipment.remove(gear);
            }
        }

    }

    public String setItems(final ItemsRequest request) {
        itemDb.setItems(request.getItems());

        return "";
    }

    public String setItemsWithHeroes(final ItemsRequest request) {
        final List<Hero> allHeroes = heroDb.getAllHeroes();
        final List<Item> newItems = request.getItems();
        final Map<String, Hero> heroesByName = new HashMap<>();

        allHeroes.forEach(x -> heroesByName.putIfAbsent(x.getName(), x));

        for (final Item item : newItems) {
            if (StringUtils.isBlank(item.getHeroName())) {
                continue;
            }

            if (heroesByName.containsKey(item.getHeroName())) {
                final Hero hero = heroesByName.get(item.getHeroName());
                itemDb.equipItemOnHero(item.getId(), hero.getId());
            }
        }

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
            dbItem.setReforgedStats(item.getReforgedStats());
            dbItem.setEnhance(item.getEnhance());
            dbItem.setGear(item.getGear());
            dbItem.setLevel(item.getLevel());
            dbItem.setMain(item.getMain());
            dbItem.setRank(item.getRank());
            dbItem.setSet(item.getSet());
            dbItem.setSubstats(item.getSubstats());
            dbItem.setReforgeable(item.getReforgeable());
            dbItem.setUpgradeable(item.getUpgradeable());
            dbItem.setMaterial(item.getMaterial());
            itemDb.calculateWss(dbItem);
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
        augmentItemData(items);
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

    public String getItemsByIds(final IdsRequest request) {
        if (request.getIds() == null) {
            return "";
        }

        final List<Item> items = request.getIds()
                .stream()
                .map(itemDb::getItemById)
                .collect(Collectors.toList());

        final GetAllItemsResponse response = GetAllItemsResponse.builder()
                .items(items)
                .build();

        return toJson(response);
    }

    private void augmentItemData(final List<Item> items) {
        final Map<Integer, List<Item>> itemsByHash = new HashMap<>();

        // Note down matching items
        for (final Item item : items) {
            item.setDuplicateId("");
            final int hash = item.getHash();

            if (itemsByHash.containsKey(hash)) {
                final List<Item> matchingItems = itemsByHash.get(hash);
                matchingItems.add(item);
            } else {
                itemsByHash.put(hash, new ArrayList<>(Collections.singletonList(item)));
            }
        }

        itemsByHash.entrySet().forEach((x -> {
            if (x.getValue().size() > 1) {
                System.out.println("DUPLICATE");
                x.getValue().forEach(y -> y.setDuplicateId("DUPLICATE" + x.getKey()));
            }
        }));
    }
}
