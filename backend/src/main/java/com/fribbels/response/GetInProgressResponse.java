package com.fribbels.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class GetInProgressResponse extends Response {

    private Boolean inProgress;
}
