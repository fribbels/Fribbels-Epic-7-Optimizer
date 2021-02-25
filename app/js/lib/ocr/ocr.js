const OcrFixer = require('./ocrFixer');
const OcrConverter = require('./ocrConverter');
const Jimp = require('jimp');

function handleError(error) {
    Notifier.error("OCR error " + error);
    console.error(error);
}

const options = {
    langPath: Path.resolve(__dirname, '../../../tessdata/') ,
    cacheMethod: 'none',
    workerBlobURL: false,
    errorHandler: handleError
};

// setLogging(true);

// var textWorker = createWorker(options);
// var numberWorker = createWorker(options);
// var enhanceWorker = createWorker(options);

// var textScheduler = createScheduler();
// var numberScheduler = createScheduler();
// var enhanceScheduler = createScheduler();

function terminate(obj) {
    if (obj) obj.terminate();
}

async function setupWorkers() {
    // return new Promise((resolve, reject) => {
    //     terminate(textWorker)
    //     terminate(numberWorker)
    //     terminate(enhanceWorker)

    //     terminate(textScheduler)
    //     terminate(numberScheduler)
    //     terminate(enhanceScheduler)

    //     textWorker = createWorker(options);
    //     numberWorker = createWorker(options);
    //     enhanceWorker = createWorker(options);

    //     textScheduler = createScheduler();
    //     numberScheduler = createScheduler();
    //     enhanceScheduler = createScheduler();

    //     console.log("Loading workers..");
    //     loadWorkers().then(x => {
    //         console.log("Loading languages..");
    //         loadLanguages().then(x => {
    //             console.log("Initializing..");
    //             initialize().then(x => {
    //                 console.log("Setting parameters..");
    //                 setParameters().then(x => {
    //                     console.log("Done loading workers");
    //                     textScheduler.addWorker(textWorker);
    //                     numberScheduler.addWorker(numberWorker);
    //                     enhanceScheduler.addWorker(enhanceWorker);

    //                     resolve();
    //                 })
    //             })
    //         })
    //     })
    // })
}

function loadWorkers() {
    const promises = [
        textWorker.load(),
        numberWorker.load(),
        enhanceWorker.load(),
    ]
    return Promise.all(promises);
}

function loadLanguages() {
    const promises = [
        textWorker.loadLanguage(),
        numberWorker.loadLanguage(),
        enhanceWorker.loadLanguage(),
    ]
    return Promise.all(promises);
}

function initialize() {
    const promises = [
        textWorker.initialize(),
        numberWorker.initialize(),
        enhanceWorker.initialize(),
    ]
    return Promise.all(promises);
}

// const NUMBER_PARAMETERS = {
//     tessedit_char_whitelist: '0123456789%',
//     tessedit_pageseg_mode: PSM.PSM_SINGLE_BLOCK,
// };
// const TEXT_PARAMETERS = {
//     tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
//     tessedit_pageseg_mode: PSM.PSM_SINGLE_BLOCK,
// };
// const ENHANCE_PARAMETERS = {
//     tessedit_char_whitelist: '0123456789+',
//     tessedit_pageseg_mode: PSM.PSM_SINGLE_BLOCK,
// };

function setParameters() {
    const promises = [
        textWorker.setParameters(TEXT_PARAMETERS),
        numberWorker.setParameters(NUMBER_PARAMETERS),
        enhanceWorker.setParameters(ENHANCE_PARAMETERS),
    ]
    return Promise.all(promises);
}

function splitByFirstNumber(str) {
    const index = str.search(/\d/);
    return [
        str.substring(0, index),
        str.substring(index)
    ]
}

module.exports = {
    workerDebug: async (filename) => {
        return await numberWorker.recognize(filename);
    },

    readGearFile: async (filename) => {
        const image = await Jimp.read(filename);
        const c = image.getPixelColor(88, 162); // returns the colour of that pixel e.g. 0xFFFFFFFF
        var shifted = false;
        if (c < 260) {
            shifted = true;
        }

        const clone = image.clone();


        clone.crop(50, 400, 350, 200);
        clone
                .resize(Jimp.AUTO, 800, Jimp.RESIZE_BICUBIC)
                .brightness(-0.4) // darken
                .greyscale()
                .invert()
                .brightness(-0.4) // darken
                .contrast(0.4) // make sharper
                .brightness(0.2) // lighter
                .contrast(0.4) // make sharper

        await clone.writeAsync(filename + "debugSubstats.png");


        // image.crop(0, 0, 400, 600);
        image.crop(50, 150, 150, 100);
        image
                .brightness(-0.3) // lighten
                .contrast(0.8) // make sharper
                .brightness(-0.3) // lighten
                .contrast(0.2) // make sharper
                .greyscale()
                // .brightness(0.2)
                .invert()
                // .brightness();
        await image.writeAsync(filename + "debugLevel.png");

        const response = await Api.ocr(filename);

        console.log("response", response)

        // TITLE
        const titleArr = response.title.split('↵').filter(x => x.length > 0);
        const gearAndRank = titleArr[0];
        const name = titleArr.slice(1).join(' ');

        // // HERO
        // const hero = response.hero.split('↵').filter(x => x.length > 0)[0];

        // Set
        const set = response.set.split('↵').filter(x => x.length > 0)[0];
        const response2 = await Api.ocr2(filename, shifted);

        // ENHANCE
        const enhance = response2.enhance.split('↵').filter(x => x.length > 0)[0]

        // LEVEL
        const level = response2.level.split('↵').filter(x => x.length > 0)[0];

        // MAIN
        const split = splitByFirstNumber(response.main);
        const mainStatText = split[0];
        const mainStatNumbers = split[1];

        // SUBSTATS
        // console.log("substats", response.substats);
        // const subStatArr = response.substats.split('\n').filter(x => x.length > 0);
        // console.log("subStatArr", subStatArr);
        // const splitSubStatArr = subStatArr.map(x => splitByFirstNumber(x))
        // console.log("splitSubStatArr", splitSubStatArr);
        const subStatText = response2.substatsText.split('\n').filter(x => x.length > 0);
        const subStatNumbers = response2.substatsNumbers.split('\n').filter(x => x.length > 0);

        const values = {
            gearText:        gearAndRank,
            mainStatText:    mainStatText,
            subStatText:     subStatText,
            setText:         set,
            subStatNumbers:  subStatNumbers,
            mainStatNumbers: mainStatNumbers,
            levelNumbers:    level || "0",
            enhanceNumbers:  enhance || "0",
            // hero: hero
        };

        console.log("values", values);
        const fixed = OcrFixer.fixOcr(values);
        const converted = OcrConverter.convertOcr(fixed);

        console.log("DONE" + JSON.stringify(converted));
        return converted;
    },

    readGearFiles: async (filenames) => {
        const testEnabled = false;
        console.log(filenames)
        const gear = [];
        var count = 1;

        var length = filenames.filter(x => !x.includes('debug'))
                              .filter(x => !x.includes('.DS_Store')).length;
        var failed = [];

        for (var filename of filenames) {
            try {
                $('#exportOutputText').val("Reading screenshots in progress...\nSucceeded: " + gear.length + " / " + length + "\nFailed: " + failed.length + " / " + length)

                if (filename.includes("inverted") || filename.includes("debug") || filename.includes(".DS_Store")) {
                    await fs.unlink(filename, err => {if (err) console.log(err)})
                    continue;
                }

                console.log("COUNT", count);
                count++;

                if (count % 100 == 0) {
                    console.log("REINITIALIZE BEGIN")
                    await setupWorkers();
                    console.log("REINITIALIZE END")
                }

                const converted = await module.exports.readGearFile(filename);
                gear.push(converted);
                console.log(gear.length + " / " + length);

                const pathSteps = filename.split("\\");
                const details = `TEST ${converted.level} ${converted.enhance} ${converted.rank} ${converted.gear} ${converted.set} --- ${converted.main.type} ${converted.main.value} --- ${converted.substats.map(x => "" + x.type + " " + x.value).join(" ")}`;
                pathSteps[pathSteps.length-1] = details + ".png";
                const newFilename = pathSteps.join("\\");

                if (testEnabled && filename.includes("TEST")) {
                    const parts = filename.split(".png")[0].split("---")

                    const gearData = parts[0].split(" ");
                    const parsedLevel = gearData[1];
                    const parsedEnhance = gearData[2];
                    const parsedRank = gearData[3];
                    const parsedGear = gearData[4];
                    const parsedSet = gearData[5];

                    const mainData = parts[1].split(" ");
                    const parsedMainType = mainData[1]
                    const parsedMainValue = parseInt(mainData[2])


                    const subData = parts[2].split(" ").filter(x => x.length > 0);
                    const parsedSubstats = [];
                    for (var i = 0; i < subData.length; i += 2) {
                        parsedSubstats.push({
                            type: subData[i],
                            value: parseInt(subData[i+1])
                        })
                    }

                    if (parsedLevel != converted.level
                    ||  parsedEnhance != converted.enhance
                    ||  parsedRank != converted.rank
                    ||  parsedGear != converted.gear
                    ||  parsedSet != converted.set
                    ||  parsedMainType != converted.main.type
                    ||  parsedMainValue != converted.main.value
                    ||  parsedSubstats.length != converted.substats.length) {
                        console.log(parsedLevel, parsedEnhance, parsedRank, parsedGear, parsedSet, parsedMainType, parsedMainValue, parsedSubstats)
                        throw 'INVALID main data ' + filename;
                    }

                    for (var i = 0; i < converted.substats.length; i++) {
                        const substat = converted.substats[i];
                        if (parsedSubstats[i].type != substat.type || parsedSubstats[i].value != substat.value) {
                            console.log(substat);
                            console.log(parsedSubstats[i]);
                            throw 'INVALID sub data ' + filename;
                        }
                    }
                }

            // fs.rename(filename, newFilename, function(err) {
            //     if ( err ) console.log('ERROR: ' + err);
            // });
            } catch (e) {
                console.error(e);
                Notifier.error("Failed to read a screenshot: " + e);
                failed.push(filename);
            }
        }

        return {
            items: gear,
            failed: failed
        };
    },

    readGearFiles2: async (filenames) => {
        console.log(filenames)

        const gear = [];

        for (var filename of filenames) {
            if (filename.endsWith("inverted.png")) continue;

            // Save inverted image
            const regularPath = filename;
            const invertedPath = regularPath + "_inverted.png";
            const image = await Jimp.read(regularPath);
            await image.invert().greyscale().brightness(-0.3).contrast(0.5).writeAsync(invertedPath);

            console.log("Start reading gear")
            const results = await readPaths(filename, regularPath, invertedPath);
            console.log("Done reading gear, results:");
            const values = {
                gearText:        results[0].data.text,
                mainStatText:    results[1].data.text,
                subStatText:     results[2].data.text,
                setText:         results[3].data.text,
                subStatNumbers:  results[4].data.text,
                mainStatNumbers: results[5].data.text,
                levelNumbers:    results[6].data.text,
                enhanceNumbers:  results[7].data.text,
            };
            console.log(values);
            const fixed = OcrFixer.fixOcr(values);
            const converted = OcrConverter.convertOcr(fixed);
            // console.log(JSON.stringify(fixed, null, 2));
            console.log(converted);
            gear.push(converted);
        }

        console.log("Read all gear in folder", gear);
        return gear;
    },

    readGearInFolder: async (folder) => {
        const filenames = Files.listFilesInFolder(folder);
        const fullFilenames = filenames.map(x => folder + "/" + x);

        return module.exports.readGearFiles(fullFilenames);
    }
}

async function readPaths(filename, regularPath, invertedPath) {
    return Promise.all([
        textScheduler.addJob('recognize', invertedPath, { rectangle: gearTextRectangle }),
        textScheduler.addJob('recognize', invertedPath, { rectangle: mainstatTextRectangle }),
        textScheduler.addJob('recognize', invertedPath, { rectangle: substatTextRectangle }),
        textScheduler.addJob('recognize', invertedPath, { rectangle: setTextRectangle }),
        numberScheduler.addJob('recognize', invertedPath, { rectangle: substatNumberRectangle }),
        numberScheduler.addJob('recognize', invertedPath, { rectangle: mainstatNumberRectangle }),
        enhanceScheduler.addJob('recognize', regularPath, { rectangle: levelNumberRectangle }),
        enhanceScheduler.addJob('recognize', regularPath, { rectangle: enhanceNumberRectangle }),
    ]);
}

const substatNumberRectangle = {
    left:   300-20,
    top:    450-180,
    width:  85,
    height: 130,
};
const substatTextRectangle = {
    left:   50-20,
    top:    450-180,
    width:  250,
    height: 140,
};
const mainstatNumberRectangle = {
    left:   302-20,
    top:    380-180,
    width:  100,
    height: 45,
};
const mainstatTextRectangle = {
    left:   85-20,
    top:    380-180,
    width:  217,
    height: 45,
};
const gearTextRectangle = {
    left:   178-20,
    top:    190-180,
    width:  235,
    height: 160,
};
const setTextRectangle = {
    left:   100-20,
    top:    605-180,
    width:  300,
    height: 50,
};
const levelNumberRectangle = {
    left:   65-20,
    top:    214-180,
    width:  25,
    height: 18,
};
const enhanceNumberRectangle = { // Filter "1 " = "+"
    left:   140-20,
    top:    206-180,
    width:  31,
    height: 16,
};
