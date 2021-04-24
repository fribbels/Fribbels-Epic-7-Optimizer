package com.fribbels.model;

import com.fribbels.enums.Gear;
import com.fribbels.enums.Material;
import com.fribbels.enums.Rank;
import com.fribbels.enums.Set;
import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Wither;

import java.util.List;

@Getter
@Setter
@Wither
@AllArgsConstructor
@EqualsAndHashCode
public class Item {

    private Gear gear;
    private Rank rank;
    public Set set;

    private Integer enhance;
    public Integer level;

    private Stat main;
    private List<Stat> substats;
    private Mod mod;

    private String name;

    private AugmentedStats augmentedStats;
    private AugmentedStats reforgedStats;
    private Material material;
    private String mconfidence;

    public String id;
    public String modId;
    public String ingameId;
    public String ingameEquippedId;

    private String equippedById;
    private String equippedByName;
    private String heroName;

    private boolean locked;
//    private boolean alreadyPredictedReforge;
    public int reforgeable;
    public int upgradeable;
    public int convertable;
    public int priority;
    private int wss;
    private int reforgedWss;
    private int dpsWss;
    private int supportWss;
    private int combatWss;

    private String duplicateId;
    private String allowedMods;

    public String toString() {
        return new Gson().toJson(this);
    }

    public int getHash() {
        final HashItem hashItem = new HashItem(gear, rank, set, 0, level, main, augmentedStats);
        return hashItem.hashCode();
    }
}
