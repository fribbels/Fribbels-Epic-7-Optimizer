package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;

public enum Rank {

    @SerializedName("Normal") NORMAL,
    @SerializedName("Good")   GOOD,
    @SerializedName("Rare")   RARE,
    @SerializedName("Heroic") HEROIC,
    @SerializedName("Epic")   EPIC
}
