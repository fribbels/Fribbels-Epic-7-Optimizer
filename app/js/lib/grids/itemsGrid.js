const tinygradient = require('tinygradient');
var gradient = tinygradient('#ffffff', '#8fed78');

var itemsGrid;
var currentAggregate = {};


module.exports = {
    initialize: async () => {
        const getAllItemsResponse = await Api.getAllItems();
        const gridOptions = {
            defaultColDef: {
                width: 50,
                sortable: true,
                sortingOrder: ['desc', 'asc'],
                cellStyle: columnGradient,
                // valueFormatter: numberFormatter,
            },

            columnDefs: [
                {headerName: 'Set', field: 'set', filter: 'agTextColumnFilter', cellRenderer: (params) => renderSets(params.value)},
                {headerName: 'Gear', field: 'gear', filter: 'agTextColumnFilter', cellRenderer: (params) => renderGear(params.value)},
                {headerName: 'Rank', field: 'rank'},
                {headerName: 'Level', field: 'level'},
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
                {headerName: 'Score', field: 'wss'},
                {headerName: 'Equipped', field: 'equippedByName', width: 120},
                {headerName: 'Locked', field: 'locked'},
            ],
            rowSelection: 'multiple',
            pagination: true,
            paginationPageSize: 100000,
            rowData: getAllItemsResponse.items,
            onRowSelected: onRowSelected,
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

    redraw: async () => {
        console.log("Redraw items");
        return Api.getAllItems().then(getAllItemsResponse => {
            aggregateCurrentGearStats(getAllItemsResponse.items);
            itemsGrid.gridOptions.api.setRowData(getAllItemsResponse.items)
        });
    },

    refreshFilters: (setFilter, gearFilter) => {
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
    console.warn(event)
}