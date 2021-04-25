package com.fribbels.handler;

import com.fribbels.Main;
import com.fribbels.enums.Set;
import com.fribbels.request.IdRequest;
import com.fribbels.request.Ocr2Request;
import com.fribbels.response.OcrResponse;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.apache.commons.lang3.StringUtils;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.leptonica.PIX;
import org.bytedeco.tesseract.TessBaseAPI;

import java.io.File;
import java.io.IOException;
import java.util.AbstractMap;
import java.util.Comparator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.bytedeco.leptonica.global.lept.pixDestroy;
import static org.bytedeco.leptonica.global.lept.pixRead;

public class OcrRequestHandler extends RequestHandler implements HttpHandler {

    private TessBaseAPI tessBaseAPI;

    private static boolean initialized = false;

    public OcrRequestHandler() throws Exception {
    }

    private void initialize() throws Exception {
        final String path = new File(Main.class.getProtectionDomain().getCodeSource().getLocation()
                .toURI()).getParentFile().getParentFile().getParentFile().getPath();
//        System.err.println("Path: " + path);

        tessBaseAPI = new TessBaseAPI();
        if (tessBaseAPI.Init(path + "/data/tessdata/eng.traineddata", "eng", 0) != 0) {
            System.err.println("Could not initialize tesseract.");
            System.exit(1);
        }

        tessBaseAPI.SetVariable("load_system_dawg", "false");
        tessBaseAPI.SetVariable("load_freq_dawg", "false");
        tessBaseAPI.SetVariable("classify_enable_learning", "0");
        tessBaseAPI.SetVariable("user_defined_dpi", "70");
        initialized = true;
    }

    @Override
    public void handle(final HttpExchange exchange) throws IOException {
        System.out.println("===================== ItemsRequestHandler =====================");
        final String path = exchange.getRequestURI().getPath();

        System.out.println("Path: " + path);

        try {
            if (!initialized) {
                initialize();
            }

            switch (path) {
                case "/ocr":
                    final IdRequest ocrRequest = parseRequest(exchange, IdRequest.class);
                    sendResponse(exchange, handleOcrRequest(ocrRequest));
                    return;
                case "/ocr2":
                    final Ocr2Request ocr2Request = parseRequest(exchange, Ocr2Request.class);
                    sendResponse(exchange, handleOcr2Request(ocr2Request));
                    return;
                default:
                    System.out.println("No handler found for " + path);
            }
        } catch (final Exception e) {
            e.printStackTrace();
        }

        sendResponse(exchange, "ERROR");
    }

    private String handleOcr2Request(final Ocr2Request request) {
        final String levelFilename = request.getId() + "debugLevel.png";
        final String substatsFilename = request.getId() + "debugSubstats.png";
        final PIX levelImage = pixRead(levelFilename);
        final PIX substatsImage = pixRead(substatsFilename);

        tessBaseAPI.SetImage(levelImage);

        final String enhance;
        final String level;
        final String substatsText;
        final String substatsNumbers;

        if (request.getShifted()) {
            enhance = readShiftedEnhance();
            level = readShiftedLevel();
        } else {
            enhance = readEnhance();
            level = readLevel();
        }

        tessBaseAPI.SetImage(substatsImage);

        if (request.getShifted()) {
            substatsText = readShiftedSubstatsText();
            substatsNumbers = readShiftedSubstatsNumbers();
        } else {
            substatsText = readSubstatsText();
            substatsNumbers = readSubstatsNumbers();
        }

        final OcrResponse ocrResponse = OcrResponse.builder()
                .enhance(enhance)
                .level(level)
                .substatsText(substatsText)
                .substatsNumbers(substatsNumbers)
                .build();

        System.out.println(ocrResponse);

        pixDestroy(levelImage);
        pixDestroy(substatsImage);
        return toJson(ocrResponse);
    }

    private String handleOcrRequest(final IdRequest idRequest) {
        final String filename = idRequest.getId();
        final PIX image = pixRead(filename);

        tessBaseAPI.SetImage(image);

        final Set set = readSet();
        final String title;
        final String main;
//        final String hero = readEquippedBy();

        if (isShiftedSet(set)) {
            title = readShiftedTitle();
            main = readShiftedMain();
        } else {
            title = readTitle();
            main = readMain();
        }

        // Get OCR result

        final OcrResponse ocrResponse = OcrResponse.builder()
                .title(title)
                .main(main)
                .set(set.getName())
//                .hero(hero)
                .build();

        System.out.println(ocrResponse);

        pixDestroy(image);
        return toJson(ocrResponse);
    }

    private int enhanceBufferX = 50;
    private int enhanceBufferY = 150;

    private int substatsBufferX = 50;
    private int substatsBufferY = 400;

    private String readTitle() {
        setText();
        return readRectangle(177, 185, 234, 170);
    }

    private String readEnhance() {
        setNumbersAndPlus();
        return readRectangle(132-enhanceBufferX, 198-enhanceBufferY, 40, 19);
    }

    private String readLevel() {
        setNumbers();
        return readRectangle(65-enhanceBufferX, 212-enhanceBufferY, 25, 19);
    }

    private String readMain() {
        setNumbersAndTextAndPercentAndComma();
        return readRectangle(85, 370, 318, 53);
    }

    private String readSubstatsText() {
        setText();
        return readRectangle(0, 193, 1000, 580);
    }

    private String readSubstatsNumbers() {
        setNumbersAndPercentAndComma();
        return readRectangle(1041, 185, 354, 553);
    }

    private String readEquippedBy() {
        setText();
        return readRectangle(165, 825, 265, 34);
    }

    private String readShiftedTitle() {
        setText();
        return readRectangle(176, 160, 236, 170);
    }

    private String readShiftedEnhance() {
        setNumbersAndPlus();
        return readRectangle(132-enhanceBufferX, 173-enhanceBufferY, 39, 20);
    }

    private String readShiftedLevel() {
        setNumbers();
        return readRectangle(65-enhanceBufferX, 188-enhanceBufferY, 27, 18);
    }

    private String readShiftedMain() {
        setNumbersAndTextAndPercentAndComma();
        return readRectangle(84, 342, 323, 69);
    }

    private String readShiftedSubstatsText() {
        setText();
        return readRectangle(0, 100, 1000, 567);
    }

    private String readShiftedSubstatsNumbers() {
        setNumbersAndPercentAndComma();
        return readRectangle(1034, 108, 339, 524);
    }

    private Set readSet() {
        setText();
        final String text = readRectangle(100, 572, 250, 69);

        final Map<Set, Integer> distances = Stream.of(Set.values()).collect(Collectors.toMap(
                x -> x,
                x -> StringUtils.getLevenshteinDistance(x.getName(), text)));

        final Set likelySet = distances.entrySet().stream()
                .min(Comparator.comparingInt(Map.Entry::getValue))
                .orElse(new AbstractMap.SimpleEntry<>(Set.SPEED, 0))
                .getKey();

        return likelySet;
    }

    private String readRectangle(final int x, final int y, final int w, final int h) {
        final BytePointer outText;
        tessBaseAPI.SetRectangle(x, y, w, h);
        outText = tessBaseAPI.GetUTF8Text();

        final String text = outText.getString();

        outText.deallocate();
        return text;
    }

    private boolean isShiftedSet(final Set set) {
        return set == Set.REVENGE
        ||     set == Set.INJURY
        ||     set == Set.PENETRATION
        ||     set == Set.IMMUNITY;
    }

    private void setNumbers() {
        tessBaseAPI.SetVariable("tessedit_char_whitelist", "0123456789");
    }

    private void setNumbersAndPercentAndComma() {
        tessBaseAPI.SetVariable("tessedit_char_whitelist", "0123456789%,");
    }

    private void setNumbersAndPlus() {
        tessBaseAPI.SetVariable("tessedit_char_whitelist", "0123456789+");
    }

    private void setNumbersAndTextAndPercentAndComma() {
        tessBaseAPI.SetVariable("tessedit_char_whitelist", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%,");
    }

    private void setText() {
        tessBaseAPI.SetVariable("tessedit_char_whitelist", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
}
