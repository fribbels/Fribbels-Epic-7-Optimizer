const stringSimilarity = require('string-similarity');
const tinygradient = require('tinygradient');

var lightGradient = tinygradient('#ffffff', '#8fed78');
var lightScoreGradient = tinygradient('#ffa8a8', '#ffffe5', '#8fed78');

var darkGradient = tinygradient('#212529', '#38821F');
var darkScoreGradient = tinygradient('#5A1A06', '#343127', '#38821F');
var darkScoreGradient2 = tinygradient([
    {color: '#5A1A06', pos: 0}, // red
    {color: '#343127', pos: 0.4},
    {color: '#38821F', pos: 1} // green
]);



var gradient = lightGradient;
var scoreGradient = lightScoreGradient;


var itemsGrid;
var currentAggregate = {};
var selectedCell = null;

module.exports = {

    toggleDarkMode(enabled) {
        if (enabled) {
            gradient = darkGradient;
            scoreGradient = darkScoreGradient2;
        } else {
            gradient = lightGradient;
            scoreGradient = lightScoreGradient;
        }

        try {
            itemsGrid.gridOptions.api.refreshView()
        } catch (e) {

        }
    },

    initialize: async () => {
        if (i18next.language == 'zh') {
          var localeText = AG_GRID_LOCALE_ZH;
        } else if (i18next.language == 'zh-TW') {
          var localeText = AG_GRID_LOCALE_ZH_TW;
        } else {
          var localeText = AG_GRID_LOCALE_EN;
        }
        console.log('localeText:'+localeText);

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
                {headerName: i18next.t('Set'), field: 'set', cellRenderer: (params) => renderSets(params.value)},
                {headerName: i18next.t('Gear'), field: 'gear', cellRenderer: (params) => renderGear(params.value)},
                {headerName: i18next.t('Rank'), field: 'rank', cellRenderer: (params) => i18next.t(params.value), width: 50},
                {headerName: i18next.t('Level'), field: 'level', filter: 'agNumberColumnFilter'},
                {headerName: i18next.t('Enhance'), field: 'enhance', width: 60, filter: 'agNumberColumnFilter'},
                {headerName: i18next.t('Main'), field: 'main.type', width: 100, cellRenderer: (params) => renderStat(i18next.t(params.value))},
                {headerName: i18next.t('Value'), field: 'main.value', width: 60},
                {headerName: i18next.t('Atk%'), field: 'augmentedStats.AttackPercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Atk'), field: 'augmentedStats.Attack', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Spd'), field: 'augmentedStats.Speed', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Cr'), field: 'augmentedStats.CriticalHitChancePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Cd'), field: 'augmentedStats.CriticalHitDamagePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Hp%'), field: 'augmentedStats.HealthPercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Hp'), field: 'augmentedStats.Health', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Def%'), field: 'augmentedStats.DefensePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Def'), field: 'augmentedStats.Defense', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Eff'), field: 'augmentedStats.EffectivenessPercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Res'), field: 'augmentedStats.EffectResistancePercent', cellRenderer: (params) => params.value == 0 ? "" : params.value},
                {headerName: i18next.t('Score'), field: 'wss', width: 50, cellStyle: scoreColumnGradient},
                {headerName: i18next.t('dScore'), field: 'dpsWss', width: 50, cellStyle: scoreColumnGradient},
                {headerName: i18next.t('sScore'), field: 'supportWss', width: 50, cellStyle: scoreColumnGradient},
                {headerName: i18next.t('cScore'), field: 'combatWss', width: 50, cellStyle: scoreColumnGradient},
                {headerName: i18next.t('Equipped'), field: 'equippedByName', width: 120, cellRenderer: (params) => renderStat(i18next.t(params.value))},
                // {headerName: i18next.t('Mconf'), field: 'mconfidence', width: 50},
                // {headerName: i18next.t('Material'), field: 'material', width: 120},
                {headerName: i18next.t('Locked'), field: 'locked', cellRenderer: (params) => params.value == true ? i18next.t('yes') : i18next.t('no')},
                // {headerName: i18next.t('Actions'), field: 'id', cellRenderer: renderActions},
                {headerName: i18next.t('Duplicate'), field: 'duplicateId', hide: true},
                {headerName: 'AllowedMods', field: 'allowedMods', hide: true},
            ],
            rowSelection: 'multiple',
            pagination: true,
            paginationPageSize: 100000,
            localeText: localeText,
            rowData: getAllItemsResponse.items,
            onRowSelected: onRowSelected,
            onCellMouseOver: cellMouseOver,
            onCellMouseOut: cellMouseOut,
            suppressScrollOnNewData: true,
            // onRowSelected: onRowSelected,
        };
        let gridDiv = document.getElementById('gear-grid');
        itemsGrid = new Grid(gridDiv, gridOptions);
        global.itemsGrid = itemsGrid;
        console.log("!!! itemsGrid", itemsGrid);


        Tooltip.displayItem('item1', "asdf");
        // module.exports.redraw();
    },

    getSelectedGear: () => {
        const selectedRows = itemsGrid.gridOptions.api.getSelectedRows();
        console.log("SELECTED ROWS", selectedRows)

        return selectedRows;
    },

    redraw: async (newItem) => {
        if (!itemsGrid) return;
        console.log("Redraw items", newItem);
        var selectedNode;
        const selectedNodes = itemsGrid.gridOptions.api.getSelectedNodes()
        if (selectedNodes.length == 1) {
            selectedNode = selectedNodes[0];
        }

        return Api.getAllItems().then(getAllItemsResponse => {
            aggregateCurrentGearStats(getAllItemsResponse.items);
            itemsGrid.gridOptions.api.setRowData(getAllItemsResponse.items)

            var refreshedItem;
            if (newItem) {
                itemsGrid.gridOptions.api.forEachNode((node) => {
                    if (node.data.id == newItem.id) {
                        node.setSelected(true, false);
                        itemsGrid.gridOptions.api.ensureNodeVisible(node);
                        refreshedItem = node.data;
                    }
                })
            } else if (selectedNode) {
                itemsGrid.gridOptions.api.forEachNode((node) => {
                    if (node.data.id == selectedNode.data.id) {
                        node.setSelected(true, false);
                        itemsGrid.gridOptions.api.ensureNodeVisible(node);
                        refreshedItem = node.data;
                    }
                })
            } else {

            }
            drawPreview(refreshedItem)
            updateSelectedCount();
        });
    },

    // refreshFilters: (setFilter, gearFilter, levelFilter, enhanceFilter, statFilter) => {
    refreshFilters: (filters) => {
        if (!itemsGrid) {
            return;
        }

        const setFilter = filters.setFilter;
        const gearFilter = filters.gearFilter;
        const levelFilter = filters.levelFilter;
        const enhanceFilter = filters.enhanceFilter;
        const statFilter = filters.statFilter;
        const substatFilter = filters.substatFilter;
        const duplicateFilter = filters.duplicateFilter;
        const modifyFilter = filters.modifyFilter;

        const setFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('set');
        if (!setFilter) {
            // document.getElementById('checkboxImageClearSets').checked = true;
            setFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearSets').checked = false;

            setFilterComponent.setModel({
                type: 'startsWith',
                filter: setFilter
            });
        }

        const gearFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('gear');
        if (!gearFilter) {
            // document.getElementById('checkboxImageClearGears').checked = true;
            gearFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearGears').checked = false;

            gearFilterComponent.setModel({
                type: 'startsWith',
                filter: gearFilter
            });
        }

        const levelFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('level');
        if (!levelFilter) {
            // document.getElementById('checkboxImageClearLevels').checked = true;
            levelFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearLevels').checked = false;

            if (levelFilter == "90") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 90
                });
            }
            if (levelFilter == "88") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 88
                });
            }
            if (levelFilter == "85") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 85
                });
            }
            if (levelFilter == "under85") {
                levelFilterComponent.setModel({
                    type: 'lessThan',
                    filter: 85
                });
            }
            if (levelFilter == "0") {
                levelFilterComponent.setModel({
                    type: 'equals',
                    filter: 0
                });
            }
        }

        const enhanceFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('enhance');
        if (!enhanceFilter) {
            enhanceFilterComponent.setModel(null);
        } else {
            if (enhanceFilter == "plus0") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: -1,
                    filterTo: 3
                });
            }
            if (enhanceFilter == "plus3") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 2,
                    filterTo: 6
                });
            }
            if (enhanceFilter == "plus6") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 5,
                    filterTo: 9
                });
            }
            if (enhanceFilter == "plus9") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 8,
                    filterTo: 12
                });
            }
            if (enhanceFilter == "plus12") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 11,
                    filterTo: 15
                });
            }
            if (enhanceFilter == "plus15") {
                enhanceFilterComponent.setModel({
                    filterType: 'number',
                    type: 'inRange',
                    filter: 14,
                    filterTo: 16
                });
            }

            // if (levelFilter == "85at") {
            //     levelFilterComponent.setModel({
            //         type: 'equals',
            //         filter: 85
            //     });
            // }
            // if (levelFilter == "85below") {
            //     levelFilterComponent.setModel({
            //         type: 'lessThan',
            //         filter: 85
            //     });
            // }
        }

        const statFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('main.type');
        if (!statFilter) {
            // document.getElementById('checkboxImageClearStats').checked = true;
            statFilterComponent.setModel(null);
        } else {
            // document.getElementById('checkboxImageClearStats').checked = false;

            statFilterComponent.setModel({
                type: 'equals',
                filter: statFilter
            });
        }

        const statList = [
            "Attack",
            "AttackPercent",
            "Defense",
            "DefensePercent",
            "Health",
            "HealthPercent",
            "Speed",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ]
        for (var stat of statList) {
            itemsGrid.gridOptions.api.getFilterInstance('augmentedStats.' + stat).setModel(null);
        }
        if (substatFilter) {
            const substatFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('augmentedStats.' + substatFilter);

            substatFilterComponent.setModel({
                type: 'notEqual',
                filter: 0
            });
        }

        const allowedModsFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('allowedMods');
        if (modifyFilter) {

            allowedModsFilterComponent.setModel({
                type: 'contains',
                filter: "|" + modifyFilter + "|"
            });
        } else {
            allowedModsFilterComponent.setModel(null);
        }

        const duplicateFilterComponent = itemsGrid.gridOptions.api.getFilterInstance('duplicateId');
        if (!duplicateFilter) {
            duplicateFilterComponent.setModel(null);
        } else {
            duplicateFilterComponent.setModel({
                type: 'startsWith',
                filter: "DUPLICATE"
            });
        }

        itemsGrid.gridOptions.api.onFilterChanged();
        updateSelectedCount();
    }
}
            // SAMPLE OR FILTER
            // statFilterComponent.setModel({
            //     // filterType: 'string',
            //     // operator: 'OR',
            //     // condition1: {
            //     //     filterType: 'string',
            //     //     type: 'notEqual',
            //     //     filter: modifyFilter
            //     // },
            //     // condition2: {
            //     //     filterType: 'string',
            //     //     type: 'equals',
            //     //     filter: 6
            //     // }
            //     type: 'notEqual',
            //     filter: modifyFilter
            // });

function renderActions(params) {
    const id = params.value;
    return '<img class="optimizerSetIcon" id="item1" src=' + Assets.getSetAsset("SpeedSet") + '></img>';
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

        if (percent == 0) {
            return {
                backgroundColor: 'ffffff00'
            }
        }

        return {
            backgroundColor: color.toHexString()
        };
    } catch (e) {console.error(e)}

}

function scoreColumnGradient(params) {
    try {
        if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        // var percent = value * (80-40) + 0.4;
        var percent = (80 * (value/80))/100
        percent = Math.min(1, percent);
        percent = Math.max(0, percent);

        const color = scoreGradient.rgbAt(percent);

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

function updateSelectedCount() {
    const count = module.exports.getSelectedGear().length;
    $('#selectedCount').html(count);
}


function cellMouseOver(event) {
    const item = event.data;

    drawPreview(item);
}

function cellMouseOut(event) {
    const item = selectedCell;

    if (!item) return;

    drawPreview(item);
}

function drawPreview(item) {
    if (!item) {
        document.getElementById("gearTabPreview").innerHTML = "";
        return;
    }

    var baseStats = null;

    if (!item.equippedByName) {

    } else {
        baseStats = HeroData.getBaseStatsByName(item.equippedByName)
    }

    // TODO ADD STAT SELECTOR
    const html = HtmlGenerator.buildItemPanel(item, "itemsGrid", baseStats, "Speed")
    document.getElementById("gearTabPreview").innerHTML = html;
}

function onRowSelected(event) {
    if (event.node.selected) {
        selectedCell = event.data;
        updateSelectedCount();
    }
}
