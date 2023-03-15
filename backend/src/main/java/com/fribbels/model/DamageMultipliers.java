package com.fribbels.model;

import com.aparapi.Kernel;
import com.fribbels.enums.Gear;
import com.fribbels.enums.Rank;
import com.fribbels.enums.Set;
import com.google.gson.Gson;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode
public class DamageMultipliers {

    private Float[] rate           = new Float[]{1f, 1f, 1f};
    private Float[] pow            = new Float[]{1f, 1f, 1f};

    private Float[] selfHpScaling             = new Float[]{1f, 1f, 1f};
    private Float[] selfAtkScaling            = new Float[]{1f, 1f, 1f};
    private Float[] selfDefScaling            = new Float[]{1f, 1f, 1f};
    private Float[] selfSpdScaling            = new Float[]{1f, 1f, 1f};
    private Float[] constantValue             = new Float[]{1f, 1f, 1f};
    private Float[] selfAtkConstantValue      = new Float[]{1f, 1f, 1f};
    private Float[] increasedValue            = new Float[]{1f, 1f, 1f};
    private Float[] defDiffPen                = new Float[]{1f, 1f, 1f};
    private Float[] defDiffPenMax             = new Float[]{1f, 1f, 1f};
    private Float[] atkDiffPen                = new Float[]{1f, 1f, 1f};
    private Float[] atkDiffPenMax             = new Float[]{1f, 1f, 1f};
    private Float[] spdDiffPen                = new Float[]{1f, 1f, 1f};
    private Float[] spdDiffPenMax             = new Float[]{1f, 1f, 1f};
    private Float[] penetration               = new Float[]{1f, 1f, 1f};
    private Float[] atkIncrease               = new Float[]{1f, 1f, 1f};
    private Float[] cdmgIncrease              = new Float[]{1f, 1f, 1f};
    private Float[] crit                      = new Float[]{1f, 1f, 1f};
    private Float[] damage                    = new Float[]{1f, 1f, 1f};
    private Float[] support                   = new Float[]{1f, 1f, 1f};
    private Float[] hitMulti                  = new Float[]{1f, 1f, 1f};

    private Float[] extraSelfAtkScaling       = new Float[]{1f, 1f, 1f};
    private Float[] extraSelfDefScaling       = new Float[]{1f, 1f, 1f};
    private Float[] extraSelfHpScaling        = new Float[]{1f, 1f, 1f};

}
