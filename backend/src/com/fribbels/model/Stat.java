package com.fribbels.model;

import com.fribbels.enums.StatType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
public class Stat {

    private StatType type;

    private Integer value;
}
