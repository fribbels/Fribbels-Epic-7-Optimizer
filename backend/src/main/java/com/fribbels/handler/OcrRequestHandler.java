package com.fribbels.handler;

import static org.bytedeco.leptonica.global.leptonica.pixDestroy;
import static org.bytedeco.leptonica.global.leptonica.pixRead;

import java.io.File;
import java.io.IOException;
import java.util.AbstractMap;
import java.util.Comparator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.leptonica.PIX;
import org.bytedeco.tesseract.TessBaseAPI;

import com.fribbels.Main;
import com.fribbels.enums.Set;
import com.fribbels.request.IdRequest;
import com.fribbels.request.Ocr2Request;
import com.fribbels.response.OcrResponse;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class OcrRequestHandler extends RequestHandler implements HttpHandler {

    private static boolean initialized = false;
    private static final int ENCHANCE_BUFFER_X = 50;
    private static final int ENCHANCE_BUFFER_Y = 150;

    private static TessBaseAPI tessBaseAPI;

    public OcrRequestHandler() {
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
                    final IdRequest ocrRequest = this.parseRequest(exchange, IdRequest.class);
                    this.sendResponse(exchange, this.handleOcrRequest(ocrRequest));
                    return;
                case "/ocr2":
                    final Ocr2Request ocr2Request = this.parseRequest(exchange, Ocr2Request.class);
                    this.sendResponse(exchange, this.handleOcr2Request(ocr2Request));
                    return;
                default:
                    System.out.println("No handler found for " + path);
            }
        } catch (final Exception e) {
            e.printStackTrace();
        }

        this.sendResponse(exchange, "ERROR");
    }

    private static void initialize() throws Exception {
        final String path = new File(Main.class.getProtectionDomain().getCodeSource().getLocation()
                .toURI()).getParentFile().getParentFile().getParentFile().getPath();

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

        if (request.isShifted()) {
            enhance = this.readShiftedEnhance();
            level = this.readShiftedLevel();
        } else {
            enhance = this.readEnhance();
            level = this.readLevel();
        }

        tessBaseAPI.SetImage(substatsImage);

        if (request.isShifted()) {
            substatsText = this.readShiftedSubstatsText();
            substatsNumbers = this.readShiftedSubstatsNumbers();
        } else {
            substatsText = this.readSubstatsText();
            substatsNumbers = this.readSubstatsNumbers();
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
        return this.toJson(ocrResponse);
    }

    private String handleOcrRequest(final IdRequest idRequest) {
        final String filename = idRequest.getId();
        final PIX image = pixRead(filename);

        tessBaseAPI.SetImage(image);

        final Set set = this.readSet();
        final String title;
        final String main;

        if (this.isShiftedSet(set)) {
            title = this.readShiftedTitle();
            main = this.readShiftedMain();
        } else {
            title = this.readTitle();
            main = this.readMain();
        }

        // Get OCR result

        final OcrResponse ocrResponse = OcrResponse.builder()
                .title(title)
                .main(main)
                .set(set.getName())
                // .hero(hero)
                .build();

        System.out.println(ocrResponse);

        pixDestroy(image);
        return this.toJson(ocrResponse);
    }

    private String readTitle() {
        this.setText();
        return this.readRectangle(177, 185, 234, 170);
    }

    private String readEnhance() {
        this.setNumbersAndPlus();
        return this.readRectangle(132 - ENCHANCE_BUFFER_X, 198 - ENCHANCE_BUFFER_Y, 40, 19);
    }

    private String readLevel() {
        this.setNumbers();
        return this.readRectangle(65 - ENCHANCE_BUFFER_X, 212 - ENCHANCE_BUFFER_Y, 25, 19);
    }

    private String readMain() {
        this.setNumbersAndTextAndPercentAndComma();
        return this.readRectangle(85, 370, 318, 53);
    }

    private String readSubstatsText() {
        this.setText();
        return this.readRectangle(0, 193, 1000, 580);
    }

    private String readSubstatsNumbers() {
        this.setNumbersAndPercentAndComma();
        return this.readRectangle(1041, 185, 354, 553);
    }

    private String readShiftedTitle() {
        this.setText();
        return this.readRectangle(176, 160, 236, 170);
    }

    private String readShiftedEnhance() {
        this.setNumbersAndPlus();
        return this.readRectangle(132 - ENCHANCE_BUFFER_X, 173 - ENCHANCE_BUFFER_Y, 39, 20);
    }

    private String readShiftedLevel() {
        this.setNumbers();
        return this.readRectangle(65 - ENCHANCE_BUFFER_X, 188 - ENCHANCE_BUFFER_Y, 27, 18);
    }

    private String readShiftedMain() {
        this.setNumbersAndTextAndPercentAndComma();
        return this.readRectangle(84, 342, 323, 69);
    }

    private String readShiftedSubstatsText() {
        this.setText();
        return this.readRectangle(0, 100, 1000, 567);
    }

    private String readShiftedSubstatsNumbers() {
        this.setNumbersAndPercentAndComma();
        return this.readRectangle(1034, 108, 339, 524);
    }

    private Set readSet() {
        this.setText();
        final String text = this.readRectangle(100, 572, 250, 69);

        final Map<Set, Integer> distances = Stream.of(Set.values()).collect(Collectors.toMap(
                x -> x,
                x -> this.levenshteinDistance(x.getName(), text)));

        return distances.entrySet().stream()
                .min(Comparator.comparingInt(Map.Entry::getValue))
                .orElse(new AbstractMap.SimpleEntry<>(Set.SPEED, 0))
                .getKey();
    }

    private int levenshteinDistance(final String a, final String b) {
        final int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++) {
            for (int j = 0; j <= b.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                } else if (j == 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                            dp[i - 1][j - 1] + (a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1),
                            Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1));
                }
            }
        }

        return dp[a.length()][b.length()];
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
                || set == Set.INJURY
                || set == Set.PENETRATION
                || set == Set.IMMUNITY;
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
        tessBaseAPI.SetVariable("tessedit_char_whitelist",
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%,");
    }

    private void setText() {
        tessBaseAPI.SetVariable("tessedit_char_whitelist", "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }
}
