package com.fribbels.request;

import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class EditResultRowsRequest extends Request {

    private String executionId;
    private int index;
    private String property;
}
