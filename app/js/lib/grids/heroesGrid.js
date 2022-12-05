const tinygradient = require('tinygradient');
const colorPicker = require('../colorPicker');

var lightGradient = {gradient:tinygradient([
    {color: '#F5A191', pos: 0}, // red
    {color: '#ffffe5', pos: 0.5},
    {color: '#77e246', pos: 1} // green
])};

var darkGradient = colorPicker.getColors();
// var darkGradient = tinygradient([
//     {color: '#5A1A06', pos: 0}, // red
//     {color: '#343127', pos: 0.5},
//     {color: '#38821F', pos: 1} // green
// ]);

var gradient = lightGradient;

global.heroesGrid = null;
global.buildsGrid = null;
var currentHeroes = [];
var selectedBuildNode = null;

var currentAggregate = {};

module.exports = {

    toggleDarkMode(enabled) {
        if (enabled) {
            gradient = darkGradient;
        } else {
            gradient = lightGradient;
        }

        try {
            buildsGrid.gridOptions.api.refreshView()
        } catch (e) {

        }
    },

    initialize: () => {
        if (i18next.language == 'zh') {
          var localeText = AG_GRID_LOCALE_ZH;
        } else if (i18next.language == 'zh-TW') {
          var localeText = AG_GRID_LOCALE_ZH_TW;
        } else if (i18next.language == 'fr') {
          var localeText = AG_GRID_LOCALE_FR;
        } else if (i18next.language == 'ja') {
          var localeText = AG_GRID_LOCALE_JA;
        } else if (i18next.language == 'ko') {
          var localeText = AG_GRID_LOCALE_KO;
        } else {
          var localeText = AG_GRID_LOCALE_EN;
        }
        console.log('localeText:'+localeText);

        buildGrid(localeText);
    },

    resetSort: () => {
        heroesGrid.gridOptions.columnApi.resetColumnState()
    },

    refresh: async (heroes, id) => {
        if (!heroes) {
            const response = await Api.getAllHeroes();
            heroes = response.heroes;
        }
        const selectedNode = heroesGrid.gridOptions.api.getSelectedNodes()[0]

        heroes.forEach(element => {
          element.label = i18next.t(element.name)
        });
        currentHeroes = heroes;
        heroesGrid.gridOptions.api.setRowData(heroes)
        heroesGrid.gridOptions.api.redrawRows();

        if (!selectedNode && !id) {
            return;
        }

        heroesGrid.gridOptions.api.forEachNode((node) => {
            if (id) {
                if (node.data.id == id) {
                    node.setSelected(true, false);
                    heroesGrid.gridOptions.api.ensureNodeVisible(node);
                }
            } else {
                if (node.data.id == selectedNode.data.id) {
                    node.setSelected(true, false);
                }
            }
        })
    },

    refreshHeroesGrid: () => {
        const selectedNode = heroesGrid.gridOptions.api.getSelectedNodes()[0]
        heroesGrid.gridOptions.api.refreshCells();

        heroesGrid.gridOptions.api.forEachNode((node) => {
            if (node.data.id == selectedNode.data.id) {
                node.setSelected(true, false);
            }
        })
    },

    refreshBuilds: async (response) => {
        const selectedRow = module.exports.getSelectedRow();
        if (!selectedRow) return;

        var hero;
        if (response) {
            hero = response.hero;
        } else {
            const useReforgedStats = HeroesTab.getUseReforgedStats();
            hero = (await Api.getHeroById(selectedRow.id, useReforgedStats)).hero;
        }

        updateCurrentAggregate(hero);
        console.log("Refresh build selected hero row", hero);
        buildsGrid.gridOptions.api.setRowData(hero.builds == null ? [] : hero.builds)

        const getMaybeSelectedRows = buildsGrid.gridOptions.api.getSelectedNodes()[0];
        if (getMaybeSelectedRows) {
            selectedBuildNode = getMaybeSelectedRows;
        }


        if (!selectedBuildNode) {
            return;
        }

        buildsGrid.gridOptions.api.forEachNode((node) => {
            if (JSON.stringify(node.data.items) == JSON.stringify(selectedBuildNode.data.items)) {
                node.setSelected(true, false);
            }
        })
        // })
    },

    getSelectedRow: () => {
        const selectedRows = heroesGrid.gridOptions.api.getSelectedRows();
        if (selectedRows.length > 0) {
            const row = selectedRows[0];
            console.log("SELECTED ROW", row)
            return row;
        }
        return null;
    },

    getSelectedBuildRow: () => {
        const selectedRows = buildsGrid.gridOptions.api.getSelectedRows();
        if (selectedRows.length > 0) {
            const row = selectedRows[0];
            console.log("SELECTED ROW", row)
            return row;
        }
        return null;
    },

    refreshFilters: (filters) => {
        const classFilter = filters.classFilter;
        const elementFilter = filters.elementFilter;

        const classFilterComponent = heroesGrid.gridOptions.api.getFilterInstance('role');
        if (!classFilter) {
            classFilterComponent.setModel(null);
        } else {
            classFilterComponent.setModel({
                type: 'startsWith',
                filter: classFilter
            });
        }

        const elementFilterComponent = heroesGrid.gridOptions.api.getFilterInstance('attribute');
        if (!elementFilter) {
            elementFilterComponent.setModel(null);
        } else {
            elementFilterComponent.setModel({
                type: 'startsWith',
                filter: elementFilter
            });
        }

        heroesGrid.gridOptions.api.onFilterChanged();
    },

    redrawPreview: async () => {
        const heroRow = module.exports.getSelectedRow();
        const buildRow = module.exports.getSelectedBuildRow();
        if (buildRow) {
            const itemIds = buildRow.items;

            const itemsResponse = await Api.getItemsByIds(itemIds);
            const items = itemsResponse.items;

            const useReforgeStats = HeroesTab.getUseReforgedStats();
            const heroResponse = await Api.getHeroById(heroRow.id, useReforgeStats);
            const baseStats = heroResponse.baseStats;

            for (var i = 0; i < 6; i++) {
                const item = items[i];
                // const itemId = itemIds[i];
                const displayId = Constants.gearDisplayIdByIndex[i];
                const html = HtmlGenerator.buildItemPanel(item, "heroesGrid", baseStats)
                document.getElementById(displayId).innerHTML = html;
            }
            return;
        }


        if (heroRow) {
            redrawPreviewHero(heroRow.id);
        }
    },
}

function buildGrid(localeText) {
    const DIGITS_2 = 40;
    const DIGITS_3 = 40;
    const DIGITS_4 = 44;
    const DIGITS_5 = 48;
    const DIGITS_6 = 55;

    const gridOptions = {
        defaultColDef: {
            width: 47,
            sortable: true,
            sortingOrder: ['desc', 'asc', null],
            cellStyle: {
                'height': '100%',
                'display': 'flex ',
                'justify-content': 'center',
                'align-items': 'center ',
            },
        },

        columnDefs: [
            {headerName: i18next.t('rank'), sortable: false, width: 60, field: 'index', rowDrag: true, rowDragText: (params, dragItemCount) => {
                console.log(params)
                return params.rowNode.data.name;
            }},
            {headerName: i18next.t('icon'), sortable: false, field: 'name', width: 60, cellRenderer: (params) => renderIcon(params.value)},
            {headerName: i18next.t('elem'), field: 'attribute', width: 45, filter: 'agTextColumnFilter', cellRenderer: (params) => renderElement(params.value)},
            {headerName: i18next.t('class'), field: 'role', width: 50, filter: 'agTextColumnFilter', cellRenderer: (params) => renderClass(params.value)},
            //{headerName: i18next.t('name'), field: 'name', width: 0, wrapText: true, cellStyle: {'display':'none'}},
            {headerName: i18next.t('name'), field: 'label', width: 155, wrapText: true, sortingOrder: ['asc', 'desc', null], cellStyle: {'white-space': 'normal !important', 'line-height': '16px'}, cellRenderer: (params) => renderName(params)},
            // {headerName: i18next.t('Stars'), field: 'rarity', width: 50},
            // {headerName: i18next.t('Class'), field: 'role', width: 100, cellRenderer: (params) => renderClass(params.value)},
            {headerName: i18next.t('sets'), field: 'equipment', width: 85, cellRenderer: (params) => renderSets(params.value)},
            {headerName: i18next.t('atk'), field: 'atk', width: DIGITS_4},
            {headerName: i18next.t('def'), field: 'def', width: DIGITS_4},
            {headerName: i18next.t('hp'), field: 'hp', width: DIGITS_5},
            {headerName: i18next.t('spd'), field: 'spd', width: DIGITS_3},
            {headerName: i18next.t('cr'), field: 'cr', width: DIGITS_3},
            {headerName: i18next.t('cd'), field: 'cd', width: DIGITS_3},
            {headerName: i18next.t('eff'), field: 'eff', width: DIGITS_3},
            {headerName: i18next.t('res'), field: 'res', width: DIGITS_3},
            {headerName: i18next.t('cp'), field: 'cp', width: DIGITS_6},
            {headerName: i18next.t('hps'), field: 'hpps', width: DIGITS_4},
            {headerName: i18next.t('ehp'), field: 'ehp', width: DIGITS_6},
            {headerName: i18next.t('ehps'), field: 'ehpps', width: DIGITS_5},
            {headerName: i18next.t('dmg'), field: 'dmg', width: DIGITS_5},
            {headerName: i18next.t('dmgs'), field: 'dmgps', width: DIGITS_4},
            {headerName: i18next.t('mcd'), field: 'mcdmg', width: 55, width: DIGITS_3},
            {headerName: i18next.t('mcds'), field: 'mcdmgps', width: 55, width: DIGITS_4},
            {headerName: i18next.t('dmgh'), field: 'dmgh', width: 55, width: DIGITS_5},
            {headerName: i18next.t('dmgd'), field: 'dmgd', width: 55, width: DIGITS_5},
            {headerName: i18next.t('score'), field: 'score', width: 55, width: DIGITS_3},
            {headerName: i18next.t('upg'), field: 'upgrades', width: 65, width: DIGITS_2},
        ],
        rowSelection: 'single',
        rowData: [],
        suppressScrollOnNewData: true,
        rowHeight: 45,
        pagination: true,
        paginationPageSize: 100000,
        localeText:localeText,
        onRowSelected: onHeroRowSelected,
        onRowClicked: onHeroRowClick,
        onRowDragEnter: onRowDragEnter,
        onRowDragEnd: onRowDragEnd,
        onRowDragMove: onRowDragMove,
        onRowDragLeave: onRowDragLeave,
        onSortChanged: onSortChanged,
        onFilterChanged: onFilterChanged,
        suppressMoveWhenRowDragging: true,
        onRowDoubleClicked: onRowDoubleClicked,
        suppressCellSelection: true,
        enableRangeSelection: false,

        animateRows: true,
        immutableData: true,
        suppressDragLeaveHidesColumns: true,
        getRowNodeId: (data) => {
            return data.id;
        },
        // suppressMoveWhenRowDragging: true,
        navigateToNextCell: GridRenderer.arrowKeyNavigator(this, "heroesGrid"),
    };

    const buildsGridOptions = {
        defaultColDef: {
            width: 50,
            sortable: true,
            sortingOrder: ['desc', 'asc'],
            cellStyle: columnGradient,
            // suppressNavigable: true,
            cellClass: 'no-border'
            // valueFormatter: numberFormatter,
        },
        columnDefs: [
            {headerName: i18next.t('name'), field: 'name', sortingOrder: ['asc', 'desc', null], width: 150},
            {headerName: i18next.t('sets'), field: 'sets', width: 100, cellRenderer: (params) => GridRenderer.renderSets(params.value)},
            {headerName: i18next.t('atk'), field: 'atk'},
            {headerName: i18next.t('def'), field: 'def'},
            {headerName: i18next.t('hp'), field: 'hp', width: 55},
            {headerName: i18next.t('spd'), field: 'spd'},
            {headerName: i18next.t('cr'), field: 'cr'},
            {headerName: i18next.t('cd'), field: 'cd'},
            {headerName: i18next.t('eff'), field: 'eff'},
            {headerName: i18next.t('res'), field: 'res'},
            // {headerName: i18next.t('dac'), field: 'dac'},
            {headerName: i18next.t('cp'), field: 'cp', width: 55},
            {headerName: i18next.t('hps'), field: 'hpps', width: 50},
            {headerName: i18next.t('ehp'), field: 'ehp', width: 55},
            {headerName: i18next.t('ehps'), field: 'ehpps', width: 50},
            {headerName: i18next.t('dmg'), field: 'dmg', width: 50},
            {headerName: i18next.t('dmgs'), field: 'dmgps', width: 50},
            {headerName: i18next.t('mcd'), field: 'mcdmg', width: 55},
            {headerName: i18next.t('mcds'), field: 'mcdmgps', width: 50},
            {headerName: i18next.t('dmgh'), field: 'dmgh', width: 50},
            {headerName: i18next.t('dmgd'), field: 'dmgd', width: 50},
            {headerName: i18next.t('score'), field: 'score', width: 50},
            {headerName: i18next.t('upg'), field: 'upgrades', width: 65},
        ],
        rowHeight: 27,
        rowSelection: 'single',
        onRowSelected: onBuildRowSelected,
        suppressScrollOnNewData: true,
        localeText:localeText,
        rowData: [],
        cacheBlockSize: 1000,
        maxBlocksInCache: 1,
        suppressPaginationPanel: false,
        suppressDragLeaveHidesColumns: true,
        suppressCellSelection: true,
        enableRangeSelection: false,
        // animateRows: true,
        // immutableData: true,
        // getRowNodeId: (data) => {
        //     return data.id;
        // },
        navigateToNextCell: GridRenderer.arrowKeyNavigator(this, "buildsGrid"),

        // navigateToNextCell: navigateToNextCell.bind(this),
    };

    const gridDiv = document.getElementById('heroes-table');
    const buildsGridDiv = document.getElementById('builds-table');
    heroesGrid = new Grid(gridDiv, gridOptions);
    buildsGrid = new Grid(buildsGridDiv, buildsGridOptions);
}


const fourPieceSets = [
    "AttackSet",
    "SpeedSet",
    "DestructionSet",
    "LifestealSet",
    "ProtectionSet",
    "CounterSet",
    "RageSet",
    "RevengeSet",
    "InjurySet"
]
function renderSets(equipment) {
    if (!equipment) return;

    const setNames = Object.values(equipment).map(x => x.set);
    const setCounters = [
        Math.floor(setNames.filter(x => x == "HealthSet").length),
        Math.floor(setNames.filter(x => x == "DefenseSet").length),
        Math.floor(setNames.filter(x => x == "AttackSet").length),
        Math.floor(setNames.filter(x => x == "SpeedSet").length),
        Math.floor(setNames.filter(x => x == "CriticalSet").length),
        Math.floor(setNames.filter(x => x == "HitSet").length),
        Math.floor(setNames.filter(x => x == "DestructionSet").length),
        Math.floor(setNames.filter(x => x == "LifestealSet").length),
        Math.floor(setNames.filter(x => x == "CounterSet").length),
        Math.floor(setNames.filter(x => x == "ResistSet").length),
        Math.floor(setNames.filter(x => x == "UnitySet").length),
        Math.floor(setNames.filter(x => x == "RageSet").length),
        Math.floor(setNames.filter(x => x == "ImmunitySet").length),
        Math.floor(setNames.filter(x => x == "PenetrationSet").length),
        Math.floor(setNames.filter(x => x == "RevengeSet").length),
        Math.floor(setNames.filter(x => x == "InjurySet").length),
        Math.floor(setNames.filter(x => x == "ProtectionSet").length),
        Math.floor(setNames.filter(x => x == "TorrentSet").length)
    ]

    const sets = [];
    for (var i = 0; i < setCounters.length; i++) {
        const setsFound = Math.floor(setCounters[i] / Constants.piecesBySetIndex[i]);
        for (var j = 0; j < setsFound; j++) {
            sets.push(Constants.setsByIndex[i]);
        }
    }

    sets.sort((a, b) => {
        if (fourPieceSets.includes(a)) {
            return -1;
        } else if (fourPieceSets.includes(b)) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    })

    const images = sets.map(x => '<img class="optimizerSetIcon" src=' + Assets.getSetAsset(x) + '></img>');
    // console.log("RenderSets images", images);
    return images.join("");
}
// function columnGradient(params) {
//     const field = params.colDef.field;
//     if (field == "sets" || field == "name") return;

//     const hero = module.exports.getSelectedRow();
//     if (params.value > hero[field]) {
//         return {
//             backgroundColor: "#bbfd91"
//         };
//     } else if (params.value < hero[field]) {
//         return {
//             backgroundColor: "#ffafaf"
//         };
//     } else {
//         // return {
//         //     backgroundColor: "#fffdc4"
//         // };
//     }
// }

function columnGradient(params) {
    try {
        if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        var agg = currentAggregate[colId];

        if (!agg) return;

        // var percent = agg.max == agg.min ? 1 : (value - agg.min) / (agg.max - agg.min);

        var color;
        if (value > agg.avg) {
            var percent = 0.5 * ((value - agg.avg) / (agg.max - agg.avg)) + 0.5
            percent = Math.min(1, Math.max(0, percent))
            color = gradient.gradient.rgbAt(percent);
        }

        if (value == agg.avg) {
            color = gradient.gradient.rgbAt(0.5)
        }

        if (value < agg.avg) {
            var percent = (1 - (agg.avg - value) / (agg.avg - agg.min))*0.5
            percent = Math.min(1, Math.max(0, percent))
            color = gradient.gradient.rgbAt(percent);
        }

        // if (agg.min == 0 && agg.max == 0) {
        //     color = gradient.rgbAt(0.5)
        // }

        return {
            backgroundColor: color.toHexString()
        };
    } catch (e) {console.error(e)}
}

function navigateToNextCell(params) {
  var previousCell = params.previousCellPosition,
    suggestedNextCell = params.nextCellPosition,
    nextRowIndex,
    renderedRowCount;

  switch (params.key) {
    case KEY_DOWN:
      // return the cell below
      nextRowIndex = previousCell.rowIndex + 1;
      renderedRowCount = optimizerGrid.gridOptions.api.getModel().getRowCount();
      if (nextRowIndex >= renderedRowCount) {
        return null;
      } // returning null means don't navigate

      optimizerGrid.gridOptions.api.selectNode(optimizerGrid.gridOptions.api.getRowNode("" + nextRowIndex))
      return {
        rowIndex: nextRowIndex,
        column: previousCell.column,
        floating: previousCell.floating,
      };
    case KEY_UP:
      // return the cell above
      nextRowIndex = previousCell.rowIndex - 1;
      if (nextRowIndex <= -1) {
        return null;
      } // returning null means don't navigate

      optimizerGrid.gridOptions.api.selectNode(optimizerGrid.gridOptions.api.getRowNode("" + nextRowIndex))
      return {
        rowIndex: nextRowIndex,
        column: previousCell.column,
        floating: previousCell.floating,
      };
    case KEY_LEFT:
    case KEY_RIGHT:
      return suggestedNextCell;
    default:
      throw 'this will never happen, navigation is always one of the 4 keys above';
  }
}


function renderElement(element) {
    var file = Assets.getElementAsset(element);
    return `<img class='optimizerSetIcon' src='${file}'></img>`;

    // return {
    //     "light": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_promlight.png'></img>",
    //     "fire": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_profire.png'></img>",
    //     "ice": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_proice.png'></img>",
    //     "wind": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_proearth.png'></img>",
    //     "dark": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_promdark.png'></img>",
    // }[element];
}


function renderName(params) {
    var stars = params.data.stars
    var name = i18next.t(params.data.name)
    return stars == 5 ? name + " - 5 ★" : name;
}

function renderClass(role) {
    var file = Assets.getClassAsset(role);
    return `<img class='optimizerSetIcon' src='${file}'></img>`;
}



function renderIcon(name) {
    const url = HeroData.getHeroExtraInfo(name).assets.icon
    const image = '<img class="heroIcon" src=' + url + '></img>';
    return image;
}

// function renderClass(value) {
//     if (value == 'manauser')
//         return 'Soul Weaver';
//     if (value == 'mage')
//         return 'Mage';
//     if (value == 'ranger')
//         return 'Ranger';
//     if (value == 'knight')
//         return 'Knight';
//     if (value == 'warrior')
//         return 'Warrior';
//     if (value == 'assassin')
//         return 'Thief';
//     return value;
// }

async function onBuildRowSelected(event) {
    console.log("onBuildRowSelected", event);
    if (event.node.selected) {
        const hero = HeroesGrid.getSelectedRow();
        const useReforgeStats = HeroesTab.getUseReforgedStats();
        const heroResponse = await Api.getHeroById(hero.id, useReforgeStats);
        const baseStats = heroResponse.baseStats;
        const itemIds = event.data.items;

        const itemsResponse = await Api.getItemsByIds(itemIds);
        const items = itemsResponse.items;
        const mods = event.data.mods || [];

        for (var i = 0; i < 6; i++) {
            const item = items[i];
            const mod = mods[i];

            console.warn("modding", items, mods, event.data);

            if (mod) {
                for (var j = 0; j < item.substats.length; j++) {
                    const substat = item.substats[j];
                    if (j == mod.index) {
                        substat.type = mod.type;
                        substat.value = mod.value;
                        substat.originalType = mod.originalType;
                        substat.originalValue = mod.originalValue;
                        substat.modified = true;
                    }
                }
            }

            // const itemId = itemIds[i];
            const displayId = Constants.gearDisplayIdByIndex[i];
            const html = HtmlGenerator.buildItemPanel(item, "heroesGrid", baseStats, mods)
            document.getElementById(displayId).innerHTML = html;
        }
    }
}

function onHeroRowClick(event) {
    selectedBuildNode = null;
}

function onHeroRowSelected(event) {
    if (event.node.selected) {
        console.log("onHeroRowSelected", event);
        const heroId = event.data.id;

        redrawPreviewHero(heroId);
    }
}

function redrawPreviewHero(heroId) {
    const useReforgedStats = HeroesTab.getUseReforgedStats();
    console.log("Use reforge", useReforgedStats)
    Api.getHeroById(heroId, useReforgedStats).then(async (response) => {
        const hero = response.hero;
        console.log("On hero row selected hero row", hero);

        updateCurrentAggregate(hero);
        buildsGrid.gridOptions.api.setRowData(hero.builds == null ? [] : hero.builds)

        const equipmentMap = hero.equipment ? hero.equipment : {};
        const equipment = [
            equipmentMap["Weapon"],
            equipmentMap["Helmet"],
            equipmentMap["Armor"],
            equipmentMap["Necklace"],
            equipmentMap["Ring"],
            equipmentMap["Boots"],
        ]

        module.exports.refreshBuilds(response);

        const baseStats = response.baseStats;

        for (var i = 0; i < 6; i++) {
            const gear = equipment[i];
            const displayId = Constants.gearDisplayIdByIndex[i];

            const html = HtmlGenerator.buildItemPanel(gear, "heroesGrid", baseStats)
            document.getElementById(displayId).innerHTML = html;
        }
    })
}

function getField(heroStats, stat) {
    return heroStats.map(x => x[stat]);
}
function cleanInfinities(num) {
    if (num == -Infinity || num == Infinity) {
        return 0;
    }
    return num;
}


function updateCurrentAggregate(hero) {
    const statsToAggregate = [
        "atk",
        "hp",
        "def",
        "spd",
        "cr",
        "cd",
        "eff",
        "res",
        "dac",
        "cp",
        "hpps",
        "ehp",
        "ehpps",
        "dmg",
        "dmgps",
        "mcdmg",
        "mcdmgps",
        "dmgh",
        "dmgd",
        "score"
    ]

    const heroStats = hero.builds || [];
    var count = heroStats.length;

    for (var stat of statsToAggregate) {
        const arrSum = arr => arr.reduce((a,b) => a + b[stat], 0);
        var max = Math.max(...getField(heroStats, stat));
        var min = Math.min(...getField(heroStats, stat));
        var sum = arrSum(heroStats);
        var avg = hero[stat];

        if (stat == 'cr') {
            max = Math.min(100, max);
            min = Math.min(100, min);
        }
        if (stat == 'cd') {
            max = Math.min(350, max);
            min = Math.min(350, min);
        }

        currentAggregate[stat] = {
            max: cleanInfinities(max),
            min: cleanInfinities(min),
            sum: cleanInfinities(sum),
            avg: cleanInfinities(avg)
        }
    }

    console.log("Aggregated", currentAggregate);
}

function onRowDragEnter(e) {
  console.warn('onRowDragEnter', e);
  heroesGrid.gridOptions.api.selectNode(e.node)
}

async function onRowDragEnd(e) {
    console.log('onRowDragEnd', e, e.overIndex);

    const dragged = e.node.data;
    const destination = e.overNode.data;

    await Api.reorderHeroes(dragged.id, e.overIndex + 1);
    HeroesTab.redraw();
}

// function onRowDragMove(e) {
//   // console.log('onRowDragMove', e);
// }

function onRowDragLeave(e) {
  // console.log('onRowDragLeave', e);
}

var lastOverNode = undefined;
var toReplace = undefined;

function onRowDragMove(event) {
    var movingNode = event.node;
    var overNode = event.overNode;

    var rowNeedsToMove = overNode.data.id != lastOverNode?.data.id &&
                         overNode.data.id != lastOverNode?.data.id &&
                         overNode.data.id != movingNode.data.id;

    if (rowNeedsToMove) {
        console.log('onRowDragMove', overNode.data.id, lastOverNode?.data.id, movingNode.data.id, rowNeedsToMove);
    }
    lastOverNode = overNode;

    if (rowNeedsToMove) {
        // the list of rows we have is data, not row nodes, so extract the data
        var movingData = movingNode.data;
        var overData = overNode.data;

        var fromIndex = currentHeroes.indexOf(movingData);
        var toIndex = currentHeroes.indexOf(overData);

        var newStore = currentHeroes.slice();
        moveInArray(newStore, fromIndex, toIndex);

        currentHeroes = newStore;
        heroesGrid.gridOptions.api.setRowData(newStore);

        heroesGrid.gridOptions.api.clearFocusedCell();
    }
}

function moveInArray(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}


var filterActive = false;
var sortActive = false;
function onSortChanged() {
  var sortModel = heroesGrid.gridOptions.api.getSortModel();
  sortActive = sortModel && sortModel.length > 0;
  // suppress row drag if either sort or filter is active
  var suppressRowDrag = sortActive || filterActive;
  console.log(
    'sortActive = ' +
      sortActive +
      ', allowRowDrag = ' +
      suppressRowDrag
  );
  heroesGrid.gridOptions.api.setSuppressRowDrag(suppressRowDrag);
}
// listen for changes on filter changed
function onFilterChanged() {
  filterActive = heroesGrid.gridOptions.api.isAnyFilterPresent();
  // suppress row drag if either sort or filter is active
  var suppressRowDrag = sortActive || filterActive;
  console.log(
    'sortActive = ' +
      sortActive +
      ', filterActive = ' +
      filterActive +
      ', allowRowDrag = ' +
      suppressRowDrag
  );
  heroesGrid.gridOptions.api.setSuppressRowDrag(suppressRowDrag);
}

function onRowDoubleClicked(e) {
    if (!e.data || !e.data.id) {
        return
    }

    var heroId = e.data.id

    console.log("Double clicked hero row", e)
    $("#inputHeroAdd").val(heroId).change();
    $('#tab1').trigger('click');
}