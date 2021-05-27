const rangesliderJs = require('rangeslider-js');
var permutations = 0;
var progressTimer;
var currentFilteredItems = [];
const electron = require('electron');
const ipc = electron.ipcRenderer;

var resized = false;

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

function fixSliders() {
    // if (!resized) {
    //     console.log("NOT FIXING")
    //     return;
    // }
    console.log("Fixing sliders")
    document.querySelector('#atkSlider')['rangeslider-js'].update()
    document.querySelector('#hpSlider')['rangeslider-js'].update()
    document.querySelector('#defSlider')['rangeslider-js'].update()
    document.querySelector('#spdSlider')['rangeslider-js'].update()
    document.querySelector('#crSlider')['rangeslider-js'].update()
    document.querySelector('#cdSlider')['rangeslider-js'].update()
    document.querySelector('#effSlider')['rangeslider-js'].update()
    document.querySelector('#resSlider')['rangeslider-js'].update()
    document.querySelector('#filterSlider')['rangeslider-js'].update()

    resized = false;
}

async function loadPreviousHeroFilters(heroResponse) {
    const heroId = document.getElementById('inputHeroAdd').value;
    if (!heroResponse) {
        heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    }

    const hero = heroResponse.hero;
    const request = hero.optimizationRequest;

    if (!hero) return;
    if (!request) {
        $("#inputPredictReforges").prop('checked', true);
        $("#inputSubstatMods").prop('checked', false);
        $("#inputAllowLockedItems").prop('checked', false);
        $("#inputAllowEquippedItems").prop('checked', false);
        $("#inputKeepCurrentItems").prop('checked', false);
        $("#inputOrderedHeroPriority").prop('checked', false);
        $("#inputOnlyMaxedGear").prop('checked', false);
        return;
    }

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

    $("#inputMinDmgHLimit").val(inputDisplayNumber(request.inputMinDmgHLimit));
    $("#inputMaxDmgHLimit").val(inputDisplayNumber(request.inputMaxDmgHLimit));
    $("#inputMinUpgradesLimit").val(inputDisplayNumber(request.inputMinUpgradesLimit));
    $("#inputMaxUpgradesLimit").val(inputDisplayNumber(request.inputMaxUpgradesLimit));
    $("#inputMinConversionsLimit").val(inputDisplayNumber(request.inputMinConversionsLimit));
    $("#inputMaxConversionsLimit").val(inputDisplayNumber(request.inputMaxConversionsLimit));
    $("#inputMinScoreLimit").val(inputDisplayNumber(request.inputMinScoreLimit));
    $("#inputMaxScoreLimit").val(inputDisplayNumber(request.inputMaxScoreLimit));
    $("#inputMinPriorityLimit").val(inputDisplayNumber(request.inputMinPriorityLimit));
    $("#inputMaxPriorityLimit").val(inputDisplayNumber(request.inputMaxPriorityLimit));

    $("#inputPredictReforges").prop('checked', isNullUndefined(request.inputPredictReforges) ? true : request.inputPredictReforges);
    $("#inputSubstatMods").prop('checked', isNullUndefined(request.inputSubstatMods) ? true : request.inputSubstatMods);
    $("#inputAllowLockedItems").prop('checked', isNullUndefined(request.inputAllowLockedItems) ? false : request.inputAllowLockedItems);
    $("#inputAllowEquippedItems").prop('checked', isNullUndefined(request.inputAllowEquippedItems) ? false : request.inputAllowEquippedItems);
    $("#inputKeepCurrentItems").prop('checked', isNullUndefined(request.inputKeepCurrentItems) ? false : request.inputKeepCurrentItems);
    $("#inputOrderedHeroPriority").prop('checked', isNullUndefined(request.inputOrderedHeroPriority) ? false : request.inputOrderedHeroPriority);
    $("#inputOnlyMaxedGear").prop('checked', isNullUndefined(request.inputOnlyMaxedGear) ? false : request.inputOnlyMaxedGear);

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

    document.querySelector('#filterSlider')['rangeslider-js'].update({value: Math.sqrt(inputDisplayNumberNumber(request.inputFilterPriority) / 0.01)})
    document.querySelector('#filterSliderInput').setAttribute('value', inputDisplayNumberNumber(request.inputFilterPriority, 100))

    // $('#forceNumberSelect').val(inputDisplayNumberNumber(request.inputForceNumberSelect))

    Selectors.setGearMainAndSetsFromRequest(request);
    recalculateFilters(null, heroResponse);
    fixSliders()
}

function isNullUndefined(x) {
    return x === null || x === undefined;
}

module.exports = {

    initialize: () => {
        ipc.on('resized', () => {
            resized = true;
            fixSliders()
        });

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
        // document.getElementById('submitOptimizerLoad').addEventListener("click", async () => {
        //     loadPreviousHeroFilters();
        // });

        document.getElementById('submitOptimizerReset').addEventListener("click", () => {
            clearRatings();
            clearStats();
            // clearForce();

            Selectors.clearGearMainAndSets();

            clearSubstatPriority();

            clearOptions();

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


        $('#inputHeroAdd').change(async () => {
            const heroId = document.getElementById('inputHeroAdd').value;
            const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));

            recalculateFilters();
            redrawHeroImage();
            module.exports.redrawHeroSelector();
            loadPreviousHeroFilters(heroResponse);
            OptimizerGrid.setPinnedHero(heroResponse.hero);
            StatPreview.draw(heroResponse.hero, heroResponse.hero)
        });

        // $('#forceNumberSelect').change(recalculateFilters);
        $('.optimizer-number-input').change(recalculateFilters);
        $('.optimizer-checkbox').change(recalculateFilters);
        $('.inputGearFilterSelect').change(recalculateFilters);
        $('.inputSetFilterSelect').change(recalculateFilters);
        $('.icon-close').click(recalculateFilters)
        // $('#filterSliderInput').change(recalculateFilters);

        $('.optionsExcludeGearFrom').change(() => {
            // Doesnt work without explicit function call for some reason
            recalculateFilters();
        })

        document.getElementById('tab1label').addEventListener("click", async () => {
            await module.exports.redrawHeroSelector();
            recalculateFilters();
            fixSliders()
        });

        document.getElementById('substatPriorityLabel').addEventListener("click", async () => {
            clearSubstatPriority();
            recalculateFilters();
        });
        document.getElementById('statsLabel').addEventListener("click", async () => {
            clearStats();
            recalculateFilters();
        });
        document.getElementById('ratingsLabel').addEventListener("click", async () => {
            clearRatings();
            recalculateFilters();
        });
        // document.getElementById('forceLabel').addEventListener("click", async () => {
        //     clearForce();
        //     recalculateFilters();
        // });
        document.getElementById('optionsLabel').addEventListener("click", async () => {
            clearOptions();
            recalculateFilters();
        });
        // document.getElementById('accessorySetsLabel').addEventListener("click", async () => {
        //     Selectors.clearGearMainAndSets();
        //     recalculateFilters();
        // });

        buildSlider('#atkSlider')
        buildSlider('#hpSlider')
        buildSlider('#defSlider')
        buildSlider('#spdSlider')
        buildSlider('#crSlider')
        buildSlider('#cdSlider')
        buildSlider('#effSlider')
        buildSlider('#resSlider')
        buildTopSlider('#filterSlider')
    },

    drawPreview: (gearIds, mods) => {
        console.log("Draw preview", gearIds, mods)

        const moddedGear = ModificationFilter.getModsByIds(gearIds, mods);
        console.log("Modded gear results", moddedGear)

        Api.getItemsByIds(gearIds).then(async (response) => {
            const selectedGear = response.items;

            const heroId = document.getElementById('inputHeroAdd').value;
            const getHeroByIdResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
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

            document.getElementById('optimizer-heroes-equipped-weapon').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[0], "optimizerGrid", baseStats);
            document.getElementById('optimizer-heroes-equipped-helmet').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[1], "optimizerGrid", baseStats);
            document.getElementById('optimizer-heroes-equipped-armor').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[2], "optimizerGrid", baseStats);
            document.getElementById('optimizer-heroes-equipped-necklace').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[3], "optimizerGrid", baseStats);
            document.getElementById('optimizer-heroes-equipped-ring').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[4], "optimizerGrid", baseStats);
            document.getElementById('optimizer-heroes-equipped-boots').innerHTML = HtmlGenerator.buildItemPanel(selectedGear[5], "optimizerGrid", baseStats);
        })
    },

    getOptimizationRequestParams: () => {
        return getOptimizationRequestParams();
    },

    editGearFromIcon: (id, reforge) => {
        editGearFromIcon(id, reforge);
    },

    lockGearFromIcon: (id) => {
        lockGearFromIcon(id);
    },

    redrawHeroSelector: async () => {
        const getAllHeroesResponse = await Api.getAllHeroes();
        const selectedId = $( "#inputHeroAdd option:selected" ).val()

        clearHeroOptions("inputHeroAdd");
        clearHeroOptions("optionsExcludeGearFrom");
        const optimizerHeroSelector = document.getElementById('inputHeroAdd')
        const optimizerAllowGearFromSelector = document.getElementById('optionsExcludeGearFrom')
        const heroes = getAllHeroesResponse.heroes;
        Utils.sortByAttribute(heroes, "name");
        console.log("getAllHeroesResponse", getAllHeroesResponse)
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
            optimizerAllowGearFromSelector.add(option2);

            if (selectedId && selectedId == hero.id) {
                optimizerHeroSelector.value = selectedId
                OptimizerGrid.setPinnedHero(hero);
            }
        }
        redrawHeroImage();
        recalculateFilters();
        Selectors.refreshInputHeroAdd();
        Selectors.refreshAllowGearFrom();
    }
}

function clearSubstatPriority() {
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
}

function clearRatings() {
    $(".optimizer-number-input").val("")
}
function clearStats() {
    $(".stat-number-input").val("")
}

function clearOptions() {
    $("#inputPredictReforges").prop('checked', true);
    $("#inputSubstatMods").prop('checked', false);
    $("#inputAllowLockedItems").prop('checked', false);
    $("#inputAllowEquippedItems").prop('checked', false);
    $("#inputOrderedHeroPriority").prop('checked', false);
    $("#inputKeepCurrentItems").prop('checked', false);
    $("#inputOnlyMaxedGear").prop('checked', false);
}

async function editGearFromIcon(id, reforge) {
    const result = await Api.getItemById(id);
    console.log(result.item);
    const editedItem = await Dialog.editGearDialog(result.item, true, reforge);

    ItemAugmenter.augment([editedItem])
    await Api.editItems([editedItem]);
    Notifier.quick("Edited item");

    ItemsTab.redraw(editedItem);
    drawPreview();
    Saves.autoSave();
    HeroesGrid.redrawPreview();
    HeroesGrid.refresh();
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


    ItemsTab.redraw(result.item);
    drawPreview();
    Saves.autoSave();
    HeroesGrid.redrawPreview();
}

function redrawHeroImage() {
    const name = $( "#inputHeroAdd option:selected" ).attr("label")
    if (!name || name.length == 0) {
        $('#inputHeroImage').attr("src", Assets.getBlank());
        return;
    }

    const data = HeroData.getHeroExtraInfo(name);
    const image = data.assets.thumbnail;

    $('#inputHeroImage').attr("src", image);
}

function clearHeroOptions(id) {
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

async function recalculateFilters(e, heroResponse) {
    // Selects fire twice, we should only calculate once
    if (e && e.target.className.includes("offscreen")) {
        return;
    }

    const heroId = document.getElementById('inputHeroAdd').value;
    if (!heroId || heroId.length == 0) {
        return;
    }

    const params = getOptimizationRequestParams();

    if (!heroResponse) {
        heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    }

    const allItemsResponse = await Api.getAllItems();

    applyItemFilters(params, heroResponse, allItemsResponse, false).then(result => {
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

    return filteredIds.filter(x => !!x);
}

async function addBuild() {
    const row = OptimizerGrid.getSelectedRow()
    const node = OptimizerGrid.getSelectedNode()
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (!selectedGear.length || selectedGear.includes(undefined) || selectedGear.includes(null)) {
        return;
    }

    const rowId = row.id;
    const heroId = getSelectedHeroId();

    const hero = (await Api.getHeroById(heroId)).hero;

    console.log("ADD BUILD", row)

    if (row.mods.filter(x => x).length > 0) {
        row.name = "MOD: " + (!hero.modGrade ? "" : (hero.modGrade == "greater" ? "Greater" : "Lesser")) + " " + (hero.rollQuality || "0") + "%";
    }

    await Api.addBuild(heroId, row);
    await Api.editResultRows(parseInt(rowId), "star");

    row.property = "star";
    node.updateData(row);


    drawPreview()
    Saves.autoSave();
}

async function removeBuild() {
    const row = OptimizerGrid.getSelectedRow()
    const node = OptimizerGrid.getSelectedNode()
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (!row) return;
    if (selectedGear.length == 0) return;

    const rowId = row.id;

    const heroId = getSelectedHeroId();

    console.log("REMOVE BUILD", row)

    await Api.removeBuild(heroId, row);
    await Api.editResultRows(parseInt(rowId), "not star");

    row.property = "not star";
    node.updateData(row);

    drawPreview()
    Saves.autoSave();
}

async function equipSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (selectedGear.length == 0) return;
    if (selectedGear.includes(undefined) || selectedGear.includes(null)) {
        return;
    }
    const heroId = getSelectedHeroId();

    const heroResult = await Api.equipItemsOnHero(heroId, selectedGear, $('#inputPredictReforges').prop('checked'));
    const hero = heroResult.hero;

    const row = OptimizerGrid.getSelectedRow()
    const node = OptimizerGrid.getSelectedNode()
    const rowId = row.id;


    if (row.mods.filter(x => x).length > 0) {
        row.name = "MOD: " + (!hero.modGrade ? "" : (hero.modGrade == "greater" ? "Greater" : "Lesser")) + " " + (hero.rollQuality || "0") + "%";
    }

    await Api.addBuild(heroId, row);
    await Api.editResultRows(parseInt(rowId), "star");

    row.property = "star";
    node.updateData(row);

    OptimizerGrid.setPinnedHero(hero);
    drawPreview()
    Saves.autoSave();
}

async function unequipSelectedGear() {
    const selectedGear = filterSelectedGearByCheckbox(OptimizerGrid.getSelectedGearIds());
    if (selectedGear.length == 0) return;

    const heroId = getSelectedHeroId();

    await Api.unequipItems(selectedGear);

    const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    const hero = heroResponse.hero;

    OptimizerGrid.setPinnedHero(hero);

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

async function applyItemFilters(params, heroResponse, allItemsResponse, submit) {
    const gearMainFilters = Selectors.getGearMainFilters();
    const getAllItemsResponse = allItemsResponse;
    const hero = heroResponse.hero;
    const baseStats = heroResponse.baseStats;
    const heroId = hero.id;
    var allItems = getAllItemsResponse.items;
    var items = allItems;

    const allHeroesResponse = await Api.getAllHeroes()
    const heroes = allHeroesResponse.heroes;

    console.log("Optimization params", params);

    if (params.inputExcludeSet.length > 0) {
        items = items.filter(x => !params.inputExcludeSet.includes(x.set));
    }

    if (params.excludeFilter.length > 0) {
        items = items.filter(x => !params.excludeFilter.includes(x.equippedById) || x.equippedById == heroId);
    }

    if (params.inputOnlyMaxedGear) {
        items = items.filter(x => x.enhance == 15 && !Reforge.isReforgeable(x));
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

    if (params.inputOrderedHeroPriority) {
        // todo
        console.warn(heroes, hero);
        // var higherPriorityItems = [];
        var higherPriorityHeroes = [];
        for (var i = 0; i < heroes.length; i++) {
            if (heroes[i].id == hero.id) {
                break;
            }

            higherPriorityHeroes.push(heroes[i].id);

            // higherPriorityItems.push(
            //     heroes[i].equipment.Weapon?.id,
            //     heroes[i].equipment.Helmet?.id,
            //     heroes[i].equipment.Armor?.id,
            //     heroes[i].equipment.Necklace?.id,
            //     heroes[i].equipment.Ring?.id,
            //     heroes[i].equipment.Boots?.id
            // )
        }

        // higherPriorityItems = higherPriorityItems.filter(x => !!x);
        items = items.filter(x => !higherPriorityHeroes.includes(x.equippedById))
        console.warn(higherPriorityHeroes);
    }

    if (params.inputKeepCurrentItems) {
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

    if (params.inputPredictReforges) {
        console.log("Predict reforges enabled")
        ItemAugmenter.augment(items);
        items.forEach(x => {
            if (Reforge.isReforgeableNow(x)) {
                x.substats.forEach(substat => {
                    if (substat.reforgedValue) {
                        substat.value = substat.reforgedValue;
                    }
                });

                x.main.value = x.main.reforgedValue;
            }
        })
    }

    items = ModificationFilter.apply(items, params.inputSubstatMods, hero, submit);

    items = PriorityFilter.applyPriorityFilters(params, items, baseStats, allItems, params.inputPredictReforges, params.inputSubstatMods)

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

// True if blocking error
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
        Dialog.error("Stat priority was selected but the filter is set to Top 100%. The stat priority filter is only useful when the % is not 100.")
        return true;
    } else if (params.inputFilterPriority != 100
    &&  params.inputAtkPriority == 0
    &&  params.inputHpPriority == 0
    &&  params.inputDefPriority == 0
    &&  params.inputSpdPriority == 0
    &&  params.inputCrPriority == 0
    &&  params.inputCdPriority == 0
    &&  params.inputEffPriority == 0
    &&  params.inputResPriority == 0) {
        Dialog.error("Top % was selected but no stat priorities are assigned. Assign stat priorities otherwise the filter will not work.")
        return true;
    }

    if (params.inputSetsOne && params.inputSetsOne.length == 0) {
        Notifier.info("No sets were selected. For best results, select at least one set.")
    }

    if (params.inputDefMinLimit > 10000) {
        Dialog.error("Your minimum defense filter is over 10,000, did you mean HP?");
        return true;
    }

    if (params.inputNecklaceStat && params.inputNecklaceStat.length == 0
    &&  params.inputRingStat && params.inputRingStat.length == 0
    &&  params.inputBootsStat && params.inputBootsStat.length == 0) {
        Notifier.info("No accessory main stats were selected. For best results, use the main stat filter to narrow down the search.")
    }

    if (permutations >= 5_000_000_000) {
        Notifier.info("Over 5 billion permutations selected. For faster results, try applying stricter filters or using a lower Top N%.")
    }
    return false;
}

async function submitOptimizationFilterRequest() {
    const params = getOptimizationRequestParams();
    getSetFormat(params.inputSets, true);
    if (warnParams(params)) {
        return;
    }

    const heroId = document.getElementById('inputHeroAdd').value;
    const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    params.hero = heroResponse.hero;
    OptimizerGrid.showLoadingOverlay();
    Api.submitOptimizationFilterRequest(params).then(response => {
        console.warn("Optimization filter response", response);
        OptimizerGrid.reloadData();
    });
}

async function submitOptimizationRequest() {
    recalculateFilters();

    const inProgressResponse = await Api.getOptimizationInProgress();
    if (inProgressResponse.inProgress) {
        Notifier.warn("Optimization already in progress. Please cancel before starting a new search.")
        return;
    }

    // console.log(ItemSerializer.serializeToArr(getAllItemsResponse.items));
    const params = getOptimizationRequestParams(true);
    const heroId = document.getElementById('inputHeroAdd').value;

    const allItemsResponse = await Api.getAllItems();
    const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    const hero = heroResponse.hero;
    const baseStats = heroResponse.baseStats;

    var filterResult = await applyItemFilters(params, heroResponse, allItemsResponse, true);
    var items = filterResult.items;

    console.log("OPTIMIZING HERO", hero);

    OptimizerGrid.setPinnedHero(hero);
    const request = {
        base: baseStats,
        requestType: "OptimizationRequest",
        items: items,
        bonusHp: hero.bonusHp,
        bonusAtk: hero.bonusAtk,
        hero: hero
    }

    if (!hero.artifactName || hero.artifactName == "None") {
        Notifier.warn("Your hero does not have an artifact equipped, use the 'Add Bonus Stats' button on the Heroes page to add artifact stats");
    }

    if (warnParams(params)) {
        return;
    }

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

        var maxResults = parseInt(Settings.parseMaxResults() || 0);
        if (result.results >= maxResults) {
            Dialog.info('Search terminated after the result limit was exceeded, the full results are not shown. Please apply more filters to narrow your search.')
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

async function drawPreview() {
    const selectedGear = OptimizerGrid.getSelectedGearIds();
    const selectedMods = OptimizerGrid.getSelectedGearMods();
    module.exports.drawPreview(selectedGear, selectedMods);
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

function getOptimizationRequestParams(showError) {
    const request = new OptimizationRequest();

    const setFilters = Selectors.getSetFilters();
    const mainFilters = Selectors.getGearMainFilters();
    const excludeFilter = Selectors.getExcludeGearFrom();
    const setFormat = getSetFormat(setFilters.sets, showError);
    console.log("SETFORMAT", setFormat);

    request.inputPredictReforges   = readCheckbox('inputPredictReforges');
    request.inputSubstatMods   = readCheckbox('inputSubstatMods');
    request.inputAllowLockedItems   = readCheckbox('inputAllowLockedItems');
    request.inputAllowEquippedItems = readCheckbox('inputAllowEquippedItems');
    request.inputOrderedHeroPriority   = readCheckbox('inputOrderedHeroPriority');
    request.inputKeepCurrentItems   = readCheckbox('inputKeepCurrentItems');
    request.inputOnlyMaxedGear   = readCheckbox('inputOnlyMaxedGear');
    // request.inputOver85   = readCheckbox('inputOver85');
    // request.inputOnlyPlus15Gear   = readCheckbox('inputOnlyPlus15Gear');

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

    request.inputMinDmgHLimit = readNumber('inputMinDmgHLimit');
    request.inputMaxDmgHLimit = readNumber('inputMaxDmgHLimit');
    request.inputMinUpgradesLimit = readNumber('inputMinUpgradesLimit');
    request.inputMaxUpgradesLimit = readNumber('inputMaxUpgradesLimit');
    request.inputMinConversionsLimit = readNumber('inputMinConversionsLimit');
    request.inputMaxConversionsLimit = readNumber('inputMaxConversionsLimit');
    request.inputMinScoreLimit = readNumber('inputMinScoreLimit');
    request.inputMaxScoreLimit = readNumber('inputMaxScoreLimit');
    request.inputMinPriorityLimit = readNumber('inputMinPriorityLimit');
    request.inputMaxPriorityLimit = readNumber('inputMaxPriorityLimit');

    // request.inputAtkMinForce = readNumber('inputMinAtkForce');
    // request.inputAtkMaxForce = readNumber('inputMaxAtkForce');
    // request.inputAtkPercentMinForce = readNumber('inputMinAtkPercentForce');
    // request.inputAtkPercentMaxForce = readNumber('inputMaxAtkPercentForce');
    // request.inputSpdMinForce = readNumber('inputMinSpdForce');
    // request.inputSpdMaxForce = readNumber('inputMaxSpdForce');
    // request.inputCrMinForce = readNumber('inputMinCrForce');
    // request.inputCrMaxForce = readNumber('inputMaxCrForce');
    // request.inputCdMinForce = readNumber('inputMinCdForce');
    // request.inputCdMaxForce = readNumber('inputMaxCdForce');
    // request.inputHpMinForce = readNumber('inputMinHpForce');
    // request.inputHpMaxForce = readNumber('inputMaxHpForce');
    // request.inputHpPercentMinForce = readNumber('inputMinHpPercentForce');
    // request.inputHpPercentMaxForce = readNumber('inputMaxHpPercentForce');
    // request.inputDefMinForce = readNumber('inputMinDefForce');
    // request.inputDefMaxForce = readNumber('inputMaxDefForce');
    // request.inputDefPercentMinForce = readNumber('inputMinDefPercentForce');
    // request.inputDefPercentMaxForce = readNumber('inputMaxDefPercentForce');
    // request.inputEffMinForce = readNumber('inputMinEffForce');
    // request.inputEffMaxForce = readNumber('inputMaxEffForce');
    // request.inputResMinForce = readNumber('inputMinResForce');
    // request.inputResMaxForce = readNumber('inputMaxResForce');

    request.inputAtkPriority = readNumber('atkSliderInput');
    request.inputHpPriority = readNumber('hpSliderInput');
    request.inputDefPriority = readNumber('defSliderInput');
    request.inputSpdPriority = readNumber('spdSliderInput');
    request.inputCrPriority = readNumber('crSliderInput');
    request.inputCdPriority = readNumber('cdSliderInput');
    request.inputEffPriority = readNumber('effSliderInput');
    request.inputResPriority = readNumber('resSliderInput');
    request.inputFilterPriority = readNumber('filterSliderInput');

    // request.inputForceNumberSelect = readNumber('forceNumberSelect')

    request.inputSets = setFilters.sets;

    request.inputSetsOne = setFilters.sets[0];
    request.inputSetsTwo = setFilters.sets[1];
    request.inputSetsThree = setFilters.sets[2];
    request.inputExcludeSet = setFilters.exclude;

    request.inputNecklaceStat = mainFilters[0];
    request.inputRingStat = mainFilters[1];
    request.inputBootsStat = mainFilters[2];

    request.excludeFilter = excludeFilter;

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

function getSetFormat(sets, showError) {
    if (sets[0].length == 0) {
        if (sets[1].length > 0) {
            if (showError) Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
        }
        if (sets[2].length > 0) {
            if (showError) Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
        }
        return 0;
    }
    if (hasFourPieceSet(sets[0])) {
        if (hasTwoPieceSet(sets[0])) {
            if (showError) Dialog.error("Invalid sets, the first set filter must be either all 4 piece or all 2 piece sets.");
            throw 'Invalid Sets'
        }
        if (hasTwoPieceSet(sets[2])) {
            if (showError) Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
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
            if (showError) Dialog.error("Invalid sets, fill in the set filters from top to bottom.");
            throw 'Invalid Sets'
        }
        return 3;
    }
}
