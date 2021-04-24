package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OptimizationColumn {

    @SerializedName("atk") ATK,
    @SerializedName("hp") HP,
    @SerializedName("def") DEF,
    @SerializedName("spd") SPD,
    @SerializedName("cr") CR,
    @SerializedName("cd") CD,
    @SerializedName("eff") EFF,
    @SerializedName("res") RES,
    @SerializedName("dac") DAC,
    @SerializedName("cp") CP,
    @SerializedName("hpps") HPPS,
    @SerializedName("ehp") EHP,
    @SerializedName("ehpps") EHPPS,
    @SerializedName("dmg") DMG,
    @SerializedName("dmgps") DMGPS,
    @SerializedName("mcdmg") MCDMG,
    @SerializedName("mcdmgps") MCDMGPS,
    @SerializedName("dmgh") DMGH,
    @SerializedName("upgrades") UPGRADES,
    @SerializedName("conversions") CONVERSIONS,
    @SerializedName("score") SCORE,
    @SerializedName("priority") PRIORITY,
}
