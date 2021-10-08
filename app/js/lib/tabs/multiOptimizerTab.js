var count = 0;
global.multiOptimizerHeroes = []

function setMultiOptimizerHero(index, heroResponse) {
    redrawHeroImage(index);
    multiOptimizerHeroes[index].heroResponse = heroResponse;
    multiOptimizerHeroes[index].hero = heroResponse.hero;


}

function initializeBlank(index) {
    const html = `
<div class="multiOptimizerHeroRow">
  <div class="multiTopRow">
      <div class="multiInfoPanel">
          <select id="addMultiOptimizerHeroesSelector${index}" class="gearPreviewButton"></select>
          <div class="inputHeroImageContainer">
              <img src="" id="multiInputHeroImage${index}" class="inputHeroImage"></img>
          </div>

          <input type="submit" value="Start" class="gearPreviewButton" id="multiStart${index}" data-t ><br>
          <input type="submit" value="Edit filters" class="gearPreviewButton" id="multiEditFilters${index}" data-t ><br>
          <input type="submit" value="Remove" class="gearPreviewButton" id="multiRemove${index}" data-t ><br>

          <input type="submit" value="Equip" class="gearPreviewButton" id="multiEquip${index}" data-t ><br>
          <input type="submit" value="Save" class="gearPreviewButton" id="multiSave${index}" data-t ><br>
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
</div>
<br>

`

    $('#multi-optimizer-section').append(html);

    var localeText = AG_GRID_LOCALE_EN;
    const DIGITS_2 = 35;
    const DIGITS_3 = 41;
    const DIGITS_4 = 45;
    const DIGITS_5 = 50;
    const DIGITS_6 = 55;

    const gridOptions = {
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
        datasource: datasource,
        suppressScrollOnNewData: true,
        // onCellMouseOver: cellMouseOver,
        // onCellMouseOut: cellMouseOut,
        navigateToNextCell: GridRenderer.arrowKeyNavigator(this, "optimizerGrid"),
        suppressDragLeaveHidesColumns: true,
    };

    const gridDiv = document.getElementById('multiGrid' + index);
    const grid = new Grid(gridDiv, gridOptions);

    grid.gridOptions.onRowSelected = provideOnRowSelected(grid, index);

    multiOptimizerHeroes[index] = {
        index: index,
        div: gridDiv,
        gridOptions, gridOptions,
        grid: grid,
        initialized: false
    }

    module.exports.redrawHeroSelector(index)

    $('#addMultiOptimizerHeroesSelector' + index).change(async () => {
        const heroId = document.getElementById('addMultiOptimizerHeroesSelector' + index).value;
        const heroResponse = await Api.getHeroById(heroId, true);
        // const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));

        setMultiOptimizerHero(index, heroResponse);
        if (index == multiOptimizerHeroes.length - 1) {
            initializeBlank(index + 1);
        }
    });

    document.getElementById('multiStart' + index).addEventListener("click", async () => {
        const inProgressResponse = await Api.getOptimizationInProgress();
        if (inProgressResponse.inProgress) {
            Notifier.warn("Optimization already in progress. Please cancel before starting a new search.")
            return;
        }

        const heroResponse = await Api.getHeroById(multiOptimizerHeroes[index].hero.id, true);
        const allItemsResponse = await Api.getAllItems();
        const hero = heroResponse.hero;
        const params = hero.optimizationRequest
        const baseStats = heroResponse.baseStats;
        params.excludeFilter = Settings.getExcludeSelects()
        var filterResult = await OptimizerTab.applyItemFilters(params, heroResponse, allItemsResponse, true);

        // OptimizerGrid.setPinnedHero(hero);

        if (!hero.artifactName || hero.artifactName == "None") {
            Notifier.warn("Your hero does not have an artifact equipped, use the 'Add Bonus Stats' button on the Heroes page to add artifact stats");
        }

        if (OptimizerTab.warnParams(params)) {
            return;
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

        console.log("Sending request:", mergedRequest)
        // OptimizerGrid.showLoadingOverlay();


        function updateProgress() {
            Api.getOptimizationProgress().then(result => {
                // var searchedCount = result.searched;
                // var resultsCounter = result.results;

                // var searchedStr = Number(searchedCount).toLocaleString();
                // var resultsStr = Number(resultsCounter).toLocaleString();

                // $('#searchedPermutationsNum').text(searchedStr);
                // $('#resultsFoundNum').text(resultsStr);
            })
        }

        const progressTimer = setInterval(updateProgress, 150)

        const oldExecutionId = multiOptimizerHeroes[index].executionId;
        await Api.deleteExecution(oldExecutionId);

        const newExecutionId = await Api.prepareExecution();
        mergedRequest.executionId = newExecutionId;
        multiOptimizerHeroes[index].executionId = newExecutionId

        const results = Api.submitOptimizationRequest(mergedRequest).then(result => {
            console.log("RESPONSE RECEIVED", result);
            clearInterval(progressTimer);
            // $('#estimatedPermutations').text(Number(permutations).toLocaleString());
            var searchedCount = result.searched;
            var resultsCounter = result.results;

            var searchedStr = Number(searchedCount).toLocaleString();
            var resultsStr = Number(resultsCounter).toLocaleString();

            var maxResults = parseInt(Settings.parseMaxResults() || 0);
            if (result.results >= maxResults) {
                Dialog.info('Search terminated after the result limit was exceeded, the full results are not shown. Please apply more filters to narrow your search.')
            } else {
                // $('#maxPermutationsNum').text(searchedStr);
            }

            // $('#searchedPermutationsNum').text(searchedStr);
            // $('#resultsFoundNum').text(resultsStr);
            // OptimizerGrid.reloadData();
            // console.log("REFRESHED");
            const grid = multiOptimizerHeroes[index].grid;
            grid.gridOptions.api.setDatasource(getDataSource(index, grid, multiOptimizerHeroes[index]));
        });
    })

    document.getElementById('multiEditFilters' + index).addEventListener("click", async () => {
        console.warn(multiOptimizerHeroes, multiOptimizerHeroes[index])
        const heroIndex = multiOptimizerHeroes[index];
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

        Api.saveOptimizationRequest(mergedRequest);

        const allItemsResponse = await Api.getAllItems();

        OptimizerTab.applyItemFilters(params, heroResponse, allItemsResponse, false).then(result => {
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

            console.warn("PERMUTATIONS: " + permutations)
        });
    });

}

module.exports = {
    initialize: async () => {
        initializeBlank(0)
    },

    redrawHeroSelector: async (index) => {
        const getAllHeroesResponse = await Api.getAllHeroes();
        const selectedId = $( "#addMultiOptimizerHeroesSelector" + index + " option:selected" ).val()

        clearHeroOptions("addMultiOptimizerHeroesSelector" + index);

        const optimizerHeroSelector = document.getElementById('addMultiOptimizerHeroesSelector' + index)
        const heroes = getAllHeroesResponse.heroes;
        Utils.sortByAttribute(heroes, "name");
        console.log("getAllHeroesResponse", getAllHeroesResponse)

        // heroes.unshift({
        //     name: "Hero",
        //     id: "Hero"
        // })

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

        Selectors.refreshMultiHeroSelector('addMultiOptimizerHeroesSelector' + index)
    }
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

var gradient = darkGradient;

function columnGradient(params) {
    try {
        if (!params || params.value == undefined) return;
        var colId = params.column.colId;
        var value = params.value;

        var agg = currentAggregate[colId];
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

var currentSortModel;
var currentAggregate = {};
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


function aggregateCurrentHeroStats(heroStats) {
// currentAggregate
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
                aggregateCurrentHeroStats(getResultRowsResponse.heroStats)
                grid.gridOptions.api.hideOverlay();

                var pinned = grid.gridOptions.api.getPinnedTopRow(0);
                if (pinned) {
                    grid.gridOptions.api.setPinnedTopRowData([pinned.data])
                }

                console.warn("SELECTEDNODE COMPARE", multiHero.selectedNode, index, grid)

                if (multiHero.selectedNode) {
                    grid.gridOptions.api.forEachNode((node) => {
                        // if (!node || !node.data || !multiHero.selectedNode || !multiHero.selectedNode.data) {
                        //     console.log(node);
                        //     console.log(node.data);
                        //     console.log(multiHero.selectedNode);
                        //     console.log(multiHero.selectedNode.data);
                        //     return;
                        // }
                        // console.log(node)
                        // console.log(node.data)
                        // console.log(node.data.modIds)
                        // console.log(node.data.modIds, multiHero.selectedNode.data.modIds)
                        if (node.data && multiHero.selectedNode && multiHero.selectedNode.data) {
                            if (node.data.modIds == multiHero.selectedNode.data.modIds) {
                                node.setSelected(true, false);
                                grid.gridOptions.api.ensureNodeVisible(node);
                                console.error("FOUND", selectedNode)

                                // refreshedItem = node.data;
                            }
                        }
                    })
                }

                params.successCallback(getResultRowsResponse.heroStats, getResultRowsResponse.maximum)
            });
        },
    }
}
const datasource = {
    async getRows(params) {
        console.log("DEBUG getRows params", params);
        const startRow = params.startRow;
        const endRow = params.endRow;
        const sortColumn = params.sortModel.length ? params.sortModel[0].colId : null;
        const sortOrder = params.sortModel.length ? params.sortModel[0].sort : null;

        global.optimizerGrid = optimizerGrid;

        optimizerGrid.gridOptions.api.showLoadingOverlay();
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

        const getResultRowsResponse = Api.getResultRows(request).then(getResultRowsResponse => {
            console.log("GetResultRowsResponse", getResultRowsResponse);
            aggregateCurrentHeroStats(getResultRowsResponse.heroStats)
            optimizerGrid.gridOptions.api.hideOverlay();
            params.successCallback(getResultRowsResponse.heroStats, getResultRowsResponse.maximum)

            var pinned = optimizerGrid.gridOptions.api.getPinnedTopRow(0);
            if (pinned) {
                optimizerGrid.gridOptions.api.setPinnedTopRowData([pinned.data])
            }
        });
    },
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

    const moddedGear = ModificationFilter.getModsByIds(gearIds, mods);
    console.log("Modded gear results", moddedGear)

    Api.getItemsByIds(gearIds).then(async (response) => {
        const selectedGear = response.items;

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
        if (!multiHero.hero) {
            continue;
        }
        if (multiHero.index == index) {
            continue;
        }

        const grid = multiHero.grid;
        const filteredGearIds = getSelectedGearIds(grid);

        var allFilteredItems = [];
        for (var otherMultiHero of multiOptimizerHeroes) {
            if (!otherMultiHero.hero || otherMultiHero.hero.id == multiHero.id) {
                continue;
            }
            const otherFilteredGearIds = getSelectedGearIds(otherMultiHero.grid)
            allFilteredItems = allFilteredItems.concat(otherFilteredGearIds)
        }

        const difference = allFilteredItems.filter(x => !filteredGearIds.includes(x));

        const heroResponse = await Api.getHeroById(multiHero.hero.id);
        const request = heroResponse.hero.optimizationRequest;

        request.executionId = multiHero.executionId;
        request.excludedGearIds = difference;

        console.warn("MULTIHERO", multiHero)
        console.warn("FILTERED", filteredGearIds)
        // console.warn("DIFFERENCE", difference)
        console.warn("REQ", request)


        const selectedNodes = grid.gridOptions.api.getSelectedNodes()
        var selectedNode;
        if (selectedNodes.length > 0) {
            selectedNode = selectedNodes[0];
        }

        multiHero.selectedNode = selectedNode;

        await Api.submitOptimizationFilterRequest(request).then(response => {
            console.warn("Optimization filter response", response);
            // OptimizerGrid.reloadData();
            multiHero.grid.gridOptions.api.setDatasource(getDataSource(multiHero.index, multiHero.grid, multiHero));
        });
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