package com.fribbels.request;

import com.fribbels.model.Request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Wither;

@Wither
@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class SetSettingsRequest extends Request {

    private boolean settingUnlockOnUnequip;
    private boolean settingRageSet;
    private boolean settingPenSet;
    private Integer settingMaxResults;
    private Integer settingPenDefense;
}
