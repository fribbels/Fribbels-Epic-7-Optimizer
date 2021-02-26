package com.fribbels.model;

import com.fribbels.enums.Gear;
import com.fribbels.enums.Material;
import com.fribbels.enums.Rank;
import com.fribbels.enums.Set;
import com.google.gson.Gson;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
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

    private String name;

    private AugmentedStats augmentedStats;
    private AugmentedStats reforgedStats;
    private Material material;
    private String mconfidence;

    public String id;

    private String equippedById;
    private String equippedByName;
    private String heroName;

    private boolean locked;
    public int reforgeable;
    public int upgradeable;
    private int wss;
    private int reforgedWss;
    private int dpsWss;
    private int supportWss;
    private int combatWss;

    private String duplicateId;

    public String toString() {
        return new Gson().toJson(this);
    }

    public int getHash() {
        final HashItem hashItem = new HashItem(gear, rank, set, enhance, level, main, augmentedStats);
        return hashItem.hashCode();
    }
}
