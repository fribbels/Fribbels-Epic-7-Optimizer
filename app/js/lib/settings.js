const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();
const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '/FribbelsOptimizerSaves';

const defaultPath = savesFolder;

const settingsPath = defaultPath + "/settings.ini";
var pathOverride;

var excludeSelects = [];

module.exports = {
    initialize: () => {
        module.exports.loadSettings();

        const settingsIds = [
            'settingUnlockOnUnequip',
            'settingMaxResults',
            'settingRageSet',
        ];

        $('#optionsExcludeGearFrom').change(module.exports.saveSettings)
        $('#darkSlider').change(module.exports.saveSettings)


        for (var id of settingsIds) {
            document.getElementById(id).addEventListener('change', (event) => {
                module.exports.saveSettings();
            });
        }

        document.getElementById('selectDefaultFolderSubmit').addEventListener("click", async () => {
            const options = {
                title: "Open folder",
                defaultPath : module.exports.getDefaultPath(),
                buttonLabel : "Open folder",
                properties: ['openDirectory'],
            }

            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = Files.path(filenames[0]);
            pathOverride = path;
            module.exports.saveSettings();
            $('#selectDefaultFolderSubmitOutputText').text(`New saves folder: ${path}`);

            Notifier.info(path);
        });
    },

    getDefaultPath: () => {
        return Files.path(pathOverride || defaultPath);
    },

    getExcludeSelects: () => {
        return excludeSelects;
    },

    getDefaultSettings: () => {
        return {
            settingUnlockOnUnequip: true,
            settingRageSet: true,
            settingMaxResults: 5_000_000,
            settingDefaultPath: defaultPath,
            settingExcludeEquipped: [],
            settingDarkMode: false,
        }
    },

    loadSettings: async () => {
        console.log("LOAD SETTINGS", settingsPath);
        const text = await Files.readFile(Files.path(settingsPath));
        const settings = JSON.parse(text);
        console.log("LOADING SETTINGS", settings);


        document.getElementById('settingUnlockOnUnequip').checked = settings.settingUnlockOnUnequip;
        document.getElementById('settingRageSet').checked = settings.settingRageSet;
        pathOverride = settings.settingDefaultPath;

        if (settings.settingMaxResults) {
            document.getElementById('settingMaxResults').value = settings.settingMaxResults;
        }

        if (settings.settingDarkMode) {
            document.getElementById('darkSlider').checked = true;
            DarkMode.toggle();
        }

        if (settings.settingExcludeEquipped) {
            console.log("BEFORE", $('#optionsExcludeGearFrom').multipleSelect('getOptions'))
            console.log("BEFORE", $('#optionsExcludeGearFrom').multipleSelect('getSelects'))
            $('#optionsExcludeGearFrom').multipleSelect('setSelects', settings.settingExcludeEquipped)
            console.log("AFTER", $('#optionsExcludeGearFrom').multipleSelect('getSelects'))
            excludeSelects = settings.settingExcludeEquipped;
        }

        $('#selectDefaultFolderSubmitOutputText').text(settings.settingDefaultPath || defaultPath);
        Api.setSettings(settings);
    },

    saveSettings: async () => {
        console.log("SAVE SETTINGS");
        const settings = {
            settingUnlockOnUnequip: document.getElementById('settingUnlockOnUnequip').checked,
            settingRageSet: document.getElementById('settingRageSet').checked,
            settingMaxResults: parseInt(document.getElementById('settingMaxResults').value || 5_000_000),
            settingDefaultPath: pathOverride ? pathOverride : defaultPath,
            settingExcludeEquipped: $('#optionsExcludeGearFrom').multipleSelect('getSelects'),
            settingDarkMode: document.getElementById('darkSlider').checked,
        };

        excludeSelects = settings.settingExcludeEquipped;

        Files.saveFile(settingsPath, JSON.stringify(settings, null, 2))
        Api.setSettings(settings);
    },
}