const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();

const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '/FribbelsOptimizerSaves';

// const defaultPath = Files.isMac() ?
//                     (Files.getDataPath() + "/saves/").replace(/\//g, "/") :
//                     (Files.getDataPath() + "/saves/").replace(/\//g, "\\");
const defaultPath = savesFolder;

module.exports = {

    createFolder: () => {
        Files.createFolder(savesFolder);
    },

    autoSave: async () => {
        module.exports.createFolder();
        module.exports.saveData(Settings.getDefaultPath() + '/autosave.json');
    },

    saveData: async (filename) => {
        try {
            module.exports.createFolder();
            const getAllHeroesResponse = await Api.getAllHeroes();
            const getAllItemsResponse = await Api.getAllItems();

            const data = {
                heroes: getAllHeroesResponse.heroes,
                items: getAllItemsResponse.items
            }

            const stringified = JSON.stringify(data);
            Files.saveFile(Files.path(filename), stringified);

            return data;
        } catch (e) {
            Dialog.error("Unable to save file. Please try disabling your antivirus, or add the app as an exception, then restarting the app in admin mode.")
        }
    },

    loadAutoSave: async () => {
        const autoSavePath = Settings.getDefaultPath() + '/autosave.json';

        console.warn("Loading autosave: " + autoSavePath);

        try {
            const data = await Files.readFileSync(Files.path(autoSavePath));
            module.exports.loadSavedData(JSON.parse(data));
            console.log(JSON.parse(data));
        } catch (e) {
            // Notifier.error("Failed to load autosave - " + e);
            console.warn("Failed to load autosave -", e);
        }
    },

    initialize: async () => {
        module.exports.createFolder();

        document.getElementById('saveDataSubmit').addEventListener("click", async () => {
            const options = {
                title: "Save file",
                defaultPath : Files.path(Settings.getDefaultPath() + "/" + getDateString() + '-export.json'),
                buttonLabel : "Save file",
                filters :[
                    {name: 'JSON', extensions: ['json']},
                ]
            }
            const filename = dialog.showSaveDialogSync(currentWindow, options);
            console.log(filename);

            if (!filename) return;

            const data = await module.exports.saveData(Files.path(filename));
            await module.exports.autoSave();
            console.log("DATA", data);
            $('#saveDataSubmitOutputText').text(`Saved ${data.heroes.length} heroes and ${data.items.length} items to ${filename}`)
        });

        document.getElementById('loadDataSubmit').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath()),
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

            const data = await Files.readFileSync(filenames[0]);
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
            return console.error("Invalid loaded data", data);
        }

        ItemAugmenter.augment(data.items);

        console.log("Saved items", data.items)
        console.log("Saved heroes", data.heroes)

        await Api.setItems(data.items);
        await Api.setHeroes(data.heroes);

        const heroData = HeroData.getAllHeroData();
        const heroNames = Object.keys(heroData);

        // Remove bad overrides
        for (var hero of data.heroes) {
            if (!heroNames.includes(hero.name)) {
                await Api.removeHeroById(hero.id);
            }
        }

        OptimizerTab.redrawHeroSelector();
        HeroesTab.redraw();
    },
}

function getDateString() {
    const now = new Date();
    const dateString = new Date(now.getTime() - (now.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
    return dateString;
}