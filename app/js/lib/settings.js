const remote = require('@electron/remote');
const dialog = remote.dialog
const currentWindow = remote.getCurrentWindow();
const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '/FribbelsOptimizerSaves';

const defaultPath = savesFolder;

const settingsPath = defaultPath + "/settings.ini";
var pathOverride;

var excludeSelects = [];
var enhanceLimit = 0;
var defaultOptimizerSettings = {
    settingDefaultUseReforgedStats: true,
    settingDefaultUseHeroPriority: false,
    settingDefaultUseSubstatMods: false,
    settingDefaultLockedItems: false,
    settingDefaultEquippedItems: false,
    settingDefaultKeepCurrent: false,
}

function formatNumbersOnKey(event) {
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
}

module.exports = {
    initialize: async () => {
        await module.exports.loadSettings();

        // Format numbers
        $("#settingMaxResults").on("keyup", formatNumbersOnKey);
        $("#settingPenDefense").on("keyup", formatNumbersOnKey);

        const settingsIds = [
            'settingUnlockOnUnequip',
            'settingMaxResults',
            'settingPenDefense',
            'settingRageSet',
            'settingPenSet',
            'settingDefaultUseReforgedStats',
            'settingDefaultUseHeroPriority',
            'settingDefaultUseSubstatMods',
            'settingDefaultLockedItems',
            'settingDefaultEquippedItems',
            'settingDefaultKeepCurrent',
        ];

        $('#optionsExcludeGearFrom').change(module.exports.saveSettings)
        $('#optionsEnhanceLimit').change(module.exports.saveSettings)
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

    getOptimizerOptions: () => {
        return defaultOptimizerSettings;
    },

    getDefaultSettings: () => {
        return {
            settingUnlockOnUnequip: true,
            settingRageSet: true,
            settingPenSet: true,
            settingMaxResults: 5_000_000,
            settingPenDefense: 1_500,
            settingDefaultPath: defaultPath,
            settingExcludeEquipped: [],
            settingEnhanceLimit: 0,
            settingDarkMode: true,
            settingArchetypes: GearRating.getDefaultArchetypes(),
            settingDefaultUseReforgedStats: true,
            settingDefaultUseHeroPriority: false,
            settingDefaultUseSubstatMods: false,
            settingDefaultLockedItems: false,
            settingDefaultEquippedItems: false,
            settingDefaultKeepCurrent: false,
            settingBackgroundColor: '#212529',
            settingTextColorPicker: '#E2E2E2',
            settingAccentColorPicker: '#F84C48',
            settingInputColorPicker: '#2D3136',
            settingGridTextColorPicker: '#E2E2E2',
            settingRedColorPicker: '#5A1A06',
            settingNeutralColorPicker: '#343127',
            settingGreenColorPicker: '#38821F'
        }
    },

    parseNumberValue: (id) => {
        var value = document.getElementById(id).value;
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
        try {
            JSON.parse(text)
        } catch (e) {
            Notifier.error(`There was an error parsing the ${Files.path(settingsPath)} file. Please repair the file or delete it.`)
        }
        const settings = JSON.parse(text);
        console.log("LOADING SETTINGS", settings);

        function isNullUndefined(x) {
            return x === null || x === undefined;
        }

        document.getElementById('settingUnlockOnUnequip').checked = isNullUndefined(settings.settingUnlockOnUnequip) ? true : settings.settingUnlockOnUnequip;
        document.getElementById('settingRageSet').checked = isNullUndefined(settings.settingRageSet) ? true : settings.settingRageSet;
        document.getElementById('settingPenSet').checked = isNullUndefined(settings.settingPenSet) ? true : settings.settingPenSet;
        document.getElementById('settingDefaultUseReforgedStats').checked = isNullUndefined(settings.settingDefaultUseReforgedStats) ? true : settings.settingDefaultUseReforgedStats;
        document.getElementById('settingDefaultUseHeroPriority').checked = settings.settingDefaultUseHeroPriority;
        document.getElementById('settingDefaultUseSubstatMods').checked = settings.settingDefaultUseSubstatMods;
        document.getElementById('settingDefaultLockedItems').checked = settings.settingDefaultLockedItems;
        document.getElementById('settingDefaultEquippedItems').checked = settings.settingDefaultEquippedItems;
        document.getElementById('settingDefaultKeepCurrent').checked = settings.settingDefaultKeepCurrent;
        defaultOptimizerSettings = {
            settingDefaultUseReforgedStats: isNullUndefined(settings.settingDefaultUseReforgedStats) ? true : settings.settingDefaultUseReforgedStats,
            settingDefaultUseHeroPriority: settings.settingDefaultUseHeroPriority,
            settingDefaultUseSubstatMods: settings.settingDefaultUseSubstatMods,
            settingDefaultLockedItems: settings.settingDefaultLockedItems,
            settingDefaultEquippedItems: settings.settingDefaultEquippedItems,
            settingDefaultKeepCurrent: settings.settingDefaultKeepCurrent
        }
        pathOverride = settings.settingDefaultPath;

        console.warn("changing path override to: " + pathOverride);

        if (isNullUndefined(settings.settingPenSet)) {
            settings.settingPenSet = true;
        }

        if (settings.settingMaxResults) {
            document.getElementById('settingMaxResults').value = settings.settingMaxResults.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            document.getElementById('settingMaxResults').value = "5,000,000";
            settings.settingMaxResults = 5_000_000;
        }

        if (settings.settingPenDefense) {
            document.getElementById('settingPenDefense').value = settings.settingPenDefense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            document.getElementById('settingPenDefense').value = "1,500";
            settings.settingPenDefense = 1_500;
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

        if (settings.settingEnhanceLimit) {
            $('#optionsEnhanceLimit').multipleSelect('setSelects', settings.settingEnhanceLimit)
            enhanceLimit = settings.settingEnhanceLimit;
        }

  // "settingBackgroundColor": "#212529",
  // "settingTextColorPicker": "#e2e2e2",
  // "settingAccentColorPicker": "#f84c48",
  // "settingInputColorPicker": "#2d3136",
  // "settingGridTextColorPicker": "#ffffff",
  // "settingRedColorPicker": "#ff430a",
  // "settingNeutralColorPicker": "#343127",
  // "settingGreenColorPicker": "#38821f"

        console.warn(settings);
        ColorPicker.loadColorSettings(settings)

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

        if (settings.settingArchetypes) {
            GearRating.setArchetypes(settings.settingArchetypes)
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
            settingPenSet: document.getElementById('settingPenSet').checked,
            settingDefaultUseReforgedStats: document.getElementById('settingDefaultUseReforgedStats').checked,
            settingDefaultUseHeroPriority: document.getElementById('settingDefaultUseHeroPriority').checked,
            settingDefaultUseSubstatMods: document.getElementById('settingDefaultUseSubstatMods').checked,
            settingDefaultLockedItems: document.getElementById('settingDefaultLockedItems').checked,
            settingDefaultEquippedItems: document.getElementById('settingDefaultEquippedItems').checked,
            settingDefaultKeepCurrent: document.getElementById('settingDefaultKeepCurrent').checked,
            settingMaxResults: parseInt(module.exports.parseNumberValue('settingMaxResults') || 5_000_000),
            settingPenDefense: parseInt(module.exports.parseNumberValue('settingPenDefense') || 1_500),
            settingDefaultPath: pathOverride ? pathOverride : defaultPath,
            settingExcludeEquipped: $('#optionsExcludeGearFrom').multipleSelect('getSelects'),
            settingEnhanceLimit: $('#optionsEnhanceLimit').multipleSelect('getSelects'),
            settingDarkMode: document.getElementById('darkSlider').checked,
            settingVersion: Updater.getCurrentVersion(),
            settingArchetypes: GearRating.getArchetypes(),
            settingBackgroundColor: document.getElementById('backgroundColorPicker').value,
            settingTextColorPicker: document.getElementById('textColorPicker').value,
            settingAccentColorPicker: document.getElementById('accentColorPicker').value,
            settingInputColorPicker: document.getElementById('inputColorPicker').value,
            settingGridTextColorPicker: document.getElementById('gridTextColorPicker').value,
            settingRedColorPicker: document.getElementById('redColorPicker').value,
            settingNeutralColorPicker: document.getElementById('neutralColorPicker').value,
            settingGreenColorPicker: document.getElementById('greenColorPicker').value
        };
        defaultOptimizerSettings = {
            settingDefaultUseReforgedStats: settings.settingDefaultUseReforgedStats,
            settingDefaultUseHeroPriority: settings.settingDefaultUseHeroPriority,
            settingDefaultUseSubstatMods: settings.settingDefaultUseSubstatMods,
            settingDefaultLockedItems: settings.settingDefaultLockedItems,
            settingDefaultEquippedItems: settings.settingDefaultEquippedItems,
            settingDefaultKeepCurrent: settings.settingDefaultKeepCurrent
        }

        excludeSelects = settings.settingExcludeEquipped;
        enhanceLimit = settings.settingEnhanceLimit;

        Files.saveFile(settingsPath, JSON.stringify(settings, null, 2))
        Api.setSettings(settings);
    },
}
