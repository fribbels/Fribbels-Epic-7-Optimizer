async function readPaths(filename, regularPath, invertedPath) {
    drawDebugRectangle(regularPath, enhanceNumberRectangle);

    const rawMainstatText    = await readPathRectangle(invertedPath, mainstatTextRectangle,   TEXT);
    console.log(rawMainstatText);
    
    const rawSubstatText     = await readPathRectangle(invertedPath, substatTextRectangle,    TEXT);
    console.log(rawSubstatText);

    const rawSubstatNumbers  = await readPathRectangle(invertedPath, substatNumberRectangle,  NUMBERS);
    console.log(rawSubstatNumbers);

    const rawMainstatNumbers = await readPathRectangle(invertedPath, mainstatNumberRectangle, NUMBERS);
    console.log(rawMainstatNumbers);

    const rawGearText = await readPathRectangle(invertedPath, gearTextRectangle, TEXT);
    console.log(rawGearText);

    const rawSetText = await readPathRectangle(invertedPath, setTextRectangle, TEXT);
    console.log(rawGearText);

    const rawLevelNumber = await readPathRectangle(regularPath, levelNumberRectangle, NUMBERS);
    console.log(rawLevelNumber);

    const rawEnhanceNumber = await readPathRectangle(regularPath, enhanceNumberRectangle, ENHANCE);
    console.log("Result:" + rawEnhanceNumber);
}

function readOcrInputs() {
    var path = document.getElementById('ocr-test-input-url').value;
    var left = document.getElementById('ocr-test-input-left').value;
    var top = document.getElementById('ocr-test-input-top').value;
    var width = document.getElementById('ocr-test-input-width').value;
    var height = document.getElementById('ocr-test-input-height').value;

    // Sub stat names 0/360/240/120
    // Sub stat number 240/360/90/100
    // Main stat name 70/300/150/50
    // Main stat number 230/300/100/50
    // 

    read(parseInt(left), parseInt(top), parseInt(width), parseInt(height), path);
}


    // const guessedSubstatNumbers = rawSubstatNumbers.split("\n").map(x => x.trim()).filter(x => x.length > 0);
    // const realSubstatNumbers = filename.split(".")[0].split("_");

    // console.log("GUESSED: " + guessedSubstatNumbers);
    // console.log("ACTUAL:  " + realSubstatNumbers);
    // console.log(guessedSubstatNumbers.toString() == realSubstatNumbers.toString() ? "CORRECT" : "WRONG");  
    // if (guessedSubstatNumbers.toString() != realSubstatNumbers.toString()) throw "WRONG";  



const substatNumberRectangle = {
    left:   300,
    top:    450,
    width:  85,
    height: 130,
};
const substatTextRectangle = {
    left:   50,
    top:    450,
    width:  250,
    height: 140,
};
const mainstatNumberRectangle = {
    left:   302,
    top:    380,
    width:  100,
    height: 45,
};
const mainstatTextRectangle = {
    left:   85,
    top:    380,
    width:  217,
    height: 45,
};
const gearTextRectangle = {
    left:   178,
    top:    190,
    width:  235,
    height: 160,
};
const setTextRectangle = {
    left:   100,
    top:    605,
    width:  300,
    height: 50,
};
const levelNumberRectangle = {
    left:   65,
    top:    214,
    width:  25,
    height: 18,
};

// Filter "1 " = "+"
const enhanceNumberRectangle = {
    left:   140,
    top:    206,
    width:  31,
    height: 16,
};

var fs = require('fs');

module.exports = {
    addEventListenerToOcrTest: () => {
        document.getElementById('ocr-test-main-name').addEventListener("click", async () => {
            await setText();        
            read(85, 380, 220, 50);
        });
        document.getElementById('ocr-test-main-numbers').addEventListener("click", async () => {
            await setNumbers();        
            read(300, 380, 100, 50);
        });
        document.getElementById('ocr-test-sub-name').addEventListener("click", async () => {
            await setText();        
            read(50, 450, 225, 150);
        });
        document.getElementById('ocr-test-sub-numbers').addEventListener("click", async () => {
            await setNumbers();        
            read(300, 375, 85, 220);
        });

        document.getElementById('ocr-test-submit-number').addEventListener("click", async () => {
            await setNumbers();        
            readOcrInputs();
        });

        document.getElementById('ocr-test-submit-text').addEventListener("click", async () => {
            await setText();        
            readOcrInputs();
        });

        document.getElementById('ocr-test-jimp').addEventListener("click", async () => {
            var path = document.getElementById('ocr-test-input-url').value;
            const image = await Jimp.read(path); 
            console.log(image);
            await image.invert().contrast(0.5).writeAsync(path + "inverted.png")
            // var bitmap = await image.invert().getBase64Async(Jimp.AUTO);


            // const rectangle = { left: "300", top: "515", width: "85", height: "35"};
            const rectangle = { left: 305, top: 450, width: 85, height: 150};

            document.getElementById('ocr-test-crop').src = path+"inverted.png";
            document.getElementById('ocr-test-crop').style = 
            `  position: absolute;
               clip: rect(${rectangle.top}px, ${rectangle.width+rectangle.left}px, ${rectangle.top+rectangle.height}px, ${rectangle.left}px);
            `;
            console.log("Start");
            await setNumbers();        
            const { data: { text } } = await worker.recognize(path+"inverted.png", { rectangle });
            console.log("result: \n" + text);
            console.log("Done");
        });

        // document.getElementById('ocr-test-all').addEventListener("click", async () => {
        //     await setText();        
        //     await read(85, 380, 220, 50);
        //     await setNumbers();        
        //     await read(300, 380, 100, 50);
        //     await setText();        
        //     await read(50, 450, 225, 150);
        //     await setNumbers();        
        //     await read(300, 450, 100, 150);
        // });

        document.getElementById('ocr-test-file-scan').addEventListener("click", async () => {
            // Files.listFilesInFolder("");
        });

        document.getElementById('ocr-test-full-scan').addEventListener("click", async () => {
            const folder = document.getElementById('ocr-test-input-folder').value;
            const filenames = Files.listFilesInFolder(folder);
            console.log(filenames)

            for (var filename of filenames) {
                if (filename.endsWith("inverted.png")) continue;

                const regularPath = folder + "/" + filename;
                const invertedPath = regularPath + "_inverted.png";
                const image = await Jimp.read(regularPath); 
                await image.invert().greyscale().brightness(-0.3).contrast(0.5).writeAsync(invertedPath);

                console.log("Start")
                await readPaths(filename, regularPath, invertedPath);
                console.log("Done")
            }
        });

        document.getElementById('ocr-test-lib').addEventListener("click", async () => {
            const folder = document.getElementById('ocr-test-input-folder').value;

            await Ocr.readGearInFolder(folder);
            // Ocr.test(folder);
        });

//RESIZE_BICUBIC wins
        document.getElementById('ocr-test-debug1').addEventListener("click", async () => {
            const path = document.getElementById('ocr-test-input-url').value;

            Ocr.readGearFile(path);
            // const Jimp = require('jimp')
            // const path = document.getElementById('ocr-test-input-url').value;
            // const outPath = path + "test.png";

            // const image = await Jimp.read(path); 
            // const clone = image.clone();
            // clone.crop(20, 180, 400, 600)

            // const substatNumberClone = clone.clone();
            // substatNumberClone.crop(300-20, 450-180, 85, 130)
            //         .resize(Jimp.AUTO, 130*4)
            //         .resize(200, Jimp.AUTO, Jimp.RESIZE_BICUBIC)
            //         .resize(100, Jimp.AUTO, Jimp.RESIZE_BICUBIC)
            //         .invert()
            //         .greyscale();

            // const testImage = substatNumberClone;
            // await testImage.writeAsync(outPath);

            // const data = await testImage.getBufferAsync('image/png');

            // // document.getElementById('ocr-test-crop').src = outPath;
            // const text = await Ocr.workerDebug(data);

            // const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            // await image.print(font, 65+120, 214, text.data.text).writeAsync(outPath+"x.png");
            // document.getElementById('ocr-test-crop').src = outPath+"x.png";
            // console.log("Done");
        });
    }
}



async function readPath(path, left, top, width, height) {
    drawDebugImage(path, left, top, width, height);
    const rectangle = { left, top, width, height };
    const { data: { text } } = await worker.recognize(path, { rectangle });
    console.log(text);
    return text;
}

var NUMBERS = 1;
var TEXT = 2;
var ENHANCE = 3;

async function readPathRectangle(path, rectangle, numbersOrLetters) {
    if (numbersOrLetters == NUMBERS) {
        await setNumbers();
    } else if (numbersOrLetters == ENHANCE) {
        await setEnhance();
    } else {
        await setText();
    }

    // drawDebugImage(path, left, top, width, height);
    // const rectangle = { left, top, width, height };
    const { data: { text } } = await worker.recognize(path, { rectangle });
    console.log(text);
    return text;
}

async function drawDebugImage(path, left, top, width, height) {
    document.getElementById('ocr-test-input-left').value = left;
    document.getElementById('ocr-test-input-top').value = top;
    document.getElementById('ocr-test-input-width').value = width;
    document.getElementById('ocr-test-input-height').value = height;

    document.getElementById('ocr-test-crop').src = path
    document.getElementById('ocr-test-crop').style = 
    `  position: absolute;
       clip: rect(${top}px, ${width+left}px, ${top+height}px, ${left}px);
    `;
}

async function drawDebugRectangle(path, rectangle) {
    drawDebugImage(path, rectangle.left, rectangle.top, rectangle.width, rectangle.height)
}

async function read(left, top, width, height) {
    var path = document.getElementById('ocr-test-input-url').value;

    document.getElementById('ocr-test-input-left').value = left;
    document.getElementById('ocr-test-input-top').value = top;
    document.getElementById('ocr-test-input-width').value = width;
    document.getElementById('ocr-test-input-height').value = height;

    document.getElementById('ocr-test-crop').src = path
    document.getElementById('ocr-test-crop').style = 
    `  position: absolute;
       clip: rect(${top}px, ${width+left}px, ${top+height}px, ${left}px);
    `;

    const rectangle = { left: parseInt(left), top: parseInt(top), width: parseInt(width), height: parseInt(height) };
    const { data: { text } } = await worker.recognize(path, { rectangle });
    console.log(text);
    return text;
}

async function setNumbers() {
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789%',
        tessedit_pageseg_mode: PSM.PSM_SINGLE_LINE,
    });
}
async function setText() {
    await worker.setParameters({
        tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        tessedit_pageseg_mode: PSM.PSM_SINGLE_LINE,
    });
}
async function setEnhance() {
    await worker.setParameters({
        tessedit_char_whitelist: '0123456789+',
        tessedit_pageseg_mode: PSM.PSM_SINGLE_WORD,
    });
}