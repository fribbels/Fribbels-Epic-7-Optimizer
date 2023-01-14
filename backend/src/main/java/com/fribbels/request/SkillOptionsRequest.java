package com.fribbels.request;

import com.fribbels.model.HeroSkillOptions;
import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class SkillOptionsRequest extends Request {

    private String heroId;

    private HeroSkillOptions skillOptions;
}

