package com.fribbels.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.security.MessageDigest;
import java.util.List;
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

    public int upgrades;
    public int score;

    public int bonusMaxAtkPercent;
    public int bonusMaxDefPercent;
    public int bonusMaxHpPercent;

    public int[] sets;

    public String id;
    public String name;
    public String property;
    public List<String> items;

    public String getBuildHash() {
        if (items == null || items.size() != 6) {
            return null;
        }

        try {
            final MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            final String combinedItems = String.join("", items);
            messageDigest.update(combinedItems.getBytes());
            final String stringHash = new String(messageDigest.digest());

            return stringHash;
        } catch (final Exception e) {
            return null;
        }
    }
}
