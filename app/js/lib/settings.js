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
    initialize: async () => {
        await module.exports.loadSettings();

        // Format numbers
        $("#settingMaxResults").on("keyup", function(event ) {
            // When user select text in the document, also abort.
            var selection = window.getSelection().toString();
            if (selection !== '') {
                return;
            }
            // When the arrow keys are pressed, abort.
            if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
                return;
            }
            var $this = $(this);
            // Get the value.
            var input = $this.val();
            input = input.replace(/[\D\s\._\-]+/g, "");
            input = input?parseInt(input, 10):0;
            $this.val(function () {
                return (input === 0)?"":input.toLocaleString("en-US");
            });
        });

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
            settingDarkMode: true,
        }
    },

    parseMaxResults: () => {
        var value = document.getElementById('settingMaxResults').value;
        value = value.replace(/,/g, "")

        return parseInt(value);
    },

    loadSettings: async () => {
        try {
            Saves.createFolder();
        } catch (e) {
            Notifier.error("Unable to create the Documents/FribbelsOptimizerSaves folder. Try disabling running the app as admin and disabling your virus scan");
            return;
        }

        console.log("LOAD SETTINGS", settingsPath);
        const text = await Files.readFileSync(Files.path(settingsPath));
        const settings = JSON.parse(text);
        console.log("LOADING SETTINGS", settings);


        document.getElementById('settingUnlockOnUnequip').checked = settings.settingUnlockOnUnequip;
        document.getElementById('settingRageSet').checked = settings.settingRageSet;
        pathOverride = settings.settingDefaultPath;

        console.warn("changing path override to: " + pathOverride);

        if (settings.settingMaxResults) {
            document.getElementById('settingMaxResults').value = settings.settingMaxResults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

        const currentVersion = Updater.getCurrentVersion();
        if (settings.settingVersion) {
            if (currentVersion != settings.settingVersion) {

                Updater.showNewFeatures(currentVersion);
                module.exports.saveSettings();
            }
        } else {
            Updater.showNewFeatures(currentVersion);
            module.exports.saveSettings();
        }

        $('#selectDefaultFolderSubmitOutputText').text(settings.settingDefaultPath || defaultPath);
        Api.setSettings(settings);
    },

    saveSettings: async () => {
        try {
            Saves.createFolder();
        } catch (e) {
            Notifier.error("Unable to create the Documents/FribbelsOptimizerSaves folder. Try disabling running the app as admin and disabling your virus scan");
            return;
        }

        console.log("SAVE SETTINGS");
        const settings = {
            settingUnlockOnUnequip: document.getElementById('settingUnlockOnUnequip').checked,
            settingRageSet: document.getElementById('settingRageSet').checked,
            settingMaxResults: parseInt(module.exports.parseMaxResults() || 5_000_000),
            settingDefaultPath: pathOverride ? pathOverride : defaultPath,
            settingExcludeEquipped: $('#optionsExcludeGearFrom').multipleSelect('getSelects'),
            settingDarkMode: document.getElementById('darkSlider').checked,
            settingVersion: Updater.getCurrentVersion()
        };

        excludeSelects = settings.settingExcludeEquipped;

        Files.saveFile(settingsPath, JSON.stringify(settings, null, 2))
        Api.setSettings(settings);
    },
}
