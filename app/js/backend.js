function sendCommand(input) {
    if (input === 'stop') {
        child.kill('SIGINT');
        console.log('SIGINT')
    }

    test();

    // console.log("Sending: ", input);
    // child.stdin.write(input + "\n");
}

function init() {
    setInterval(() => {
        child.stdin.setEncoding('utf-8');
        child.stdin.write("asdf\n");
        console.log("wrote")
    }, 1000)
}


function test() {
    const data = require('./test/data');
    const testHeroes = require('./test/testHeroes');
    const inputItems = data.items;
    const items = {
        [Gears.WEAPON]: [],
        [Gears.HELMET]: [],
        [Gears.ARMOR]: [],
        [Gears.NECKLACE]: [],
        [Gears.RING]: [],
        [Gears.BOOTS]: [],
    };
    const hero = testHeroes.Angelica;

    console.log("data", data);

    for(var item of inputItems) {
        const converted = Converter.toItem(item) ;
        items[converted.gear].push(converted);
    }

    const sortedItems = {
        [Gears.WEAPON]: gearSort(items[Gears.WEAPON], hero),
        [Gears.HELMET]: gearSort(items[Gears.HELMET], hero),
        [Gears.ARMOR]: gearSort(items[Gears.ARMOR], hero),
        [Gears.NECKLACE]: gearSort(items[Gears.NECKLACE], hero),
        [Gears.RING]: gearSort(items[Gears.RING], hero),
        [Gears.BOOTS]: gearSort(items[Gears.BOOTS], hero),
    };

    console.log(sortedItems)

    function gearSort(items, hero) {
        scoredItems = items.map(x => {
            return {
                item: x,
                score: ScoreCalculator.itemScore(hero, x)
            }
        });

        return scoredItems.sort((b, a) => a.score - b.score);
    }
}

// testSpeed2()
// spawnJre();

// console.log(output); // Should print 'true'
// console.log(output.stderr); // Should print 'true'
// call(args);
// console.log(child)
// console.log(new Stat(1, 2))
// console.log(Gears)
// console.log(TestItems)
// testBonusStats(TestItems.slice(0, 6));
// testEquipSort();


module.exports = {
    sendCommand: sendCommand
}


function calc() {
    const params = Optimizer.getOptimizationRequestParams();
    const items = Db.getItems()
            .concat(Db.getItems())
            .concat(Db.getItems())
            .concat(Db.getItems())
            // .concat(Db.getItems())
            // .concat(Db.getItems())

    // // Optimization
    // items.forEach(x => x.set = indexBySetType[x.set]);

    const resultCount = 10_000_000;
    const results = new Array(resultCount);

    const itemsByGear = buildItemsByGear(items);
    const accumulatorArrsByItem = {};
    var counter = 0;
    var resultsCounter = 0;

    const base = {
        "atk": 576,
        "hp": 5700,
        "spd": 88,
        "def": 743,
        "cr": 15,
        "cd": 150,
        "eff": 0,
        "res": 0,
        "dac": 5   
    };

    const setsBuffer = new Array(13).fill();
    var exit = false;

    for (var weapon of itemsByGear[Gears.Weapon]) {
        if (exit) break;
        const weaponAccumulatorArr = getStatAccumulatorArr(base, weapon, accumulatorArrsByItem);

        for (var helmet of itemsByGear[Gears.Helmet]) {
            if (exit) break;
            const helmetAccumulatorArr = getStatAccumulatorArr(base, helmet, accumulatorArrsByItem);

            for (var armor of itemsByGear[Gears.Armor]) {
                if (exit) break;
                const armorAccumulatorArr = getStatAccumulatorArr(base, armor, accumulatorArrsByItem);

                for (var necklace of itemsByGear[Gears.Necklace]) {
                    if (exit) break;
                    const necklaceAccumulatorArr = getStatAccumulatorArr(base, necklace, accumulatorArrsByItem);

                    for (var ring of itemsByGear[Gears.Ring]) {
                        if (exit) break;
                        const ringAccumulatorArr = getStatAccumulatorArr(base, ring, accumulatorArrsByItem);

                        for (var boots of itemsByGear[Gears.Boots]) {
                            if (exit) break;
                            const index = counter++;

                            const bootsAccumulatorArr = getStatAccumulatorArr(base, boots, accumulatorArrsByItem);

                            const result = addAccumulatorArrsToHero(
                                base, 
                                [weaponAccumulatorArr, helmetAccumulatorArr, armorAccumulatorArr, necklaceAccumulatorArr, ringAccumulatorArr, bootsAccumulatorArr],
                                [weapon, helmet, armor, necklace, ring, boots],
                                setsBuffer
                            );

                            // const passesFilter = passesFilter(result, params);
                            const passesFilter = true;

                            if (passesFilter) {
                                const resultsIndex = resultsCounter++;
                                if (resultsIndex < resultCount) {
                                    results[resultsIndex] = result;
                                }
                            }

                            if (index % 1_000_000 == 1) {
                                console.log("DEBUG", index);
                            }

                            if (index > 10_000_000) {
                                exit = true;
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("DONE");
    console.log("ITERATIONS", resultsCounter);
    // console.log(results);
}

function keep() {
    try {
        var str = data.toString();
        console.log(str);

        if (data.includes('OUTPUTSTART')) {
            var parts = str.split('OUTPUTSTART', 2);

            strBuffer = parts[1];
            output = [];
        } else if (data.includes('OUTPUTEND')) {
            var parts = str.split('OUTPUTEND', 2);

            strBuffer += parts[0];
        } else {
            strBuffer += str;
        }

        if (strBuffer.includes("||")) {
            var parts = strBuffer.split('||');
            for (var i = 0; i < parts.length-1; i++) {
                console.log('batch');
                var part = parts[i];
                var outputArr = JSON.parse(part);
                // console.log(outputArr);
                output = output.concat(outputArr);   
            }

            strBuffer = parts[parts.length-1];
        }

        if (data.includes('DONE')) {
            console.log("DRAW TABLE");
            console.log(output)
            callback();

            // output = [];
            // strBuffer = "";
        }
    } catch (e) {
        console.log("strBuffer", strBuffer);
        console.log("data", data.toString());
        console.log(e);
    }

                    // console.log(str)

                    // if (data.includes('OUTPUTSTART')) {
                    //     var parts = str.split('OUTPUTSTART', 2);

                    //     strBuffer = parts[1];
                    //     output = [];
                    // } else if (data.includes('OUTPUTEND')) {
                    //     var parts = str.split('OUTPUTEND', 2);

                    //     strBuffer += parts[0];
                    // } else {
                    //     strBuffer += str;
                    // }

                    // if (strBuffer.includes("|")) {
                    //     var parts = strBuffer.split('|');
                    //     for (var i = 0; i < parts.length-1; i++) {
                    //         count += parts.length;
                    //         console.log(count);
                    //         var part = parts[i];
                    //         var outputArr = JSON.parse(part);
                    //         // console.log(outputArr);
                    //         output = output.concat(outputArr);   
                    //     }

                    //     strBuffer = parts[parts.length-1];
                    // }

}

function cheetah() {

    grid = new cheetahGrid.ListGrid({
    // Parent element on which to place the grid
        parentElement: document.querySelector('#grid-sample'),
        theme: userTheme,
        // Header definition
        header: [
            {field: 'check', caption: '', width: 35, columnType: 'check'},
            {field: 'atk', caption: 'atk', minWidth: 70, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'def', caption: 'def', minWidth: 70, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'hp', caption: 'hp', minWidth: 70, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'spd', caption: 'spd', minWidth: 50, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'cr', caption: 'cr', minWidth: 50, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'cd', caption: 'cd', minWidth: 50, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'eff', caption: 'eff', minWidth: 50, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'res', caption: 'res', minWidth: 50, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
            {field: 'dac', caption: 'dac', minWidth: 50, sort: hpSorter(), columnType: 'number', style: {textAlign: 'center'}, headerStyle: {textAlign: 'left'}},
        ],
        // Array data to be displayed on the grid
        records: resultStats
        // Column fixed position
    });
    const cheetahGrid = require("cheetah-grid")

    const materialDesignTheme = cheetahGrid.themes.MATERIAL_DESIGN;
    const userTheme = materialDesignTheme.extends({
      defaultBgColor({row, grid}) {
        // change the color of the checked row.
        if (row < grid.frozenRowCount) {
          return null;
        }
        const record = resultStats[row - grid.frozenRowCount];
        if (record.check) {
          return '#DDF';
        }
        return null;
      },
    });
    function number() {
        return new cheetahGrid.columns.type.NumberColumn();
    }
    if (grid) {
        grid.records = resultStats;
        grid.invalidate();
        return;
    }

    const {
      SELECTED_CELL,
    } = cheetahGrid.ListGrid.EVENT_TYPE;
    
    grid.listen(SELECTED_CELL, (cell) => {
        console.log(cell)
        if (!cell.selected) {
            return;
        }
        if (!cell.row) {
            const oldData = resultStats[cell.before.row-1];
            if (oldData) oldData.check = false;
            grid.invalidate();
            return;
        }
        console.log(cell.row, cell.col)

        const data = resultStats[cell.row-1];
        const oldData = resultStats[cell.before.row-1]

        if (oldData) oldData.check = false;
        data.check = true;

        console.log("!!!", grid.getCellRange(cell.col, cell.row));

        const weapon = data.weapon;
        const helmet = data.helmet;
        const armor = data.armor;
        const necklace = data.necklace;
        const ring = data.ring;
        const boots = data.boots;

        // document.getElementById('gear-preview-left-top').innerHTML = JSON.stringify(weapon.augmentedStats, null, 2);
        // document.getElementById('gear-preview-left-mid').innerHTML = JSON.stringify(helmet.augmentedStats, null, 2);
        // document.getElementById('gear-preview-left-bot').innerHTML = JSON.stringify(armor.augmentedStats, null, 2);
        // document.getElementById('gear-preview-right-top').innerHTML = JSON.stringify(necklace.augmentedStats, null, 2);
        // document.getElementById('gear-preview-right-mid').innerHTML = JSON.stringify(ring.augmentedStats, null, 2);
        // document.getElementById('gear-preview-right-bot').innerHTML = JSON.stringify(boots.augmentedStats, null, 2);

        const heroId = document.getElementById('inputHeroAdd').value;
        HeroManager.equipGearOnHero(heroId, [weapon, helmet, armor, necklace, ring, boots]);    
        console.log("See equipped:", HeroManager.getHeroById(heroId))

        grid.invalidate();
    });
}

function sorts() {
    // TimSort = require('timsort');
    function numberCompare(a,b) {
        return a.atk-b.atk;
    }

    // 336, 2818-566
    // 361, 
    // 351
    // 351
    // 330

    function timsort() {
        var start = window.performance.now();

        TimSort.sort(resultStats, (a,b) => a.atk-b.atk);

        var end = window.performance.now();

        console.log("Time: ", end - start)
    }


    function jssort() {
        var start = window.performance.now();

        resultStats.sort(numberCompare);

        var end = window.performance.now();

        console.log("Time: ", end - start)
    }

    // 683, 5215-1047
    // 691, 16015-1091
    // 677, 5371-1145
    // 698
    // 691

    var sort = require('fast-sort')
    function fastsort() {
        var start = window.performance.now();

        sort(resultStats).asc('atk');

        var end = window.performance.now();

        console.log("Time: ", end - start)
    }
    //511
    //543
    //547
    //552
    //576

    var arraySort = require('array-sort');
    function arraysort() {
        var start = window.performance.now();

        arraySort(resultStats, 'atk');

        var end = window.performance.now();

        console.log("Time: ", end - start)
    }
}

function toItem(item) {
    const mainStatType = toStat(item.Main.Name)
    const mainStatNumber = MainStatFixer.fix(mainStatType)

    const newItem = new Item(
        toGear(item.Type),
        toRank(item.Grade),
        toSet(item.Set), 
        item.Ilvl, //
        item.Enhance, //
        new Stat(mainStat, mainStatNumber),  //
        item.SubStats.map(x => new Stat(toStat(x.Name), x.Value))
    );

    return newItem;
}

function toStat(input) {
    switch (input) {
        case 0:
            return Stats.ATK;
        case 1:
            return Stats.FLATATK;
        case 2:
            return Stats.SPD;
        case 3:
            return Stats.CR;
        case 4:
            return Stats.CD;
        case 5:
            return Stats.HP;
        case 6:
            return Stats.FLATHP;
        case 7:
            return Stats.DEF;
        case 8:
            return Stats.FLATDEF;
        case 9:
            return Stats.EFF;
        case 10:
            return Stats.RES;
        default:   
            throw new Error('Invalid enum: ' + JSON.stringify(input));
    }
}

function toSet(input) {
    switch (input) {
        case 0:
            return Sets.SPEED;
        case 1:
            return Sets.HIT;
        case 2:
            return Sets.CRIT;
        case 3:
            return Sets.DEFENSE;
        case 4:
            return Sets.HEALTH;
        case 5:
            return Sets.ATTACK;
        case 6:
            return Sets.COUNTER;
        case 7:
            return Sets.LIFESTEAL;
        case 8:
            return Sets.DESTRUCTION;
        case 9:
            return Sets.RESIST;
        case 10:
            return Sets.RAGE;
        case 11:
            return Sets.IMMUNITY;
        case 12:
            return Sets.UNITY;
        default:   
            throw new Error('Invalid enum: ' + input);
    }
}

function toGear(input) {
    switch (input) {
        case 0:
            return Gears.WEAPON;
        case 1:
            return Gears.HELMET;
        case 2:
            return Gears.ARMOR;
        case 3:
            return Gears.NECKLACE;
        case 4:
            return Gears.RING;
        case 5:
            return Gears.BOOTS;
        default:   
            throw new Error('Invalid enum: ' + input);
    }
}

function toRank(input) {
    switch (input) {
        case 0:
            return Ranks.EPIC;
        case 1:
            return Ranks.HEROIC;
        case 2:
            return Ranks.RARE;
        case 3:
            return Ranks.GOOD;
        case 4:
            return Ranks.NORMAL;
        default:   
            throw new Error('Invalid enum: ' + input);
    }
}

module.exports = {
    toItem,
}

// const TimSort = require('timsort');

module.exports = {
    hpSorter: (field) => {
        return (order, col, grid) => {
            if (order === 'asc')
                TimSort.sort(resultStats, (a,b) => a.hp-b.hp);
            else
                TimSort.sort(resultStats, (a,b) => b.hp-a.hp);

            grid.records = resultStats;
        }
    },

    handleDataRefresh: (params, resultStats, grid) => {
        const column = params.sortModel[0].colId
        const order = params.sortModel[0].sort

        if (order === 'asc') {
            if (column == 'atk')
                TimSort.sort(resultStats, (a,b) => a.atk-b.atk);
            if (column == 'hp')
                TimSort.sort(resultStats, (a,b) => a.hp-b.hp);
            if (column == 'def')
                TimSort.sort(resultStats, (a,b) => a.def-b.def);
            if (column == 'spd')
                TimSort.sort(resultStats, (a,b) => a.spd-b.spd);
            if (column == 'cr')
                TimSort.sort(resultStats, (a,b) => a.cr-b.cr);
            if (column == 'cd')
                TimSort.sort(resultStats, (a,b) => a.cd-b.cd);
            if (column == 'eff')
                TimSort.sort(resultStats, (a,b) => a.eff-b.eff);
            if (column == 'res')
                TimSort.sort(resultStats, (a,b) => a.res-b.res);
            if (column == 'hpps')
                TimSort.sort(resultStats, (a,b) => a.hpps-b.hpps);
            if (column == 'ehp')
                TimSort.sort(resultStats, (a,b) => a.ehp-b.ehp);
            if (column == 'ehpps')
                TimSort.sort(resultStats, (a,b) => a.ehpps-b.ehpps);
            if (column == 'dmg')
                TimSort.sort(resultStats, (a,b) => a.dmg-b.dmg);
            if (column == 'dmgps')
                TimSort.sort(resultStats, (a,b) => a.dmgps-b.dmgps);
            if (column == 'mcdmg')
                TimSort.sort(resultStats, (a,b) => a.mcdmg-b.mcdmg);
            if (column == 'mcdmgps')
                TimSort.sort(resultStats, (a,b) => a.mcdmgps-b.mcdmgps);
        } else {
            if (column == 'atk')
                TimSort.sort(resultStats, (a,b) => b.atk-a.atk);
            if (column == 'hp')
                TimSort.sort(resultStats, (a,b) => b.hp-a.hp);
            if (column == 'def')
                TimSort.sort(resultStats, (a,b) => b.def-a.def);
            if (column == 'spd')
                TimSort.sort(resultStats, (a,b) => b.spd-a.spd);
            if (column == 'cr')
                TimSort.sort(resultStats, (a,b) => b.cr-a.cr);
            if (column == 'cd')
                TimSort.sort(resultStats, (a,b) => b.cd-a.cd);
            if (column == 'eff')
                TimSort.sort(resultStats, (a,b) => b.eff-a.eff);
            if (column == 'res')
                TimSort.sort(resultStats, (a,b) => b.res-a.res);
            if (column == 'dac')
                TimSort.sort(resultStats, (a,b) => b.dac-a.dac);
            if (column == 'hpps')
                TimSort.sort(resultStats, (a,b) => b.hpps-a.hpps);
            if (column == 'ehp')
                TimSort.sort(resultStats, (a,b) => b.ehp-a.ehp);
            if (column == 'ehpps')
                TimSort.sort(resultStats, (a,b) => b.ehpps-a.ehpps);
            if (column == 'dmg')
                TimSort.sort(resultStats, (a,b) => b.dmg-a.dmg);
            if (column == 'dmgps')
                TimSort.sort(resultStats, (a,b) => b.dmgps-a.dmgps);
            if (column == 'mcdmg')
                TimSort.sort(resultStats, (a,b) => b.mcdmg-a.mcdmg);
            if (column == 'mcdmgps')
                TimSort.sort(resultStats, (a,b) => b.mcdmgps-a.mcdmgps);
        }
    }
}