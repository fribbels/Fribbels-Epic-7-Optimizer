const fs = require('fs');
const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();

const defaultPath = (Files.getDataPath() + "/saves/").replace(/\//g, "\\");

module.exports = {
    addDebugFile: () => {
        // const path = Path.resolve(__dirname, '../../../resources/saves/gear.txt');

        // fs.readFile(path, 'utf8', async function read(err, data) {
        //     if (err) {
        //         throw err;
        //     }

        //     const deserializedData = JSON.parse(data);
        //     const items = deserializedData.items;
        //     // const items = ItemSerializer.deserialize(data.items);
        //     ItemAugmenter.augmentStats(items);

        //     await Api.setItems(items);
        //     ItemsGrid.redraw();

            // Test Zarroc
            // const testConverterItems = items.map(x => ZarrocConverter.convertItem(x));
            // console.log("CONVERTED", testConverterItems);
            // console.log(JSON.stringify(testConverterItems));
        // });
    },

    addEventListener: () => {
        document.getElementById('fileReadSubmit').addEventListener("click", async () => {
            // const fullFilenames = [];
            // document.getElementById('fileFolderSelect').files.forEach(x => fullFilenames.push(x.path));

            // const items = await Ocr.readGearFiles(fullFilenames);
            // console.log("SERIALIZING");
            // var serializedStr = ItemSerializer.serialize(items);
            // console.log("DESERIALIZING");
            // var deserializedItems = ItemSerializer.deserialize(serializedStr); // maybe this causing memory issues?

            // // console.log(serializedStr);
            // // console.log(deserializedItems);

            // document.getElementById('exportOutputText').value = serializedStr;
            const fullFilenames = [];
            document.getElementById('fileFolderSelect').files.forEach(x => fullFilenames.push(x.path));

            Ocr.readGearFiles(fullFilenames).then((items) => {
                console.log("SERIALIZING");
                var serializedStr = "{\"items\":" + ItemSerializer.serialize(items) + "}";
                // console.log("DESERIALIZING");
                // var deserializedItems = {
                //     items: ItemSerializer.deserialize(serializedStr); // maybe this causing memory issues?
                // };

                // console.log(serializedStr);
                // console.log(deserializedItems);

                document.getElementById('exportOutputText').value = serializedStr;
            }).catch(e => console.log(e));
        });

        document.getElementById('saveExportOutput').addEventListener("click", async () => {
            const output = document.getElementById('exportOutputText').value;
            console.error('defaultPath', defaultPath + 'gear.txt')
            const options = {
                title: "Save file",
                defaultPath : defaultPath + 'gear.txt',
                buttonLabel : "Save file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filename = dialog.showSaveDialogSync(currentWindow, options);
            if (!filename) return;

            fs.writeFile(filename, output, (err) => {
                if (err) 
                    return console.log(err);
                console.log('Exported gear.txt');
                document.getElementById('exportOutputText').value = `Exported data to ${filename}`;
            });
        });

        

        document.getElementById('importFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : defaultPath + 'gear.txt',
                buttonLabel : "Load file",
                // filters :[
                //     {name: 'JSON', extensions: ['json']},
                // ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.error("Invalid filename")
            };

            const path = filenames[0];

            fs.readFile(path, 'utf8', async function read(err, data) {
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
                ItemAugmenter.augmentStats(items);

                // Db.setItems(items);
                await Api.setItems(items);
                await Api.setHeroes(heroes);

                $('#importOutputText').text('Done')
            });
        })


        // document.getElementById('importFileSubmit').addEventListener("click", async () => {
        //     const files = document.getElementById('importFileSelect').files;
        //     if (files.length == 0) return;

        //     const path = files[0].path;

        //     fs.readFile(path, 'utf8', async function read(err, data) {
        //         if (err) {
        //             throw err;
        //         }

        //         const parsedData = JSON.parse(data);
        //         console.log("PARSEDDATA", parsedData);
        //         const items = parsedData.items;
        //         const heroes = parsedData.heroes;
        //         // const deserializedData = ItemSerializer.deserialize(data);
        //         // const items = deserializedData.items;
        //         console.log("ITEMS", items);
        //         ItemAugmenter.augmentStats(items);

        //         // Db.setItems(items);
        //         await Api.setItems(items);
        //         await Api.setHeroes(heroes);
        //     });
        // });

        document.getElementById('importZarrocFileSubmit').addEventListener("click", async () => {
            console.log('zarroc clicked')
            const files = document.getElementById('importZarrocFileSelect').files;
            if (files.length == 0) return;

            const path = files[0].path;

            fs.readFile(path, 'utf8', async function read(err, data) {
                if (err) {
                    throw err;
                }

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                var items = parsedData.items;
                // const deserializedData = ItemSerializer.deserialize(data);
                // const items = deserializedData.items;
                console.log("ITEMS", items);

                items = items.map(item => ZarrocConverter.reverseConvertItem(item))
                console.log("CONVERTEDITEMS", items);
                ItemAugmenter.augmentStats(items);

                // Db.setItems(items);
                await Api.setItems(items);
                await Api.setHeroes([]);
            });
        });
    }
}