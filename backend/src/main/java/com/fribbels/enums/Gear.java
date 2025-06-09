package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;

public enum Gear {

    @SerializedName("Weapon")   WEAPON("Weapon"),
    @SerializedName("Helmet")   HELMET("Helmet"),
    @SerializedName("Armor")    ARMOR("Armor"),
    @SerializedName("Necklace") NECKLACE("Necklace"),
    @SerializedName("Ring")     RING("Ring"),
    @SerializedName("Boots")    BOOTS("Boots");

    private final String displayName;

    Gear(final String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
