package com.fribbels.db;

import com.fribbels.model.AugmentedStats;
import com.fribbels.model.Hero;
import com.fribbels.model.Item;
import org.apache.commons.lang3.StringUtils;

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
        final List<Item> validItems = newItems.stream()
                .filter(this::isValid)
                .map(this::calculateWss)
                .collect(Collectors.toList());

        items.addAll(validItems);
    }

    public void setItems(final List<Item> newItems) {
        final List<Item> validItems = newItems.stream()
                .filter(this::isValid)
                .map(this::calculateWss)
                .collect(Collectors.toList());

        items = validItems;
    }

    public List<Item> getAllItems() {
        return items;
    }

    private boolean isValid(final Item item) {
        return item.getSet() != null;
    }

    public Item calculateWss(final Item item) {
        final AugmentedStats stats = item.getAugmentedStats();
        double wssValue =
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

        double dpsWssValue =
                stats.getAttackPercent() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getCritDamage() * (8.0/7.0) +
                stats.getCritRate() * (8.0/5.0) +
                stats.getAttack() / 39.0 * (1.0/2.0);

        double supportWssValue =
                stats.getDefensePercent() +
                stats.getHealthPercent() +
                stats.getEffectResistance() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getDefense() / 31.0 * (1.0/2.0) +
                stats.getHealth() / 174.0 * (1.0/2.0);

        double combatWssValue =
                stats.getAttackPercent() +
                stats.getDefensePercent() +
                stats.getHealthPercent() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getCritDamage() * (8.0/7.0) +
                stats.getCritRate() * (8.0/5.0) +
                stats.getAttack() / 39.0 * (1.0/2.0) +
                stats.getDefense() / 31.0 * (1.0/2.0) +
                stats.getHealth() / 174.0 * (1.0/2.0);

        item.setWss((int) Math.round(wssValue));
        item.setDpsWss((int) Math.round(dpsWssValue));
        item.setSupportWss((int) Math.round(supportWssValue));
        item.setCombatWss((int) Math.round(combatWssValue));
        return item;
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

        final String previousOwnerId = existingItem.getEquippedById();
        final Hero hero = heroDb.getHeroById(previousOwnerId);

        if (hero != null) {
            hero.getEquipment().remove(existingItem.getGear());
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


        hero.getEquipment().put(item.getGear(), item);
        item.setEquippedById(heroId);
        item.setEquippedByName(hero.getName());
    }
}
