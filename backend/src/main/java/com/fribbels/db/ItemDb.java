package com.fribbels.db;

import com.fribbels.enums.Gear;
import com.fribbels.model.AugmentedStats;
import com.fribbels.model.Hero;
import com.fribbels.model.Item;
import com.fribbels.request.ItemsRequest;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ItemDb {

    private List<Item> items;
    private HeroDb heroDb;

    public ItemDb(final HeroDb heroDb) {
        items = new ArrayList<>();
        this.heroDb = heroDb;
    }

    public void addItems(final List<Item> newItems) {
        newItems.forEach(this::calculateWss);
        items.addAll(newItems);
    }

    public void setItems(final List<Item> newItems) {
        newItems.forEach(this::calculateWss);
        items = newItems;
    }

    public List<Item> getAllItems() {
        return items;
    }

    private void calculateWss(final Item item) {
        final AugmentedStats stats = item.getAugmentedStats();
        double value =
                stats.getAttackPercent() +
                stats.getDefensePercent() +
                stats.getHealthPercent() +
                stats.getEffectResistance() +
                stats.getEffectiveness() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getCritDamage() * (8.0/7.0) +
                stats.getCritRate() * (8.0/5.0) +
                stats.getAttack() / 39.0 * (1.0/2.0) +
                stats.getDefense() / 31.0 * (1.0/2.0) +
                stats.getHealth() / 174.0 * (1.0/2.0);

        DecimalFormat df = new DecimalFormat("#.#");
        df.setRoundingMode(RoundingMode.CEILING);

        System.out.println("VALUE" + value);

        item.setWss((int) Math.round(value));
    }

    public Item getItemById(final String id) {
        return items.stream()
                .filter(x -> StringUtils.equals(x.getId(), id))
                .findFirst()
                .orElse(null);
    }

    public List<Item> getItemsById(final List<String> ids) {
        return ids.stream()
                .map(this::getItemById)
                .collect(Collectors.toList());
    }

    public void editItem(final Item item) {

    }

    public void lockItem(final Item item) {

    }

    public void unequipItem(final String id) {
        final Item existingItem = getItemById(id);

        if (existingItem == null) {
            return;
        }

        existingItem.setEquippedById(null);
        existingItem.setEquippedByName(null);
    }

    public void deleteItem(final String id) {
        final Item existingItem = getItemById(id);

        if (existingItem == null) return;

        final String heroId = existingItem.getEquippedById();
        final Hero hero = heroDb.getHeroById(heroId);

        if (hero != null) {
            hero.getEquipment().remove(existingItem.getGear());
        }

        items.removeIf(item -> StringUtils.equals(item.getId(), id));
    }

    public void equipItemOnHero(final String itemId, final String heroId) {
        final Item item = getItemById(itemId);
        final Hero hero = heroDb.getHeroById(heroId);

        if (item == null || hero == null) {
            return;
        }

        final String previousOwner = item.getEquippedById();
        if (previousOwner != null && !StringUtils.equals(previousOwner, heroId)) {
            System.out.println("PREV OWNER" + previousOwner);
            heroDb.getHeroById(previousOwner).getEquipment().remove(item.getGear());
        }

        final Item previousItem = hero.switchItem(item);
        if (previousItem != null && !StringUtils.equals(previousItem.getId(), item.getId())) {
            System.out.println("PREV ITEM" + previousItem);
            unequipItem(previousItem.getId());
        }

        item.setEquippedById(heroId);
        item.setEquippedByName(hero.getName());
    }
}
