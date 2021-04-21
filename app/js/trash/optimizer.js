var resultStats = [];
var grid;
var currentSortModel;
var currentFilteredItems;

function numberFormatter(params) {
    if (!params.value)
        return '';
    return Math.floor(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function onRowSelected(event) {
    console.log("onRowSelected", event);
    if (event.node.selected) {
        drawPreview();
    }
}

function equipSelectedGear() {
    const selectedGear = getSelectedGear();
    const heroId = document.getElementById('inputHeroAdd').value;

    if (selectedGear.length == 0) return;
    HeroManager.equipGearOnHero(heroId, selectedGear);
    console.log("See equipped:", HeroManager.getHeroById(heroId))
    drawPreview(selectedGear)
}


function getSelectedGear() {
    const selectedRows = grid.gridOptions.api.getSelectedRows();
    if (selectedRows.length > 0) {
        const row = selectedRows[0];

        const weapon = Db.getItemById(row.weapon.id);
        const helmet = Db.getItemById(row.helmet.id);
        const armor = Db.getItemById(row.armor.id);
        const necklace = Db.getItemById(row.necklace.id);
        const ring = Db.getItemById(row.ring.id);
        const boots = Db.getItemById(row.boots.id);

        return [weapon, helmet, armor, necklace, ring, boots];
    }
    return [];
}

module.exports = {
    // initialize: () => {
    //     document.getElementById('submitOptimizerRequest').addEventListener("click", () => {
    //         submitOptimizationRequest()
    //     });
    //     document.getElementById('gearPreviewEquip').addEventListener("click", () => {
    //         equipSelectedGear()
    //     });
    //     document.getElementById('gearPreviewLockAndEquip').addEventListener("click", () => {
    //         lockAndEquipSelectedGear()
    //     });
    //     buildGrid();
    // },

    redraw: async () => {
        const optimizerHeroSelector = document.getElementById('inputHeroAdd')
        const response = await Api.getAllHeroes();
        const heroesById = response.heroes

        optimizerHeroSelector.innerHTML = "";
        for (var id of Object.keys(heroesById)) {
            const hero = heroesById[id];

            // console.log("DEBUG", hero)
            const option = document.createElement('option');
            option.innerHTML = i18next.t(hero.name);
            option.label = hero.name;
            option.value = hero.id;

            optimizerHeroSelector.add(option);
        }
    },

    getOptimizationRequestParams: () => {
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

        // request.inputNecklaceStat = gearMainFilters[0];
        // request.inputRingStat = gearMainFilters[1];
        // request.inputBootsStat = gearMainFilters[2];

        request.inputSets = setFilters;

        request.inputSetsOne = setFilters[0];
        request.inputSetsTwo = setFilters[1];
        request.inputSetsThree = setFilters[2];

        request.setFormat = setFormat;

        return request;
    },
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

function readNumber(id) {
    var possibleNaN = parseInt(document.getElementById(id).value);

    return isNaN(possibleNaN) ? undefined : possibleNaN;
}

function readCheckbox(id) {
    var boolean = document.getElementById(id).checked;

    return boolean === true ? true : false;
}
