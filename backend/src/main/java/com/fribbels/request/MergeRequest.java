package com.fribbels.request;

import com.fribbels.enums.HeroFilter;
import com.fribbels.model.Item;
import com.fribbels.model.MergeHero;
import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Setter
@Getter
@Builder
@ToString
public class MergeRequest extends Request {

    private List<Item> items;
    private List<MergeHero> mergeHeroes;
    private Integer enhanceLimit;
    private HeroFilter heroFilter;
}
