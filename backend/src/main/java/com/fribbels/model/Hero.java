package com.fribbels.model;

import com.fribbels.enums.Gear;
import com.fribbels.enums.StatType;
import com.fribbels.request.BonusStatsRequest;
import com.fribbels.request.ModStatsRequest;
import com.fribbels.request.OptimizationRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Wither;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Wither
@Builder
@AllArgsConstructor
@ToString
public class Hero {

    public int atk;
    public int hp;
    public int def;
    public int cr;
    public int cd;
    public int eff;
    public int res;
    public int dac;
    public int spd;

    public int ehp;
    public int hpps;
    public int ehpps;
    public int dmg;
    public int dmgps;
    public int mcdmg;
    public int mcdmgps;
    public int dmgh;

    public int upgrades;
    public int score;
    public int priority;
    public int conversions;

    private String id;
    public String name;
    private int index;
    private int rarity;
    private int stars;
    private String attribute;
    private String role;

    public int bonusAtk;
    public int bonusDef;
    public int bonusHp;
    public float bonusAtkPercent;
    public float bonusDefPercent;
    public float bonusHpPercent;
    public int bonusSpeed;
    public float bonusCr;
    public float bonusCd;
    public float bonusEff;
    public float bonusRes;

    public float aeiAtk;
    public float aeiDef;
    public float aeiHp;
    public float aeiAtkPercent;
    public float aeiDefPercent;
    public float aeiHpPercent;
    public int aeiSpeed;
    public float aeiCr;
    public float aeiCd;
    public float aeiEff;
    public float aeiRes;

    public String artifactName;
    public String artifactLevel;
    public String imprintNumber;
    public String eeNumber;

    private int bonusMaxAtkPercent;
    private int bonusMaxDefPercent;
    private int bonusMaxHpPercent;

    private String modGrade;
    private String keepStatOptions;
    private Float rollQuality;
    private Integer limitRolls;
    private List<StatType> keepStats;
    private List<StatType> ignoreStats;
    private List<StatType> discardStats;

    private int[] sets;
    private int cp;

    private Map<Gear, Item> equipment;

    private List<HeroStats> builds;

    private OptimizationRequest optimizationRequest;

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

    public void setModStats(final ModStatsRequest modStatsRequest) {
        this.modGrade = modStatsRequest.getModGrade();
        this.keepStatOptions = modStatsRequest.getKeepStatOptions();
        this.rollQuality = modStatsRequest.getRollQuality();
        this.limitRolls = modStatsRequest.getLimitRolls();
        this.keepStats = modStatsRequest.getKeepStats();
        this.ignoreStats = modStatsRequest.getIgnoreStats();
        this.discardStats = modStatsRequest.getDiscardStats();
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

        this.aeiAtk = bonusStats.getAeiAtk();
        this.aeiDef = bonusStats.getAeiDef();
        this.aeiHp = bonusStats.getAeiHp();
        this.aeiAtkPercent = bonusStats.getAeiAtkPercent();
        this.aeiDefPercent = bonusStats.getAeiDefPercent();
        this.aeiHpPercent = bonusStats.getAeiHpPercent();
        this.aeiSpeed = bonusStats.getAeiSpeed();
        this.aeiCr = bonusStats.getAeiCr();
        this.aeiCd = bonusStats.getAeiCd();
        this.aeiEff = bonusStats.getAeiEff();
        this.aeiRes = bonusStats.getAeiRes();

        this.artifactName = bonusStats.getArtifactName();
        this.artifactLevel = bonusStats.getArtifactLevel();
        this.imprintNumber = bonusStats.getImprintNumber();
        this.eeNumber = bonusStats.getEeNumber();

        this.stars = bonusStats.getStars();
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
        this.dmgh = heroStats.getDmgh();

        this.upgrades = heroStats.getUpgrades();
        this.score = heroStats.getScore();
        this.priority = heroStats.getPriority();
        this.conversions = heroStats.getConversions();
    }
}
