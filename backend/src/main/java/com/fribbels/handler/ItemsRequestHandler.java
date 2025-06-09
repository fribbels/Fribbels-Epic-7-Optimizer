package com.fribbels.handler;

import com.fribbels.db.HeroDb;
import com.fribbels.db.ItemDb;
import com.fribbels.enums.HeroFilter;
import com.fribbels.model.Hero;
import com.fribbels.model.Item;
import com.fribbels.model.MergeHero;
import com.fribbels.request.EquipItemsOnHeroRequest;
import com.fribbels.request.HeroesRequest;
import com.fribbels.request.IdRequest;
import com.fribbels.request.IdsRequest;
import com.fribbels.request.ItemsRequest;
import com.fribbels.request.MergeRequest;
import com.fribbels.response.GetAllItemsResponse;
import com.fribbels.response.GetItemByIdResponse;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import lombok.AllArgsConstructor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@AllArgsConstructor
public class ItemsRequestHandler extends RequestHandler implements HttpHandler {

    private final ItemDb itemDb;
    private final HeroDb heroDb;
    private final HeroesRequestHandler heroesRequestHandler;

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
                    final MergeRequest mergeItemsRequest = parseRequest(exchange, MergeRequest.class);
                    sendResponse(exchange, mergeItems(mergeItemsRequest));
                    return;
                case "/items/mergeHeroes":
                    final MergeRequest mergeHeroesRequest = parseRequest(exchange, MergeRequest.class);
                    sendResponse(exchange, mergeHeroes(mergeHeroesRequest));
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
                case "/items/getItemByIngameId":
                    final IdRequest getItemByIngameIdRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, getItemByIngameId(getItemByIngameIdRequest));
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

    private String addItems(final ItemsRequest request) {
        itemDb.addItems(request.getItems());

        return "";
    }

    private String mergeItems(final MergeRequest request) {
        final List<Item> existingItems = itemDb.getAllItems();

        // Filter new items with enhance >= enhanceLimit
        final List<Item> newItems = request.getItems().stream()
                .filter(x -> x.getEnhance() >= request.getEnhanceLimit())
                .toList();

        final Map<String, Item> itemsByIngameId = new HashMap<>();

        // Populate map with existing items by ingameId
        for (final Item item : existingItems) {
            final String ingameId = item.getIngameId();
            if (ingameId != null) {
                itemsByIngameId.put(ingameId, item);
            }
        }

        // Iterate over new items and either update or insert
        for (final Item newItem : newItems) {
            final String ingameId = newItem.getIngameId();
            if (ingameId != null) {
                final Item existingItem = itemsByIngameId.get(ingameId);
                if (existingItem != null) {
                    // Replace existing item (update logic)
                    itemDb.replaceItems(newItem);
                } else {
                    // Insert new item
                    itemDb.addItems(Collections.singletonList(newItem));
                }
            }
        }

        return "";
    }

    private String mergeHeroes(final MergeRequest request) {
        mergeItems(request);

        final List<Item> existingItems = itemDb.getAllItems();
        final Map<String, List<Item>> itemsByIngameEquippedId = existingItems.stream()
                .collect(Collectors.groupingBy(
                        Item::getIngameEquippedId,
                        Collectors.toList()));

        final List<MergeHero> mergeHeroes = request.getMergeHeroes();
        final Map<String, MergeHero> mergeHeroesByName = mergeHeroes
                .stream()
                .collect(Collectors.toMap(
                        MergeHero::getName,
                        x -> x,
                        (x, y) -> x));

        final List<Hero> existingHeroes = heroDb.getAllHeroes();
        final Map<String, Hero> existingHeroesByName = existingHeroes
                .stream()
                .collect(Collectors.toMap(
                        Hero::getName,
                        x -> x,
                        (x, y) -> x));

        if (request.getHeroFilter() == HeroFilter.OPTIMIZER) {
            existingHeroes
                    .stream()
                    .forEach(hero -> {
                        final String name = hero.getName();

                        final MergeHero mergeHero = mergeHeroesByName.getOrDefault(name, null);
                        if (mergeHero == null)
                            return;

                        final String ingameHeroId = mergeHero.getId();
                        final List<Item> itemsEquippedByIngameHeroId = itemsByIngameEquippedId
                                .getOrDefault(ingameHeroId, List.of());

                        heroesRequestHandler.equipItemsOnHero(EquipItemsOnHeroRequest.builder()
                                .heroId(hero.getId())
                                .itemIds(itemsEquippedByIngameHeroId
                                        .stream()
                                        .map(Item::getId)
                                        .toList())
                                .useReforgeStats(true)
                                .build());
                    });
        }

        if (request.getHeroFilter() == HeroFilter.SIX_STAR) {
            final Set<String> alreadyMergedNames = new HashSet<>();
            mergeHeroes
                    .stream()
                    .filter(x -> x.getStars() == 6)
                    .forEach(mergeHero -> {
                        final String name = mergeHero.getName();
                        if (alreadyMergedNames.contains(name))
                            return;
                        alreadyMergedNames.add(name);

                        final Hero hero;
                        if (existingHeroesByName.containsKey(name)) {
                            hero = existingHeroesByName.get(name);
                            System.out.println("EXISTING HERO");
                        } else {
                            heroesRequestHandler.addHeroes(HeroesRequest
                                    .builder()
                                    .heroes(List.of(mergeHero.getData()))
                                    .build());

                            hero = heroDb.getHeroById(mergeHero.getData().getId());
                            System.out.println("ADDED HERO" + hero);
                        }

                        final String ingameHeroId = mergeHero.getId();
                        final List<Item> itemsEquippedByIngameHeroId = itemsByIngameEquippedId
                                .getOrDefault(ingameHeroId, List.of());

                        heroesRequestHandler.equipItemsOnHero(EquipItemsOnHeroRequest.builder()
                                .heroId(hero.getId())
                                .itemIds(itemsEquippedByIngameHeroId
                                        .stream()
                                        .map(Item::getId)
                                        .toList())
                                .useReforgeStats(true)
                                .build());
                    });
        }

        if (request.getHeroFilter() == HeroFilter.FIVE_STAR) {
            final Set<String> alreadyMergedNames = new HashSet<>();
            mergeHeroes
                    .stream()
                    .filter(x -> x.getStars() == 6 || x.getStars() == 5)
                    .forEach(mergeHero -> {
                        final String name = mergeHero.getName();
                        if (alreadyMergedNames.contains(name))
                            return;
                        alreadyMergedNames.add(name);

                        final Hero hero;
                        if (existingHeroesByName.containsKey(name)) {
                            hero = existingHeroesByName.get(name);
                            System.out.println("EXISTING HERO");
                        } else {
                            heroesRequestHandler.addHeroes(HeroesRequest
                                    .builder()
                                    .heroes(List.of(mergeHero.getData()))
                                    .build());

                            hero = heroDb.getHeroById(mergeHero.getData().getId());
                            System.out.println("ADDED HERO" + hero);
                        }

                        final String ingameHeroId = mergeHero.getId();
                        final List<Item> itemsEquippedByIngameHeroId = itemsByIngameEquippedId
                                .getOrDefault(ingameHeroId, List.of());

                        heroesRequestHandler.equipItemsOnHero(EquipItemsOnHeroRequest.builder()
                                .heroId(hero.getId())
                                .itemIds(itemsEquippedByIngameHeroId
                                        .stream()
                                        .map(Item::getId)
                                        .toList())
                                .useReforgeStats(true)
                                .build());
                    });
        }

        return "";
    }

    private String setItems(final ItemsRequest request) {
        itemDb.setItems(request.getItems());

        return "";
    }

    private String editItems(final ItemsRequest request) {
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
            dbItem.setDisableMods(item.isDisableMods());
            dbItem.setAugmentedStats(item.getAugmentedStats());
            dbItem.setReforgedStats(item.getReforgedStats());
            dbItem.setEnhance(item.getEnhance());
            dbItem.setGear(item.getGear());
            dbItem.setLevel(item.getLevel());
            dbItem.setMain(item.getMain());
            dbItem.setRank(item.getRank());
            dbItem.setSet(item.getSet());
            dbItem.setSubstats(item.getSubstats());
            dbItem.setOp(item.getOp());
            dbItem.setStorage(item.getStorage());
            dbItem.setReforgeable(item.getReforgeable());
            dbItem.setUpgradeable(item.getUpgradeable());
            dbItem.setConvertable(item.getConvertable());
            dbItem.setMaterial(item.getMaterial());
            dbItem.setAllowedMods(item.getAllowedMods());
            itemDb.calculateWss(dbItem);
            System.out.println("EDITED ITEM");
        }

        return "";
    }

    private String lockItems(final IdsRequest request) {
        System.out.println(request);
        final List<Item> items = itemDb.getItemsById(request.getIds());
        for (final Item item : items) {
            item.setLocked(true);
        }

        return "";
    }

    private String unlockItems(final IdsRequest request) {
        System.out.println(request);
        final List<Item> items = itemDb.getItemsById(request.getIds());
        for (final Item item : items) {
            item.setLocked(false);
        }

        return "";
    }

    private String deleteItems(final IdsRequest request) {
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

    private String getAllItems() {
        final List<Item> items = itemDb.getAllItems();
        augmentItemData(items);
        final GetAllItemsResponse response = GetAllItemsResponse.builder()
                .items(items)
                .build();

        return toJson(response);
    }

    private String getItemById(final IdRequest request) {
        final Item item = itemDb.getItemById(request.getId());
        System.out.println(request);
        System.out.println(item);
        final GetItemByIdResponse response = GetItemByIdResponse.builder()
                .item(item)
                .build();

        return toJson(response);
    }

    private String getItemByIngameId(final IdRequest request) {
        final List<Item> items = itemDb.getAllItems();
        final Optional<Item> match = items.stream()
                .filter(x -> x.getIngameId().equals(request.getId()))
                .findFirst();

        System.out.println(request);
        System.out.println(match);

        final GetItemByIdResponse response = GetItemByIdResponse.builder()
                .item(match.orElse(null))
                .build();

        return toJson(response);
    }

    private String getItemsByIds(final IdsRequest request) {
        if (request.getIds() == null) {
            return "";
        }

        final List<Item> items = request.getIds()
                .stream()
                .map(itemDb::getItemById)
                .toList();

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
