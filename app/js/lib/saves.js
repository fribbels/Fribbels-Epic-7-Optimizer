const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();

const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '\\FribbelsOptimizerSaves\\';

// const defaultPath = Files.isMac() ?
//                     (Files.getDataPath() + "/saves/").replace(/\//g, "/") :
//                     (Files.getDataPath() + "/saves/").replace(/\//g, "\\");
const defaultPath = Files.isMac() ?
                    savesFolder.replace(/\//g, "/") :
                    savesFolder.replace(/\//g, "/");

module.exports = {

    createFolder: () => {
        Files.createFolder(savesFolder);
    },

    autoSave: async () => {
        module.exports.createFolder();
        module.exports.saveData(defaultPath + 'autosave.json');
    },

    saveData: async (filename) => {
        module.exports.createFolder();
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
            // Notifier.error("Failed to load autosave - " + e);
            console.error("Failed to load autosave -", e);
        }
    },

    initialize: async () => {
        module.exports.createFolder();

        document.getElementById('saveDataSubmit').addEventListener("click", async () => {
            const options = {
                title: "Save file",
                defaultPath : defaultPath + getDateString() + '-export.json',
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
            await module.exports.loadSavedData(parsedData);
            console.log(parsedData);

            $('#loadDataSubmitOutputText').text(`Loaded ${parsedData.heroes.length} heroes and ${parsedData.items.length} items from ${filenames[0]}`)
            module.exports.autoSave();

        })
    },

    loadSavedData: async (data) => {
        if (!data || !data.items || !data.heroes) {
            Notifier.error("Invalid save data");
            return console.error("Invalid data", data);
        }

        data.items.forEach(x => Reforge.getReforgeStats(x))

        console.log("Saved items", data.items)
        console.log("Saved heroes", data.heroes)

        await Api.setItems(data.items);
        await Api.setHeroes(data.heroes);

        OptimizerTab.redrawHeroSelector();
        HeroesTab.redraw();
    },

    saveCurrentData: () => {
    },
}

function getDateString() {
    const now = new Date();
    const dateString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
    return dateString;
}