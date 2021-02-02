const { remote } = require('electron')

const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '\\FribbelsOptimizerSaves\\';

const defaultPath = Files.isMac() ?
                    savesFolder.replace(/\//g, "/") :
                    savesFolder.replace(/\//g, "/");

const settingsPath = defaultPath + "/settings.ini";

module.exports = {
    initialize: () => {
        module.exports.loadSettings();

        const settingsIds = [
            'settingUnlockOnUnequip',
            'settingMaxResults',
            'settingRageSet'
        ];

        for (var id of settingsIds) {
            document.getElementById(id).addEventListener('change', (event) => {
                module.exports.saveSettings();
            });
        }
    },

    getDefaultSettings: () => {
        return {
            settingUnlockOnUnequip: false,
            settingRageSet: true,
            settingMaxResults: 5_000_000
        }
    },

    loadSettings: async () => {
        console.log("LOAD SETTINGS");
        const text = await Files.readFile(settingsPath);
        const settings = JSON.parse(text);

        document.getElementById('settingUnlockOnUnequip').checked = settings.settingUnlockOnUnequip;
        document.getElementById('settingRageSet').checked = settings.settingRageSet;

        if (settings.settingMaxResults) {
            document.getElementById('settingMaxResults').value = settings.settingMaxResults;
        }

        Api.setSettings(settings);
    },

    saveSettings: async () => {
        console.log("SAVE SETTINGS");
        const settings = {
            settingUnlockOnUnequip: document.getElementById('settingUnlockOnUnequip').checked,
            settingRageSet: document.getElementById('settingRageSet').checked,
            settingMaxResults: parseInt(document.getElementById('settingMaxResults').value || 5_000_000)
        };

        Files.saveFile(settingsPath, JSON.stringify(settings, null, 2))
        Api.setSettings(settings);
    },
}