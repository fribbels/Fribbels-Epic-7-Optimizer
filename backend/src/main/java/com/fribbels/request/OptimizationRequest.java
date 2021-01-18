package com.fribbels.request;

import com.fribbels.enums.Set;
import com.fribbels.enums.StatType;
import com.fribbels.model.Hero;
import com.fribbels.model.Item;
import com.fribbels.model.Request;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Wither;

import java.util.List;

@Wither
@Setter
@Getter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class OptimizationRequest extends Request {

    private String heroId;
    private Hero hero;
    private List<Item> items;

    private List<Set> inputSetsOne;
    private List<Set> inputSetsTwo;
    private List<Set> inputSetsThree;
    private List<Set> inputExcludeSet;

    private List<StatType> inputNecklaceStat;
    private List<StatType> inputRingStat;
    private List<StatType> inputBootsStat;

    private Boolean inputPredictReforges;
    private Boolean inputAllowLockedItems;
    private Boolean inputAllowEquippedItems;
    private Boolean inputKeepCurrentItems;
    private Boolean inputCanReforge;

    private int atk;
    private int hp;
    private int def;
    private int cr;
    private int cd;
    private int eff;
    private int res;
    private int spd;
    private int dac;

    private int inputAtkMinLimit;
    private int inputAtkMaxLimit = Integer.MAX_VALUE;
    private int inputHpMinLimit;
    private int inputHpMaxLimit = Integer.MAX_VALUE;
    private int inputDefMinLimit;
    private int inputDefMaxLimit = Integer.MAX_VALUE;
    private int inputSpdMinLimit;
    private int inputSpdMaxLimit = Integer.MAX_VALUE;
    private int inputCrMinLimit;
    private int inputCrMaxLimit = Integer.MAX_VALUE;
    private int inputCdMinLimit;
    private int inputCdMaxLimit = Integer.MAX_VALUE;
    private int inputEffMinLimit;
    private int inputEffMaxLimit = Integer.MAX_VALUE;
    private int inputResMinLimit;
    private int inputResMaxLimit = Integer.MAX_VALUE;
    private int inputMinCpLimit;
    private int inputMaxCpLimit = Integer.MAX_VALUE;
    private int inputMinHppsLimit;
    private int inputMaxHppsLimit = Integer.MAX_VALUE;
    private int inputMinEhpLimit;
    private int inputMaxEhpLimit = Integer.MAX_VALUE;
    private int inputMinEhppsLimit;
    private int inputMaxEhppsLimit = Integer.MAX_VALUE;
    private int inputMinDmgLimit;
    private int inputMaxDmgLimit = Integer.MAX_VALUE;
    private int inputMinDmgpsLimit;
    private int inputMaxDmgpsLimit = Integer.MAX_VALUE;
    private int inputMinMcdmgLimit;
    private int inputMaxMcdmgLimit = Integer.MAX_VALUE;
    private int inputMinMcdmgpsLimit;
    private int inputMaxMcdmgpsLimit = Integer.MAX_VALUE;

    private Integer inputAtkMinForce;
    private Integer inputAtkMaxForce;
    private Integer inputAtkPercentMinForce;
    private Integer inputAtkPercentMaxForce;
    private Integer inputSpdMinForce;
    private Integer inputSpdMaxForce;
    private Integer inputCrMinForce;
    private Integer inputCrMaxForce;
    private Integer inputCdMinForce;
    private Integer inputCdMaxForce;
    private Integer inputHpMinForce;
    private Integer inputHpMaxForce;
    private Integer inputHpPercentMinForce;
    private Integer inputHpPercentMaxForce;
    private Integer inputDefMinForce;
    private Integer inputDefMaxForce;
    private Integer inputDefPercentMinForce;
    private Integer inputDefPercentMaxForce;
    private Integer inputEffMinForce;
    private Integer inputEffMaxForce;
    private Integer inputResMinForce;
    private Integer inputResMaxForce;

    private Integer inputForceNumberSelect;
    private Integer inputForceMode;
    private Integer inputFilterPriority;
    private Integer inputAtkPriority;
    private Integer inputHpPriority;
    private Integer inputDefPriority;
    private Integer inputSpdPriority;
    private Integer inputCrPriority;
    private Integer inputCdPriority;
    private Integer inputEffPriority;
    private Integer inputResPriority;

    // calculated fields
    private boolean[] boolArr;
    private int setFormat;
}
