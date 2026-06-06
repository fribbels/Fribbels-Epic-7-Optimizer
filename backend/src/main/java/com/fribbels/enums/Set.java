package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Set {

    @SerializedName("HealthSet")      HEALTH      (0, 2, setCounter(0, 2), setIndices(0, 2), "HealthSet"),
    @SerializedName("DefenseSet")     DEFENSE     (1, 2, setCounter(1, 2), setIndices(1, 2), "DefenseSet"),
    @SerializedName("AttackSet")      ATTACK      (2, 4, setCounter(2, 4), setIndices(2, 4), "AttackSet"),
    @SerializedName("SpeedSet")       SPEED       (3, 4, setCounter(3, 4), setIndices(3, 4), "SpeedSet"),
    @SerializedName("CriticalSet")    CRIT        (4, 2, setCounter(4, 2), setIndices(4, 2), "CriticalSet"),
    @SerializedName("HitSet")         HIT         (5, 2, setCounter(5, 2), setIndices(5, 2), "HitSet"),
    @SerializedName("DestructionSet") DESTRUCTION (6, 4, setCounter(6, 4), setIndices(6, 4), "DestructionSet"),
    @SerializedName("LifestealSet")   LIFESTEAL   (7, 4, setCounter(7, 4), setIndices(7, 4), "LifestealSet"),
    @SerializedName("CounterSet")     COUNTER     (8, 4, setCounter(8, 4), setIndices(8, 4), "CounterSet"),
    @SerializedName("ResistSet")      RESIST      (9, 2, setCounter(9, 2), setIndices(9, 2), "ResistSet"),
    @SerializedName("UnitySet")       UNITY       (10, 2, setCounter(10, 2), setIndices(10, 2), "UnitySet"),
    @SerializedName("RageSet")        RAGE        (11, 4, setCounter(11, 4), setIndices(11, 4), "RageSet"),
    @SerializedName("ImmunitySet")    IMMUNITY    (12, 2, setCounter(12, 2), setIndices(12, 2), "ImmunitySet"),
    @SerializedName("PenetrationSet") PENETRATION (13, 2, setCounter(13, 2), setIndices(13, 2), "PenetrationSet"),
    @SerializedName("RevengeSet")     REVENGE     (14, 4, setCounter(14, 4), setIndices(14, 4), "RevengeSet"),
    @SerializedName("InjurySet")      INJURY      (15, 4, setCounter(15, 4), setIndices(15, 4), "InjurySet"),
    @SerializedName("ProtectionSet")  PROTECTION  (16, 4, setCounter(16, 4), setIndices(16, 4), "ProtectionSet"),
    @SerializedName("TorrentSet")     TORRENT     (17, 2, setCounter(17, 2), setIndices(17, 2), "TorrentSet"),
    @SerializedName("ReversalSet")    REVERSAL    (18, 4, setCounter(18, 4), setIndices(18, 4), "ReversalSet"),
    @SerializedName("RiposteSet")     RIPOSTE     (19, 4, setCounter(19, 4), setIndices(19, 4), "RiposteSet"),
    @SerializedName("WarfareSet")     OPENER      (20, 4, setCounter(20, 4), setIndices(20, 4), "WarfareSet"),
    @SerializedName("PursuitSet")     CHASE       (21, 2, setCounter(21, 2), setIndices(21, 2), "PursuitSet"),
    @SerializedName("WeakeningSet")   WEAKENING   (22, 4, setCounter(22, 4), setIndices(22, 4), "WeakeningSet"),
    @SerializedName("FervorSet")      FERVOR      (23, 2, setCounter(23, 2), setIndices(23, 2), "FervorSet");

    public int index;
    private int count;
    private int[] arr;
    private int[] indices;
    private String name;

    private static int[] setCounter(final int index, final int count) {
        final int[] output = new int[24];
        output[index] = count;
        return output;
    }

    private static int[] setIndices(final int index, final int count) {
        final int[] output = new int[count];
        for (int i = 0; i < count; i++) {
            output[i] = index;
        }
        return output;
    }
}
