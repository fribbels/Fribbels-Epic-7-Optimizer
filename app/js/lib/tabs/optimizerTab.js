const rangesliderJs = require('rangeslider-js');
var permutations = 0;
var progressTimer;
var currentFilteredItems = [];
const electron = require('electron');
const ipc = electron.ipcRenderer;

var currentExecutionId;
var resized = false;

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

function fixSliders(index) {
    if (index == null || index == undefined) {
        index = '';
    }
    // if (!resized) {
    //     console.log("NOT FIXING")
    //     return;
    // }
    console.log("Fixing sliders")
    document.querySelector('#atkSlider' + index)['rangeslider-js'].update()
    document.querySelector('#hpSlider' + index)['rangeslider-js'].update()
    document.querySelector('#defSlider' + index)['rangeslider-js'].update()
    document.querySelector('#spdSlider' + index)['rangeslider-js'].update()
    document.querySelector('#crSlider' + index)['rangeslider-js'].update()
    document.querySelector('#cdSlider' + index)['rangeslider-js'].update()
    document.querySelector('#effSlider' + index)['rangeslider-js'].update()
    document.querySelector('#resSlider' + index)['rangeslider-js'].update()
    document.querySelector('#filterSlider' + index)['rangeslider-js'].update()

    resized = false;
}

function isNullUndefined(x) {
    return x === null || x === undefined;
}

function calculatePlaceholderRatings(index) {
    if (index == null || index == undefined) {
        index = '';
    }

    const minDef = readNumber('inputMinDefLimit' + index)
    const minHp = readNumber('inputMinHpLimit' + index)

    if (minDef == undefined || minHp == undefined || minDef == 0 || minHp == 0) {
        $("#inputMinEhpLimit" + index).attr("placeholder", "");
    } else {
        const ehp = Math.floor(minHp * (minDef / 300 + 1));
        $("#inputMinEhpLimit" + index).attr("placeholder", ehp);
    }

    const minAtk = readNumber('inputMinAtkLimit' + index)
    const minCd = readNumber('inputMinCdLimit' + index)

    if (minAtk == undefined || minCd == undefined || minAtk == 0 || minCd == 0) {
        $("#inputMinMcdmgLimit" + index).attr("placeholder", "");
    } else {
        const mcd = minAtk * minCd / 100;
        $("#inputMinMcdmgLimit" + index).attr("placeholder", mcd);
    }
}

module.exports = {

    initialize: () => {
        ipc.on('resized', () => {
            resized = true;
            fixSliders()
        });

        document.getElementById('inputMinDefLimit').addEventListener("change", () => {
            calculatePlaceholderRatings()
        });
        document.getElementById('inputMinHpLimit').addEventListener("change", () => {
            calculatePlaceholderRatings()
        });

        document.getElementById('inputMinAtkLimit').addEventListener("change", () => {
            calculatePlaceholderRatings()
        });
        document.getElementById('inputMinCdLimit').addEventListener("change", () => {
            calculatePlaceholderRatings()
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

        document.getElementById('submitOptimizerHeroLibrary').addEventListener("click", async () => {
            const heroId = document.getElementById('inputHeroAdd').value;
            const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
            electron.shell.openExternal('https://fribbels.github.io/e7/hero-library.html?hero=' + heroResponse.hero.name);
        });
        document.getElementById('submitOptimizerReset').addEventListener("click", () => {
            clearRatings();
            clearStats();
            calculatePlaceholderRatings();
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
            module.exports.loadPreviousHeroFilters(heroResponse, null, true);
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
        document.getElementById('skillsLabel').addEventListener("click", async () => {
            clearSkills();
            recalculateFilters();
        });
        document.getElementById('optionsLabel').addEventListener("click", async () => {
            clearOptions();
            recalculateFilters();
        });

        document.getElementById('skillOptionsButton').addEventListener("click", async () => {
            var heroId = document.getElementById('inputHeroAdd').value;
            if (!heroId) return;
            console.log("addSkills", heroId);

            var skillOptions = await module.exports.showSkillOptionsWindow(heroId);

            Saves.autoSave();
        });

        document.getElementById('addBonusStatsOptimizerButton').addEventListener("click", async () => {
            var heroId = document.getElementById('inputHeroAdd').value;
            if (!heroId) return;

            const hero = (await Api.getHeroById(heroId)).hero;

            await HeroesTab.showBonusStatsWindow(hero);
            redrawHeroImage()
            Saves.autoSave();
        });

        document.getElementById('addSubstatModsOptimizerButton').addEventListener("click", async () => {
            var heroId = document.getElementById('inputHeroAdd').value;
            if (!heroId) return;

            const hero = (await Api.getHeroById(heroId)).hero;

            const modStats = await Dialog.editModStatsDialog(hero);

            // mods

            await Api.setModStats(modStats, hero.id);
            Notifier.success("Saved mod stats");
            Saves.autoSave();

            // var heroId = document.getElementById('inputHeroAdd').value;
            // if (!heroId) return;
            // console.log("addSkills", heroId);

            // var skillOptions = await module.exports.showSkillOptionsWindow(heroId);

            // Saves.autoSave();
        });
        // document.getElementById('accessorySetsLabel').addEventListener("click", async () => {
        //     Selectors.clearGearMainAndSets();
        //     recalculateFilters();
        // });

        module.exports.buildSlider('#atkSlider', true)
        module.exports.buildSlider('#hpSlider', true)
        module.exports.buildSlider('#defSlider', true)
        module.exports.buildSlider('#spdSlider', true)
        module.exports.buildSlider('#crSlider', true)
        module.exports.buildSlider('#cdSlider', true)
        module.exports.buildSlider('#effSlider', true)
        module.exports.buildSlider('#resSlider', true)
        module.exports.buildTopSlider('#filterSlider', true)
    },

    buildSlider: (slider, recalc) => {
        var sliderEl = document.querySelector(slider);
        var nrInput = document.querySelector(slider + 'Input');
        rangesliderJs.create(sliderEl, {
            onSlideEnd: val => {
                nrInput.setAttribute('value', val)
                if (recalc) {
                    recalculateFilters();
                }
            },
            onSlide: val => {
                nrInput.setAttribute('value', val)
            },
        })
        nrInput.addEventListener('input',  ev => sliderEl['rangeslider-js'].update({value: ev.target.value}))
    },

    buildTopSlider: (slider, recalc) => {
        var sliderEl = document.querySelector(slider);
        var nrInput = document.querySelector(slider + 'Input');
        rangesliderJs.create(sliderEl, {
            onSlideEnd: val => {
                nrInput.setAttribute('value', Math.round(0.01 * Math.pow(val, 2)))
                if (recalc) {
                    recalculateFilters();
                }
            },
            onSlide: val => {
                nrInput.setAttribute('value', Math.round(0.01 * Math.pow(val, 2)))
            },
        })
        nrInput.addEventListener('input',  ev => sliderEl['rangeslider-js'].update({value: ev.target.value}))
    },

    applyItemFilters: async (params, heroResponse, allItemsResponse, submit, allowedHeroIds, overrideGearMainFilters, index) => {
        const gearMainFilters = overrideGearMainFilters || Selectors.getGearMainFilters();
        const getAllItemsResponse = allItemsResponse;
        const hero = heroResponse.hero;
        const baseStats = heroResponse.baseStats;
        const heroId = hero.id;
        var allItems = getAllItemsResponse.items;
        var items = allItems;

        const allHeroesResponse = await Api.getAllHeroes()
        const heroes = allHeroesResponse.heroes;

        if (!params.inputSets) {
            params.inputSets = [params.inputSetsOne, params.inputSetsTwo, params.inputSetsThree]
        }

        console.log("Optimization params", params);

        if (params.enhanceLimit) {
            const limit = params.enhanceLimit.length > 0 ? parseInt(params.enhanceLimit[0]) : 0;
            items = items.filter(x => x.enhance >= limit);
        }

        if (params.inputExcludeSet.length > 0) {
            items = items.filter(x => !params.inputExcludeSet.includes(x.set));
        }

        if (params.excludeFilter.length > 0) {
            items = items.filter(x => !params.excludeFilter.includes(x.equippedById) || x.equippedById == heroId);
        }

        // if (params.inputOnlyMaxedGear) {
        //     items = items.filter(x => x.enhance == 15 && !Reforge.isReforgeable(x));
        // }

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
            higherPriorityHeroes = higherPriorityHeroes.filter(x => !(allowedHeroIds || []).includes(x))
            items = items.filter(x => !higherPriorityHeroes.includes(x.equippedById))
            console.warn("DEBUG FILTER", higherPriorityHeroes, allowedHeroIds);
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

        const min = params.inputMinItemGSLimit == undefined ? 0 : params.inputMinItemGSLimit
        const max = params.inputMaxItemGSLimit == undefined ? 99999999 : params.inputMaxItemGSLimit

        items = items.filter(item => {
            return item.reforgedWss > min && item.reforgedWss < max
        })

        items = ModificationFilter.apply(items, params.inputSubstatMods, hero, submit, index);

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
    },

    getOptimizationRequestParams: (showError, index) => {
        if (index == null || index == undefined) {
            index = '';
        }
        const request = new OptimizationRequest();

        const setFilters = Selectors.getSetFilters(index);
        const mainFilters = Selectors.getGearMainFilters(index);
        const excludeFilter = Selectors.getExcludeGearFrom(index);
        const enhanceLimit = Selectors.getEnhanceLimit(index);
        const setFormat = getSetFormat(setFilters.sets, showError);
        console.log("SETFORMAT", setFormat);

        request.inputSubstatMods   = readCheckbox('inputSubstatMods' + index);
        request.inputAllowLockedItems   = readCheckbox('inputAllowLockedItems' + index);
        request.inputAllowEquippedItems = readCheckbox('inputAllowEquippedItems' + index);
        request.inputOrderedHeroPriority   = readCheckbox('inputOrderedHeroPriority' + index);
        request.inputKeepCurrentItems   = readCheckbox('inputKeepCurrentItems' + index);
        request.inputOnlyMaxedGear   = readCheckbox('inputOnlyMaxedGear' + index);
        request.inputPredictReforges   = request.inputSubstatMods || readCheckbox('inputPredictReforges' + index);
        // request.inputOver85   = readCheckbox('inputOver85');
        // request.inputOnlyPlus15Gear   = readCheckbox('inputOnlyPlus15Gear');

        request.inputAtkMinLimit = readNumber('inputMinAtkLimit' + index);
        request.inputAtkMaxLimit = readNumber('inputMaxAtkLimit' + index);
        request.inputHpMinLimit  = readNumber('inputMinHpLimit' + index);
        request.inputHpMaxLimit  = readNumber('inputMaxHpLimit' + index);
        request.inputDefMinLimit = readNumber('inputMinDefLimit' + index);
        request.inputDefMaxLimit = readNumber('inputMaxDefLimit' + index);
        request.inputSpdMinLimit = readNumber('inputMinSpdLimit' + index);
        request.inputSpdMaxLimit = readNumber('inputMaxSpdLimit' + index);
        request.inputCrMinLimit  = readNumber('inputMinCrLimit' + index);
        request.inputCrMaxLimit  = readNumber('inputMaxCrLimit' + index);
        request.inputCdMinLimit  = readNumber('inputMinCdLimit' + index);
        request.inputCdMaxLimit  = readNumber('inputMaxCdLimit' + index);
        request.inputEffMinLimit = readNumber('inputMinEffLimit' + index);
        request.inputEffMaxLimit = readNumber('inputMaxEffLimit' + index);
        request.inputResMinLimit = readNumber('inputMinResLimit' + index);
        request.inputResMaxLimit = readNumber('inputMaxResLimit' + index);

        request.inputMinCpLimit = readNumber('inputMinCpLimit' + index);
        request.inputMaxCpLimit = readNumber('inputMaxCpLimit' + index);
        request.inputMinHppsLimit = readNumber('inputMinHppsLimit' + index);
        request.inputMaxHppsLimit = readNumber('inputMaxHppsLimit' + index);
        request.inputMinEhpLimit = readNumber('inputMinEhpLimit' + index);
        request.inputMaxEhpLimit = readNumber('inputMaxEhpLimit' + index);
        request.inputMinEhppsLimit = readNumber('inputMinEhppsLimit' + index);
        request.inputMaxEhppsLimit = readNumber('inputMaxEhppsLimit' + index);
        request.inputMinDmgLimit = readNumber('inputMinDmgLimit' + index);
        request.inputMaxDmgLimit = readNumber('inputMaxDmgLimit' + index);
        request.inputMinDmgpsLimit = readNumber('inputMinDmgpsLimit' + index);
        request.inputMaxDmgpsLimit = readNumber('inputMaxDmgpsLimit' + index);
        request.inputMinMcdmgLimit = readNumber('inputMinMcdmgLimit' + index);
        request.inputMaxMcdmgLimit = readNumber('inputMaxMcdmgLimit' + index);
        request.inputMinMcdmgpsLimit = readNumber('inputMinMcdmgpsLimit' + index);
        request.inputMaxMcdmgpsLimit = readNumber('inputMaxMcdmgpsLimit' + index);

        request.inputMinS1Limit = readNumber('inputMinS1Limit' + index);
        request.inputMaxS1Limit = readNumber('inputMaxS1Limit' + index);
        request.inputMinS2Limit = readNumber('inputMinS2Limit' + index);
        request.inputMaxS2Limit = readNumber('inputMaxS2Limit' + index);
        request.inputMinS3Limit = readNumber('inputMinS3Limit' + index);
        request.inputMaxS3Limit = readNumber('inputMaxS3Limit' + index);

        request.inputMinDmgHLimit = readNumber('inputMinDmgHLimit' + index);
        request.inputMaxDmgHLimit = readNumber('inputMaxDmgHLimit' + index);
        request.inputMinDmgDLimit = readNumber('inputMinDmgDLimit' + index);
        request.inputMaxDmgDLimit = readNumber('inputMaxDmgDLimit' + index);
        request.inputMinUpgradesLimit = readNumber('inputMinUpgradesLimit' + index);
        request.inputMaxUpgradesLimit = readNumber('inputMaxUpgradesLimit' + index);
        request.inputMinConversionsLimit = readNumber('inputMinConversionsLimit' + index);
        request.inputMaxConversionsLimit = readNumber('inputMaxConversionsLimit' + index);
        request.inputMinEquippedLimit = readNumber('inputMinEquippedLimit' + index);
        request.inputMaxEquippedLimit = readNumber('inputMaxEquippedLimit' + index);
        request.inputMinScoreLimit = readNumber('inputMinScoreLimit' + index);
        request.inputMaxScoreLimit = readNumber('inputMaxScoreLimit' + index);
        request.inputMinBSLimit = readNumber('inputMinBSLimit' + index);
        request.inputMaxBSLimit = readNumber('inputMaxBSLimit' + index);
        request.inputMinPriorityLimit = readNumber('inputMinPriorityLimit' + index);
        request.inputMaxPriorityLimit = readNumber('inputMaxPriorityLimit' + index);
        request.inputMinItemGSLimit = readNumber('inputMinItemGSLimit' + index);
        request.inputMaxItemGSLimit = readNumber('inputMaxItemGSLimit' + index);

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

        request.inputAtkPriority = readNumber('atkSlider' + index + 'Input');
        request.inputHpPriority = readNumber('hpSlider' + index + 'Input');
        request.inputDefPriority = readNumber('defSlider' + index + 'Input');
        request.inputSpdPriority = readNumber('spdSlider' + index + 'Input');
        request.inputCrPriority = readNumber('crSlider' + index + 'Input');
        request.inputCdPriority = readNumber('cdSlider' + index + 'Input');
        request.inputEffPriority = readNumber('effSlider' + index + 'Input');
        request.inputResPriority = readNumber('resSlider' + index + 'Input');
        request.inputFilterPriority = readNumber('filterSlider' + index + 'Input');

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
        request.enhanceLimit = enhanceLimit;

        request.setFormat = setFormat;

        return request;
    },

    loadPreviousHeroFilters: async (heroResponse, index, recalc, tab) => {
        if (index == null || index == undefined) {
            index = '';
        }

        if (!heroResponse) {
            const heroId = document.getElementById('inputHeroAdd').value;
            heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
        }

        const hero = heroResponse.hero;
        const request = hero.optimizationRequest;

        if (!hero) return;
        if (!request) {
            const optimizerSettings = Settings.getOptimizerOptions();

            $("#inputPredictReforges" + index).prop('checked', optimizerSettings.settingDefaultUseReforgedStats);
            $("#inputSubstatMods" + index).prop('checked', optimizerSettings.settingDefaultUseSubstatMods);
            $("#inputAllowLockedItems" + index).prop('checked', optimizerSettings.settingDefaultLockedItems);
            $("#inputAllowEquippedItems" + index).prop('checked', optimizerSettings.settingDefaultEquippedItems);
            $("#inputOrderedHeroPriority" + index).prop('checked', optimizerSettings.settingDefaultUseHeroPriority);
            $("#inputKeepCurrentItems" + index).prop('checked', optimizerSettings.settingDefaultKeepCurrent);
            return;
        }

        $("#inputMinAtkLimit" + index).val(inputDisplayNumber(request.inputAtkMinLimit))
        $("#inputMaxAtkLimit" + index).val(inputDisplayNumber(request.inputAtkMaxLimit))
        $("#inputMinHpLimit" + index).val(inputDisplayNumber(request.inputHpMinLimit))
        $("#inputMaxHpLimit" + index).val(inputDisplayNumber(request.inputHpMaxLimit))
        $("#inputMaxHpLimit" + index).val(inputDisplayNumber(request.inputHpMaxLimit));
        $("#inputMinDefLimit" + index).val(inputDisplayNumber(request.inputDefMinLimit));
        $("#inputMaxDefLimit" + index).val(inputDisplayNumber(request.inputDefMaxLimit));
        $("#inputMinSpdLimit" + index).val(inputDisplayNumber(request.inputSpdMinLimit));
        $("#inputMaxSpdLimit" + index).val(inputDisplayNumber(request.inputSpdMaxLimit));
        $("#inputMinCrLimit" + index).val(inputDisplayNumber(request.inputCrMinLimit));
        $("#inputMaxCrLimit" + index).val(inputDisplayNumber(request.inputCrMaxLimit));
        $("#inputMinCdLimit" + index).val(inputDisplayNumber(request.inputCdMinLimit));
        $("#inputMaxCdLimit" + index).val(inputDisplayNumber(request.inputCdMaxLimit));
        $("#inputMinEffLimit" + index).val(inputDisplayNumber(request.inputEffMinLimit));
        $("#inputMaxEffLimit" + index).val(inputDisplayNumber(request.inputEffMaxLimit));
        $("#inputMinResLimit" + index).val(inputDisplayNumber(request.inputResMinLimit));
        $("#inputMaxResLimit" + index).val(inputDisplayNumber(request.inputResMaxLimit));

        $("#inputMinCpLimit" + index).val(inputDisplayNumber(request.inputMinCpLimit));
        $("#inputMaxCpLimit" + index).val(inputDisplayNumber(request.inputMaxCpLimit));
        $("#inputMinHppsLimit" + index).val(inputDisplayNumber(request.inputMinHppsLimit));
        $("#inputMaxHppsLimit" + index).val(inputDisplayNumber(request.inputMaxHppsLimit));
        $("#inputMinEhpLimit" + index).val(inputDisplayNumber(request.inputMinEhpLimit));
        $("#inputMaxEhpLimit" + index).val(inputDisplayNumber(request.inputMaxEhpLimit));
        $("#inputMinEhppsLimit" + index).val(inputDisplayNumber(request.inputMinEhppsLimit));
        $("#inputMaxEhppsLimit" + index).val(inputDisplayNumber(request.inputMaxEhppsLimit));
        $("#inputMinDmgLimit" + index).val(inputDisplayNumber(request.inputMinDmgLimit));
        $("#inputMaxDmgLimit" + index).val(inputDisplayNumber(request.inputMaxDmgLimit));
        $("#inputMinDmgpsLimit" + index).val(inputDisplayNumber(request.inputMinDmgpsLimit));
        $("#inputMaxDmgpsLimit" + index).val(inputDisplayNumber(request.inputMaxDmgpsLimit));
        $("#inputMinMcdmgLimit" + index).val(inputDisplayNumber(request.inputMinMcdmgLimit));
        $("#inputMaxMcdmgLimit" + index).val(inputDisplayNumber(request.inputMaxMcdmgLimit));
        $("#inputMinMcdmgpsLimit" + index).val(inputDisplayNumber(request.inputMinMcdmgpsLimit));
        $("#inputMaxMcdmgpsLimit" + index).val(inputDisplayNumber(request.inputMaxMcdmgpsLimit));

        $("#inputMinS1Limit" + index).val(inputDisplayNumber(request.inputMinS1Limit));
        $("#inputMaxS1Limit" + index).val(inputDisplayNumber(request.inputMaxS1Limit));
        $("#inputMinS2Limit" + index).val(inputDisplayNumber(request.inputMinS2Limit));
        $("#inputMaxS2Limit" + index).val(inputDisplayNumber(request.inputMaxS2Limit));
        $("#inputMinS3Limit" + index).val(inputDisplayNumber(request.inputMinS3Limit));
        $("#inputMaxS3Limit" + index).val(inputDisplayNumber(request.inputMaxS3Limit));

        $("#inputMinDmgHLimit" + index).val(inputDisplayNumber(request.inputMinDmgHLimit));
        $("#inputMaxDmgHLimit" + index).val(inputDisplayNumber(request.inputMaxDmgHLimit));
        $("#inputMinDmgDLimit" + index).val(inputDisplayNumber(request.inputMinDmgDLimit));
        $("#inputMaxDmgDLimit" + index).val(inputDisplayNumber(request.inputMaxDmgDLimit));
        $("#inputMinUpgradesLimit" + index).val(inputDisplayNumber(request.inputMinUpgradesLimit));
        $("#inputMaxUpgradesLimit" + index).val(inputDisplayNumber(request.inputMaxUpgradesLimit));
        $("#inputMinConversionsLimit" + index).val(inputDisplayNumber(request.inputMinConversionsLimit));
        $("#inputMaxConversionsLimit" + index).val(inputDisplayNumber(request.inputMaxConversionsLimit));
        $("#inputMinEquippedLimit" + index).val(inputDisplayNumber(request.inputMinEquippedLimit));
        $("#inputMaxEquippedLimit" + index).val(inputDisplayNumber(request.inputMaxEquippedLimit));
        $("#inputMinScoreLimit" + index).val(inputDisplayNumber(request.inputMinScoreLimit));
        $("#inputMaxScoreLimit" + index).val(inputDisplayNumber(request.inputMaxScoreLimit));
        $("#inputMinBSLimit" + index).val(inputDisplayNumber(request.inputMinBSLimit));
        $("#inputMaxBSLimit" + index).val(inputDisplayNumber(request.inputMaxBSLimit));
        $("#inputMinPriorityLimit" + index).val(inputDisplayNumber(request.inputMinPriorityLimit));
        $("#inputMaxPriorityLimit" + index).val(inputDisplayNumber(request.inputMaxPriorityLimit));

        const optimizerSettings = Settings.getOptimizerOptions();

        $("#inputPredictReforges" + index).prop('checked',     isNullUndefined(request.inputPredictReforges)     ? optimizerSettings.settingDefaultUseReforgedStats : request.inputPredictReforges);
        $("#inputSubstatMods" + index).prop('checked',         isNullUndefined(request.inputSubstatMods)         ? optimizerSettings.settingDefaultUseSubstatMods   : request.inputSubstatMods);
        $("#inputAllowLockedItems" + index).prop('checked',    isNullUndefined(request.inputAllowLockedItems)    ? optimizerSettings.settingDefaultLockedItems      : request.inputAllowLockedItems);
        $("#inputAllowEquippedItems" + index).prop('checked',  isNullUndefined(request.inputAllowEquippedItems)  ? optimizerSettings.settingDefaultEquippedItems    : request.inputAllowEquippedItems);
        $("#inputKeepCurrentItems" + index).prop('checked',    isNullUndefined(request.inputKeepCurrentItems)    ? optimizerSettings.settingDefaultKeepCurrent      : request.inputKeepCurrentItems);
        $("#inputOrderedHeroPriority" + index).prop('checked', isNullUndefined(request.inputOrderedHeroPriority) ? optimizerSettings.settingDefaultUseHeroPriority  : request.inputOrderedHeroPriority);

        document.querySelector('#atkSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputAtkPriority)})
        document.querySelector('#atkSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputAtkPriority))

        document.querySelector('#hpSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputHpPriority)})
        document.querySelector('#hpSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputHpPriority))

        document.querySelector('#defSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputDefPriority)})
        document.querySelector('#defSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputDefPriority))

        document.querySelector('#spdSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputSpdPriority)})
        document.querySelector('#spdSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputSpdPriority))

        document.querySelector('#crSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputCrPriority)})
        document.querySelector('#crSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputCrPriority))

        document.querySelector('#cdSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputCdPriority)})
        document.querySelector('#cdSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputCdPriority))

        document.querySelector('#effSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputEffPriority)})
        document.querySelector('#effSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputEffPriority))

        document.querySelector('#resSlider' + index)['rangeslider-js'].update({value: inputDisplayNumberNumber(request.inputResPriority)})
        document.querySelector('#resSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputResPriority))

        document.querySelector('#filterSlider' + index)['rangeslider-js'].update({value: Math.sqrt(inputDisplayNumberNumber(request.inputFilterPriority) / 0.01)})
        document.querySelector('#filterSlider' + index + 'Input').setAttribute('value', inputDisplayNumberNumber(request.inputFilterPriority, 100))

        // $('#forceNumberSelect').val(inputDisplayNumberNumber(request.inputForceNumberSelect))

        Selectors.setGearMainAndSetsFromRequest(request, index);

        if (recalc) {
            recalculateFilters(null, heroResponse);
        }
        fixSliders(index)
        if (tab != 'multiOptimizer') {
            calculatePlaceholderRatings(index)
        }
    },

    // True if blocking error
    warnParams: (params, overridePermutations) => {
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
            Notifier.warn("No accessory main stats were selected. For best results, use the main stat filter to narrow down the search.")
        }

        // if ((overridePermutations ? overridePermutations : permutations) >= 5_000_000_000) {
        //     Notifier.info("Over 5 billion permutations selected. For faster results, try applying stricter filters or using a lower Top N%.")
        // }
        return false;
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

    editGearFromIcon: (id, reforge, checkboxPrefix) => {
        editGearFromIcon(id, reforge, checkboxPrefix);
    },

    lockGearFromIcon: (id, checkboxPrefix) => {
        lockGearFromIcon(id, checkboxPrefix);
    },

    getCurrentExecutionId: () => {
        return currentExecutionId;
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
    },


    showSkillOptionsWindow: async (heroId) => {
        // showEditHeroInfoPopups(row.name)
        const skillOptions = await Dialog.changeSkillOptionsDialog(heroId);

        if (!skillOptions) {
            return;
        }

        console.warn("skillOptions", skillOptions)

        Api.setSkillOptions(skillOptions, heroId)
        Notifier.success("Saved skill options");
        Saves.autoSave();
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
function clearSkills() {
    $(".skill-number-input").val("")
}
function clearStats() {
    $(".stat-number-input").val("")
    calculatePlaceholderRatings();
}

function clearOptions() {
    const optimizerSettings = Settings.getOptimizerOptions();

    $("#inputPredictReforges").prop('checked', optimizerSettings.settingDefaultUseReforgedStats);
    $("#inputSubstatMods").prop('checked', optimizerSettings.settingDefaultUseSubstatMods);
    $("#inputAllowLockedItems").prop('checked', optimizerSettings.settingDefaultLockedItems);
    $("#inputAllowEquippedItems").prop('checked', optimizerSettings.settingDefaultEquippedItems);
    $("#inputOrderedHeroPriority").prop('checked', optimizerSettings.settingDefaultUseHeroPriority);
    $("#inputKeepCurrentItems").prop('checked', optimizerSettings.settingDefaultKeepCurrent);
}

async function editGearFromIcon(id, reforge, checkboxPrefix) {
    const result = await Api.getItemById(id);
    console.log("a1", result.item);
    const editedItem = await Dialog.editGearDialog(result.item, true, reforge);

    ItemAugmenter.augment([editedItem])
    await Api.editItems([editedItem]);
    Notifier.quick("Edited item");
    await ItemsGrid.editedItem();

    ItemsTab.redraw(editedItem);
    drawPreview();
    Saves.autoSave();
    HeroesGrid.redrawPreview();
    HeroesGrid.refresh();

    if (checkboxPrefix == "enhanceTab") {
        EnhancingTab.redrawEnhanceGuideFromRemoteId(editedItem.id);
    }
}

async function lockGearFromIcon(id, checkboxPrefix) {
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

    if (checkboxPrefix == "enhanceTab") {
        EnhancingTab.redrawEnhanceGuideFromRemoteId(id);
    }
}

async function redrawHeroImage() {
    const name = $( "#inputHeroAdd option:selected" ).attr("label")
    const id = $( "#inputHeroAdd option:selected" ).attr('value')
    if (!name || name.length == 0) {
        $('#inputHeroImage').attr("src", Assets.getBlank());
        return;
    }


    const data = HeroData.getHeroExtraInfo(name);
    const image = data.assets.thumbnail;
    $('#inputHeroImage').attr("src", image);


    const heroResponse = await Api.getHeroById(id, $('#inputPredictReforges').prop('checked'));
    const hero = heroResponse.hero;
    const artifact = hero.artifactName
    const artifactData = HeroData.getArtifactByName(artifact)

    if (artifactData) {
        const artiUrl = `https://static.smilegatemegaport.com/event/live/epic7/guide/wearingStatus/images/artifact/${artifactData.code}_ico.png`
        $('#inputArtifactImage').attr("src", artiUrl);
    } else {
        $('#inputArtifactImage').attr("src", Assets.getBlank());
    }

    const imprintNumber = Utils.round100ths(parseFloat(hero.imprintNumber)/100)
    const imprintMatch = Object.entries(data.self_devotion.grades).filter(x => Utils.round100ths(x[1]) == imprintNumber)

    if (imprintMatch.length > 0) {
        $('#inputImprintImage').attr("src", `./assets/imprint${imprintMatch[0][0]}.png`);
    } else {
        $('#inputImprintImage').attr("src", Assets.getBlank());
    }
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

    const params = module.exports.getOptimizationRequestParams();

    if (!heroResponse) {
        heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    }

    const allItemsResponse = await Api.getAllItems();

    module.exports.applyItemFilters(params, heroResponse, allItemsResponse, false).then(result => {
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
    await Api.editResultRows(parseInt(rowId), "star", currentExecutionId);

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
    await Api.editResultRows(parseInt(rowId), "not star", currentExecutionId);

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
    await Api.editResultRows(parseInt(rowId), "star", currentExecutionId);

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

async function submitOptimizationFilterRequest() {
    const params = module.exports.getOptimizationRequestParams();
    getSetFormat(params.inputSets, true);
    if (module.exports.warnParams(params)) {
        return;
    }

    const heroId = document.getElementById('inputHeroAdd').value;
    const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    params.hero = heroResponse.hero;
    params.hero.artifactAttack = 0;
    params.hero.artifactHealth = 0;
    if (params.hero.artifactName && params.hero.artifactName != "None") {
        const artifactLevelText = params.hero.artifactLevel;
        if (artifactLevelText != "None") {
            const artifactLevel = parseInt(artifactLevelText);
            const artifactStats = Artifact.getStats(params.hero.artifactName, artifactLevel);

            params.hero.artifactHealth += artifactStats.health;
            params.hero.artifactAttack += artifactStats.attack;
        }
    }

    OptimizerGrid.showLoadingOverlay();
    params.executionId = currentExecutionId;

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
    const params = module.exports.getOptimizationRequestParams(true);
    const heroId = document.getElementById('inputHeroAdd').value;

    const allItemsResponse = await Api.getAllItems();
    const heroResponse = await Api.getHeroById(heroId, $('#inputPredictReforges').prop('checked'));
    const hero = heroResponse.hero;
    const baseStats = heroResponse.baseStats;


    var filterResult = await module.exports.applyItemFilters(params, heroResponse, allItemsResponse, true);
    var items = filterResult.items;

    console.log("OPTIMIZING HERO", hero);

    OptimizerGrid.setPinnedHero(hero);
    const request = {
        base: baseStats,
        requestType: "OptimizationRequest",
        items: items,
        bonusHp: hero.bonusHp,
        bonusAtk: hero.bonusAtk,
        hero: hero,
        damageMultipliers: DamageCalc.getMultipliers(hero, hero.skillOptions)
    }

    request.hero.artifactAttack = 0;
    request.hero.artifactHealth = 0;
    if (request.hero.artifactName && request.hero.artifactName != "None") {
        const artifactLevelText = request.hero.artifactLevel;
        if (artifactLevelText != "None") {
            const artifactLevel = parseInt(artifactLevelText);
            const artifactStats = Artifact.getStats(request.hero.artifactName, artifactLevel);

            request.hero.artifactHealth = artifactStats.health;
            request.hero.artifactAttack = artifactStats.attack;
        }
    }

    if (!hero.artifactName || hero.artifactName == "None") {
        Notifier.warn("Your hero does not have an artifact equipped, use the 'Add Bonus Stats' button on the Heroes page to add artifact stats");
    }

    if (module.exports.warnParams(params)) {
        return;
    }

    const mergedRequest = Object.assign(request, params, baseStats);
    const str = JSON.stringify(mergedRequest);

    console.log("Sending request:", mergedRequest)
    OptimizerGrid.showLoadingOverlay();
    // Subprocess.sendString(str)
    if (progressTimer) {
        clearInterval(progressTimer)
    }
    progressTimer = setInterval(updateProgress, 200)

    await Api.deleteExecution(currentExecutionId);
    currentExecutionId = await Api.prepareExecution();
    mergedRequest.executionId = currentExecutionId;

    const results = Api.submitOptimizationRequest(mergedRequest).then(result => {
        console.log("RESPONSE RECEIVED", result);
        if (progressTimer) {
            clearInterval(progressTimer)
        }
        // $('#estimatedPermutations').text(Number(permutations).toLocaleString());
        var searchedCount = result.searched;
        var resultsCounter = result.results;

        var searchedStr = Number(searchedCount).toLocaleString();
        var resultsStr = Number(resultsCounter).toLocaleString();

        var maxResults = parseInt(Settings.parseNumberValue('settingMaxResults') || 0);
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
    "AttackSet", "SpeedSet", "DestructionSet", "LifestealSet", "ProtectionSet", "CounterSet",  "RageSet", "RevengeSet", "InjurySet"
]

const twoPieceSets = [
    "HealthSet", "DefenseSet", "CriticalSet", "HitSet", "ResistSet", "UnitySet", "ImmunitySet", "PenetrationSet", "TorrentSet"
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
