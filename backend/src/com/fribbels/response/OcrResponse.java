package com.fribbels.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Builder
@ToString
public class OcrResponse extends Response {

    private String title;
    private String enhance;
    private String level;
    private String main;
    private String substats;
    private String substatsText;
    private String substatsNumbers;
    private String set;
}
