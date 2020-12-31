// Libs
global.Assets = require('./assets');
global.Path = window.require('path');
global.Files = require('./files');
global.Constants = require('./constants');
global.Api = require('./api');
global.Dialog = require('./dialog');
global.DataFetcher = require('./datafetcher');
global.SpecialtyChange = require('./specialtychange');
global.Reforge = require('./reforge');

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
global.Optimizer = require('./optimizer');
global.GearCalculator = require('./gearCalculator');
global.ItemSerializer = require('./itemSerializer');
// global.Backend = require('../backend');
global.Files = require('./files');
global.HeroData = require('./heroData');
// global.HeroManager = require('./heroManager');
global.HtmlGenerator = require('./htmlGenerator');
global.fs = require('fs');
global.Saves = require('./saves');
const Jimp = require('jimp');

document.addEventListener("DOMContentLoaded", async () => {
    Selectors.initialize();
    console.log("DOMContentLoaded")

    Subprocess.initialize();
    await copyLang();
    HtmlGenerator.initialize();
    GearCalculator.initialize();
    await HeroData.initialize();
    Ocr.initialize();
    Assets.initialize();
    Saves.initialize();
    ItemsTab.initialize();
    ItemsGrid.initialize();

    Importer.addDebugFile();
    Importer.addEventListener();
    ZarrocConverter.initialize();

    console.log("Document initialized")

    $(document).on('click','input[type=number]',function(){ this.select(); });;
    $(document).on('click','input[type=text]',function(){ this.select(); });;

    HeroesTab.initialize();
    HeroesGrid.initialize();
    OptimizerTab.initialize();
    OptimizerGrid.initialize();

    Saves.loadAutoSave();
});

function copyLang() {
    // return new Promise((resolve, reject) => {
    //     console.log(__dirname)
    //     fs.copyFile(Path.resolve(__dirname, '../../tessdata/eng.traineddata'), Path.resolve(__dirname, '../../eng.traineddata'), (err) => {
    //         if (err) {
    //             console.error(err)
    //             reject(error);
    //         }
    //         resolve("Copied");
    //     });
    // })
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

// function handleEscape() {
//     Backend.sendCommand('stop')
// }

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
