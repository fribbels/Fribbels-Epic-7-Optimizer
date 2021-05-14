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

var modifyGreater = true;
var modifyFilter;
const modifyCheckboxes = [];

const filters = {
    setFilter: null,
    gearFilter: null,
    levelFilter: null,
    enhanceFilter: null,
    statFilter: null,
    substatFilter: null,
    duplicateFilter: null,
    equippedOrNotFilter: null,
    modifyFilter: null,
}

module.exports = {

    getCurrentModifier: () => {
        return {
            grade: modifyGreater ? 'greater' : 'lesser',
            stat: filters.modifyFilter
        }
    },

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
        "mainStatDefensePercentFilter",
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
        "subStatDefensePercentFilter",
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
    ],
    equippedOrNotFilter: [
        "equippedFilter",
        "unequippedFilter",
    ],
    modifyFilter: [
        "modifyAtkFilter",
        "modifyAtkPercentFilter",
        "modifyDefFilter",
        "modifyDefPercentFilter",
        "modifyHpFilter",
        "modifyHpPercentFilter",
        "modifyCrFilter",
        "modifyCdFilter",
        "modifyEffFilter",
        "modifyResFilter",
        "modifySpeedFilter",
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
    setupFilterListener("mainStatDefensePercentFilter", "statFilter", "DefensePercent")
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
    setupFilterListener("subStatDefensePercentFilter", "substatFilter", "DefensePercent")
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

    // Modify
    setupFilterListener("modifyAtkFilter", "modifyFilter", "Attack")
    setupFilterListener("modifyAtkPercentFilter", "modifyFilter", "AttackPercent")
    setupFilterListener("modifyDefFilter", "modifyFilter", "Defense")
    setupFilterListener("modifyDefPercentFilter", "modifyFilter", "DefensePercent")
    setupFilterListener("modifyHpFilter", "modifyFilter", "Health")
    setupFilterListener("modifyHpPercentFilter", "modifyFilter", "HealthPercent")
    setupFilterListener("modifyCrFilter", "modifyFilter", "CriticalHitChancePercent")
    setupFilterListener("modifyCdFilter", "modifyFilter", "CriticalHitDamagePercent")
    setupFilterListener("modifyEffFilter", "modifyFilter", "EffectivenessPercent")
    setupFilterListener("modifyResFilter", "modifyFilter", "EffectResistancePercent")
    setupFilterListener("modifySpeedFilter", "modifyFilter", "Speed")

    setupClearListener("clearModifyFilter", "modifyFilter")

    // Other
    setupFilterListener("duplicateFilter", "duplicateFilter", "duplicate")

    setupFilterListener("equippedFilter", "equippedOrNotFilter", "equipped")
    setupFilterListener("unequippedFilter", "equippedOrNotFilter", "unequipped")

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

    document.getElementById('modifySwitch').addEventListener('click', () => {
        if (modifyGreater) {
            modifyGreater = false;

            $('#modifyAtkIcon').attr("src", "./assets/lesseratk.png");
            $('#modifyAtkPercentIcon').attr("src", "./assets/lesseratkpercent.png");
            $('#modifyDefIcon').attr("src", "./assets/lesserdef.png");
            $('#modifyDefPercentIcon').attr("src", "./assets/lesserdefpercent.png");
            $('#modifyHpIcon').attr("src", "./assets/lesserhp.png");
            $('#modifyHpPercentIcon').attr("src", "./assets/lesserhppercent.png");
            $('#modifyCrIcon').attr("src", "./assets/lessercr.png");
            $('#modifyCdIcon').attr("src", "./assets/lessercd.png");
            $('#modifyEffIcon').attr("src", "./assets/lessereff.png");
            $('#modifyResIcon').attr("src", "./assets/lesserres.png");
            $('#modifySpeedIcon').attr("src", "./assets/lesserspeed.png");
            $('#modifySwitchIcon').attr("src", "./assets/greater.png");
        } else {
            modifyGreater = true;

            $('#modifyAtkIcon').attr("src", "./assets/greateratk.png");
            $('#modifyAtkPercentIcon').attr("src", "./assets/greateratkpercent.png");
            $('#modifyDefIcon').attr("src", "./assets/greaterdef.png");
            $('#modifyDefPercentIcon').attr("src", "./assets/greaterdefpercent.png");
            $('#modifyHpIcon').attr("src", "./assets/greaterhp.png");
            $('#modifyHpPercentIcon').attr("src", "./assets/greaterhppercent.png");
            $('#modifyCrIcon').attr("src", "./assets/greatercr.png");
            $('#modifyCdIcon').attr("src", "./assets/greatercd.png");
            $('#modifyEffIcon').attr("src", "./assets/greatereff.png");
            $('#modifyResIcon').attr("src", "./assets/greaterres.png");
            $('#modifySpeedIcon').attr("src", "./assets/greaterspeed.png");
            $('#modifySwitchIcon').attr("src", "./assets/lesser.png");
        }
    })
}