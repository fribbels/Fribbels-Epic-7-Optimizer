package com.fribbels.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.security.MessageDigest;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HeroStats {

    public int atk;
    public int hp;
    public int def;
    public int cr;
    public int cd;
    public int eff;
    public int res;
    public int dac;
    public int spd;
    public int cp;

    public int ehp;
    public int hpps;
    public int ehpps;
    public int dmg;
    public int dmgps;
    public int mcdmg;
    public int mcdmgps;
    public int dmgh;

    public int upgrades;
    public int conversions;
    public int score;
    public int priority;

    public int bonusMaxAtkPercent;
    public int bonusMaxDefPercent;
    public int bonusMaxHpPercent;

    public int[] sets;

    public String id;
    public String name;
    public String property;
    public List<String> items;
    public List<String> modIds;
    public List<Mod> mods;

    public String getBuildHash() {
        if (items == null || items.size() != 6) {
            return null;
        }

        try {
            final MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            final String combinedItems = String.join("", items) + (mods == null ? "" : mods.stream()
                                                                      .filter(Objects::nonNull)
                                                                      .map(Mod::toString)
                                                                      .collect(Collectors.joining("")));
            messageDigest.update(combinedItems.getBytes());
            final String stringHash = new String(messageDigest.digest());

            return stringHash;
        } catch (final Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
