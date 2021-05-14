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
    public Hero hero;
    private List<Item> items;

    private List<Set> inputSetsOne;
    private List<Set> inputSetsTwo;
    private List<Set> inputSetsThree;
    private List<Set> inputExcludeSet;

    private List<StatType> inputNecklaceStat;
    private List<StatType> inputRingStat;
    private List<StatType> inputBootsStat;

    private Boolean inputPredictReforges;
    private Boolean inputSubstatMods;
    private Boolean inputAllowLockedItems;
    private Boolean inputAllowEquippedItems;
    private Boolean inputOrderedHeroPriority;
    private Boolean inputKeepCurrentItems;
    private Boolean inputOnlyMaxedGear;

    private int atk;
    private int hp;
    private int def;
    private int cr;
    private int cd;
    private int eff;
    private int res;
    private int spd;
    private int dac;

    public int inputAtkMinLimit;
    public int inputAtkMaxLimit = Integer.MAX_VALUE;
    public int inputHpMinLimit;
    public int inputHpMaxLimit = Integer.MAX_VALUE;
    public int inputDefMinLimit;
    public int inputDefMaxLimit = Integer.MAX_VALUE;
    public int inputSpdMinLimit;
    public int inputSpdMaxLimit = Integer.MAX_VALUE;
    public int inputCrMinLimit;
    public int inputCrMaxLimit = Integer.MAX_VALUE;
    public int inputCdMinLimit;
    public int inputCdMaxLimit = Integer.MAX_VALUE;
    public int inputEffMinLimit;
    public int inputEffMaxLimit = Integer.MAX_VALUE;
    public int inputResMinLimit;
    public int inputResMaxLimit = Integer.MAX_VALUE;
    public int inputMinCpLimit;
    public int inputMaxCpLimit = Integer.MAX_VALUE;
    public int inputMinHppsLimit;
    public int inputMaxHppsLimit = Integer.MAX_VALUE;
    public int inputMinEhpLimit;
    public int inputMaxEhpLimit = Integer.MAX_VALUE;
    public int inputMinEhppsLimit;
    public int inputMaxEhppsLimit = Integer.MAX_VALUE;
    public int inputMinDmgLimit;
    public int inputMaxDmgLimit = Integer.MAX_VALUE;
    public int inputMinDmgpsLimit;
    public int inputMaxDmgpsLimit = Integer.MAX_VALUE;
    public int inputMinMcdmgLimit;
    public int inputMaxMcdmgLimit = Integer.MAX_VALUE;
    public int inputMinMcdmgpsLimit;
    public int inputMaxMcdmgpsLimit = Integer.MAX_VALUE;

    public int inputMinDmgHLimit;
    public int inputMaxDmgHLimit = Integer.MAX_VALUE;
    public int inputMinUpgradesLimit;
    public int inputMaxUpgradesLimit = Integer.MAX_VALUE;
    public int inputMinConversionsLimit;
    public int inputMaxConversionsLimit = Integer.MAX_VALUE;
    public int inputMinScoreLimit;
    public int inputMaxScoreLimit = Integer.MAX_VALUE;
    public int inputMinPriorityLimit;
    public int inputMaxPriorityLimit = Integer.MAX_VALUE;

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
    public boolean[] boolArr;
    private int setFormat;
}
