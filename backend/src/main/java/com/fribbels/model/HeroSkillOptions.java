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
public class HeroSkillOptions {

    public SingleSkillOptions S1;
    public SingleSkillOptions S2;
    public SingleSkillOptions S3;
}
