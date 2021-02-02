package com.fribbels.request;

import com.fribbels.model.Hero;
import com.fribbels.model.Item;
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
public class AllDataResponse extends Request {

    private List<Hero> heroes;
    private List<Item> items;
}
