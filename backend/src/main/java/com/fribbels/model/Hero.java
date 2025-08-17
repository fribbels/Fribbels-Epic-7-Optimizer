package com.fribbels.model;

import com.fribbels.enums.Gear;
import com.fribbels.enums.StatType;
import com.fribbels.request.BonusStatsRequest;
import com.fribbels.request.ModStatsRequest;
import com.fribbels.request.OptimizationRequest;
import com.fribbels.request.SkillOptionsRequest;
import lombok.*;
import lombok.experimental.Wither;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
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
    public int dmgd;

    public int s1;
    public int s2;
    public int s3;

    public int upgrades;
    public int score;
    public int bs;
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

    public float finalAtkMultiplier;
    public float finalDefMultiplier;
    public float finalHpMultiplier;

    public float artifactAttack;
    public float artifactHealth;
    public float artifactDefense;

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

    private HeroSkillOptions skillOptions;
    private DamageMultipliers damageMultipliers;
    private HeroSkills skills;

    public DamageMultipliers getDamageMultipliers() {
        if (damageMultipliers != null) {
            return damageMultipliers;
        }
        if (skills == null || skills.S1[0].name == null) {
            skills = HeroSkills.builder()
                    .S1(new SkillData[]{SkillData.builder().build(), SkillData.builder().build(), SkillData.builder().build()})
                    .S2(new SkillData[]{SkillData.builder().build(), SkillData.builder().build(), SkillData.builder().build()})
                    .S3(new SkillData[]{SkillData.builder().build(), SkillData.builder().build(), SkillData.builder().build()})
                    .build();
        }
        if (skillOptions == null) {
            return DamageMultipliers.builder()
                    .rate(new Float[]{skills.S1[0].rate, skills.S2[0].rate, skills.S3[0].rate})
                    .pow(new Float[]{skills.S1[0].pow, skills.S2[0].pow, skills.S3[0].pow})
                    .targets(new Integer[]{skills.S1[0].targets, skills.S2[0].targets, skills.S3[0].targets})
                    .selfHpScaling(new Float[]{skills.S1[0].selfHpScaling, skills.S2[0].selfHpScaling, skills.S3[0].selfHpScaling})
                    .selfAtkScaling(new Float[]{skills.S1[0].selfAtkScaling, skills.S2[0].selfAtkScaling, skills.S3[0].selfAtkScaling})
                    .selfDefScaling(new Float[]{skills.S1[0].selfDefScaling, skills.S2[0].selfDefScaling, skills.S3[0].selfDefScaling})
                    .selfSpdScaling(new Float[]{skills.S1[0].selfSpdScaling, skills.S2[0].selfSpdScaling, skills.S3[0].selfSpdScaling})
                    .increasedValue(new Float[]{skills.S1[0].increasedValue, skills.S2[0].increasedValue, skills.S3[0].increasedValue})
                    .extraSelfHpScaling(new Float[]{skills.S1[0].extraSelfHpScaling, skills.S2[0].extraSelfHpScaling, skills.S3[0].extraSelfHpScaling})
                    .extraSelfDefScaling(new Float[]{skills.S1[0].extraSelfDefScaling, skills.S2[0].extraSelfDefScaling, skills.S3[0].extraSelfDefScaling})
                    .extraSelfAtkScaling(new Float[]{skills.S1[0].extraSelfAtkScaling, skills.S2[0].extraSelfAtkScaling, skills.S3[0].extraSelfAtkScaling})
                    .cdmgIncrease(new Float[]{skills.S1[0].cdmgIncrease, skills.S2[0].cdmgIncrease, skills.S3[0].cdmgIncrease})
                    .penetration(new Float[]{skills.S1[0].penetration, skills.S2[0].penetration, skills.S3[0].penetration})
                    .hitMulti(new Float[]{calculateHitMulti(0, skills.S1[0].name), calculateHitMulti(1, skills.S2[0].name), calculateHitMulti(2, skills.S3[0].name)})
                    .support( new Float[]{calculateSupport(0, skills.S1[0].name), calculateSupport(1, skills.S2[0].name), calculateSupport(2, skills.S3[0].name)})
                    .crit(    new Float[]{calculateCrit(0, skills.S1[0].name), calculateCrit(1, skills.S2[0].name), calculateCrit(2, skills.S3[0].name)})
                    .build();
        } else {
            final SkillData s1 = Arrays.stream(skills.S1).filter(x -> StringUtils.equals(x.name, skillOptions.getS1().skillEffect)).findFirst().orElse(skills.S1[0]);
            final SkillData s2 = Arrays.stream(skills.S2).filter(x -> StringUtils.equals(x.name, skillOptions.getS2().skillEffect)).findFirst().orElse(skills.S2[0]);
            final SkillData s3 = Arrays.stream(skills.S3).filter(x -> StringUtils.equals(x.name, skillOptions.getS3().skillEffect)).findFirst().orElse(skills.S3[0]);
            return DamageMultipliers.builder()
                    .rate(new Float[]{s1.rate, s2.rate, s3.rate})
                    .pow(new Float[]{s1.pow, s2.pow, s3.pow})
                    .targets(new Integer[]{s1.targets, s2.targets, s3.targets})
                    .selfHpScaling(new Float[]{s1.selfHpScaling, s2.selfHpScaling, s3.selfHpScaling})
                    .selfAtkScaling(new Float[]{s1.selfAtkScaling, s2.selfAtkScaling, s3.selfAtkScaling})
                    .selfDefScaling(new Float[]{s1.selfDefScaling, s2.selfDefScaling, s3.selfDefScaling})
                    .selfSpdScaling(new Float[]{s1.selfSpdScaling, s2.selfSpdScaling, s3.selfSpdScaling})
                    .increasedValue(new Float[]{s1.increasedValue, s2.increasedValue, s3.increasedValue})
                    .extraSelfHpScaling(new Float[]{s1.extraSelfHpScaling, s2.extraSelfHpScaling, s3.extraSelfHpScaling})
                    .extraSelfDefScaling(new Float[]{s1.extraSelfDefScaling, s2.extraSelfDefScaling, s3.extraSelfDefScaling})
                    .extraSelfAtkScaling(new Float[]{s1.extraSelfAtkScaling, s2.extraSelfAtkScaling, s3.extraSelfAtkScaling})
                    .cdmgIncrease(new Float[]{s1.cdmgIncrease, s2.cdmgIncrease, s3.cdmgIncrease})
                    .penetration(new Float[]{s1.penetration, s2.penetration, s3.penetration})
                    .hitMulti(new Float[]{calculateHitMulti(0, getSkillOptionsByIndex(0).skillEffect), calculateHitMulti(1, getSkillOptionsByIndex(1).skillEffect), calculateHitMulti(2, getSkillOptionsByIndex(2).skillEffect)})
                    .support(new Float[]{calculateSupport(0, getSkillOptionsByIndex(0).skillEffect), calculateSupport(1, getSkillOptionsByIndex(1).skillEffect), calculateSupport(2, getSkillOptionsByIndex(2).skillEffect)})
                    .crit(new Float[]{calculateCrit(0, getSkillOptionsByIndex(0).skillEffect), calculateCrit(1, getSkillOptionsByIndex(1).skillEffect), calculateCrit(2, getSkillOptionsByIndex(2).skillEffect)})
                    .build();
        }
    }

    private SingleSkillOptions getSkillOptionsByIndex(final int skill) {
        if (skill == 0) return skillOptions.S1;
        if (skill == 1) return skillOptions.S2;
        return skillOptions.S3;
    }

    private float calculateSupport(final int skill, final String name) {
        if (StringUtils.contains(name, "heal") ||
                StringUtils.contains(name, "barrier")) {
            return 1f;
        }
        return 0f;
    }

    private float calculateCrit(final int skill, final String name) {
        if (StringUtils.contains(name, "crit")) {
            return 1f;
        }
        return 0f;
    }

    private Float calculateHitMulti(final int skill, final String name) {
        if (StringUtils.contains(name, "crit")) {
            return 0f;
        }
        if (StringUtils.contains(name, "crushing")) {
            return 1.3f;
        }
        if (StringUtils.contains(name, "normal")) {
            return 1f;
        }
        if (StringUtils.contains(name, "miss")) {
            return 0.75f;
        }
        return 0f;
    }

    public Item switchItem(final Item item) {
        final Gear gear = item.getGear();
        final Item previousItem = addToEquipment(gear, item);

        return previousItem;
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

        this.finalAtkMultiplier = bonusStats.getFinalAtkMultiplier();
        this.finalDefMultiplier = bonusStats.getFinalDefMultiplier();
        this.finalHpMultiplier = bonusStats.getFinalHpMultiplier();

        this.artifactAttack = bonusStats.getArtifactAttack();
        this.artifactHealth = bonusStats.getArtifactHealth();
        this.artifactDefense = bonusStats.getArtifactDefense();

        this.artifactName = bonusStats.getArtifactName();
        this.artifactLevel = bonusStats.getArtifactLevel();
        this.imprintNumber = bonusStats.getImprintNumber();
        this.eeNumber = bonusStats.getEeNumber();

        this.stars = bonusStats.getStars();
    }

    public void setSkillOptions(final SkillOptionsRequest request) {
        this.skillOptions = request.getSkillOptions();
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
        this.dmgd = heroStats.getDmgd();

        this.s1 = heroStats.getS1();
        this.s2 = heroStats.getS2();
        this.s3 = heroStats.getS3();

        this.upgrades = heroStats.getUpgrades();
        this.score = heroStats.getScore();
        this.bs = heroStats.getBs();
        this.priority = heroStats.getPriority();
        this.conversions = heroStats.getConversions();
    }
}
