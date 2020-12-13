package com.fribbels.enums;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum SortOrder {

    @SerializedName("asc") ASC,
    @SerializedName("desc") DESC,
}
