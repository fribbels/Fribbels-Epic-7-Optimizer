package com.fribbels.model;

import com.fribbels.enums.Gear;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class HeroStats {

//    private String name;

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

    private int bonusMaxAtkPercent;
    private int bonusMaxDefPercent;
    private int bonusMaxHpPercent;

    private int[] sets;

    private String id;
    private String name;
    private List<String> items;

    private Map<Gear, Item> equipment;
}
