package com.fribbels.model;

import com.fribbels.enums.StatType;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@AllArgsConstructor
@EqualsAndHashCode
public class Stat {

    private StatType type;

    private Integer value;

    private Integer rolls;

    private Boolean modified;

    private Integer ingameRolls;
}
