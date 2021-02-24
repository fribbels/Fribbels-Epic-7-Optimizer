const fs = require('fs');
const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();

const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '/FribbelsOptimizerSaves';

const defaultPath = savesFolder;

module.exports = {

    addEventListener: () => {

        document.getElementById('loadIngameGearStart').addEventListener("click", async () => {
            Scanner.start();
        });

        document.getElementById('loadIngameGearEnd').addEventListener("click", async () => {
            Scanner.end();
        });

        document.getElementById('fileReadSubmit').addEventListener("click", async () => {
            const options = {
                title: "Open folder",
                defaultPath : Files.path(Settings.getDefaultPath() + 'gear.txt'),
                buttonLabel : "Open folder",
                properties: ['openDirectory'],
                // filters :[
                //     {name: 'TEXT', extensions: ['txt']},
                // ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];
            const filesInFolder = Files.listFilesInFolder(Files.path(path));
            const fullFilenames = filesInFolder.filter(x => !x.includes('debug'))
                                               .map(x => path + "/" + x);

            console.log("FILENAMES", fullFilenames);

            $('#fileReadSubmitOutputText').text(`Reading data from ${fullFilenames.length} screenshots..`)

            Ocr.readGearFiles(fullFilenames).then((data) => {
                const items = data.items;
                const failed = data.failed;

                Notifier.success("Finished reading screenshots");
                $('#fileReadSubmitOutputText').html(`Finished reading ${fullFilenames.length} screenshots. \n${items.length} screenshots succeded, ${failed.length} failed. ${failed.length > 0 ? "Failed files are:<br>" + failed.join("<br>") : ""} `)

                console.log("SERIALIZING");
                var serializedStr = "{\"items\":" + ItemSerializer.serialize(items) + "}";

                document.getElementById('exportOutputText').value = serializedStr;
            }).catch(e => {
                console.error(e)
                Dialog.error("Error occurred while reading screenshots\n" + e);
            });
        });


        document.getElementById('saveExportOutput').addEventListener("click", async () => {
            const output = document.getElementById('exportOutputText').value;

            if (!output || output.length == 0) {
                Notifier.error("Nothing to export yet, please select a folder");
                return;
            }

            if (output.includes('Reading screenshots in progress...')) {
                Notifier.error("Screenshot reading in progress, please wait");
                return;
            }

            const options = {
                title: "Save file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Save file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filename = dialog.showSaveDialogSync(currentWindow, options);
            if (!filename) return;

            fs.writeFile(Files.path(filename), output, (err) => {
                if (err) {
                    console.error(err)
                    Notifier.error("Unable to write file " + filename + " - " + err);
                    return;
                }
                console.log('Exported gear.txt');
                $('#screenshotExportOutputText').text(`Exported data to ${filename}`)
            });
        });

        document.getElementById('saveLoadFromGameExportOutput').addEventListener("click", async () => {
            const output = document.getElementById('loadFromGameExportOutputText').value;

            if (!output || output.length == 0) {
                Notifier.error("Nothing to export yet, please follow the steps to import gear");
                return;
            }

            if (output.includes('Started scanning') || output.includes('Reading items')) {
                Notifier.error("Item reading in progress, please wait");
                return;
            }

            const options = {
                title: "Save file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Save file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filename = dialog.showSaveDialogSync(currentWindow, options);
            if (!filename) return;

            fs.writeFile(Files.path(filename), output, (err) => {
                if (err) {
                    console.error(err)
                    Notifier.error("Unable to write file " + filename + " - " + err);
                    return;
                }
                console.log('Exported gear.txt');
                $('#loadFromGameExportOutputText').text(`Exported data to ${filename}`)
            });
        });

        document.getElementById('importFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT/JSON', extensions: ['txt', 'json']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];

            fs.readFile(Files.path(path), 'utf8', async function read(err, data) {
                if (err) {
                    throw err;
                }

                $('#importOutputText').text('Parsing data..')

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes;
                // const deserializedData = ItemSerializer.deserialize(data);
                // const items = deserializedData.items;
                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                await Api.setItems(items);
                await Api.setHeroes([]);

                $('#importOutputText').text(`Imported ${items.length} items from ${path}`)
            });
        })

        document.getElementById('importAppendFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT/JSON', extensions: ['txt', 'json']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];

            fs.readFile(Files.path(path), 'utf8', async function read(err, data) {
                if (err) {
                    throw err;
                }

                $('#importAppendOutputText').text('Parsing data..')

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes;
                // const deserializedData = ItemSerializer.deserialize(data);
                // const items = deserializedData.items;
                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                await Api.addItems(items);

                $('#importAppendOutputText').text(`Appended ${items.length} items from ${path}`)
            });
        })


        document.getElementById('importMergeFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT/JSON', extensions: ['txt', 'json']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];

            fs.readFile(Files.path(path), 'utf8', async function read(err, data) {
                if (err) {
                    throw err;
                }

                $('#importMergeOutputText').text('Parsing data..')

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes;
                // const deserializedData = ItemSerializer.deserialize(data);
                // const items = deserializedData.items;
                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                await Api.mergeItems(items);

                $('#importMergeOutputText').text(`Merged ${items.length} items from ${path}`)
            });
        })

        document.getElementById('importZarrocSaveFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                // defaultPath : defaultPath,
                buttonLabel : "Load file",
                filters :[
                    {name: 'JSON', extensions: ['json']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const data = await Files.readFile(filenames[0]);

            const parsedData = JSON.parse(data);
            console.log("PARSEDDATA", parsedData);
            var items = parsedData.items || [];
            var heroes = parsedData.heroes || [];
            // const deserializedData = ItemSerializer.deserialize(data);
            // const items = deserializedData.items;
            console.log("ITEMS", items);

            items = items.map(item => ZarrocConverter.reverseConvertItem(item))
            heroes = heroes.map(hero => ZarrocConverter.reverseConvertHero(hero))
            console.log("CONVERTEDITEMS", items);
            console.log("CONVERTEDHEROES", heroes);
            ItemAugmenter.augment(items);

            ZarrocConverter.attachItemsToHeroes(items, heroes);
            await Api.setItems(items);
            await Api.setHeroes(heroes);

            HeroesTab.redrawHeroInputSelector();

            $('#importZarrocSaveFileSelectOutputText').text(`Loaded ${heroes.length} heroes and ${items.length} items from ${filenames[0]}`)
        })
    }
}