const rangesliderJs = require('rangeslider-js');
var permutations = 0;
var progressTimer;


function buildSlider(slider) {
    var sliderEl = document.querySelector(slider);
    var nrInput = document.querySelector(slider + 'Input');
    rangesliderJs.create(sliderEl, {
        onSlide: val => {
            nrInput.setAttribute('value', val)
            recalculateFilters();
        }
    })
    nrInput.addEventListener('input',  ev => sliderEl['rangeslider-js'].update({value: ev.target.value}))
}

module.exports = {

    initialize: () => {
        document.getElementById('submitOptimizerRequest').addEventListener("click", () => {
            submitOptimizationRequest()
        });
        document.getElementById('submitOptimizerFilter').addEventListener("click", () => {
            submitOptimizationFilterRequest()
        });
        document.getElementById('submitOptimizerCancel').addEventListener("click", () => {
            Api.cancelOptimizationRequest();
        });
        document.getElementById('gearPreviewEquip').addEventListener("click", () => {
            equipSelectedGear()
        });
        document.getElementById('gearPreviewLockAndEquip').addEventListener("click", () => {
            lockAndEquipSelectedGear()
        });
        document.getElementById('gearPreviewSelectAll').addEventListener("click", () => {
            $('#optimizerGridWeapon').prop('checked', true);
            $('#optimizerGridHelmet').prop('checked', true);
            $('#optimizerGridArmor').prop('checked', true);
            $('#optimizerGridNecklace').prop('checked', true);
            $('#optimizerGridRing').prop('checked', true);
            $('#optimizerGridBoots').prop('checked', true);
        });
        document.getElementById('gearPreviewDeselectAll').addEventListener("click", () => {
            $('#optimizerGridWeapon').prop('checked', false);
            $('#optimizerGridHelmet').prop('checked', false);
            $('#optimizerGridArmor').prop('checked', false);
            $('#optimizerGridNecklace').prop('checked', false);
            $('#optimizerGridRing').prop('checked', false);
            $('#optimizerGridBoots').prop('checked', false);
        });

        $('#forceNumberSelect').change(recalculateFilters);
        $('#inputHeroAdd').change(recalculateFilters);
        $('.optimizer-number-input').change(recalculateFilters);
        $('.optimizer-checkbox').change(recalculateFilters);
        $('.inputGearFilterSelect').change(recalculateFilters);
        $('.inputSetFilterSelect').change(recalculateFilters);
        // $('#filterSliderInput').change(recalculateFilters);

        buildSlider('#atkSlider')
        buildSlider('#hpSlider')
        buildSlider('#defSlider')
        buildSlider('#spdSlider')
        buildSlider('#crSlider')
        buildSlider('#cdSlider')
        buildSlider('#effSlider')
        buildSlider('#resSlider')
        buildSlider('#filterSlider')

        document.getElementById('tab1label').addEventListener("click", () => {
            module.exports.redrawHeroSelector();
        });
    },

    drawPreview: (gearIds) => {
        const promises = Promise.all([
            Api.getItemById(gearIds[0]),
            Api.getItemById(gearIds[1]),
            Api.getItemById(gearIds[2]),
            Api.getItemById(gearIds[3]),
            Api.getItemById(gearIds[4]),
            Api.getItemById(gearIds[5]),
        ]).then(selectedGear => {
            document.getElementById('optimizer-heroes-equipped-weapon').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[0].item, "optimizerGrid");
            document.getElementById('optimizer-heroes-equipped-helmet').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[1].item, "optimizerGrid");
            document.getElementById('optimizer-heroes-equipped-armor').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[2].item, "optimizerGrid");
            document.getElementById('optimizer-heroes-equipped-necklace').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[3].item, "optimizerGrid");
            document.getElementById('optimizer-heroes-equipped-ring').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[4].item, "optimizerGrid");
            document.getElementById('optimizer-heroes-equipped-boots').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[5].item, "optimizerGrid");
        })
        HeroesTab.redraw();
    },

    getOptimizationRequestParams: () => {
        return getOptimizationRequestParams();
    },

    redrawHeroSelector: () => {

    },
}

function recalculateFilters(e) {
    // Selects fire twice
    if (e && e.target.className.includes("offscreen")) {
        return;
    }


    const params = getOptimizationRequestParams();
    const heroId = document.getElementById('inputHeroAdd').value;
    applyItemFilters(params, heroId).then(items => {
        const weapons = items.filter(x => x.gear == "Weapon");
        const helmets = items.filter(x => x.gear == "Helmet");
        const armors = items.filter(x => x.gear == "Armor");
        const necklaces = items.filter(x => x.gear == "Necklace");
        const rings = items.filter(x => x.gear == "Ring");
        const boots = items.filter(x => x.gear == "Boots");

        permutations = weapons.length 
                * helmets.length 
                * armors.length 
                * necklaces.length
                * rings.length
                * boots.length
        $('#estimatedPermutations').text(Number(permutations).toLocaleString());
    });

    console.warn("RECALCULATE", e);
}

function getSelectedHeroId() {
    return document.getElementById('inputHeroAdd').value;
}

function filterSelectedGearByCheckbox(selectedGear) {
    const filteredIds = [];

    if ($('#optimizerGridWeapon').prop('checked')) filteredIds.push(selectedGear[0]);
    if ($('#optimizerGridHelmet').prop('checked')) filteredIds.push(selectedGear[1]);
    if ($('#optimizerGridArmor').prop('checked')) filteredIds.push(selectedGear[2]);
    if ($('#optimizerGridNecklace').prop('checked')) filteredIds.push(selectedGear[3]);
    if ($('#optimizerGridRing').prop('checked')) filteredIds.push(selectedGear[4]);
    if ($('#optimizerGridBoots').prop('checked')) filteredIds.push(selectedGear[5]);

    return filteredIds;
}

async function equipSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    const heroId = getSelectedHeroId();

    if (selectedGear.length == 0) return;

    await Api.equipItemsOnHero(heroId, selectedGear);

    const response = await Api.getHeroById(heroId);
    OptimizerGrid.setPinnedHero(response.hero);

    drawPreview()
    Saves.autoSave();
}

async function lockAndEquipSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    const heroId = getSelectedHeroId();

    if (selectedGear.length == 0) return;

    await Api.lockItems(selectedGear);
    drawPreview()
    Saves.autoSave();
}

async function applyItemFilters(params, heroId) {
    const gearMainFilters = Selectors.getGearMainFilters();
    const getAllItemsResponse = await Api.getAllItems();
    const baseStats = await getHeroBaseStats(heroId);
    const hero = (await Api.getHeroById(heroId)).hero;
    var items = getAllItemsResponse.items;

    console.log("PARAMS", params);
    if (isFourAndTwoPieceSets(params.inputSets) || isTwoAndTwoAndTwoPieceSets(params.inputSets)) {
        const possibleSets = params.inputSets.flat();
        items = items.filter(x => possibleSets.includes(x.set));
    }

    if (!params.inputAllowEquippedItems) {
        items = items.filter(x => !x.equippedById || x.equippedById == heroId);
    }

    if (!params.inputAllowLockedItems) {
        items = items.filter(x => !x.locked || x.equippedById == heroId);
    }

    if (params.inputKeepCurrentItems) {
        // const result = await Api.getHeroById(heroId);
        if (!hero.equipment) {
            items = [];
            hero.equipment = {};
        }

        console.warn("EQ", hero)
        const equipped = Object.values(hero.equipment);
        for (var i = 0; i < 6; i++) {
            const item = equipped[i];
            if (item) {
                items = items.filter(x => {
                    const passFilter = item.gear != x.gear || item.equippedById == x.equippedById;
                    if (!passFilter)
                        console.log(x);
                    return passFilter;
                })
            }
        }
    }

    for (var i = 0; i < gearMainFilters.length; i++) {
        const filter = gearMainFilters[i];
        if (filter.length == 0)
            continue;
        if (i == 0)
            items = items.filter(x => filter.includes(x.main.type) && x.gear == "Necklace" || x.gear != "Necklace")
        if (i == 1)
            items = items.filter(x => filter.includes(x.main.type) && x.gear == "Ring" || x.gear != "Ring")
        if (i == 2)
            items = items.filter(x => filter.includes(x.main.type) && x.gear == "Boots" || x.gear != "Boots")
    }

    items = ForceFilter.applyForceFilters(params, items)
    items = PriorityFilter.applyPriorityFilters(params, items, baseStats)

    items = items.sort((a, b) => {
        return a.set-b.set;
    })
    const prioritizedItems = [];
    for (var item of items) {
        if (params.inputSetsOne.includes(item.set)) {
            prioritizedItems.unshift(item);
        } else {
            prioritizedItems.push(item);
        }
    }

    console.log("Filtered items", prioritizedItems)
    currentFilteredItems = prioritizedItems;
    return items;
}

function submitOptimizationFilterRequest() {
    console.warn("Click optimization filter");
    const params = getOptimizationRequestParams();
    OptimizerGrid.showLoadingOverlay();
    Api.submitOptimizationFilterRequest(params).then(response => {
        console.warn("Optimization filter response", response);
        OptimizerGrid.refresh();
    });
}

async function getHeroBaseStats(heroId) {
    const getHeroByIdResponse = await Api.getHeroById(heroId);
    const hero = getHeroByIdResponse.hero;
    const baseStats = HeroData.getBaseStatsByName(hero.name);
    console.warn(baseStats);
    return baseStats;
}

async function submitOptimizationRequest() {
    const getAllItemsResponse = await Api.getAllItems();

    console.log(ItemSerializer.serializeToArr(getAllItemsResponse.items));
    const params = getOptimizationRequestParams();
    const heroId = document.getElementById('inputHeroAdd').value;
    const baseStats = await getHeroBaseStats(heroId);
    const heroResponse = await Api.getHeroById(heroId);

    var items = await applyItemFilters(params, heroId);

    console.log("OPTIMIZING HERO", heroResponse.hero);

    const request = {
        base: baseStats,
        requestType: "OptimizationRequest",
        items: items,
        bonusHp: heroResponse.hero.bonusHp,
        bonusAtk: heroResponse.hero.bonusAtk,
        hero: heroResponse.hero
    }

    const mergedRequest = Object.assign(request, params, baseStats);
    const str = JSON.stringify(mergedRequest);

    console.log("Sending request:", mergedRequest)
    OptimizerGrid.showLoadingOverlay();
    // Subprocess.sendString(str)
    progressTimer = setInterval(updateProgress, 100)

    const results = Api.submitOptimizationRequest(mergedRequest).then(x => {
        console.log("RESPONSE RECEIVED", x);
        if (x.count >= 5000000) {
            alert('Search terminated after 5,000,000 result limit exceeded, the full results are not shown. Apply more filters to narrow your search.')
        }
        OptimizerGrid.refresh();
        clearInterval(progressTimer);
        $('#estimatedPermutations').text(Number(permutations).toLocaleString());
        console.log("REFRESHED");
    });
}

function updateProgress() {
    Api.getOptimizationProgress().then(result => {
        var progressCount = result.count;

        var str = Number(progressCount).toLocaleString() + " / " + Number(permutations).toLocaleString();

        $('#estimatedPermutations').text(str);
    })
}

function drawPreviewForGearId(id, elementId) {
    Api.getItemById(id).then(response => {
        document.getElementById(elementId).innerHTML = HtmlGenerator.buildItemPanel(response.item, "optimizerGrid");
    })
}

function drawPreview() {
    const selectedGear = OptimizerGrid.getSelectedGearIds();
    drawPreviewForGearId(selectedGear[0], 'optimizer-heroes-equipped-weapon');
    drawPreviewForGearId(selectedGear[1], 'optimizer-heroes-equipped-helmet');
    drawPreviewForGearId(selectedGear[2], 'optimizer-heroes-equipped-armor');
    drawPreviewForGearId(selectedGear[3], 'optimizer-heroes-equipped-necklace');
    drawPreviewForGearId(selectedGear[4], 'optimizer-heroes-equipped-ring');
    drawPreviewForGearId(selectedGear[5], 'optimizer-heroes-equipped-boots');
}

const fourPieceSets = [
    "AttackSet", "SpeedSet", "DestructionSet", "LifestealSet", "CounterSet",  "RageSet", "RevengeSet", "InjurySet"
]

const twoPieceSets = [
    "HealthSet", "DefenseSet", "CriticalSet", "HitSet", "ResistSet", "UnitySet", "ImmunitySet", "PenetrationSet"
]

function isFourAndTwoPieceSets(sets) {
    return hasFourPieceSet(sets[0]) && (hasTwoPieceSet(sets[1]) || hasTwoPieceSet(sets[2]))
}
function isTwoAndTwoAndTwoPieceSets(sets) {
    return hasTwoPieceSet(sets[0]) && hasTwoPieceSet(sets[1]) && hasTwoPieceSet(sets[2]);
}
function hasFourPieceSet(set) {
    return set.filter(x => fourPieceSets.includes(x)).length > 0;
}
function hasTwoPieceSet(set) {
    return set.filter(x => twoPieceSets.includes(x)).length > 0;
}

function getOptimizationRequestParams() {
    const request = new OptimizationRequest();

    const hero = document.getElementById('submitOptimizerRequest').value;
    const setFilters = Selectors.getSetFilters();
    const setFormat = getSetFormat(setFilters);
    console.log("SETFORMAT", setFormat);

    request.inputAllowLockedItems   = readCheckbox('inputAllowLockedItems');
    request.inputAllowEquippedItems = readCheckbox('inputAllowEquippedItems');
    request.inputKeepCurrentItems   = readCheckbox('inputKeepCurrentItems');

    request.inputAtkMinLimit = readNumber('inputMinAtkLimit');
    request.inputAtkMaxLimit = readNumber('inputMaxAtkLimit');
    request.inputHpMinLimit  = readNumber('inputMinHpLimit');
    request.inputHpMaxLimit  = readNumber('inputMaxHpLimit');
    request.inputDefMinLimit = readNumber('inputMinDefLimit');
    request.inputDefMaxLimit = readNumber('inputMaxDefLimit');
    request.inputSpdMinLimit = readNumber('inputMinSpdLimit');
    request.inputSpdMaxLimit = readNumber('inputMaxSpdLimit');
    request.inputCrMinLimit  = readNumber('inputMinCrLimit');
    request.inputCrMaxLimit  = readNumber('inputMaxCrLimit');
    request.inputCdMinLimit  = readNumber('inputMinCdLimit');
    request.inputCdMaxLimit  = readNumber('inputMaxCdLimit');
    request.inputEffMinLimit = readNumber('inputMinEffLimit');
    request.inputEffMaxLimit = readNumber('inputMaxEffLimit');
    request.inputResMinLimit = readNumber('inputMinResLimit');
    request.inputResMaxLimit = readNumber('inputMaxResLimit');

    request.inputMinHppsLimit = readNumber('inputMinHppsLimit');
    request.inputMaxHppsLimit = readNumber('inputMaxHppsLimit');
    request.inputMinEhpLimit = readNumber('inputMinEhpLimit');
    request.inputMaxEhpLimit = readNumber('inputMaxEhpLimit');
    request.inputMinEhppsLimit = readNumber('inputMinEhppsLimit');
    request.inputMaxEhppsLimit = readNumber('inputMaxEhppsLimit');
    request.inputMinDmgLimit = readNumber('inputMinDmgLimit');
    request.inputMaxDmgLimit = readNumber('inputMaxDmgLimit');
    request.inputMinDmgpsLimit = readNumber('inputMinDmgpsLimit');
    request.inputMaxDmgpsLimit = readNumber('inputMaxDmgpsLimit');
    request.inputMinMcdmgLimit = readNumber('inputMinMcdmgLimit');
    request.inputMaxMcdmgLimit = readNumber('inputMaxMcdmgLimit');
    request.inputMinMcdmgpsLimit = readNumber('inputMinMcdmgpsLimit');
    request.inputMaxMcdmgpsLimit = readNumber('inputMaxMcdmgpsLimit');

    request.inputAtkMinForce = readNumber('inputMinAtkForce');
    request.inputAtkMaxForce = readNumber('inputMaxAtkForce');
    request.inputAtkPercentMinForce = readNumber('inputMinAtkPercentForce');
    request.inputAtkPercentMaxForce = readNumber('inputMaxAtkPercentForce');
    request.inputSpdMinForce = readNumber('inputMinSpdForce');
    request.inputSpdMaxForce = readNumber('inputMaxSpdForce');
    request.inputCrMinForce = readNumber('inputMinCrForce');
    request.inputCrMaxForce = readNumber('inputMaxCrForce');
    request.inputCdMinForce = readNumber('inputMinCdForce');
    request.inputCdMaxForce = readNumber('inputMaxCdForce');
    request.inputHpMinForce = readNumber('inputMinHpForce');
    request.inputHpMaxForce = readNumber('inputMaxHpForce');
    request.inputHpPercentMinForce = readNumber('inputMinHpPercentForce');
    request.inputHpPercentMaxForce = readNumber('inputMaxHpPercentForce');
    request.inputDefMinForce = readNumber('inputMinDefForce');
    request.inputDefMaxForce = readNumber('inputMaxDefForce');
    request.inputDefPercentMinForce = readNumber('inputMinDefPercentForce');
    request.inputDefPercentMaxForce = readNumber('inputMaxDefPercentForce');
    request.inputEffMinForce = readNumber('inputMinEffForce');
    request.inputEffMaxForce = readNumber('inputMaxEffForce');
    request.inputResMinForce = readNumber('inputMinResForce');
    request.inputResMaxForce = readNumber('inputMaxResForce');

    request.inputAtkPriority = readNumber('atkSliderInput');
    request.inputHpPriority = readNumber('hpSliderInput');
    request.inputDefPriority = readNumber('defSliderInput');
    request.inputSpdPriority = readNumber('spdSliderInput');
    request.inputCrPriority = readNumber('crSliderInput');
    request.inputCdPriority = readNumber('cdSliderInput');
    request.inputEffPriority = readNumber('effSliderInput');
    request.inputResPriority = readNumber('resSliderInput');
    request.inputFilterPriority = readNumber('filterSliderInput');

    request.inputSets = setFilters;

    request.inputSetsOne = setFilters[0];
    request.inputSetsTwo = setFilters[1];
    request.inputSetsThree = setFilters[2];

    request.setFormat = setFormat;

    return request;
}

function readNumber(id) {
    var possibleNaN = parseInt(document.getElementById(id).value);

    return isNaN(possibleNaN) ? undefined : possibleNaN;
}

function readCheckbox(id) {
    var boolean = document.getElementById(id).checked;

    return boolean === true ? true : false;
}

function getSetFormat(sets) {
    if (sets[0].length == 0) {
        if (sets[1].length > 0) {
            throw 'Invalid Sets';
        }
        if (sets[2].length > 0) {
            throw 'Invalid Sets';
        }
        return 0;
    }
    if (hasFourPieceSet(sets[0])) {
        if (hasTwoPieceSet(sets[0])) {
            throw 'Invalid Sets';
        }
        if (hasTwoPieceSet(sets[2])) {
            throw 'Invalid Sets';
        }
        if (sets[1].length > 0) {
            return 1;       
        }
        return 2
    }
    if (hasTwoPieceSet(sets[0])) {
        if (sets[1].length > 0) {
            if (sets[2].length > 0) {
                return 5;
            } 
            return 4;
        } 
        if (sets[2].length > 0) {
            throw 'Invalid Sets';
        }
        return 3;
    }
}