package com.fribbels.model;

import com.fribbels.enums.Gear;
import com.fribbels.request.BonusStatsRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang3.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Builder
@AllArgsConstructor
@ToString
public class Hero {

    private int atk;
    private int hp;
    private int def;
    private int cr;
    private int cd;
    private int eff;
    private int res;
    private int dac;
    private int spd;

    private int ehp;
    private int hpps;
    private int ehpps;
    private int dmg;
    private int dmgps;
    private int mcdmg;
    private int mcdmgps;

    private String id;
    private String name;
    private int rarity;
    private String attribute;
    private String role;

    private int bonusAtk;
    private int bonusDef;
    private int bonusHp;
    private int bonusAtkPercent;
    private int bonusDefPercent;
    private int bonusHpPercent;
    private int bonusSpeed;
    private int bonusCr;
    private int bonusCd;
    private int bonusEff;
    private int bonusRes;

    private int bonusMaxAtkPercent;
    private int bonusMaxDefPercent;
    private int bonusMaxHpPercent;

    private int[] sets;
    private int cp;

    private Map<Gear, Item> equipment;

    public Item switchItem(final Item item) {
        final Gear gear = item.getGear();
        final Item previousItem = addToEquipment(gear, item);

        if (previousItem != null) {
            return previousItem;
        }

        return null;
    }

    private Item addToEquipment(final Gear gear, final Item item) {
        if (equipment == null) {
            equipment = new HashMap<>();
        }

        return equipment.put(gear, item);
    }

    public void setBonusStats(final BonusStatsRequest bonusStats) {
        this.bonusAtk = bonusStats.getAtk();
        this.bonusDef = bonusStats.getDef();
        this.bonusHp = bonusStats.getHp();
        this.bonusAtkPercent = bonusStats.getAtkPercent();
        this.bonusDefPercent = bonusStats.getDefPercent();
        this.bonusHpPercent = bonusStats.getHpPercent();
        this.bonusSpeed = bonusStats.getSpeed();
        this.bonusCr = bonusStats.getCr();
        this.bonusCd = bonusStats.getCd();
        this.bonusEff = bonusStats.getEff();
        this.bonusRes = bonusStats.getRes();
    }

    public Map<Gear, Item> getEquipment() {
        if (equipment == null) {
            equipment = new HashMap<>();
        }

        return equipment;
    }

    public void setStats(final HeroStats heroStats) {
        this.atk = heroStats.getAtk();
        this.hp = heroStats.getHp();
        this.def = heroStats.getDef();
        this.cr = heroStats.getCr();
        this.cd = heroStats.getCd();
        this.eff = heroStats.getEff();
        this.res = heroStats.getRes();
        this.dac = heroStats.getDac();
        this.spd = heroStats.getSpd();

        this.cp = heroStats.getCp();
        this.sets = heroStats.getSets();

        this.ehp = heroStats.getEhp();
        this.ehpps = heroStats.getEhpps();
        this.hpps = heroStats.getHpps();
        this.dmg = heroStats.getDmg();
        this.dmgps = heroStats.getDmgps();
        this.mcdmg = heroStats.getMcdmg();
        this.mcdmgps = heroStats.getMcdmgps();
    }
}
