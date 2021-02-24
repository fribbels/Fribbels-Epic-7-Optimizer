package com.fribbels.db;

import com.fribbels.handler.HeroesRequestHandler;
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

    public void replaceItems(final Item newItem) {
        final List<Item> replacing = items.stream()
                .filter(item -> !StringUtils.equals(item.getId(), newItem.getId()))
                .collect(Collectors.toList());
        replacing.add(newItem);

        replacing.stream()
                 .filter(this::isValid)
                 .map(this::calculateWss);

        items = replacing;
    }

    public List<Item> getAllItems() {
        return items;
    }

    private boolean isValid(final Item item) {
        return item.getSet() != null;
    }

    public Item calculateWss(final Item item) {
        final AugmentedStats stats = item.getAugmentedStats();
        final AugmentedStats reforgedStats = item.getReforgedStats() == null ? stats : item.getReforgedStats();

        final double atkValue = 3.46 / 39;
        final double defValue = 4.99 / 31;
        final double hpValue = 3.09 / 174;

        double wssValue =
                stats.getAttackPercent() +
                        stats.getDefensePercent() +
                        stats.getHealthPercent() +
                        stats.getEffectResistance() +
                        stats.getEffectiveness() +
                        stats.getSpeed() * (8.0/4.0) +
                        stats.getCritDamage() * (8.0/7.0) +
                        stats.getCritRate() * (8.0/5.0) +
                        stats.getAttack() * atkValue +
                        stats.getDefense() * defValue +
                        stats.getHealth() * hpValue;

        double reforgedWssValue =
                reforgedStats.getAttackPercent() +
                        reforgedStats.getDefensePercent() +
                        reforgedStats.getHealthPercent() +
                        reforgedStats.getEffectResistance() +
                        reforgedStats.getEffectiveness() +
                        reforgedStats.getSpeed() * (8.0/4.0) +
                        reforgedStats.getCritDamage() * (8.0/7.0) +
                        reforgedStats.getCritRate() * (8.0/5.0) +
                        reforgedStats.getAttack() * atkValue +
                        reforgedStats.getDefense() * defValue +
                        reforgedStats.getHealth() * hpValue;

        double dpsWssValue =
                stats.getAttackPercent() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getCritDamage() * (8.0/7.0) +
                stats.getCritRate() * (8.0/5.0) +
                stats.getAttack() * atkValue;

        double supportWssValue =
                stats.getDefensePercent() +
                stats.getHealthPercent() +
                stats.getEffectResistance() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getDefense() * defValue +
                stats.getHealth() * hpValue;

        double combatWssValue =
                stats.getAttackPercent() +
                stats.getDefensePercent() +
                stats.getHealthPercent() +
                stats.getSpeed() * (8.0/4.0) +
                stats.getCritDamage() * (8.0/7.0) +
                stats.getCritRate() * (8.0/5.0) +
                stats.getAttack() * atkValue +
                stats.getDefense() * defValue +
                stats.getHealth() * hpValue;

        item.setWss((int) Math.round(wssValue));
        item.setReforgedWss((int) Math.round(reforgedWssValue));
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

        if (HeroesRequestHandler.SETTING_UNLOCK_ON_UNEQUIP) {
            existingItem.setLocked(false);
        }
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
