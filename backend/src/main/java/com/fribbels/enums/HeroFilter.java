package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum HeroFilter {

    @SerializedName("optimizer") OPTIMIZER,
    @SerializedName("sixstar") SIX_STAR,
    @SerializedName("fivestar") FIVE_STAR,
}
