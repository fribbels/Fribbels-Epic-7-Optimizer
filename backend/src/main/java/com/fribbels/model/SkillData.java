package com.fribbels.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SkillData {

    public String name;
    public Float rate = 0f;
    public Float pow = 0f;
    public Integer targets = 0;
    public Float selfHpScaling = 0f;
    public Float selfAtkScaling = 0f;
    public Float selfDefScaling = 0f;
    public Float selfSpdScaling = 0f;
    public Float increasedValue = 0f;
    public Float extraSelfHpScaling = 0f;
    public Float extraSelfDefScaling = 0f;
    public Float extraSelfAtkScaling = 0f;
    public Float cdmgIncrease = 0f;
    public Float penetration = 0f;}
