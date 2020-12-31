const tinygradient = require('tinygradient');
var gradient = tinygradient('#ffffff', '#8fed78');

var itemsGrid;
var currentAggregate = {};


module.exports = {
    initialize: async () => {
        const getAllItemsResponse = await Api.getAllItems();
        const gridOptions = {
            defaultColDef: {
                width: 45,
                sortable: true,
                sortingOrder: ['desc', 'asc'],
                cellStyle: columnGradient,
                // valueFormatter: numberFormatter,
            },

            columnDefs: [
                {headerName: 'Set', field: 'set', filter: 'agTextColumnFilter', cellRenderer: (params) => renderSets(params.value)},
                {headerName: 'Gear', field: 'gear', filter: 'agTextColumnFilter', cellRenderer: (params) => renderGear(params.value)},
                {headerName: 'Rank', field: 'rank'},
                {headerName: 'Level', field: 'level', filter: 'agNumberColumnFilter'},
                {headerName: 'Enhance', width: 60, field: 'enhance'},
                {headerName: 'Main', field: 'main.type', width: 100, cellRenderer: (params) => renderStat(params.value)},
                {headerName: 'Value', field: 'main.value'},
                {headerName: 'Atk%', field: 'augmentedStats.AttackPercent'},
                {headerName: 'Atk', field: 'augmentedStats.Attack'},
                {headerName: 'Spd', field: 'augmentedStats.Speed'},
                {headerName: 'Cr', field: 'augmentedStats.CriticalHitChancePercent'},
                {headerName: 'Cd', field: 'augmentedStats.CriticalHitDamagePercent'},
                {headerName: 'Hp%', field: 'augmentedStats.HealthPercent'},
                {headerName: 'Hp', field: 'augmentedStats.Health'},
                {headerName: 'Def%', field: 'augmentedStats.DefensePercent'},
                {headerName: 'Def', field: 'augmentedStats.Defense'},
                {headerName: 'Eff', field: 'augmentedStats.EffectivenessPercent'},
                {headerName: 'Res', field: 'augmentedStats.EffectResistancePercent'},
                {headerName: 'Wss', field: 'wss'},
                {headerName: 'dWss', field: 'dpsWss'},
                {headerName: 'sWss', field: 'supportWss'},
                {headerName: 'cWss', field: 'combatWss'},
                {headerName: 'Equipped', field: 'equippedByName', width: 120},
                {headerName: 'Locked', field: 'locked', cellRenderer: (params) => params.value == true ? 'yes' : 'no'},
            ],
            rowSelection: 'multiple',
            pagination: true,
            paginationPageSize: 100000,
            rowData: getAllItemsResponse.items,
            suppressScrollOnNewData: true,
            // onRowSelected: onRowSelected,
        };
        let gridDiv = document.getElementById('gear-grid');
        itemsGrid = new Grid(gridDiv, gridOptions);
        global.itemsGrid = itemsGrid;
        console.log("!!! itemsGrid", itemsGrid);

        // module.exports.redraw();
    },

    getSelectedGear: () => {
        const selectedRows = itemsGrid.gridOptions.api.getSelectedRows();
        console.log("SELECTED ROWS", selectedRows)

        return selectedRows;
    },

    redraw: async (newItem) => {
        console.log("Redraw items");
        return Api.getAllItems().then(getAllItemsResponse => {
            aggregateCurrentGearStats(getAllItemsResponse.items);
            itemsGrid.gridOptions.api.setRowData(getAllItemsResponse.items)

            if (newItem) {
                itemsGrid.gridOptions.api.forEachNode((node) => {
                    if (node.data.id == newItem.id) {
                        node.setSelected(true, false);
                        itemsGrid.gridOptions.api.ensureNodeVisible(node);
                    }
                })
            }
        });
    },

    refreshFilters: (setFilter, gearFilter, levelFilter) => {
        const setFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('set');
        if (!setFilter) {
            document.getElementById('checkboxImageClearSets').checked = true;
            setFilterComponent.setModel(null);
        } else {
            document.getElementById('checkboxImageClearSets').checked = false;

            setFilterComponent.setModel({
                type: 'startsWith',
                filter: setFilter
            });
        }

        const gearFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('gear');
        if (!gearFilter) {
            document.getElementById('checkboxImageClearGears').checked = true;
            gearFilterComponent.setModel(null);
        } else {
            document.getElementById('checkboxImageClearGears').checked = false;

            gearFilterComponent.setModel({
                type: 'startsWith',
                filter: gearFilter
            });
        }

        const levelFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('level');
        if (!levelFilter) {
            document.getElementById('checkboxImageClearLevels').checked = true;
            levelFilterComponent.setModel(null);
        } else {
            document.getElementById('checkboxImageClearLevels').checked = false;

            if (levelFilter == "85above") {
                levelFilterComponent.setModel({
                    type: 'greaterThan',
                    filter: 85
                });
            }
            if (levelFilter == "85at") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 85
                });
            }
            if (levelFilter == "85below") {
                levelFilterComponent.setModel({
                    type: 'lessThan',
                    filter: 85
                });
            }
        }

        itemsGrid.gridOptions.api.onFilterChanged();
    }
}

function columnGradient(params) {
    try {
        if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        var agg = currentAggregate[colId];
        if (!agg) return;

        var percent = (value) / (agg.max + 1);
        const color = gradient.rgbAt(percent);

        return {
            backgroundColor: color.toHexString()
        };
    } catch (e) {console.error(e)}

}

function aggregateCurrentGearStats(items) {
    const statsToAggregate = [
        "augmentedStats.AttackPercent",
        "augmentedStats.Attack",
        "augmentedStats.Speed",
        "augmentedStats.CriticalHitChancePercent",
        "augmentedStats.CriticalHitDamagePercent",
        "augmentedStats.HealthPercent",
        "augmentedStats.Health",
        "augmentedStats.DefensePercent",
        "augmentedStats.Defense",
        "augmentedStats.EffectivenessPercent",
        "augmentedStats.EffectResistancePercent"
    ]

    var count = items.length;

    for (var stat of statsToAggregate) {
        const arrSum = arr => arr.reduce((a,b) => a + b[stat], 0);

        var max = Math.max(...getField(items, stat));
        var sum = arrSum(items);
        var avg = sum/count;

        currentAggregate[stat] = {
            max,
            sum,
            avg
        }
    }
}

function getField(items, stat) {
    return items.map(x => x.augmentedStats[stat.split(".")[1]]);
}

function renderSets(name) {
    return '<img class="optimizerSetIcon" src=' + Assets.getSetAsset(name) + '></img>'
}

function renderGear(name) {
    return '<img class="optimizerSetIcon" src=' + Assets.getGearAsset(name) + '></img>'
}

function renderStat(name) {
    const statEdits = {
        "CriticalHitDamagePercent": "Crit Dmg %",
        "CriticalHitChancePercent": "Crit Chance %",
        "EffectivenessPercent": "Effectiveness %",
        "EffectResistancePercent": "Effect Resist %",
        "AttackPercent": "Attack %",
        "HealthPercent": "Health %",
        "DefensePercent": "Defense %",
    };

    return statEdits[name] || name;
}

function onRowSelected(event) {
    if (event.node.selected) {
        console.warn(event)
        const gear = event.data;

        if (gear.level == 85 && gear.enhance == 15) {
            console.log("REFORGEABLE");

            for (var i = 0; i < gear.substats.length; i++) {
                const substat = gear.substats[i];
                const value = substat.value;
                if (plainStats.includes(substat.type)) {
                    substat.max = Math.floor(value/4)
                    substat.min = Math.ceil(value/8)
                    substat.multi = 6;
                }
                if (substat.type == "CriticalHitChancePercent") {
                    substat.max = Math.floor(value/3)
                    substat.min = Math.ceil(value/5)
                    substat.multi = 4;
                }
                if (substat.type == "CriticalHitDamagePercent") {
                    substat.max = Math.floor(value/4)
                    substat.min = Math.ceil(value/7)
                    substat.multi = 5.5;
                }
                if (substat.type == "Attack") {
                    substat.max = Math.round(value/39)
                    substat.min = substat.max;
                    substat.multi = 39;
                }
                if (substat.type == "Defense") {
                    substat.max = Math.round(value/31)
                    substat.min = substat.max;
                    substat.multi = 31;
                }
                if (substat.type == "Health") {
                    substat.max = Math.round(value/174)
                    substat.min = substat.max;
                    substat.multi = 174;
                }
                if (substat.type == "Speed") {
                    substat.max = Math.round(value/2);
                    substat.min = Math.ceil(value/4);
                    substat.multi = 3;
                }
            }

            // if (gear.rank == "Epic") {
            //     gear.substats[0].max = 6;
            //     gear.substats[1].max = 6;
            //     gear.substats[2].max = 6;
            //     gear.substats[3].max = 6;
            // }
            if (gear.rank == "Heroic") {
                // gear.substats[0].max = 5;
                // gear.substats[1].max = 5;
                // gear.substats[2].max = 5;
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            }
            if (gear.rank == "Rare") {
                // gear.substats[0].max = 4;
                // gear.substats[1].max = 4;
                gear.substats[2].max = Math.min(2, gear.substats[2].max);
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            }
            if (gear.rank == "Good") {
                // gear.substats[0].max = 3;
                gear.substats[1].max = Math.min(2, gear.substats[1].max);
                gear.substats[2].max = Math.min(2, gear.substats[2].max);
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            }
            if (gear.rank == "Normal") {
                gear.substats[0].max = Math.min(2, gear.substats[0].max);
                gear.substats[1].max = Math.min(2, gear.substats[1].max);
                gear.substats[2].max = Math.min(2, gear.substats[2].max);
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            }

            var rolls = 0
            for (var substat of gear.substats) {
                const value = substat.value;

                substat.scaledDiff = 0;
                substat.rolls = substat.min;
                rolls += substat.rolls;
            }

            const maxRolls = maxRollsByRank[gear.rank];

            if (rolls != maxRolls) {
                var missingRolls = maxRolls - rolls;

                for (var i = 0; i < missingRolls; i++) {
                    for (var substat of gear.substats) {
                        if (substat.rolls + 1 > substat.max) {
                            substat.minExpectedValue = 0;
                            substat.scaledDiff = 0;
                            continue;
                        };

                        const value = substat.value;
                        substat.minExpectedValue = substat.rolls * substat.multi;
                        substat.scaledDiff = (value - substat.minExpectedValue) / substat.multi;
                    }

                    const maxSubstat = gear.substats.reduce((prev, curr) => (prev.scaledDiff > curr.scaledDiff) ? prev : curr);
                    maxSubstat.rolls += 1;
                    maxSubstat.bonus = true;
                }
            }


            for (var substat of gear.substats) {
                const type = substat.type;
                const value = substat.value;

                calculateReforgeValues(substat);
            }



            console.log(gear.rank);
            console.log(rolls);
            console.log(gear.substats);
        }
    }
}