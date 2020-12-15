package com.fribbels.core;

import com.fribbels.model.HeroStats;
import com.google.common.base.Charsets;
import com.google.common.io.Files;
import com.google.gson.Gson;
import com.google.gson.stream.JsonWriter;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class FileIO {

    private static final Gson gson = new Gson();

    public String readFile(final String filename) throws IOException {
        final File requestFile = new File(filename);
        final String requestString = Files.toString(requestFile, Charsets.UTF_8);

        return requestString;
    }

    public void writeFile(final String data) throws IOException {
        final File responseFile = new File("response.txt");
        Files.write(data, responseFile, Charsets.UTF_8);
    }

    public void writeJsonToFile(final List<HeroStats> heroStats) throws IOException {
        final FileOutputStream fileOutputStream = new FileOutputStream("response.txt");
        //        final JsonWriter jsonWriter = new JsonWriter(new FileWriter("response.txt"));
        //        jsonWriter.

        JsonWriter writer = new JsonWriter(new OutputStreamWriter(fileOutputStream, "UTF-8"));
        writer.beginArray();
        for (int i = 0; i < heroStats.size(); i++) {
            if (i > 1000) break;
            final HeroStats stat = heroStats.get(i);
            gson.toJson(stat, HeroStats.class, writer);
        }
        writer.endArray();
        writer.close();
    }

    public void writeMiniOptimizationResponsesToFile(final long[] resultInts, final long size) throws IOException {
        final FileOutputStream fileOutputStream = new FileOutputStream("response.txt");
        //        final JsonWriter jsonWriter = new JsonWriter(new FileWriter("response.txt"));
        //        jsonWriter.

        JsonWriter writer = new JsonWriter(new OutputStreamWriter(fileOutputStream, StandardCharsets.UTF_8));
        writer.beginArray();
        for (int i = 0; i < size; i++) {
//            if (resultInts[i] != 0) {
                writer.value(resultInts[i]);
//            }
        }
        writer.endArray();
        writer.close();
        fileOutputStream.close();
    }

    public String writeString(final long[] itemIds, final long size) throws IOException {
        final ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        JsonWriter writer = new JsonWriter(new OutputStreamWriter(byteArrayOutputStream, StandardCharsets.UTF_8));
        writer.beginArray();
        for (int i = 0; i < size * 6; i++) {
            writer.value(itemIds[i]);
        }
        writer.endArray();
        writer.close();
        byteArrayOutputStream.close();

        return byteArrayOutputStream.toString();
    }
}
