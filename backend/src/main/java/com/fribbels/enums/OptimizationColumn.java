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
    @SerializedName("dmgd") DMGD,
    @SerializedName("s1") S1,
    @SerializedName("s2") S2,
    @SerializedName("s3") S3,
    @SerializedName("upgrades") UPGRADES,
    @SerializedName("conversions") CONVERSIONS,
    @SerializedName("eq") EQ,
    @SerializedName("score") SCORE,
    @SerializedName("bs") BS,
    @SerializedName("priority") PRIORITY,
}
