package com.fribbels.model;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class ArtifactStats {

    private final Float attack;
    private final Float health;
}
