const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();

const defaultPath = Files.isMac() ?
                    (Files.getDataPath() + "/saves/").replace(/\//g, "/") :
                    (Files.getDataPath() + "/saves/").replace(/\//g, "\\");

module.exports = {

    autoSave: async () => {
        module.exports.saveData(defaultPath + 'autosave.json');
    },

    saveData: async (filename) => {
        const getAllHeroesResponse = await Api.getAllHeroes();
        const getAllItemsResponse = await Api.getAllItems();

        const data = {
            heroes: getAllHeroesResponse.heroes,
            items: getAllItemsResponse.items
        }

        const stringified = JSON.stringify(data);
        Files.saveFile(filename, stringified);
        return data;
    },

    loadAutoSave: async () => {
        const autoSavePath = defaultPath + 'autosave.json';

        try {
            const data = await Files.readFile(autoSavePath);
            module.exports.loadSavedData(JSON.parse(data));
            console.log(JSON.parse(data));
        } catch (e) {
            console.error("Failed to load autosave -", e);
        }
    },

    initialize: async () => {
        document.getElementById('saveDataSubmit').addEventListener("click", async () => {
            const options = {
                title: "Save file",
                defaultPath : defaultPath + 'export.json',
                buttonLabel : "Save file",
                filters :[
                    {name: 'JSON', extensions: ['json']},
                ]
            }
            const filename = dialog.showSaveDialogSync(currentWindow, options);
            console.log(filename);

            if (!filename) return;

            const data = await module.exports.saveData(filename);
            await module.exports.autoSave();
            console.log("DATA", data);
            $('#saveDataSubmitOutputText').text(`Saved ${data.heroes.length} heroes and ${data.items.length} items to ${filename}`)
        });

        document.getElementById('loadDataSubmit').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : defaultPath,
                buttonLabel : "Load file",
                filters :[
                    {name: 'JSON', extensions: ['json']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.error("Invalid filename")
            };

            const data = await Files.readFile(filenames[0]);
            const parsedData = JSON.parse(data);
            module.exports.loadSavedData(parsedData);
            console.log(parsedData);

            $('#loadDataSubmitOutputText').text(`Loaded ${parsedData.heroes.length} heroes and ${parsedData.items.length} items from ${filenames[0]}`)
        })
    },

    loadSavedData: async (data) => {
        if (!data || !data.items || !data.heroes) {
            return console.error("Invalid data", data);
        }

        console.warn(data.items)
        console.warn(data.heroes)

        await Api.setItems(data.items);
        await Api.setHeroes(data.heroes);


        OptimizerTab.redrawHeroSelector();
        HeroesTab.redraw();
    },

    saveCurrentData: () => {
    },
}