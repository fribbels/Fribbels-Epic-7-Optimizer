const rangesliderJs = require('rangeslider-js');
var permutations = 0;
var progressTimer;
var currentFilteredItems = [];

function buildSlider(slider) {
    var sliderEl = document.querySelector(slider);
    var nrInput = document.querySelector(slider + 'Input');
    rangesliderJs.create(sliderEl, {
        onSlideEnd: val => {
            nrInput.setAttribute('value', val)
            recalculateFilters();
        },
        onSlide: val => {
            nrInput.setAttribute('value', val)
        },
    })
    nrInput.addEventListener('input',  ev => sliderEl['rangeslider-js'].update({value: ev.target.value}))
}

function buildTopSlider(slider) {
    var sliderEl = document.querySelector(slider);
    var nrInput = document.querySelector(slider + 'Input');
    rangesliderJs.create(sliderEl, {
        onSlideEnd: val => {
            nrInput.setAttribute('value', Math.round(0.01 * Math.pow(val, 2)))
            recalculateFilters();
        },
        onSlide: val => {

            nrInput.setAttribute('value', Math.round(0.01 * Math.pow(val, 2)))
        },
    })
    nrInput.addEventListener('input',  ev => sliderEl['rangeslider-js'].update({value: ev.target.value}))
}

function inputDisplayNumber(value) {
    if (value == 0 || value == 2147483647) {
        return "";
    }
    return value;
}

function inputDisplayNumberNumber(value, base) {
    if (!value || value == 2147483647) {
        if (base) {
            return base;
        }
        return 0;
    }
    return value;
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
            if (progressTimer) {
                clearInterval(progressTimer);
            }
            Api.cancelOptimizationRequest();
        });
        document.getElementById('submitOptimizerLoad').addEventListener("click", async () => {
            const heroId = document.getElementById('inputHeroAdd').value;
            const heroResponse = await Api.getHeroById(heroId);
            const hero = heroResponse.hero;
            const request = hero.optimizationRequest;

            if (!hero) return;

            $("#inputMinAtkLimit").val(inputDisplayNumber(request.inputAtkMinLimit))
            $("#inputMaxAtkLimit").val(inputDisplayNumber(request.inputAtkMaxLimit))
            $("#inputMinHpLimit").val(inputDisplayNumber(request.inputHpMinLimit))
            $("#inputMaxHpLimit").val(inputDisplayNumber(request.inputHpMaxLimit))
            $("#inputMaxHpLimit").val(inputDisplayNumber(request.inputHpMaxLimit));
            $("#inputMinDefLimit").val(inputDisplayNumber(request.inputDefMinLimit));
            $("#inputMaxDefLimit").val(inputDisplayNumber(request.inputDefMaxLimit));
            $("#inputMinSpdLimit").val(inputDisplayNumber(request.inputSpdMinLimit));
            $("#inputMaxSpdLimit").val(inputDisplayNumber(request.inputSpdMaxLimit));
            $("#inputMinCrLimit").val(inputDisplayNumber(request.inputCrMinLimit));
            $("#inputMaxCrLimit").val(inputDisplayNumber(request.inputCrMaxLimit));
            $("#inputMinCdLimit").val(inputDisplayNumber(request.inputCdMinLimit));
            $("#inputMaxCdLimit").val(inputDisplayNumber(request.inputCdMaxLimit));
            $("#inputMinEffLimit").val(inputDisplayNumber(request.inputEffMinLimit));
            $("#inputMaxEffLimit").val(inputDisplayNumber(request.inputEffMaxLimit));
            $("#inputMinResLimit").val(inputDisplayNumber(request.inputResMinLimit));
            $("#inputMaxResLimit").val(inputDisplayNumber(request.inputResMaxLimit));

            $("#inputMinCpLimit").val(inputDisplayNumber(request.inputMinCpLimit));
            $("#inputMaxCpLimit").val(inputDisplayNumber(request.inputMaxCpLimit));
            $("#inputMinHppsLimit").val(inputDisplayNumber(request.inputMinHppsLimit));
            $("#inputMaxHppsLimit").val(inputDisplayNumber(request.inputMaxHppsLimit));
            $("#inputMinEhpLimit").val(inputDisplayNumber(request.inputMinEhpLimit));
            $("#inputMaxEhpLimit").val(inputDisplayNumber(request.inputMaxEhpLimit));
            $("#inputMinEhppsLimit").val(inputDisplayNumber(request.inputMinEhppsLimit));
            $("#inputMaxEhppsLimit").val(inputDisplayNumber(request.inputMaxEhppsLimit));
            $("#inputMinDmgLimit").val(inputDisplayNumber(request.inputMinDmgLimit));
            $("#inputMaxDmgLimit").val(inputDisplayNumber(request.inputMaxDmgLimit));
            $("#inputMinDmgpsLimit").val(inputDisplayNumber(request.inputMinDmgpsLimit));
            $("#inputMaxDmgpsLimit").val(inputDisplayNumber(request.inputMaxDmgpsLimit));
            $("#inputMinMcdmgLimit").val(inputDisplayNumber(request.inputMinMcdmgLimit));
            $("#inputMaxMcdmgLimit").val(inputDisplayNumber(request.inputMaxMcdmgLimit));
            $("#inputMinMcdmgpsLimit").val(inputDisplayNumber(request.inputMinMcdmgpsLimit));
            $("#inputMaxMcdmgpsLimit").val(inputDisplayNumber(request.inputMaxMcdmgpsLimit));

            $("#inputMinAtkForce").val(inputDisplayNumber(request.inputAtkMinForce));
            $("#inputMaxAtkForce").val(inputDisplayNumber(request.inputAtkMaxForce));
            $("#inputMinAtkPercentForce").val(inputDisplayNumber(request.inputAtkPercentMinForce));
            $("#inputMaxAtkPercentForce").val(inputDisplayNumber(request.inputAtkPercentMaxForce));
            $("#inputMinSpdForce").val(inputDisplayNumber(request.inputSpdMinForce));
            $("#inputMaxSpdForce").val(inputDisplayNumber(request.inputSpdMaxForce));
            $("#inputMinCrForce").val(inputDisplayNumber(request.inputCrMinForce));
            $("#inputMaxCrForce").val(inputDisplayNumber(request.inputCrMaxForce));
            $("#inputMinCdForce").val(inputDisplayNumber(request.inputCdMinForce));
            $("#inputMaxCdForce").val(inputDisplayNumber(request.inputCdMaxForce));
            $("#inputMinHpForce").val(inputDisplayNumber(request.inputHpMinForce));
            $("#inputMaxHpForce").val(inputDisplayNumber(request.inputHpMaxForce));
            $("#inputMinHpPercentForce").val(inputDisplayNumber(request.inputHpPercentMinForce));
            $("#inputMaxHpPercentForce").val(inputDisplayNumber(request.inputHpPercentMaxForce));
            $("#inputMinDefForce").val(inputDisplayNumber(request.inputDefMinForce));
            $("#inputMaxDefForce").val(inputDisplayNumber(request.inputDefMaxForce));
            $("#inputMinDefPercentForce").val(inputDisplayNumber(request.inputDefPercentMinForce));
            $("#inputMaxDefPercentForce").val(inputDisplayNumber(request.inputDefPercentMaxForce));
            $("#inputMinEffForce").val(inputDisplayNumber(request.inputEffMinForce));
            $("#inputMaxEffForce").val(inputDisplayNumber(request.inputEffMaxForce));
            $("#inputMinResForce").val(inputDisplayNumber(request.inputResMinForce));
            $("#inputMaxResForce").val(inputDisplayNumber(request.inputResMaxForce));

            $("#inputPredictReforges").prop('checked', request.inputPredictReforges);
            $("#inputAllowLockedItems").prop('checked', request.inputAllowLockedItems);
            $("#inputAllowEquippedItems").prop('checked', request.inputAllowEquippedItems);
            $("#inputKeepCurrentItems").prop('checked', request.inputKeepCurrentItems);
            $("#inputCanReforge").prop('checked', request.inputCanReforge);
            $("#inputOnlyPlus15Gear").prop('checked', request.inputOnlyPlus15Gear);

            document.querySelector('#atkSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputAtkPriority)})
            document.querySelector('#atkSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputAtkPriority))

            document.querySelector('#hpSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputHpPriority)})
            document.querySelector('#hpSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputHpPriority))

            document.querySelector('#defSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputDefPriority)})
            document.querySelector('#defSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputDefPriority))

            document.querySelector('#spdSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputSpdPriority)})
            document.querySelector('#spdSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputSpdPriority))

            document.querySelector('#crSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputCrPriority)})
            document.querySelector('#crSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputCrPriority))

            document.querySelector('#cdSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputCdPriority)})
            document.querySelector('#cdSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputCdPriority))

            document.querySelector('#effSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputEffPriority)})
            document.querySelector('#effSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputEffPriority))

            document.querySelector('#resSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputResPriority)})
            document.querySelector('#resSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputResPriority))

            document.querySelector('#filterSlider')['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputFilterPriority)})
            document.querySelector('#filterSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputFilterPriority, 100))

            $('#forceNumberSelect').val(inputDisplayNumberNumber(request.inputForceNumberSelect))

            Selectors.setGearMainAndSetsFromRequest(request);
            recalculateFilters();
        });

        document.getElementById('submitOptimizerReset').addEventListener("click", () => {
            $(".optimizer-number-input").val("")

            Selectors.clearGearMainAndSets();

            document.querySelector('#atkSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#atkSliderInput').setAttribute('value', 0)

            document.querySelector('#hpSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#hpSliderInput').setAttribute('value', 0)

            document.querySelector('#defSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#defSliderInput').setAttribute('value', 0)

            document.querySelector('#spdSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#spdSliderInput').setAttribute('value', 0)

            document.querySelector('#crSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#crSliderInput').setAttribute('value', 0)

            document.querySelector('#cdSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#cdSliderInput').setAttribute('value', 0)

            document.querySelector('#effSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#effSliderInput').setAttribute('value', 0)

            document.querySelector('#resSlider')['rangeslider-js'].update({value: 0})
            document.querySelector('#resSliderInput').setAttribute('value', 0)

            document.querySelector('#filterSlider')['rangeslider-js'].update({value: 100})
            document.querySelector('#filterSliderInput').setAttribute('value', 100)

            $("#inputPredictReforges").prop('checked', true);
            $("#inputAllowLockedItems").prop('checked', false);
            $("#inputAllowEquippedItems").prop('checked', false);
            $("#inputKeepCurrentItems").prop('checked', false);
            $("#inputCanReforge").prop('checked', false);
            $("#inputOnlyPlus15Gear").prop('checked', false);
            $('#forceNumberSelect').val(0)

            recalculateFilters();
        });
        document.getElementById('gearPreviewAddBuild').addEventListener("click", () => {
            addBuild()
        });
        document.getElementById('gearPreviewRemoveBuild').addEventListener("click", () => {
            removeBuild()
        });
        document.getElementById('gearPreviewEquip').addEventListener("click", () => {
            equipSelectedGear()
        });
        document.getElementById('gearPreviewUnequip').addEventListener("click", () => {
            unequipSelectedGear()
        });
        document.getElementById('gearPreviewLock').addEventListener("click", () => {
            lockSelectedGear()
        });
        document.getElementById('gearPreviewUnlock').addEventListener("click", () => {
            unlockSelectedGear()
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


        $('#inputHeroAdd').change(() => {
            recalculateFilters();
            redrawHeroImage();
            module.exports.redrawHeroSelector();
        });

        $('#forceNumberSelect').change(recalculateFilters);
        $('.optimizer-number-input').change(recalculateFilters);
        $('.optimizer-checkbox').change(recalculateFilters);
        $('.inputGearFilterSelect').change(recalculateFilters);
        $('.inputSetFilterSelect').change(recalculateFilters);
        $('.icon-close').click(recalculateFilters)
        // $('#filterSliderInput').change(recalculateFilters);

        buildSlider('#atkSlider')
        buildSlider('#hpSlider')
        buildSlider('#defSlider')
        buildSlider('#spdSlider')
        buildSlider('#crSlider')
        buildSlider('#cdSlider')
        buildSlider('#effSlider')
        buildSlider('#resSlider')
        buildTopSlider('#filterSlider')

        document.getElementById('tab1label').addEventListener("click", async () => {
            await module.exports.redrawHeroSelector();
            recalculateFilters();
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
        ]).then(async (selectedGear) => {
            const heroId = document.getElementById('inputHeroAdd').value;
            const getHeroByIdResponse = await Api.getHeroById(heroId);
            const hero = getHeroByIdResponse.hero;
            if (!hero) return;
            const baseStatsResponse = await Api.getBaseStats(hero.name);

            document.getElementById('optimizer-heroes-equipped-weapon').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[0].item, "optimizerGrid", baseStatsResponse.heroStats);
            document.getElementById('optimizer-heroes-equipped-helmet').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[1].item, "optimizerGrid", baseStatsResponse.heroStats);
            document.getElementById('optimizer-heroes-equipped-armor').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[2].item, "optimizerGrid", baseStatsResponse.heroStats);
            document.getElementById('optimizer-heroes-equipped-necklace').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[3].item, "optimizerGrid", baseStatsResponse.heroStats);
            document.getElementById('optimizer-heroes-equipped-ring').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[4].item, "optimizerGrid", baseStatsResponse.heroStats);
            document.getElementById('optimizer-heroes-equipped-boots').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[5].item, "optimizerGrid", baseStatsResponse.heroStats);
        })
        HeroesTab.redraw();
    },

    getOptimizationRequestParams: () => {
        return getOptimizationRequestParams();
    },

    editGearFromIcon: (id) => {
        editGearFromIcon(id);
    },

    lockGearFromIcon: (id) => {
        lockGearFromIcon(id);
    },

    redrawHeroSelector: async () => {
        const getAllHeroesResponse = await Api.getAllHeroes();
        const selectedId = $( "#inputHeroAdd option:selected" ).val()

        clearOptions("inputHeroAdd");
        const optimizerHeroSelector = document.getElementById('inputHeroAdd')
        const heroes = getAllHeroesResponse.heroes;
        Utils.sortByAttribute(heroes, "name");
        console.log("getAllHeroesResponse", getAllHeroesResponse)
        for (var hero of heroes) {
            const option = document.createElement('option');
            option.innerHTML = hero.name;
            option.value = hero.id;

            optimizerHeroSelector.add(option);

            if (selectedId && selectedId == hero.id) {
                optimizerHeroSelector.value = selectedId
                OptimizerGrid.setPinnedHero(hero);
            }
        }
        redrawHeroImage();
        recalculateFilters();
    }
}

async function editGearFromIcon(id) {
    const result = await Api.getItemById(id);
    console.log(result.item);
    const editedItem = await Dialog.editGearDialog(result.item, true, true);
    await Api.editItems([editedItem]);
    Notifier.quick("Edited item");

    ItemsTab.redraw();
    drawPreview();
    Saves.autoSave();
}

async function lockGearFromIcon(id) {
    const result = await Api.getItemById(id);
    console.log(result.item);

    if (result.item.locked) {
        await Api.unlockItems([id])
        Notifier.quick("Unlocked item");
    } else {
        await Api.lockItems([id])
        Notifier.quick("Locked item");
    }


    ItemsTab.redraw();
    drawPreview();
    Saves.autoSave();
}

function redrawHeroImage() {
    const name = $( "#inputHeroAdd option:selected" ).text()
    if (!name || name.length == 0) {
        $('#inputHeroImage').attr("src", Assets.getBlank());
        return;
    }

    const data = HeroData.getHeroExtraInfo(name);
    const image = data.assets.thumbnail;

    $('#inputHeroImage').attr("src", image);

}

function clearOptions(id) {
    var select = document.getElementById(id);
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
      select.options[i] = null;
    }
}

function setSort4Piece(sets, arr) {
    arr.sort((a, b) => {
        if (sets.includes(a.set)) {
            return -1;
        }
        if (sets.includes(b.set)) {
            return 1;
        }
        return 0;
    })
}

function recalculateFilters(e) {
    // Selects fire twice, we should only calculate once
    if (e && e.target.className.includes("offscreen")) {
        return;
    }

    const heroId = document.getElementById('inputHeroAdd').value;
    if (!heroId || heroId.length == 0) {
        return;
    }

    const params = getOptimizationRequestParams();

    applyItemFilters(params, heroId).then(result => {
        // console.error("applyItemFilters", params);

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

        // const fourPieces = params.inputSetsOne.filter(x => fourPieceSets.includes(x));

        // setSort4Piece(fourPieces, allWeapons);
        // setSort4Piece(fourPieces, allHelmets);
        // setSort4Piece(fourPieces, allArmors);


        // console.log("W", allWeapons.filter(x => fourPieces.includes(x.set)).length)
        // console.log("H", allHelmets.filter(x => fourPieces.includes(x.set)).length)
        // console.log("A", allArmors.filter(x => fourPieces.includes(x.set)).length)
        // console.log("N", allNecklaces.length)
        // console.log("R", allRings.length)
        // console.log("B", allBoots.length)

        // console.error("allWeapons", allWeapons.map(x => x.set));



        permutations = weapons.length
                * helmets.length
                * armors.length
                * necklaces.length
                * rings.length
                * boots.length;

        const weaponsPercent = Math.round(weapons.length / (allWeapons.length || 1) * 100);
        const helmetsPercent = Math.round(helmets.length / (allHelmets.length || 1) * 100);
        const armorsPercent = Math.round(armors.length / (allArmors.length || 1) * 100);
        const necklacesPercent = Math.round(necklaces.length / (allNecklaces.length || 1) * 100);
        const ringsPercent = Math.round(rings.length / (allRings.length || 1) * 100);
        const bootsPercent = Math.round(boots.length / (allBoots.length || 1) * 100);

        $('#maxPermutationsNum').text(Number(permutations).toLocaleString());
        $('#filteredWeaponsNum').text(Number(weapons.length).toLocaleString() + " / " + Number(allWeapons.length).toLocaleString() + " - (" + weaponsPercent + "%)");
        $('#filteredHelmetsNum').text(Number(helmets.length).toLocaleString() + " / " + Number(allHelmets.length).toLocaleString() + " - (" + helmetsPercent + "%)");
        $('#filteredArmorsNum').text(Number(armors.length).toLocaleString() + " / " + Number(allArmors.length).toLocaleString() + " - (" + armorsPercent + "%)");
        $('#filteredNecklacesNum').text(Number(necklaces.length).toLocaleString() + " / " + Number(allNecklaces.length).toLocaleString() + " - (" + necklacesPercent + "%)");
        $('#filteredRingsNum').text(Number(rings.length).toLocaleString() + " / " + Number(allRings.length).toLocaleString() + " - (" + ringsPercent + "%)");
        $('#filteredBootsNum').text(Number(boots.length).toLocaleString() + " / " + Number(allBoots.length).toLocaleString() + " - (" + bootsPercent + "%)");
    });
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

async function addBuild() {
    const row = OptimizerGrid.getSelectedRow()
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (!row) return;
    if (selectedGear.length == 0) return;

    const rowId = row.id;

    const heroId = getSelectedHeroId();

    console.log("ADD BUILD", row)

    await Api.addBuild(heroId, row);
    await Api.editResultRows(parseInt(rowId), "star");
    OptimizerGrid.refresh()

    // const response = await Api.getHeroById(heroId);
    // OptimizerGrid.setPinnedHero(response.hero);

    drawPreview()
    Saves.autoSave();
}

async function removeBuild() {
    const row = OptimizerGrid.getSelectedRow()
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (!row) return;
    if (selectedGear.length == 0) return;

    const rowId = row.id;

    const heroId = getSelectedHeroId();

    console.log("REMOVE BUILD", row)

    await Api.removeBuild(heroId, row);
    await Api.editResultRows(parseInt(rowId), "");
    OptimizerGrid.refresh()

    // const response = await Api.getHeroById(heroId);
    // OptimizerGrid.setPinnedHero(response.hero);

    drawPreview()
    Saves.autoSave();
}

async function equipSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (selectedGear.length == 0) return;

    const heroId = getSelectedHeroId();

    await Api.equipItemsOnHero(heroId, selectedGear);

    const response = await Api.getHeroById(heroId);
    OptimizerGrid.setPinnedHero(response.hero);

    drawPreview()
    Saves.autoSave();
}

async function unequipSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (selectedGear.length == 0) return;

    const heroId = getSelectedHeroId();

    await Api.unequipItems(selectedGear);

    drawPreview()
    Saves.autoSave();
}

async function lockSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    const heroId = getSelectedHeroId();

    if (selectedGear.length == 0) return;

    await Api.lockItems(selectedGear);
    drawPreview()
    Saves.autoSave();
}

async function unlockSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    const heroId = getSelectedHeroId();

    if (selectedGear.length == 0) return;

    await Api.unlockItems(selectedGear);
    drawPreview()
    Saves.autoSave();
}

async function applyItemFilters(params, heroId) {
    const gearMainFilters = Selectors.getGearMainFilters();
    const getAllItemsResponse = await Api.getAllItems();
    const baseStats = await getHeroBaseStats(heroId);
    const hero = (await Api.getHeroById(heroId)).hero;
    var allItems = getAllItemsResponse.items;
    var items = allItems;

    console.log("Optimization params", params);

    if (params.inputExcludeSet.length > 0) {
        items = items.filter(x => !params.inputExcludeSet.includes(x.set));
    }

    if (params.inputOnlyPlus15Gear) {
        items = items.filter(x => x.enhance == 15);
    }

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

        const equipped = Object.values(hero.equipment);
        for (var i = 0; i < 6; i++) {
            const item = equipped[i];
            if (item) {
                items = items.filter(x => {
                    const passFilter = item.gear != x.gear || item.equippedById == x.equippedById;
                    // if (!passFilter)
                    //     console.log(x);
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

    items.forEach(x => Reforge.getReforgeStats(x));
    if (params.inputPredictReforges) {
        console.log("Predict reforges enabled")
        items.forEach(x => {
            if (x.level == 85 && x.enhance == 15) {
                x.substats.forEach(substat => {
                    if (substat.reforgedValue) {
                        substat.value = substat.reforgedValue;
                    }
                });

                x.main.value = x.main.reforgedValue;
            }
        })
        ItemAugmenter.augmentReforge(items);
    }


    items = ForceFilter.applyForceFilters(params, items)
    items = PriorityFilter.applyPriorityFilters(params, items, baseStats, allItems)

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

    console.log("Filtered items", prioritizedItems.length)
    currentFilteredItems = prioritizedItems;
    return {
        items,
        allItems
    };
}

function warnParams(params) {
    if (params.inputFilterPriority == 100
    &&  params.inputAtkPriority == 0
    &&  params.inputHpPriority == 0
    &&  params.inputDefPriority == 0
    &&  params.inputSpdPriority == 0
    &&  params.inputCrPriority == 0
    &&  params.inputCdPriority == 0
    &&  params.inputEffPriority == 0
    &&  params.inputResPriority == 0) {
        Notifier.info("No stat priority selected. For best results, use the stat priority filter.")
    } else if (params.inputFilterPriority == 100) {
        Notifier.info("Stat priority was selected but the filter is set to Top 100%. The stat priority filter is only useful when the % is not 100.")
    } else if (params.inputFilterPriority != 100
    &&  params.inputAtkPriority == 0
    &&  params.inputHpPriority == 0
    &&  params.inputDefPriority == 0
    &&  params.inputSpdPriority == 0
    &&  params.inputCrPriority == 0
    &&  params.inputCdPriority == 0
    &&  params.inputEffPriority == 0
    &&  params.inputResPriority == 0) {
        Notifier.info("Top N% was selected but no stat priorities are assigned. Select a stat priority otherwise the filter will pick random gears.")
    }

    if (params.inputSetsOne && params.inputSetsOne.length == 0) {
        Notifier.info("No sets were selected. For best results, select at least one set.")
    }

    if (params.inputNecklaceStat && params.inputNecklaceStat.length == 0
    &&  params.inputRingStat && params.inputRingStat.length == 0
    &&  params.inputBootsStat && params.inputBootsStat.length == 0) {
        Notifier.info("No accessory main stats were selected. For best results, use the main stat filter to narrow down the search.")
    }

    if (permutations >= 5_000_000_000) {
        Notifier.info("Over 5 billion permutations selected. For faster results, try applying stricter filters or using a lower Top N%.")
    }
}

async function submitOptimizationFilterRequest() {
    const params = getOptimizationRequestParams();
    warnParams(params);

    const heroId = document.getElementById('inputHeroAdd').value;
    const heroResponse = await Api.getHeroById(heroId);
    params.hero = heroResponse.hero;
    OptimizerGrid.showLoadingOverlay();
    Api.submitOptimizationFilterRequest(params).then(response => {
        console.warn("Optimization filter response", response);
        OptimizerGrid.reloadData();
    });
}

// Should not be used eventually
async function getHeroBaseStats(heroId) {
    const getHeroByIdResponse = await Api.getHeroById(heroId);
    const hero = getHeroByIdResponse.hero;

    const baseStats = HeroData.getBaseStatsByName(hero.name);
    return baseStats;
}

async function submitOptimizationRequest() {
    const getAllItemsResponse = await Api.getAllItems();

    console.log(ItemSerializer.serializeToArr(getAllItemsResponse.items));
    const params = getOptimizationRequestParams();
    const heroId = document.getElementById('inputHeroAdd').value;
    const baseStats = await getHeroBaseStats(heroId);
    const heroResponse = await Api.getHeroById(heroId);

    var filterResult = await applyItemFilters(params, heroId);
    var items = filterResult.items;

    console.log("OPTIMIZING HERO", heroResponse.hero);

    OptimizerGrid.setPinnedHero(heroResponse.hero);
    const request = {
        base: baseStats,
        requestType: "OptimizationRequest",
        items: items,
        bonusHp: heroResponse.hero.bonusHp,
        bonusAtk: heroResponse.hero.bonusAtk,
        hero: heroResponse.hero
    }

    warnParams(params);
    const mergedRequest = Object.assign(request, params, baseStats);
    const str = JSON.stringify(mergedRequest);

    console.log("Sending request:", mergedRequest)
    OptimizerGrid.showLoadingOverlay();
    // Subprocess.sendString(str)
    progressTimer = setInterval(updateProgress, 150)

    const results = Api.submitOptimizationRequest(mergedRequest).then(result => {
        console.log("RESPONSE RECEIVED", result);
        clearInterval(progressTimer);
        // $('#estimatedPermutations').text(Number(permutations).toLocaleString());
        var searchedCount = result.searched;
        var resultsCounter = result.results;

        var searchedStr = Number(searchedCount).toLocaleString();
        var resultsStr = Number(resultsCounter).toLocaleString();

        if (result.results >= 5000000) {
            Dialog.info('Search terminated after the 5,000,000 result limit was exceeded, the full results are not shown. Please apply more filters to narrow your search.')
        } else {
            $('#maxPermutationsNum').text(searchedStr);
        }

        $('#searchedPermutationsNum').text(searchedStr);
        $('#resultsFoundNum').text(resultsStr);
        OptimizerGrid.reloadData();
        console.log("REFRESHED");
    });
}

function updateProgress() {
    Api.getOptimizationProgress().then(result => {
        var searchedCount = result.searched;
        var resultsCounter = result.results;

        var searchedStr = Number(searchedCount).toLocaleString();
        var resultsStr = Number(resultsCounter).toLocaleString();

        $('#searchedPermutationsNum').text(searchedStr);
        $('#resultsFoundNum').text(resultsStr);
    })
}

function drawPreviewForGearId(id, elementId, baseStats) {
    // Api.getItemById(id).then(response => {
    //     document.getElementById(elementId).innerHTML = HtmlGenerator.buildItemPanel(response.item, "optimizerGrid", baseStats);
    // })
}

async function drawPreview() {
    // const heroId = document.getElementById('inputHeroAdd').value;

    // const getHeroByIdResponse = await Api.getHeroById(heroId);
    // const hero = getHeroByIdResponse.hero;
    // const baseStatsResponse = await Api.getBaseStats(hero.name);

    // console.warn("BASESTATSRESPONSE", baseStatsResponse)

    const selectedGear = OptimizerGrid.getSelectedGearIds();
    module.exports.drawPreview(selectedGear);
    // drawPreviewForGearId(selectedGear[0], 'optimizer-heroes-equipped-weapon', baseStatsResponse.heroStats);
    // drawPreviewForGearId(selectedGear[1], 'optimizer-heroes-equipped-helmet', baseStatsResponse.heroStats);
    // drawPreviewForGearId(selectedGear[2], 'optimizer-heroes-equipped-armor', baseStatsResponse.heroStats);
    // drawPreviewForGearId(selectedGear[3], 'optimizer-heroes-equipped-necklace', baseStatsResponse.heroStats);
    // drawPreviewForGearId(selectedGear[4], 'optimizer-heroes-equipped-ring', baseStatsResponse.heroStats);
    // drawPreviewForGearId(selectedGear[5], 'optimizer-heroes-equipped-boots', baseStatsResponse.heroStats);
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
    const mainFilters = Selectors.getGearMainFilters();
    const setFormat = getSetFormat(setFilters.sets);
    console.log("SETFORMAT", setFormat);

    request.inputPredictReforges   = readCheckbox('inputPredictReforges');
    request.inputAllowLockedItems   = readCheckbox('inputAllowLockedItems');
    request.inputAllowEquippedItems = readCheckbox('inputAllowEquippedItems');
    request.inputKeepCurrentItems   = readCheckbox('inputKeepCurrentItems');
    request.inputCanReforge   = readCheckbox('inputCanReforge');
    request.inputOnlyPlus15Gear   = readCheckbox('inputOnlyPlus15Gear');

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

    request.inputMinCpLimit = readNumber('inputMinCpLimit');
    request.inputMaxCpLimit = readNumber('inputMaxCpLimit');
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

    request.inputForceNumberSelect = readNumber('forceNumberSelect')

    request.inputSets = setFilters.sets;

    request.inputSetsOne = setFilters.sets[0];
    request.inputSetsTwo = setFilters.sets[1];
    request.inputSetsThree = setFilters.sets[2];
    request.inputExcludeSet = setFilters.exclude;

    request.inputNecklaceStat = mainFilters[0];
    request.inputRingStat = mainFilters[1];
    request.inputBootsStat = mainFilters[2];

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
            Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
        }
        if (sets[2].length > 0) {
            Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
        }
        return 0;
    }
    if (hasFourPieceSet(sets[0])) {
        if (hasTwoPieceSet(sets[0])) {
            Dialog.error("Invalid sets, the first set filter must be either all 4 piece or all 2 piece sets.");
            throw 'Invalid Sets'
        }
        if (hasTwoPieceSet(sets[2])) {
            Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
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
            Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
        }
        return 3;
    }
}