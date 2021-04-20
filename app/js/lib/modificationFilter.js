const { v4: uuidv4 } = require('uuid');

const statList = [
    "Attack",
    "AttackPercent",
    "Defense",
    "DefensePercent",
    "Health",
    "HealthPercent",
    "Speed",
    "CriticalHitChancePercent",
    "CriticalHitDamagePercent",
    "EffectivenessPercent",
    "EffectResistancePercent"
]

var moddedItems = {}

module.exports = {
    getModsByIds: (gearIds, mods) => {
        console.warn(moddedItems)

        const result = []
        for (var i = 0; i < mods.length; i++) {
            const jsonString = JSON.stringify(moddedItems[gearIds[i]]);
            if (!jsonString) {
                result.push(undefined)
                continue;
            }

            const item = JSON.parse(jsonString);
            if (mods[i] != null) {

                item.alreadyPredictedReforge = true;

                const mod = mods[i];

                for (var j = 0; j <= item.substats.length; j++) {
                    var substat = item.substats[j];
                    if (j == mod.index) {
                        substat.type = mod.type;
                        substat.value = mod.value;
                        substat.reforgedValue = mod.value;
                        substat.originalType = mod.originalType;
                        substat.originalValue = mod.originalValue;
                        substat.modified = true;
                    }
                }
                console.warn("remodded", item);
            }
            result.push(item)
        }
        return result;
    },

    apply: (items, enableMods, hero, submit) => {

        if (enableMods && (!hero.keepStats || hero.keepStats.length == 0)) {
            if (submit) {
                Dialog.error("Substat mods are enabled, but the hero's 'Keep' substat list is empty. Please use 'Add Substat Mods' button on the Heroes tab to adjust your mod preferences");
                throw 'Substat mods must be set before optimizing';
            }
            // for (var item of items) {
            //     item.modId = item.id;
            //     moddedItems[item.id] = item;
            // }
            // return items;
        }

        if (!enableMods || !hero.limitRolls || !hero.rollQuality) {
            for (var item of items) {
                item.modId = item.id;
                moddedItems[item.id] = item;
            }
            return items;
        }

        moddedItems = {}

        var keepList = [
            "Defense",
            "DefensePercent",
            "Health",
            "HealthPercent",
            "Speed",
        ];
        var discardList = [
            "Attack",
            "AttackPercent",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ];

        const limitRolls = hero.limitRolls;
        const rollQuality = hero.rollQuality / 100;
        const grade = hero.modGrade


        const newItems = []

        // console.log("MOD1", items)
        for (item of items) {

                        // originalType: substatCopy.originalType,
                        // originalValue: substatCopy.originalValue,
                        // type: substatCopy.type,
                        // value: substatCopy.value,
            item.modId = item.id;
            moddedItems[item.id] = item;
            newItems.push(item);

            const existingSubstats = item.substats.map(x => x.type);
            var elegibleSubstats = item.substats.filter(x => (x.rolls <= limitRolls && discardList.includes(x.type))
                                                             || x.modified);

            // console.log("E", elegibleSubstats)
            if (item.enhance != 15) {
                continue;
            }

            const tempNewItems = []
            // var substatModified = false;
            // for (var i = 0; i < item.substats.length; i++) {
            //     const substat = item.substats[i];
            //     if (substat.modified && !keepList.includes()) {
            //         substatModified = true;
            //     }
            // }

            // if (substatModified) {
            //     continue;
            // }

            const alreadyModifiedStatTypeArr = item.substats.filter(x => x.modified).map(x => x.type)

            var moddedIndex = -1;
            for (var i = 0; i < item.substats.length; i++) {
                const substat = item.substats[i];

                if (substat.modified) {
                    moddedIndex = i;
                }
            }

            for (var i = 0; i < item.substats.length; i++) {
                const substat = item.substats[i];


                if (moddedIndex > -1 && moddedIndex != i) {
                    continue;
                }


                if (!substat.modified && !discardList.includes(substat.type) && !keepList.includes(substat.type)) {
                    continue;
                }
                if (substat.rolls > limitRolls) {
                    continue;
                }

                for (replacementStat of keepList) {
                    if (replacementStat == item.main.type) {
                        continue;
                    }

                    if (item.gear == "Weapon" && replacementStat.includes("Defense")) {
                        continue;
                    }
                    if (item.gear == "Armor" && replacementStat.includes("Attack")) {
                        continue;
                    }

                    var substatPass = false;

                    if (substat.modified && substat.type == replacementStat) {
                        substatPass = true;
                    }

                    if (!existingSubstats.includes(replacementStat) || substat.type == replacementStat) {
                        // if (substat.modified && existingSubstats.filter(x => !x.modified).includes(replacementStat)) {
                        //     continue;
                        // }
                        substatPass = true;
                         // !substat.modified && !alreadyModifiedStatTypeArr.includes(replacementStat)) {
                        // if (item.id == "300e23d3-c29c-4a63-90b4-44432a7f0ad2") {
                        //     console.log("5", substat.modified, replacementStat, item, substat)
                        // }
                    }

                    // if (!existingSubstats.filter(x => x.modified).map(x => x.type).contains(replacementStat)) {

                    // }

                    if (!substatPass) {
                        continue;
                    }


                    const itemCopy = JSON.parse(JSON.stringify(item));
                    const substatCopy = itemCopy.substats[i];

                    substatCopy.originalType = substatCopy.type;
                    substatCopy.originalValue = substatCopy.value;
                    substatCopy.type = replacementStat;

                    const reforged = Reforge.isReforgeable(item) || item.level == 90 ? 'reforged' : 'unreforged';
                    const rollIndex = substat.rolls ? substat.rolls - 1 : 0;
                    const valueRange = Constants.modValues[reforged][grade][replacementStat][rollIndex];
                    const valueQuality = Math.round(valueRange[0] + (valueRange[1] - valueRange[0]) * rollQuality);

                    if (substat.type == replacementStat && substat.value >= valueQuality) {
                        // if (item.id == "300e23d3-c29c-4a63-90b4-44432a7f0ad2") {
                        //     console.log("8", substat, valueQuality)
                        // }
                        continue;
                    }

                    itemCopy.augmentedStats[substatCopy.originalType] = 0;
                    itemCopy.augmentedStats[replacementStat] = valueQuality

                    itemCopy.reforgedStats[substatCopy.originalType] = 0;
                    itemCopy.reforgedStats[replacementStat] = valueQuality

                    substatCopy.value = valueQuality;
                    substatCopy.reforgedValue = valueQuality;
                    substatCopy.modified = true;

                    itemCopy.modId = uuidv4();
                    itemCopy.mod = {
                        originalType: substatCopy.originalType,
                        originalValue: substatCopy.originalValue,
                        type: substatCopy.type,
                        value: substatCopy.value,
                        index: i
                    }
                    moddedItems[itemCopy.modId] = itemCopy;

                    // tempNewItems.push(itemCopy);
                    newItems.push(itemCopy)
                    // console.log("mod")
                }
            }

            // console.log(item);
            // console.log(tempNewItems);
            // newItems.push.apply(newItems, tempNewItems)
            // console.log("====================");
        }

        console.warn(newItems);

        return newItems;
    }
}