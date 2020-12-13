package com.fribbels.request;

import com.fribbels.enums.Set;
import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class Ocr2Request extends Request {

    private String id;
    private Boolean shifted;
}
