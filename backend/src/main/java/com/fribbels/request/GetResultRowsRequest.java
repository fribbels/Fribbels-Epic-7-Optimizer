package com.fribbels.request;

import com.fribbels.enums.OptimizationColumn;
import com.fribbels.enums.SortOrder;
import com.fribbels.model.Request;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class GetResultRowsRequest extends Request {

    private String executionId;
    private int startRow;
    private int endRow;
    private OptimizationColumn sortColumn;
    private SortOrder sortOrder;
    private OptimizationRequest optimizationRequest;
}
