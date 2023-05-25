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
public class HeroSkills {

    public SkillData[] S1;
    public SkillData[] S2;
    public SkillData[] S3;
}
