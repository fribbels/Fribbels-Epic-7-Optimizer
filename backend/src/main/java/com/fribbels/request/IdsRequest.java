package com.fribbels.request;

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
public class IdsRequest extends Request {

    private List<String> ids;
}
