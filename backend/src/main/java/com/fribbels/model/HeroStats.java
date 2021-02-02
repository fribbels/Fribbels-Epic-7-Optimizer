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

    private int atk;
    private int hp;
    private int def;
    private int cr;
    private int cd;
    private int eff;
    private int res;
    private int dac;
    private int spd;
    private int cp;

    private int ehp;
    private int hpps;
    private int ehpps;
    private int dmg;
    private int dmgps;
    private int mcdmg;
    private int mcdmgps;

    private int score;

    private int bonusMaxAtkPercent;
    private int bonusMaxDefPercent;
    private int bonusMaxHpPercent;

    private int[] sets;

    private String id;
    private String name;
    private String property;
    private List<String> items;

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
