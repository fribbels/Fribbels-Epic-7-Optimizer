package com.fribbels;

import com.fribbels.model.Item;
import com.google.gson.Gson;
import org.junit.jupiter.api.Test;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

public class DebugTest {

    @Test
    public void test() {
        Gson gson = new Gson();

        try (Reader reader = new FileReader("C:\\Users\\ivanc\\IdeaProjects\\Gear\\item.json")) {

            // Convert JSON File to Java Object
            Item item = gson.fromJson(reader, Item.class);

            // print staff object
            System.out.println(item);

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
