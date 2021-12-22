package com.fribbels.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PassesContainer {
    boolean[] passes;
    boolean locked;
    String id;
}
