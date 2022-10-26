package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Set {

    @SerializedName("HealthSet")      HEALTH      (0, 2, new int[]{2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{0, 0}, "HealthSet"),
    @SerializedName("DefenseSet")     DEFENSE     (1, 2, new int[]{0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{1, 1}, "DefenseSet"),
    @SerializedName("AttackSet")      ATTACK      (2, 4, new int[]{0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{2, 2, 2, 2}, "AttackSet"),
    @SerializedName("SpeedSet")       SPEED       (3, 4, new int[]{0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{3, 3, 3, 3}, "SpeedSet"),
    @SerializedName("CriticalSet")    CRIT        (4, 2, new int[]{0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{4, 4}, "CriticalSet"),
    @SerializedName("HitSet")         HIT         (5, 2, new int[]{0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{5, 5}, "HitSet"),
    @SerializedName("DestructionSet") DESTRUCTION (6, 4, new int[]{0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{6, 6, 6, 6}, "DestructionSet"),
    @SerializedName("LifestealSet")   LIFESTEAL   (7, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{7, 7, 7, 7}, "LifestealSet"),
    @SerializedName("CounterSet")     COUNTER     (8, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{8, 8, 8, 8}, "CounterSet"),
    @SerializedName("ResistSet")      RESIST      (9, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0}, new int[]{9, 9}, "ResistSet"),
    @SerializedName("UnitySet")       UNITY       (10, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0}, new int[]{10, 10}, "UnitySet"),
    @SerializedName("RageSet")        RAGE        (11, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0}, new int[]{11, 11, 11, 11}, "RageSet"),
    @SerializedName("ImmunitySet")    IMMUNITY    (12, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0}, new int[]{12, 12}, "ImmunitySet"),
    @SerializedName("PenetrationSet") PENETRATION (13, 2, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0}, new int[]{13, 13}, "PenetrationSet"),
    @SerializedName("RevengeSet")     REVENGE     (14, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0}, new int[]{14, 14, 14, 14}, "RevengeSet"),
    @SerializedName("InjurySet")      INJURY      (15, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0}, new int[]{15, 15, 15, 15}, "InjurySet"),
    @SerializedName("ProtectionSet")  PROTECTION  (16, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0}, new int[]{16, 16, 16, 16}, "NewSetOne"),
    @SerializedName("TorrentSet")     TORRENT     (17, 4, new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4}, new int[]{17, 17, 17, 17}, "NewSetTwo");

    public int index;
    private int count;
    private int[] arr;
    private int[] indices;
    private String name;
}
