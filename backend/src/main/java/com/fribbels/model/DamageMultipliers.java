package com.fribbels.model;

import com.fribbels.enums.Gear;
import com.fribbels.enums.Rank;
import com.fribbels.enums.Set;
import com.google.gson.Gson;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode
public class DamageMultipliers {

    private Float[] atkMods         = new Float[]{1f, 1f, 1f};
    private Float[] rates           = new Float[]{1f, 1f, 1f};
    private Float[] flatMods        = new Float[]{0f, 0f, 0f};
    private Float[] flatMods2       = new Float[]{0f, 0f, 0f};
    private Float[] multis          = new Float[]{1f, 1f, 1f};
    private Float[] pows            = new Float[]{1f, 1f, 1f};
    private Float[] selfHpScalings  = new Float[]{1f, 1f, 1f};
    private Float[] selfDefScalings = new Float[]{1f, 1f, 1f};
    private String[] types = new String[]{"damage", "damage", "damage"};
}
