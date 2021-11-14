var progressTimer = null;
var count = 0;
var interrupt = false;
global.multiOptimizerHeroes = []

function setMultiOptimizerHero(index, heroResponse) {
    redrawHeroImage(index);
    multiOptimizerHeroes[index].heroResponse = heroResponse;
    multiOptimizerHeroes[index].hero = heroResponse.hero;

    recalculateFilters(index);

    setPinnedHero(index, heroResponse.hero);
    togglePanelSelect(index, false);

    drawMultiPreview([], [], index)
    if (multiOptimizerHeroes[index] && multiOptimizerHeroes[index].grid) {
        multiOptimizerHeroes[index].grid.gridOptions.api.deselectAll();
    }
}

function initializeBlank(index) {
    const html = `<div class="multiOptimizerHeroRow" id="heroRow${index}">
  <div class="multiTopRow">
      <div class="multiInfoPanel" id="multiInfoPanel${index}">
          <select id="addMultiOptimizerHeroesSelector${index}" class="gearPreviewButton"></select>
          <div class="inputHeroImageContainer">
              <img src="" id="multiInputHeroImage${index}" class="inputHeroImage"></img>
          </div>

          <input type="submit" value="${i18next.t("Start")}" class="gearPreviewButton" id="multiStart${index}" data-t ><br>
          <div class="multiSpace"></div>
          <input type="submit" value="${i18next.t("Edit filters")}" class="gearPreviewButton" id="multiEditFilters${index}" data-t ><br>
          <div class="multiSpace"></div>
          <input type="submit" value="${i18next.t("Equip")}" class="gearPreviewButton" id="multiEquip${index}" data-t ><br>
          <div class="multiSpace"></div>
          <input type="submit" value="${i18next.t("Save")}" class="gearPreviewButton" id="multiSave${index}" data-t ><br>
          <div class="multiSpace"></div>
          <input type="submit" value="${i18next.t("Deselect")}" class="gearPreviewButton" id="multiUnselect${index}" data-t ><br>
          <div class="multiSpace"></div>
          <input type="submit" value="${i18next.t("Cancel")}" class="gearPreviewButton" id="multiCancel${index}" data-t ><br>
          <div class="multiSpace"></div>
          <input type="submit" value="${i18next.t("Remove")}" class="gearPreviewButton" id="multiRemove${index}" data-t ><br>
      </div>
      <div class="ag-theme-balham multiGrid" id="multiGrid${index}">
      </div>
  </div>

  <div class="multiBottomRow">
    <div id="multi-optimizer-equipped-section${index}" class="optimizer-equipped-section">
      <div id="multi-optimizer-heroes-equipped-weapon${index}" class="gear-preview-row">
      </div>
      <div class="vertical"></div>
      <div id="multi-optimizer-heroes-equipped-helmet${index}" class="gear-preview-row">
      </div>
      <div class="vertical"></div>
      <div id="multi-optimizer-heroes-equipped-armor${index}" class="gear-preview-row">
      </div>
      <div class="vertical"></div>
      <div id="multi-optimizer-heroes-equipped-necklace${index}" class="gear-preview-row">
      </div>
      <div class="vertical"></div>
      <div id="multi-optimizer-heroes-equipped-ring${index}" class="gear-preview-row">
      </div>
      <div class="vertical"></div>
      <div id="multi-optimizer-heroes-equipped-boots${index}" class="gear-preview-row">
      </div>
    </div>
  </div>
  <div class="horizontalSpace"></div>
</div>
`

    $('#multi-optimizer-section').append(html);

    if (i18next.language == 'zh') {
      var localeText = AG_GRID_LOCALE_ZH;
    } else if (i18next.language == 'zh-TW') {
      var localeText = AG_GRID_LOCALE_ZH_TW;
    } else if (i18next.language == 'fr') {
      var localeText = AG_GRID_LOCALE_FR;
    } else if (i18next.language == 'ja') {
      var localeText = AG_GRID_LOCALE_JA;
    } else {
      var localeText = AG_GRID_LOCALE_EN;
    }
    console.log('localeText:'+localeText);
    const DIGITS_2 = 35;
    const DIGITS_3 = 41;
    const DIGITS_4 = 45;
    const DIGITS_5 = 50;
    const DIGITS_6 = 55;

    function numberFormatter(params) {
        return params.value;
    }


    // function navigateCallback(selectedNode) {
    //     if (!selectedNode) return;
    //     const item = selectedNode.data;
    //     selectedCell = item;

    //     drawPreview(item);
    // }

    function customGridGetter() {
        return multiOptimizerHeroes[index].grid
    }

    const gridOptions = {
        defaultColDef: {
            width: 50,
            sortable: true,
            sortingOrder: ['desc', 'asc'],
            cellStyle: columnGradientProvider(index),
            // suppressNavigable: true,
            cellClass: 'no-border',
            valueFormatter: numberFormatter,
        },

        columnDefs: [
            {headerName: i18next.t('sets'), field: 'sets', width: 100, cellRenderer: (params) => GridRenderer.renderSets(params.value)},
            {headerName: i18next.t('atk'), field: 'atk', width: DIGITS_4},
            {headerName: i18next.t('def'), field: 'def', width: DIGITS_4},
            {headerName: i18next.t('hp'), field: 'hp', width: DIGITS_5},
            {headerName: i18next.t('spd'), field: 'spd', width: DIGITS_3},
            {headerName: i18next.t('cr'), field: 'cr', width: DIGITS_3},
            {headerName: i18next.t('cd'), field: 'cd', width: DIGITS_3},
            {headerName: i18next.t('eff'), field: 'eff', width: DIGITS_3},
            {headerName: i18next.t('res'), field: 'res', width: DIGITS_3},
            // {headerName: i18next.t('dac'), field: 'dac'},
            {headerName: i18next.t('cp'), field: 'cp', width: DIGITS_6},
            {headerName: i18next.t('hps'), field: 'hpps', width: DIGITS_4},
            {headerName: i18next.t('ehp'), field: 'ehp', width: DIGITS_6},
            {headerName: i18next.t('ehps'), field: 'ehpps', width: DIGITS_5},
            {headerName: i18next.t('dmg'), field: 'dmg', width: DIGITS_5},
            {headerName: i18next.t('dmgs'), field: 'dmgps', width: DIGITS_4},
            {headerName: i18next.t('mcd'), field: 'mcdmg', width: DIGITS_5},
            {headerName: i18next.t('mcds'), field: 'mcdmgps', width: DIGITS_4},
            {headerName: i18next.t('dmgh'), field: 'dmgh', width: DIGITS_5},
            {headerName: i18next.t('score'), field: 'score', width: DIGITS_3},
            {headerName: i18next.t('prio'), field: 'priority', width: DIGITS_3},
            {headerName: i18next.t('upg'), field: 'upgrades', width: DIGITS_2, width: 48},
            {headerName: i18next.t('actions'), field: 'property', width: 50, sortable: false, cellRenderer: (params) => GridRenderer.renderStar(params.value)},
        ],
        rowHeight: 27,
        rowModelType: 'infinite',
        rowSelection: 'single',
        // onRowClicked: onRowClicked,
        // onRowSelected: provideOnRowSelected(grid),
        pagination: true,
        paginationPageSize: 500,
        localeText: localeText,
        cacheBlockSize: 500,
        maxBlocksInCache: 1,
        suppressPaginationPanel: false,
        datasource: {},
        // animateRows: true,
        suppressScrollOnNewData: true,
        suppressCellSelection: true,
        enableRangeSelection: false,
        navigateToNextCell: GridRenderer.arrowKeyNavigator(this, "multiGrid", null, customGridGetter),
        // onCellMouseOver: cellMouseOver,
        // onCellMouseOut: cellMouseOut,
        getRowNodeId: d => {
           return d.id; // return the property you want set as the id.
        },
        suppressDragLeaveHidesColumns: true,
    };

    const gridDiv = document.getElementById('multiGrid' + index);
    const grid = new Grid(gridDiv, gridOptions);

    function provideGridNavigator() {
        return GridRenderer.arrowKeyNavigator(this, "multiGrid", null, grid)
    }

    grid.gridOptions.onRowSelected = provideOnRowSelected(grid, index);
    // grid.gridOptions.navigateToNextCell = GridRenderer.arrowKeyNavigator(this, "multiGrid", null, grid);

    multiOptimizerHeroes[index] = {
        index: index,
        div: gridDiv,
        gridOptions, gridOptions,
        grid: grid,
        initialized: false,
        currentAggregate: {}
    }


    $('#' + $("#" + multiOptimizerHeroes[index].div.id).find('.ag-paging-panel').first().attr('id')).prepend(`
        <div class="injectedSummaryRow">
            <div class="injectedSummaryComponent" id="summaryPanel1-${index}">
            </div>
            <div class="injectedSummaryComponent" id="summaryPanel2-${index}">
            </div>
            <div class="injectedSummaryComponent" id="summaryPanel3-${index}">
            </div>
        </div>
    `)

    module.exports.redrawHeroSelector(index)

    $('#addMultiOptimizerHeroesSelector' + index).change(async () => {
        const heroId = document.getElementById('addMultiOptimizerHeroesSelector' + index).value;

        if (!heroId || heroId.length == 0 || heroId == multiOptimizerHeroes[index].hero && multiOptimizerHeroes[index].hero.id) {
            return;
        }

        const heroResponse = await Api.getHeroById(heroId, true);
        // const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));

        setMultiOptimizerHero(index, heroResponse);
        if (index == multiOptimizerHeroes.length - 1) {
            initializeBlank(index + 1);
        }
    });

    document.getElementById('multiStart' + index).addEventListener("click", async () => {
        interrupt = false;
        handleStartOptimizationRequest(index)
    })

    document.getElementById('multiEditFilters' + index).addEventListener("click", async () => {
        console.warn(multiOptimizerHeroes, multiOptimizerHeroes[index])
        const heroIndex = multiOptimizerHeroes[index];

        if (!heroIndex || !heroIndex.hero) {
            return;
        }

        const heroResponse = await Api.getHeroById(heroIndex.hero.id, true);

        const heroId = multiOptimizerHeroes[index].hero.heroId;
        const hero = heroResponse.hero;
        if (!hero) {
            return;
        }

        const params = await Dialog.editFiltersDialog(hero, index)

        if (!params) {
            return;
        }

        const baseStats = heroIndex.baseStats;

        const request = {
            base: heroIndex.baseStats,
            requestType: "OptimizationRequest",
            items: null,
            bonusHp: hero.bonusHp,
            bonusAtk: hero.bonusAtk,
            hero: hero
        }

        const mergedRequest = Object.assign(request, params, baseStats);

        Api.saveOptimizationRequest(mergedRequest).then(Saves.autoSave());

        recalculateFilters(index);
    });

    document.getElementById('multiEquip' + index).addEventListener("click", async () => {
        const heroIndex = multiOptimizerHeroes[index];
        const grid = heroIndex.grid;

        const selectedGear = getSelectedGearIds(grid);
        if (selectedGear.length == 0) return;
        if (selectedGear.includes(undefined) || selectedGear.includes(null)) {
            return;
        }

        const heroId = heroIndex.hero.id;

        // const heroResult = await Api.equipItemsOnHero(heroId, selectedGear, $('#inputPredictReforges').prop('checked')); // TODO: make this based off params
        const heroResult = await Api.equipItemsOnHero(heroId, selectedGear, true);
        const hero = heroResult.hero;

        const row = grid.gridOptions.api.getSelectedRows()[0]
        const node = grid.gridOptions.api.getSelectedNodes()[0]
        const rowId = row.id;

        if (row.mods.filter(x => x).length > 0) {
            row.name = "MOD: " + (!hero.modGrade ? "" : (hero.modGrade == "greater" ? "Greater" : "Lesser")) + " " + (hero.rollQuality || "0") + "%";
        }

        await Api.addBuild(heroId, row);
        await Api.editResultRows(parseInt(rowId), "star", heroIndex.executionId);

        row.property = "star";
        node.updateData(row);

        drawMultiPreview(selectedGear, getSelectedGearMods(grid), index)
        setPinnedHero(index, hero);
    });

    document.getElementById('multiRemove' + index).addEventListener("click", async () => {
        handleRemove(index);
    });

    document.getElementById('multiCancel' + index).addEventListener("click", async () => {
        if (progressTimer) {
            clearInterval(progressTimer);
        }
        Api.cancelOptimizationRequest();
    });

    document.getElementById('multiSave' + index).addEventListener("click", async () => {
        const heroIndex = multiOptimizerHeroes[index];
        const grid = heroIndex.grid;

        const selectedGear = getSelectedGearIds(grid);
        if (selectedGear.length == 0) return;
        if (selectedGear.includes(undefined) || selectedGear.includes(null)) {
            return;
        }

        const heroId = heroIndex.hero.id;

        // const heroResult = await Api.equipItemsOnHero(heroId, selectedGear, $('#inputPredictReforges').prop('checked')); // TODO: make this based off params

        const row = grid.gridOptions.api.getSelectedRows()[0]
        const node = grid.gridOptions.api.getSelectedNodes()[0]
        const rowId = row.id;

        const hero = (await Api.getHeroById(heroId)).hero;
        if (row.mods.filter(x => x).length > 0) {
            row.name = "MOD: " + (!hero.modGrade ? "" : (hero.modGrade == "greater" ? "Greater" : "Lesser")) + " " + (hero.rollQuality || "0") + "%";
        }

        await Api.addBuild(heroId, row);
        await Api.editResultRows(parseInt(rowId), "star", heroIndex.executionId);

        row.property = "star";
        node.updateData(row);

        drawMultiPreview(selectedGear, getSelectedGearMods(grid), index)
    });

    document.getElementById('multiUnselect' + index).addEventListener("click", async () => {
        handleDeselect(index);
    });
}

function handleDeselect(index) {
    const heroIndex = multiOptimizerHeroes[index];
    if (!heroIndex || !heroIndex.grid) {
        return;
    }

    const grid = heroIndex.grid;

    grid.gridOptions.api.deselectAll();
    drawMultiPreview([], [], index)
    filterMultiGridItems(index);
    togglePanelSelect(index, false);
}

function handleRemove(index) {
    if (multiOptimizerHeroes.filter(x => !!x).length == 1) {
        return;
    }

    if (!multiOptimizerHeroes[index] || !multiOptimizerHeroes[index].hero) {
        return;
    }

    const heroIndex = multiOptimizerHeroes[index];
    const grid = heroIndex.grid;

    grid.destroy()

    Api.deleteExecution(heroIndex.executionId);

    $("#heroRow" + index).remove()
    multiOptimizerHeroes[index] = null;
}

async function recalculateFilters(index) {
    const heroIndex = multiOptimizerHeroes[index];
    const heroResponse = await Api.getHeroById(heroIndex.hero.id, true);

    const heroId = multiOptimizerHeroes[index].hero.heroId;
    const hero = heroResponse.hero;
    if (!hero) {
        return;
    }

    const baseStats = heroIndex.baseStats;

    const allItemsResponse = await Api.getAllItems();

    const allowedHeroIds = [];

    for (var multiHero of multiOptimizerHeroes) {
        if (multiHero && multiHero.hero) {
            allowedHeroIds.push(multiHero.hero.id)
        }
    }

    const params = hero.optimizationRequest || getDefaultParams();
    params.excludeFilter = Settings.getExcludeSelects()

    const gearMainFilters = [params.inputNecklaceStat, params.inputRingStat, params.inputBootsStat]

    OptimizerTab.applyItemFilters(params, heroResponse, allItemsResponse, false, allowedHeroIds, gearMainFilters).then(result => {
        var items = result.items;
        var allItems = result.allItems;

        const weapons = items.filter(x => x.gear == "Weapon");
        const helmets = items.filter(x => x.gear == "Helmet");
        const armors = items.filter(x => x.gear == "Armor");
        const necklaces = items.filter(x => x.gear == "Necklace");
        const rings = items.filter(x => x.gear == "Ring");
        const boots = items.filter(x => x.gear == "Boots");

        const allWeapons = allItems.filter(x => x.gear == "Weapon");
        const allHelmets = allItems.filter(x => x.gear == "Helmet");
        const allArmors = allItems.filter(x => x.gear == "Armor");
        const allNecklaces = allItems.filter(x => x.gear == "Necklace");
        const allRings = allItems.filter(x => x.gear == "Ring");
        const allBoots = allItems.filter(x => x.gear == "Boots");

        permutations = weapons.length
                * helmets.length
                * armors.length
                * necklaces.length
                * rings.length
                * boots.length;

        $(`#summaryPanel1-${index}`).text(i18next.t("Permutations") + ": " + Number(permutations).toLocaleString());

        console.warn("PERMUTATIONS: " + permutations)
    });
}

module.exports = {
    toggleDarkMode(enabled) {
        if (enabled) {
            gradient = darkGradient;
        } else {
            gradient = lightGradient;
        }

        try {
            for (var multiHero of multiOptimizerHeroes) {
                if (multiHero && multiHero.grid) {
                    multiHero.grid.gridOptions.api.refreshView()
                }
            }
        } catch (e) {

        }
    },

    initialize: async () => {
              initializeBlank(0)

        document.getElementById('multiGuide').addEventListener("click", async () => {
            Dialog.multiOptimizerGuide(
`
<h2>
    ${i18next.t("Multi Optimizer Guide")}
</h2>

${i18next.t("This tool is for building multiple heroes simultaneously, who share similar gear requirements.")}

<ul class='newFeatures'>
    <li>${i18next.t("Instructions")}</li>
    <ul>
        <li>${i18next.t("First, add all the heroes that you want to optimize.")}</li>
        <li>${i18next.t("Heroes must have filters to optimizer, click 'Edit filters' to change their stat and item filters.")}</li>
        <li>${i18next.t("Lower your permutations as much as possible. Aim for < 5 million results total across all heroes.")}</li>
        <li>${i18next.t("Click 'Start all' to begin optimizing all selected heroes, then wait for results.")}</li>
        <li>${i18next.t("Once finished, select a row to filter out builds containing the row's items from other heroes.")}</li>
        <li>${i18next.t("Click 'Deselect' to clear the selected build, and un-filter the row's items from other heroes.")}</li>
    </ul>

    <br>
    <li>${i18next.t("Details")}</li>
    <ul>
        <li>${i18next.t("This works best with 2-4 heroes, but there is no hard limit. More than 4 can be slow.")}</li>
        <li>${i18next.t("The hero priority filter has one difference: all units added into the multi-optimizer are allowed to use each other's equipped items.")}</li>
        <li>${i18next.t("If a new hero is added to the multi-optimizer while other heroes already have results, Hit 'Start all' again to refresh the existing builds.")}</li>
        <li>${i18next.t("The java process has to store all the results across all heroes. If you notice the permutations progressing very slowly, you may have run out of memory. Hit 'Cancel all' and apply stricter filters.")}</li>
    </ul>
</ul>`)
        });

        document.getElementById('multiStartAll').addEventListener("click", async () => {
            var index = 0;
            const callback = (result) => {
                if (result == "OK") {
                    if (index >= multiOptimizerHeroes.length || interrupt) {
                        return;
                    }

                    index++;
                    handleStartOptimizationRequest(index, callback);
                }
            }
            handleStartOptimizationRequest(index, callback);
        });

        document.getElementById('multiCancelAll').addEventListener("click", async () => {
            interrupt = true;
            if (progressTimer) {
                clearInterval(progressTimer);
            }
            Api.cancelOptimizationRequest();
        });

        document.getElementById('multiRemoveAll').addEventListener("click", async () => {
            for (var i = multiOptimizerHeroes.length; i >= 0; i--) {
                handleRemove(i);
            }
        });

        document.getElementById('multiDeselectAll').addEventListener("click", async () => {
            handleDeselect
            for (var i = multiOptimizerHeroes.length; i >= 0; i--) {
                handleDeselect(i);
            }
            for (var i = multiOptimizerHeroes.length; i >= 0; i--) {
                handleDeselect(i);
            }
        });

        document.getElementById('tab2label').addEventListener("click", async () => {
            const getAllHeroesResponse = await Api.getAllHeroes();
            const heroes = getAllHeroesResponse.heroes;
            Utils.sortByAttribute(heroes, "name");

            for (var i = 0; i < multiOptimizerHeroes.length; i++) {
                const optimizerHeroSelector = document.getElementById('addMultiOptimizerHeroesSelector' + i)
                const options = optimizerHeroSelector.options;
                var selected = Array.apply(null, options).filter(x => x.selected)
                selected = selected.length ? selected[0] : null;

                var select = document.getElementById('addMultiOptimizerHeroesSelector' + i);
                var length = select.options.length;
                for (k = length-1; k >= 0; k--) {
                    select.options[k] = null;
                }

                for (var j = 0; j < heroes.length; j++) {
                    const hero = heroes[j];
                    option = document.createElement('option');
                    option.innerHTML = i18next.t(hero.name);
                    option.label = hero.name;
                    option.value = hero.id;

                    if (selected && hero.id == selected.value) {
                        option.selected = true;
                    }

                    optimizerHeroSelector.add(option);
                }

                Selectors.refreshMultiHeroSelector('addMultiOptimizerHeroesSelector' + i)
            }
        });
    },

    redrawHeroSelector: async (index) => {
        const getAllHeroesResponse = await Api.getAllHeroes();
        const selectedId = $( "#addMultiOptimizerHeroesSelector" + index + " option:selected" ).val()

        clearHeroOptions("addMultiOptimizerHeroesSelector" + index);

        const optimizerHeroSelector = document.getElementById('addMultiOptimizerHeroesSelector' + index)
        const heroes = getAllHeroesResponse.heroes;
        Utils.sortByAttribute(heroes, "name");
        console.log("REDRAWHEROSELECTOR getAllHeroesResponse", getAllHeroesResponse)

        heroes.unshift({
            name: "",
            id: ""
        })

        for (var hero of heroes) {
            const option = document.createElement('option');
            const option2 = document.createElement('option');
            option.innerHTML = i18next.t(hero.name);
            option.label = hero.name;
            option.value = hero.id;
            option2.innerHTML = i18next.t(hero.name);
            option2.label = hero.name;
            option2.value = hero.id;

            optimizerHeroSelector.add(option);

            // if (selectedId && selectedId == hero.id) {
            //     optimizerHeroSelector.value = selectedId
            //     OptimizerGrid.setPinnedHero(hero);
            // }
        }

        Selectors.setMultiHeroSelector('addMultiOptimizerHeroesSelector' + index)
    }
}

function setPinnedHero(index, hero) {
    multiOptimizerHeroes[index].grid.gridOptions.api.setPinnedTopRowData([hero]);
    // pinnedRow = hero;
    // StatPreview.draw(pinnedRow, pinnedRow)
}

function clearHeroOptions(id) {
    var select = document.getElementById(id);
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
      select.options[i] = null;
    }
}

const tinygradient = require('tinygradient');
const colorPicker = require('../colorPicker');


var lightGradient = {gradient:tinygradient([
    {color: '#F5A191', pos: 0}, // red
    {color: '#ffffe5', pos: 0.4},
    {color: '#77e246', pos: 1} // green
])};

var darkGradient = colorPicker.getColors();
// var darkGradient = {gradient:tinygradient([
//     {color: '#5A1A06', pos: 0}, // red
//     {color: '#343127', pos: 0.4},
//     {color: '#38821F', pos: 1} // green
// ])};

var gradient = lightGradient;

function columnGradientProvider(index) {
    function columnGradient(params) {
        try {
            if (!params || params.value == undefined) return;
            var colId = params.column.colId;
            var value = params.value;

            var agg = multiOptimizerHeroes[index].currentAggregate[colId];
            if (!agg) return;

            var percent = agg.max == agg.min ? 1 : (value - agg.min) / (agg.max - agg.min);
            percent = Math.min(1, Math.max(0, percent))

            var color = gradient.gradient.rgbAt(percent);
            if (agg.min == 0 && agg.max == 0) {
                color = gradient.gradient.rgbAt(0.5)
            }

            return {
                backgroundColor: color.toHexString()
            };
        } catch (e) {console.error(e)}
    }

    return columnGradient;
}

// var currentSortModel;
// var currentAggregate = {};
var selectedRow = null;
var pinnedRow = {
    atk: 0,
    def: 0,
    hp: 0,
    spd: 0,
    cr: 0,
    cd: 0,
    eff: 0,
    res: 0
};


function aggregateCurrentHeroStats(heroStats, index) {
    const currentAggregate = multiOptimizerHeroes[index].currentAggregate;
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
        "score",
        "priority"
    ]

    var count = heroStats.length;

    for (var stat of statsToAggregate) {
        const arrSum = arr => arr.reduce((a,b) => a + b[stat], 0);
        var max = Math.max(...getField(heroStats, stat));
        var min = Math.min(...getField(heroStats, stat));
        var sum = arrSum(heroStats);
        var avg = sum/count;

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

function getDataSource(index, grid, multiHero) {
    return {
        async getRows(params) {
            // if (!grid) {
            //     return;
            // }
            console.log("DEBUG getRows params", params);
            const startRow = params.startRow;
            const endRow = params.endRow;
            const sortColumn = params.sortModel.length ? params.sortModel[0].colId : null;
            const sortOrder = params.sortModel.length ? params.sortModel[0].sort : null;

            grid.gridOptions.api.showLoadingOverlay();
            const heroId = document.getElementById('inputHeroAdd').value;
            const optimizationRequest = OptimizerTab.getOptimizationRequestParams();
            optimizationRequest.heroId = heroId;

            const request = {
                startRow: startRow,
                endRow: endRow,
                sortColumn: sortColumn,
                sortOrder: sortOrder,
                optimizationRequest: optimizationRequest
            }

            const executionId = multiOptimizerHeroes[index].executionId;
            request.executionId = executionId;


            // const selectedNodes = grid.gridOptions.api.getSelectedNodes()
            // var selectedNode;
            // if (selectedNodes.length > 0) {
            //     selectedNode = selectedNodes[0];
            // }

            const getResultRowsResponse = Api.getResultRows(request).then(getResultRowsResponse => {
                console.log("GetResultRowsResponse", getResultRowsResponse);
                aggregateCurrentHeroStats(getResultRowsResponse.heroStats, index)
                grid.gridOptions.api.hideOverlay();

                var pinned = grid.gridOptions.api.getPinnedTopRow(0);
                if (pinned) {
                    grid.gridOptions.api.setPinnedTopRowData([pinned.data])
                }

                params.successCallback(getResultRowsResponse.heroStats, getResultRowsResponse.maximum)
            });
        },
    }
}
// const datasource = {
//     async getRows(params) {
//         console.log("DEBUG getRows params", params);
//         const startRow = params.startRow;
//         const endRow = params.endRow;
//         const sortColumn = params.sortModel.length ? params.sortModel[0].colId : null;
//         const sortOrder = params.sortModel.length ? params.sortModel[0].sort : null;

//         global.optimizerGrid = optimizerGrid;

//         optimizerGrid.gridOptions.api.showLoadingOverlay();
//         const heroId = document.getElementById('inputHeroAdd').value;
//         const optimizationRequest = OptimizerTab.getOptimizationRequestParams();
//         optimizationRequest.heroId = heroId;

//         const request = {
//             startRow: startRow,
//             endRow: endRow,
//             sortColumn: sortColumn,
//             sortOrder: sortOrder,
//             optimizationRequest: optimizationRequest
//         }

//         const getResultRowsResponse = Api.getResultRows(request).then(getResultRowsResponse => {
//             console.log("GetResultRowsResponse", getResultRowsResponse);
//             aggregateCurrentHeroStats(getResultRowsResponse.heroStats)
//             optimizerGrid.gridOptions.api.hideOverlay();
//             params.successCallback(getResultRowsResponse.heroStats, getResultRowsResponse.maximum)

//             var pinned = optimizerGrid.gridOptions.api.getPinnedTopRow(0);
//             if (pinned) {
//                 optimizerGrid.gridOptions.api.setPinnedTopRowData([pinned.data])
//             }
//         });
//     },
// }


function getField(heroStats, stat) {
    return heroStats.map(x => x[stat]);
}
function cleanInfinities(num) {
    if (num == -Infinity || num == Infinity) {
        return 0;
    }
    return num;
}


function redrawHeroImage(index) {
    const name = $( "#addMultiOptimizerHeroesSelector" + index + " option:selected" ).attr("label")
    if (!name || name.length == 0) {
        $('#multiInputHeroImage' + index).attr("src", Assets.getBlank());
        return;
    }

    const data = HeroData.getHeroExtraInfo(name);
    const image = data.assets.thumbnail;

    $('#multiInputHeroImage' + index).attr("src", image);
}

function drawMultiPreview(gearIds, mods, index) {
    console.log("Draw preview", gearIds, mods)

    if (gearIds == []) {
        document.getElementById('multi-optimizer-heroes-equipped-weapon' + index).innerHTML = HtmlGenerator.buildItemPanel(null, "multOptimizerGrid", null);
        document.getElementById('multi-optimizer-heroes-equipped-helmet' + index).innerHTML = HtmlGenerator.buildItemPanel(null, "multOptimizerGrid", null);
        document.getElementById('multi-optimizer-heroes-equipped-armor' + index).innerHTML = HtmlGenerator.buildItemPanel(null, "multOptimizerGrid", null);
        document.getElementById('multi-optimizer-heroes-equipped-necklace' + index).innerHTML = HtmlGenerator.buildItemPanel(null, "multOptimizerGrid", null);
        document.getElementById('multi-optimizer-heroes-equipped-ring' + index).innerHTML = HtmlGenerator.buildItemPanel(null, "multOptimizerGrid", null);
        document.getElementById('multi-optimizer-heroes-equipped-boots' + index).innerHTML = HtmlGenerator.buildItemPanel(null, "multOptimizerGrid", null);
        return;
    }

    const moddedGear = ModificationFilter.getModsByIds(gearIds, mods);
    console.log("Modded gear results", moddedGear)

    Api.getItemsByIds(gearIds).then(async (response) => {
        const selectedGear = response.items;

        if (!multiOptimizerHeroes[index] || !multiOptimizerHeroes[index].hero) {
            return;
        }

        const heroId = multiOptimizerHeroes[index].hero.id;
        // const heroId = document.getElementById('inputHeroAdd').value;
        // const getHeroByIdResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
        const getHeroByIdResponse = await Api.getHeroById(heroId, true);
        const hero = getHeroByIdResponse.hero;
        const baseStats = getHeroByIdResponse.baseStats;

        if (!hero || !baseStats) return;

        for (var i = 0; i < 6; i++) {
            if (moddedGear[i]) {
                var equippedById = selectedGear[i].equippedById;
                var equippedByName = selectedGear[i].equippedByName;

                selectedGear[i] = moddedGear[i];
                selectedGear[i].equippedById = equippedById;
                selectedGear[i].equippedByName = equippedByName;
                selectedGear[i].substats = moddedGear[i].substats;
                for (var j = 0; j < selectedGear[i].substats.length; j++) {
                    selectedGear[i].substats[j].modified = moddedGear[i].substats[j].modified;
                    selectedGear[i].substats[j].value = moddedGear[i].substats[j].value;
                    selectedGear[i].substats[j].reforgedValue = moddedGear[i].substats[j].reforgedValue;
                    selectedGear[i].substats[j].reforged = true;
                }
                continue;
            }
        }

        document.getElementById('multi-optimizer-heroes-equipped-weapon' + index).innerHTML = HtmlGenerator.buildItemPanel(selectedGear[0], "multOptimizerGrid", baseStats);
        document.getElementById('multi-optimizer-heroes-equipped-helmet' + index).innerHTML = HtmlGenerator.buildItemPanel(selectedGear[1], "multOptimizerGrid", baseStats);
        document.getElementById('multi-optimizer-heroes-equipped-armor' + index).innerHTML = HtmlGenerator.buildItemPanel(selectedGear[2], "multOptimizerGrid", baseStats);
        document.getElementById('multi-optimizer-heroes-equipped-necklace' + index).innerHTML = HtmlGenerator.buildItemPanel(selectedGear[3], "multOptimizerGrid", baseStats);
        document.getElementById('multi-optimizer-heroes-equipped-ring' + index).innerHTML = HtmlGenerator.buildItemPanel(selectedGear[4], "multOptimizerGrid", baseStats);
        document.getElementById('multi-optimizer-heroes-equipped-boots' + index).innerHTML = HtmlGenerator.buildItemPanel(selectedGear[5], "multOptimizerGrid", baseStats);
    })
}

async function filterMultiGridItems(index) {
    for (var multiHero of multiOptimizerHeroes) {
        if (!multiHero || !multiHero.hero) {
            continue;
        }
        if (multiHero.index == index) {
            continue;
        }

        const grid = multiHero.grid;
        const filteredGearIds = getSelectedGearIds(grid);

        var allFilteredItems = [];
        for (var otherMultiHero of multiOptimizerHeroes) {
            if (!otherMultiHero || !otherMultiHero.hero || otherMultiHero.hero.id == multiHero.id) {
                continue;
            }
            const otherFilteredGearIds = getSelectedGearIds(otherMultiHero.grid)
            allFilteredItems = allFilteredItems.concat(otherFilteredGearIds)
        }

        const difference = allFilteredItems.filter(x => !filteredGearIds.includes(x));

        const heroResponse = await Api.getHeroById(multiHero.hero.id);
        const request = heroResponse.hero.optimizationRequest;

        if (!request) {
            continue;
        }

        request.executionId = multiHero.executionId;
        request.excludedGearIds = difference;

        const response = await Api.submitOptimizationFilterRequest(request)
        console.warn("Optimization filter response", response);

        multiHero.grid.gridOptions.api.refreshInfiniteCache();
        // multiHero.grid.gridOptions.api.purgeInfiniteCache();
    }

    ensureSelectedRowVisible();
}

function ensureSelectedRowVisible() {
    for (var multiHero of multiOptimizerHeroes) {
        if (!multiHero || !multiHero.grid) {
            continue;
        }

        const selectedNodes = multiHero.grid.gridOptions.api.getSelectedNodes()
        if (selectedNodes.length > 0) {
            multiHero.grid.gridOptions.api.ensureNodeVisible(selectedNodes[0]);
        }
    }
}

function provideOnRowSelected(grid, index) {
    function onRowSelected(event) {
        console.log("row selected", event)
        if (!event.node.selected || event.rowPinned == "top") return;

        selectedRow = event.data;

        const gearIds = getSelectedGearIds(grid);
        const mods = getSelectedGearMods(grid);
        drawMultiPreview(gearIds, mods, index);

        multiOptimizerHeroes[index].selectedItems = gearIds;
        filterMultiGridItems(index, gearIds);

        togglePanelSelect(index, true)
    }

    return onRowSelected;
}

function getSelectedGearIds(grid) {
    const selectedRows = grid.gridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
        const row = selectedRows[0];
        console.log("getSelectedGearIds SELECTED ROW", row)

        return [
            row.items[0],
            row.items[1],
            row.items[2],
            row.items[3],
            row.items[4],
            row.items[5]
        ];
    }
    return [];
}

function getSelectedGearMods(grid) {
    const selectedRows = grid.gridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
        const row = selectedRows[0];
        console.log("getSelectedGearModIds SELECTED ROW", row)

        return [
            row.mods[0],
            row.mods[1],
            row.mods[2],
            row.mods[3],
            row.mods[4],
            row.mods[5]
        ];
    }
    return [];
}

async function handleStartOptimizationRequest(index, callback) {
    console.log("Start request @ index: " + index);

    if (!multiOptimizerHeroes[index] || !multiOptimizerHeroes[index].hero) {
        if (callback) callback("OK");
        return;
    }
    if (index >= multiOptimizerHeroes.length) {
        return;
    }

    const inProgressResponse = await Api.getOptimizationInProgress();
    if (inProgressResponse.inProgress) {
        Notifier.warn("Optimization already in progress. Please cancel before starting a new search.")
        return;
    }

    const heroResponse = await Api.getHeroById(multiOptimizerHeroes[index].hero.id, true);
    const allItemsResponse = await Api.getAllItems();
    const hero = heroResponse.hero;
    const baseStats = heroResponse.baseStats;

    const allowedHeroIds = [];

    for (var multiHero of multiOptimizerHeroes) {
        if (multiHero && multiHero.hero) {
            allowedHeroIds.push(multiHero.hero.id)
        }
    }

    if (!hero.optimizationRequest) {
        Dialog.error(hero.name + " does not have filters saved. Please set your filters or run a regular optimization first.")
        return;
    }

    const params = hero.optimizationRequest;
    params.excludeFilter = Settings.getExcludeSelects()

    const gearMainFilters = [params.inputNecklaceStat, params.inputRingStat, params.inputBootsStat]

    var filterResult = await OptimizerTab.applyItemFilters(params, heroResponse, allItemsResponse, true, allowedHeroIds, gearMainFilters);

    // OptimizerGrid.setPinnedHero(hero);

    if (!hero.artifactName || hero.artifactName == "None") {
        Notifier.warn("Your hero does not have an artifact equipped, use the 'Add Bonus Stats' button on the Heroes page to add artifact stats");
    }

    const request = {
        base: baseStats,
        requestType: "OptimizationRequest",
        items: filterResult.items,
        bonusHp: hero.bonusHp,
        bonusAtk: hero.bonusAtk,
        hero: hero
    }

    const mergedRequest = Object.assign(request, params, baseStats);
    const str = JSON.stringify(mergedRequest);

    // Recalc permutations
    var items = filterResult.items;
    var allItems = filterResult.allItems;

    const weapons = items.filter(x => x.gear == "Weapon");
    const helmets = items.filter(x => x.gear == "Helmet");
    const armors = items.filter(x => x.gear == "Armor");
    const necklaces = items.filter(x => x.gear == "Necklace");
    const rings = items.filter(x => x.gear == "Ring");
    const boots = items.filter(x => x.gear == "Boots");

    const allWeapons = allItems.filter(x => x.gear == "Weapon");
    const allHelmets = allItems.filter(x => x.gear == "Helmet");
    const allArmors = allItems.filter(x => x.gear == "Armor");
    const allNecklaces = allItems.filter(x => x.gear == "Necklace");
    const allRings = allItems.filter(x => x.gear == "Ring");
    const allBoots = allItems.filter(x => x.gear == "Boots");

    permutations = weapons.length
            * helmets.length
            * armors.length
            * necklaces.length
            * rings.length
            * boots.length;

    $(`#summaryPanel1-${index}`).text(i18next.t("Permutations")+": " + Number(permutations).toLocaleString());


    if (OptimizerTab.warnParams(params, permutations)) {
        return;
    }

    console.log("Sending request:", mergedRequest)
    // OptimizerGrid.showLoadingOverlay();


    function updateProgress() {
        Api.getOptimizationProgress().then(result => {
            var searchedCount = result.searched;
            var resultsCounter = result.results;

            var searchedStr = Number(searchedCount).toLocaleString();
            var resultsStr = Number(resultsCounter).toLocaleString();

            $(`#summaryPanel2-${index}`).text(i18next.t("Searched")+": " + searchedStr);
            $(`#summaryPanel3-${index}`).text(i18next.t("Results")+": " + resultsStr);
        })
    }

    progressTimer = setInterval(updateProgress, 150)

    const oldExecutionId = multiOptimizerHeroes[index].executionId;
    await Api.deleteExecution(oldExecutionId);

    const newExecutionId = await Api.prepareExecution();
    mergedRequest.executionId = newExecutionId;
    multiOptimizerHeroes[index].executionId = newExecutionId

    setPinnedHero(index, hero);
    const results = Api.submitOptimizationRequest(mergedRequest).then(result => {
        console.log("RESPONSE RECEIVED", result);
        clearInterval(progressTimer);

        var searchedCount = result.searched;
        var resultsCounter = result.results;

        var searchedStr = Number(searchedCount).toLocaleString();
        var resultsStr = Number(resultsCounter).toLocaleString();

        var maxResults = parseInt(Settings.parseNumberValue('settingMaxResults') || 0);
        if (result.results >= maxResults) {
            Dialog.info('Search terminated after the result limit was exceeded, the full results are not shown. Please apply more filters to narrow your search.')
        } else {
            $(`#summaryPanel1-${index}`).text(i18next.t("Permutations")+": " + searchedStr);
        }

        // $('#searchedPermutationsNum').text(searchedStr);
        // $('#resultsFoundNum').text(resultsStr);
        // OptimizerGrid.reloadData();
        // console.log("REFRESHED");

        $(`#summaryPanel2-${index}`).text(i18next.t("Searched")+": " + searchedStr);
        $(`#summaryPanel3-${index}`).text(i18next.t("Results")+": " + resultsStr);
        const grid = multiOptimizerHeroes[index].grid;
        grid.gridOptions.api.setDatasource(getDataSource(index, grid, multiOptimizerHeroes[index]));
        if (callback) callback("OK");
    });
}

function getDefaultParams() {
    return {
        inputSets: [[], [], []],
        inputExcludeSet: [],
        excludeFilter: [],
        inputSetsOne: [],
        inputSetsTwo: [],
        inputSetsThree: [],
        inputNecklaceStat: [],
        inputRingStat: [],
        inputBootsStat: [],
        inputPredictReforges: true,
        inputAllowEquippedItems: true,
        inputAllowLockedItems: true,
        inputOrderedHeroPriority: true,
        inputAtkPriority: 0,
        inputHpPriority: 0,
        inputDefPriority: 0,
        inputSpdPriority: 0,
        inputCrPriority: 0,
        inputCdPriority: 0,
        inputResPriority: 0,
        inputFilterPriority: 100
    }
}

function togglePanelSelect(index, on) {
    if (on) {
        $('#multiInfoPanel' + index).css('background-color', 'var(--outline-color)')
    } else {
        $('#multiInfoPanel' + index).css('background-color', '')
    }
}
