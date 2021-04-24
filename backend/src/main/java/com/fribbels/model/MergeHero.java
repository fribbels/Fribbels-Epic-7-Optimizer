package com.fribbels.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@EqualsAndHashCode
public class MergeHero {

    private Integer awaken;
    private Integer stars;
    private String name;
    private String id;
    private Hero data;
}
