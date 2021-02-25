// Libs

(function(){
    var original = console.error;
    console.error = function() {
        // console.warn(document.getElementsByTagName('script'))
        // if(!.includes('licenseManager.js')) {
        if (arguments.length > 0) {
            original.apply(console, arguments)
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

global.Assets = require('./assets');
global.Path = window.require('path');
global.Files = require('./files');
global.Constants = require('./constants');
global.Api = require('./api');
global.Dialog = require('./dialog');
global.DataFetcher = require('./datafetcher');
global.SpecialtyChange = require('./specialtychange');
global.Reforge = require('./reforge');
global.Utils = require('./utils');
global.DarkMode = require('./darkmode');
global.GridRenderer = require('./renderer/gridRenderer');
global.Updater = require('./updater');
global.StatPreview = require('./statPreview');
global.Artifact = require('./artifact');

// Tab
global.HeroesTab = require('./tabs/heroesTab');
global.OptimizerTab = require('./tabs/optimizerTab');
global.ItemsTab = require('./tabs/itemsTab');

// Grid
global.HeroesGrid = require('./grids/heroesGrid');
global.OptimizerGrid = require('./grids/optimizerGrid');
global.ItemsGrid = require('./grids/itemsGrid');

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
const Enums = require('./enums');
global.Gears = Enums.Gears;
global.Sets = Enums.Sets;
global.Ranks = Enums.Ranks;
global.Stats = Enums.Stats;
global.Heroes = Enums.Heroes;
global.Stat = require('../models/stat').Stat;
global.Item = require('../models/item').Item;
global.MainStatFixer = require('./mainStatFixer');
global.OptimizationRequest = require('../models/optimizationRequest').OptimizationRequest;
global.Validator = require('./validator');
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
    console.log("DOMContentLoaded")

    Subprocess.initialize(async () => {
        await HeroData.initialize();
        ZarrocConverter.initialize();
        OptimizerTab.initialize();
        OptimizerGrid.initialize();
        ItemsTab.initialize();
        ItemsGrid.initialize();
        HeroesTab.initialize();
        HeroesGrid.initialize();

        Settings.initialize();
        Saves.loadAutoSave();
    });
    Updater.checkForUpdates();
    DarkMode.initialize();
    // GearCalculator.initialize();
    Selectors.initialize();
    Saves.initialize();

    Importer.addEventListener();

    Tooltip.initialize();


    console.log("Document initialized")
});


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
