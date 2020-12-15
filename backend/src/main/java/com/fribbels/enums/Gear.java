package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;

public enum Gear {

    @SerializedName("Weapon")   WEAPON,
    @SerializedName("Helmet")   HELMET,
    @SerializedName("Armor")    ARMOR,
    @SerializedName("Necklace") NECKLACE,
    @SerializedName("Ring")     RING,
    @SerializedName("Boots")    BOOTS;

    @Override
    public String toString() {
        if (this == Gear.WEAPON) {
            return "Weapon";
        }
        if (this == Gear.HELMET) {
            return "Helmet";
        }
        if (this == Gear.ARMOR) {
            return "Armor";
        }
        if (this == Gear.NECKLACE) {
            return "Necklace";
        }
        if (this == Gear.RING) {
            return "Ring";
        }
        if (this == Gear.BOOTS) {
            return "Boots";
        }
        return "";
    }
}
