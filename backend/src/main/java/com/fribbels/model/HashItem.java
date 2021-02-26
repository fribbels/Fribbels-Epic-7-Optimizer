package com.fribbels.model;

import com.fribbels.enums.Gear;
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
public class HashItem {

    private Gear gear;
    private Rank rank;
    private Set set;

    private Integer enhance;
    private Integer level;

    private Stat main;
    private AugmentedStats augmentedStats;

    public String toString() {
        return new Gson().toJson(this);
    }
}
