const stringSimilarity = require('string-similarity');

var setFilter;
const setCheckboxes = [];

var gearFilter;
const gearCheckboxes = [];

var levelFilter;
const levelCheckboxes = [];

var enhanceFilter;
const enhanceCheckboxes = [];

var statFilter;
const statCheckboxes = [];

const filters = {
    setFilter: null,
    gearFilter: null,
    levelFilter: null,
    enhanceFilter: null,
    statFilter: null,
    substatFilter: null,
    duplicateFilter: null
}

module.exports = {

    initialize: () => {
        setupEventListeners();

        // document.getElementById('updateGear').addEventListener("click", () => {
        //     module.exports.redraw();
        // });

        document.getElementById('editGear').addEventListener("click", () => {
            editGear();
        });
        document.getElementById('reforgeGear').addEventListener("click", () => {
            reforgeGear();
        });
        document.getElementById('addGear').addEventListener("click", () => {
            addGear();
        });
        document.getElementById('duplicateGear').addEventListener("click", () => {
            duplicateGear();
        });
        document.getElementById('removeGear').addEventListener("click", () => {
            removeGear();
        });
        document.getElementById('unequipGear').addEventListener("click", () => {
            unequipGear();
        });
        document.getElementById('lockGear').addEventListener("click", () => {
            lockGear();
        });
        document.getElementById('unlockGear').addEventListener("click", () => {
            unlockGear();
        });

        document.getElementById('tab3label').addEventListener("click", () => {
            module.exports.redraw();
        });
    },

    redraw: (newItem) => {

        ItemsGrid.redraw(newItem).then(x => {

            ItemsGrid.refreshFilters(filters)

            // setFilter = null;
            // for (var checkbox of setCheckboxes) {
            //     checkbox.checked = false;
            // }
            // gearFilter = null;
            // for (var checkbox of gearCheckboxes) {
            //     checkbox.checked = false;
            // }
        });
    }
}


async function editGear() {
    const items = ItemsGrid.getSelectedGear();
    if (!items || items.length != 1) {
        Notifier.warn("Select one item to edit.")
        return;
    }

    const item = items[0]

    const editedItem = await Dialog.editGearDialog(item, true, false);
    console.warn("EDITITEMS", editedItem);

    ItemAugmenter.augment([editedItem])
    await Api.editItems([editedItem]);

    Notifier.success("Edited item");
    module.exports.redraw(editedItem);
    Saves.autoSave();
}

async function reforgeGear() {
    const items = ItemsGrid.getSelectedGear();
    if (!items || items.length != 1) {
        Notifier.warn("Select one item to reforge.")
        return;
    }

    const item = items[0]

    if (item.level != 85 || item.enhance != 15) {
        Notifier.warn("Only +15 level 85 gear can be reforged.")
        return;
    }

    if (Reforge.isGaveleets(item)) {
        Notifier.warn("Abyss lifesteal set (Gaveleet's) cannot be reforged")
        return;
    }

    ItemAugmenter.augment([item]);
    const editedItem = await Dialog.editGearDialog(item, true, true);
    console.warn("EDITITEMS", editedItem);

    await Api.editItems([editedItem]);

    Notifier.quick("Reforged item");
    module.exports.redraw(editedItem);
    Saves.autoSave();
}

async function addGear() {
    const newItem = await Dialog.editGearDialog(null, false, false);
    console.warn("NEWITEM", newItem);

    Notifier.quick("Added item");
    module.exports.redraw(newItem);
    Saves.autoSave();
}

async function duplicateGear() {
    const items = ItemsGrid.getSelectedGear();
    if (!items || items.length != 1) {
        Notifier.warn("Select one item to duplicate.")
        return;
    }

    const item = items[0]

    const editedItem = await Dialog.editGearDialog(item, false, false);
    console.warn("EDITITEMS", editedItem);

    await Api.editItems([editedItem]);

    Notifier.quick("Added item");
    module.exports.redraw(editedItem);
    Saves.autoSave();
}

async function removeGear() {
    const items = ItemsGrid.getSelectedGear();

    await Api.deleteItems(items.map(x => x.id));

    Notifier.quick("Removed " + items.length + " item(s).")

    module.exports.redraw();
    Saves.autoSave();
}

async function unequipGear() {
    const items = ItemsGrid.getSelectedGear();

    await Api.unequipItems(items.map(x => x.id));

    Notifier.quick("Unequipped " + items.length + " item(s).")

    module.exports.redraw();
    Saves.autoSave();
}

async function lockGear() {
    const items = ItemsGrid.getSelectedGear();

    await Api.lockItems(items.map(x => x.id));

    Notifier.quick("Locked " + items.length + " item(s).")

    module.exports.redraw();
    Saves.autoSave();
}

async function unlockGear() {
    const items = ItemsGrid.getSelectedGear();

    await Api.unlockItems(items.map(x => x.id));

    Notifier.quick("Unlocked " + items.length + " item(s).")

    module.exports.redraw();
    Saves.autoSave();
}

function setupFilterListener(elementId, filter, filterContent) {
    document.getElementById(elementId).addEventListener('click', () => {
        const element = $('#' + elementId);
        element.toggleClass("gearTabButtonSelected");
        elementsByFilter[filter].forEach(x => {
            if (x != elementId) {
                $('#' + x).removeClass("gearTabButtonSelected")
            }
        })
        if (element.hasClass("gearTabButtonSelected")) {
            filters[filter] = filterContent
        } else {
            filters[filter] = null;
        }
        console.log("Updated filters", filters)
        ItemsGrid.refreshFilters(filters);
    })
}

function setupClearListener(elementId, filter) {
    document.getElementById(elementId).addEventListener('click', () => {
        elementsByFilter[filter].forEach(x => {
            $('#' + x).removeClass("gearTabButtonSelected")
        })
        filters[filter] = null;
        ItemsGrid.refreshFilters(filters);
    })
}

const elementsByFilter = {
    gearFilter: [
        "weaponFilter",
        "helmetFilter",
        "armorFilter",
        "necklaceFilter",
        "ringFilter",
        "bootsFilter",
    ],
    setFilter: [
        "speedSetFilter",
        "attackSetFilter",
        "destructionSetFilter",
        "lifestealSetFilter",
        "counterSetFilter",
        "rageSetFilter",
        "revengeSetFilter",
        "injurySetFilter",
        "criticalSetFilter",
        "hitSetFilter",
        "healthSetFilter",
        "defenseSetFilter",
        "resistSetFilter",
        "immunitySetFilter",
        "unitySetFilter",
        "penetrationSetFilter",
    ],
    statFilter: [
        "mainStatAttackFilter",
        "mainStatAttackPercentFilter",
        "mainStatDefencePercentFilter",
        "mainStatDefenseFilter",
        "mainStatHealthPercentFilter",
        "mainStatHealthFilter",
        "mainStatCrFilter",
        "mainStatCdFilter",
        "mainStatEffFilter",
        "mainStatEffResFilter",
        "mainStatSpeedFilter",
    ],
    substatFilter: [
        "subStatAttackFilter",
        "subStatAttackPercentFilter",
        "subStatDefencePercentFilter",
        "subStatDefenseFilter",
        "subStatHealthPercentFilter",
        "subStatHealthFilter",
        "subStatCrFilter",
        "subStatCdFilter",
        "subStatEffFilter",
        "subStatEffResFilter",
        "subStatSpeedFilter",
    ],
    levelFilter: [
        "level90Filter",
        "level88Filter",
        "level85Filter",
        "levelUnder85Filter",
        "level0Filter",
    ],
    enhanceFilter: [
        "plus15Filter",
        "plus12Filter",
        "plus9Filter",
        "plus6Filter",
        "plus3Filter",
        "plus0Filter",
    ],
    duplicateFilter: [
        "duplicateFilter",
    ]
}

function setupEventListeners() {
    // Gears
    setupFilterListener("weaponFilter", "gearFilter", "weapon");
    setupFilterListener("helmetFilter", "gearFilter", "helmet");
    setupFilterListener("armorFilter", "gearFilter", "armor");
    setupFilterListener("necklaceFilter", "gearFilter", "necklace");
    setupFilterListener("ringFilter", "gearFilter", "ring");
    setupFilterListener("bootsFilter", "gearFilter", "boots");

    setupClearListener("clearGearFilter", "gearFilter")

    // Sets
    setupFilterListener("speedSetFilter", "setFilter", "SpeedSet");
    setupFilterListener("attackSetFilter", "setFilter", "AttackSet");
    setupFilterListener("destructionSetFilter", "setFilter", "DestructionSet");
    setupFilterListener("lifestealSetFilter", "setFilter", "LifestealSet");
    setupFilterListener("counterSetFilter", "setFilter", "CounterSet");
    setupFilterListener("rageSetFilter", "setFilter", "RageSet");
    setupFilterListener("revengeSetFilter", "setFilter", "RevengeSet");
    setupFilterListener("injurySetFilter", "setFilter", "InjurySet");
    setupFilterListener("criticalSetFilter", "setFilter", "CriticalSet");
    setupFilterListener("hitSetFilter", "setFilter", "HitSet");
    setupFilterListener("healthSetFilter", "setFilter", "HealthSet");
    setupFilterListener("defenseSetFilter", "setFilter", "DefenseSet");
    setupFilterListener("resistSetFilter", "setFilter", "ResistSet");
    setupFilterListener("immunitySetFilter", "setFilter", "ImmunitySet");
    setupFilterListener("unitySetFilter", "setFilter", "UnitySet");
    setupFilterListener("penetrationSetFilter", "setFilter", "PenetrationSet");

    setupClearListener("clearSetFilter", "setFilter")

    // Main
    setupFilterListener("mainStatAttackPercentFilter", "statFilter", "AttackPercent")
    setupFilterListener("mainStatAttackFilter", "statFilter", "Attack")
    setupFilterListener("mainStatDefencePercentFilter", "statFilter", "DefensePercent")
    setupFilterListener("mainStatDefenseFilter", "statFilter", "Defense")
    setupFilterListener("mainStatHealthPercentFilter", "statFilter", "HealthPercent")
    setupFilterListener("mainStatHealthFilter", "statFilter", "Health")
    setupFilterListener("mainStatCrFilter", "statFilter", "CriticalHitChancePercent")
    setupFilterListener("mainStatCdFilter", "statFilter", "CriticalHitDamagePercent")
    setupFilterListener("mainStatEffFilter", "statFilter", "EffectivenessPercent")
    setupFilterListener("mainStatEffResFilter", "statFilter", "EffectResistancePercent")
    setupFilterListener("mainStatSpeedFilter", "statFilter", "Speed")

    setupClearListener("clearMainStatFilter", "statFilter")

    // Sub
    setupFilterListener("subStatAttackPercentFilter", "substatFilter", "AttackPercent")
    setupFilterListener("subStatAttackFilter", "substatFilter", "Attack")
    setupFilterListener("subStatDefencePercentFilter", "substatFilter", "DefensePercent")
    setupFilterListener("subStatDefenseFilter", "substatFilter", "Defense")
    setupFilterListener("subStatHealthPercentFilter", "substatFilter", "HealthPercent")
    setupFilterListener("subStatHealthFilter", "substatFilter", "Health")
    setupFilterListener("subStatCrFilter", "substatFilter", "CriticalHitChancePercent")
    setupFilterListener("subStatCdFilter", "substatFilter", "CriticalHitDamagePercent")
    setupFilterListener("subStatEffFilter", "substatFilter", "EffectivenessPercent")
    setupFilterListener("subStatEffResFilter", "substatFilter", "EffectResistancePercent")
    setupFilterListener("subStatSpeedFilter", "substatFilter", "Speed")

    setupClearListener("clearSubStatFilter", "substatFilter")

    // Level
    setupFilterListener("level90Filter", "levelFilter", "90")
    setupFilterListener("level88Filter", "levelFilter", "88")
    setupFilterListener("level85Filter", "levelFilter", "85")
    setupFilterListener("levelUnder85Filter", "levelFilter", "under85")
    setupFilterListener("level0Filter", "levelFilter", "0")

    setupClearListener("clearLevelFilter", "levelFilter")

    // Enhance
    setupFilterListener("plus15Filter", "enhanceFilter", "plus15")
    setupFilterListener("plus12Filter", "enhanceFilter", "plus12")
    setupFilterListener("plus9Filter", "enhanceFilter", "plus9")
    setupFilterListener("plus6Filter", "enhanceFilter", "plus6")
    setupFilterListener("plus3Filter", "enhanceFilter", "plus3")
    setupFilterListener("plus0Filter", "enhanceFilter", "plus0")

    setupClearListener("clearEnhanceFilter", "enhanceFilter")

    setupFilterListener("duplicateFilter", "duplicateFilter", "duplicate")

    setupClearListener("clearOtherFilter", "duplicateFilter")

    setupClearListener("clearAllFilter", "duplicateFilter")

    document.getElementById('clearAllFilter').addEventListener('click', () => {
        for (var key of Object.keys(elementsByFilter)) {
            elementsByFilter[key].forEach(x => {
                $('#' + x).removeClass("gearTabButtonSelected")
            })
            filters[key] = null;
        }
        ItemsGrid.refreshFilters(filters);
    })
    // const sets = Object.keys(Assets.getAssetsBySet())
    // console.log("SETUP", sets);
    // for (var set of sets) {
    //     const checkbox = document.getElementById('checkboxImage' + set);
    //     checkbox.addEventListener('change', function(event) {
    //         var eventSet = event.target.id.split("checkboxImage")[1];
    //         if (event.target.checked) {
    //             setFilter = eventSet
    //             for (var checkbox of setCheckboxes) {
    //                 if (checkbox != event.target)
    //                     checkbox.checked = false;
    //             }
    //         } else {
    //             setFilter = null;
    //         }

    //         ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    //     });
    //     setCheckboxes.push(checkbox);
    // }

    // document.getElementById('checkboxImageClearSets').addEventListener('change', function(event) {
    //     console.log(event);
    //     if (event.target.checked) {
    //         setFilter = null;
    //         for (var checkbox of setCheckboxes) {
    //             checkbox.checked = false;
    //         }
    //     } else {

    //     }

    //     ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    // });

    // Gear

    // const gears = Object.keys(Assets.getAssetsByGear())
    // console.log("SETUP", gears);
    // for (var gear of gears) {
    //     const checkbox = document.getElementById('checkboxImage' + gear);
    //     checkbox.addEventListener('change', function(event) {
    //         var eventGear = event.target.id.split("checkboxImage")[1];
    //         if (event.target.checked) {
    //             gearFilter = eventGear
    //             for (var checkbox of gearCheckboxes) {
    //                 if (checkbox != event.target)
    //                     checkbox.checked = false;
    //             }
    //         } else {
    //             gearFilter = null;
    //         }

    //         ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    //     });
    //     gearCheckboxes.push(checkbox);
    // }

    // document.getElementById('checkboxImageClearGears').addEventListener('change', function(event) {
    //     console.log(event);
    //     if (event.target.checked) {
    //         gearFilter = null;
    //         for (var checkbox of gearCheckboxes) {
    //             checkbox.checked = false;
    //         }
    //     } else {

    //     }

    //     ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    // });

    // Level

    // const levels = Object.keys(Assets.getAssetsByLevel())
    // console.log("SETUP", levels);
    // for (var level of levels) {
    //     const checkbox = document.getElementById('checkboxImage' + level);
    //     checkbox.addEventListener('change', function(event) {
    //         var eventLevel = event.target.id.split("checkboxImage")[1];
    //         if (event.target.checked) {
    //             levelFilter = eventLevel
    //             for (var checkbox of levelCheckboxes) {
    //                 if (checkbox != event.target)
    //                     checkbox.checked = false;
    //             }
    //         } else {
    //             levelFilter = null;
    //         }

    //         ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    //     });
    //     levelCheckboxes.push(checkbox);
    // }

    // document.getElementById('checkboxImageClearLevels').addEventListener('change', function(event) {
    //     console.log(event);
    //     if (event.target.checked) {
    //         levelFilter = null;
    //         for (var checkbox of levelCheckboxes) {
    //             checkbox.checked = false;
    //         }
    //     } else {

    //     }

    //     ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    // });

    // // Enhance

    // const enhances = Object.keys(Assets.getAssetsByEnhance())
    // console.log("SETUP", enhances);
    // for (var enhance of enhances) {
    //     const checkbox = document.getElementById('checkboxImage' + enhance);
    //     checkbox.addEventListener('change', function(event) {
    //         var eventEnhance = event.target.id.split("checkboxImage")[1];
    //         if (event.target.checked) {
    //             enhanceFilter = eventEnhance
    //             for (var checkbox of enhanceCheckboxes) {
    //                 if (checkbox != event.target)
    //                     checkbox.checked = false;
    //             }
    //         } else {
    //             enhanceFilter = null;
    //         }

    //         ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    //     });
    //     enhanceCheckboxes.push(checkbox);
    // }

    // document.getElementById('checkboxImageClearEnhances').addEventListener('change', function(event) {
    //     console.log(event);
    //     if (event.target.checked) {
    //         enhanceFilter = null;
    //         for (var checkbox of enhanceCheckboxes) {
    //             checkbox.checked = false;
    //         }
    //     } else {

    //     }

    //     ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    // });

    // // Stat

    // const stats = Object.keys(Assets.getAssetsByStat())
    // console.log("SETUP", stats);
    // for (var stat of stats) {
    //     const checkbox = document.getElementById('checkboxImage' + stat);
    //     checkbox.addEventListener('change', function(event) {
    //         var eventStat = event.target.id.split("checkboxImage")[1];
    //         if (event.target.checked) {
    //             statFilter = eventStat
    //             for (var checkbox of statCheckboxes) {
    //                 if (checkbox != event.target)
    //                     checkbox.checked = false;
    //             }
    //         } else {
    //             statFilter = null;
    //         }

    //         ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    //     });
    //     statCheckboxes.push(checkbox);
    // }

    // document.getElementById('checkboxImageClearStats').addEventListener('change', function(event) {
    //     console.log(event);
    //     if (event.target.checked) {
    //         statFilter = null;
    //         for (var checkbox of statCheckboxes) {
    //             checkbox.checked = false;
    //         }
    //     } else {

    //     }

    //     ItemsGrid.refreshFilters(setFilter, gearFilter, levelFilter, enhanceFilter, statFilter);
    // });
}