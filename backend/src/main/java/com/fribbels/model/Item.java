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
import lombok.With;

import java.util.List;

@Builder
@Getter
@Setter
@With
@AllArgsConstructor
@EqualsAndHashCode
public class Item {

    private Gear gear;
    private Rank rank;
    private Set set;

    private Integer enhance;
    private Integer level;

    private Stat main;
    private List<Stat> substats;
    private List<List<String>> op;
    private Boolean storage;
    private Mod mod;

    private String name;

    private AugmentedStats augmentedStats;
    private AugmentedStats reforgedStats;
    private Material material;
    private String mconfidence;

    private String id;
    private String modId;
    private String ingameId;
    private String ingameEquippedId;

    private String equippedById;
    private String equippedByName;
    private String heroName;

    private boolean locked;
    private boolean disableMods;

    private int reforgeable;
    private int upgradeable;
    private int convertable;
    private int alreadyEquipped;
    private int priority;
    private int wss;
    private int reforgedWss;
    private int dpsWss;
    private int supportWss;
    private int combatWss;

    private String duplicateId;
    private String allowedMods;

    private float[] tempStatAccArr;

    @Override
    public String toString() {
        return new Gson().toJson(this);
    }

    public int getHash() {
        final HashItem hashItem = new HashItem(gear, rank, set, 0, level, main, augmentedStats);
        return hashItem.hashCode();
    }
}
