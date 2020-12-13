package com.fribbels.response;

import com.fribbels.model.Item;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class GetItemByIdResponse extends Response {

    private Item item;
}
