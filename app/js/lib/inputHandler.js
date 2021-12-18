// Libs

process.env.ELECTRON_NO_ATTACH_CONSOLE = true;

(function(){
    var original = console.error;
    console.error = function() {
        // console.warn(document.getElementsByTagName('script'))
        // if(!.includes('licenseManager.js')) {
        if (arguments.length > 0) {
            original.apply(console, arguments)
            console.trace()
            Notifier.error(arguments[0]);
        }
    }
})();
// (function(){
//     var original = console.warn;
//     console.warn = function() {
//         // console.warn(document.getElementsByTagName('script'))
//         // if(!.includes('licenseManager.js')) {
//         if (arguments.length > 0) {
//             original.apply(console, arguments)
//         }
//     }
// })();


global.Files = require('./files');
global.Logger = require('./logger');
global.I18n = require('./i18n/i18n');

global.Assets = require('./assets');
global.Path = window.require('path');
global.Constants = require('./constants');
global.Api = require('./api');
global.Dialog = require('./dialog');
global.Reforge = require('./reforge');
global.Utils = require('./utils');
global.DarkMode = require('./darkmode');
global.GridRenderer = require('./renderer/gridRenderer');
global.Updater = require('./updater');
global.StatPreview = require('./statPreview');
global.Artifact = require('./artifact');
global.ColorPicker = require('./colorPicker');

// Tab
global.HeroesTab = require('./tabs/heroesTab');
global.OptimizerTab = require('./tabs/optimizerTab');
global.MultiOptimizerTab = require('./tabs/multiOptimizerTab');
global.ItemsTab = require('./tabs/itemsTab');
global.EnhancingTab = require('./tabs/enhancingTab');

// Grid
global.HeroesGrid = require('./grids/heroesGrid');
global.OptimizerGrid = require('./grids/optimizerGrid');
global.ItemsGrid = require('./grids/itemsGrid');

global.ModificationFilter = require('./modificationFilter');
global.Subprocess = require('./subprocess');
global.Selectors = require('./selectors');
global.Settings = require('./settings');
global.ForceFilter = require('./forceFilter');
global.PriorityFilter = require('./priorityFilter');
global.ZarrocConverter = require('./zarrocConverter');
const {ModuleRegistry, Grid} = require('@ag-grid-community/core');
const {ClientSideRowModelModule} = require('@ag-grid-community/client-side-row-model');
const {InfiniteRowModelModule} = require('@ag-grid-community/infinite-row-model');
ModuleRegistry.registerModules([ClientSideRowModelModule, InfiniteRowModelModule]);
global.Grid = Grid;
global.electron = require("electron");
const Enums = require('./enums');
global.Gears = Enums.Gears;
global.Sets = Enums.Sets;
global.Ranks = Enums.Ranks;
global.Stats = Enums.Stats;
global.Heroes = Enums.Heroes;
global.Stat = require('../models/stat').Stat;
global.Item = require('../models/item').Item;
global.MainStatFixer = require('./mainStatFixer');
global.GearRating = require('./gearRating');
global.OptimizationRequest = require('../models/optimizationRequest').OptimizationRequest;
global.Importer = require('./importer');
global.ItemAugmenter = require('./itemAugmenter');
global.Ocr = require('./ocr/ocr');
// global.Optimizer = require('./optimizer');
// global.GearCalculator = require('./gearCalculator');
global.ItemSerializer = require('./itemSerializer');
global.Tooltip = require('./tooltip');
// global.Backend = require('../backend');
global.Files = require('./files');
global.HeroData = require('./heroData');
// global.HeroManager = require('./heroManager');
global.HtmlGenerator = require('./htmlGenerator');
global.fs = require('fs');
global.Notifier = require('./notifier');
global.Saves = require('./saves');
global.Scanner = require('./scanner');
const Jimp = require('jimp');

document.addEventListener("DOMContentLoaded", async () => {
    setupLinks();
    Logger.initialize();

    console.log("DOMContentLoaded")

    await I18n.initialize();

    Subprocess.initialize(async () => {
        await HeroData.initialize();

        Notifier.initialize();
        Dialog.initialize();
        Selectors.initialize();

        ZarrocConverter.initialize();
        OptimizerTab.initialize();
        OptimizerGrid.initialize();
        ItemsTab.initialize();
        ItemsGrid.initialize();
        HeroesTab.initialize();
        HeroesGrid.initialize();

        await Settings.initialize();
        Saves.initialize();
        await Saves.loadAutoSave();
        MultiOptimizerTab.initialize();

        Tooltip.initialize();
        ColorPicker.initialize();
        EnhancingTab.initialize();
    });
    Scanner.initialize();
    Updater.checkForUpdates();
    DarkMode.initialize();

    Importer.addEventListener();

    console.log("Document initialized")
});

function setupLinks() {
    $('body').on('click', 'a', (event) => {
        event.preventDefault();
        let link = event.target.href;
        electron.shell.openExternal(link);
    });

    $('#discordBadge').on('click', (event) => {
        electron.shell.openExternal('https://discord.gg/rDmB4Un7qg');
    });

    $('#donateBadge').on('click', (event) => {
        electron.shell.openExternal('https://www.buymeacoffee.com/fribbels');
    });

    $('#githubBadge').on('click', (event) => {
        electron.shell.openExternal('https://github.com/fribbels/Fribbels-Epic-7-Optimizer');
    });

    $('#coffeeImage').on('click', (event) => {
        electron.shell.openExternal('https://www.buymeacoffee.com/fribbels');
    });
}


function handleKey(e) {
    const key = e.key;

    if (e.key == 'Escape') {
        handleEscape();
    }

    if (e.key == 'Enter') {
        handleEnter();
    }
}

function handleEnter() {
    const input = getValueFromId('input');

    Backend.sendCommand(input)
}

function error(e) {
    throw "Error: " + e;
}

function getValueFromId(id) {
    const value = document.getElementById(id).value;
    console.log("Input:", "[" + value + "]");
    return value;
}
