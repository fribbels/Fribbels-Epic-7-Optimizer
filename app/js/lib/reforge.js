module.exports = {
    initialize: () => {
        module.exports.buildFilterSetsBar();
        module.exports.buildFilterGearBar();
    },

    getReforgeStats: (gear) => {
        calc(gear);
        ItemAugmenter.augmentReforgeStats([gear]);
    },

    isGaveleets: (gear) => {
        return Utils.stringDistance("Gaveleets", gear.name) > 0.4;
    },

    isReforgeable: (gear) => {
        return gear.level == 85 && gear.enhance == 15 && !module.exports.isGaveleets(gear);
    }
}


function calc(gear) {
    if (gear.level == 85 && gear.enhance == 15 && !Reforge.isGaveleets(gear)) {
        // if (stringSimilarity.compareTwoStrings("Gaveleets", gear.name)) {
        //     Notifier.error("Abyss lifesteal set cannot be reforged: " + JSON.stringify(gear));
        //     return;
        // }

        if (!gear.substats || gear.substats.length != 4) {
            Notifier.error("Cannot calculate reforged stats, +15 item is missing a substat: " + JSON.stringify(gear));
            return;
        }

        gear.main.reforgedValue = mainStatValuesByStatType[gear.main.type]

        for (var i = 0; i < gear.substats.length; i++) {
            const substat = gear.substats[i];
            const value = substat.value;
            if (plainStats.includes(substat.type)) {
                substat.max = Math.floor(value/4)
                substat.min = Math.ceil(value/8)
                substat.multi = 6;
            }
            if (substat.type == "CriticalHitChancePercent") {
                substat.max = Math.floor(value/3)
                substat.min = Math.ceil(value/5)
                substat.multi = 4;
            }
            if (substat.type == "CriticalHitDamagePercent") {
                substat.max = Math.floor(value/4)
                substat.min = Math.ceil(value/7)
                substat.multi = 5.5;
            }
            if (substat.type == "Attack") {
                substat.max = Math.round(value/39)
                substat.min = substat.max;
                substat.multi = 39;
            }
            if (substat.type == "Defense") {
                substat.max = Math.round(value/31)
                substat.min = substat.max;
                substat.multi = 31;
            }
            if (substat.type == "Health") {
                substat.max = Math.round(value/174)
                substat.min = substat.max;
                substat.multi = 174;
            }
            if (substat.type == "Speed") {
                substat.max = Math.round(value/2);
                substat.min = Math.ceil(value/4);
                substat.multi = 3;
            }
        }

        if (gear.rank == "Heroic") {
            gear.substats[3].max = Math.min(2, gear.substats[3].max);
        }
        if (gear.rank == "Rare") {
            gear.substats[2].max = Math.min(2, gear.substats[2].max);
            gear.substats[3].max = Math.min(2, gear.substats[3].max);
        }
        if (gear.rank == "Good") {
            gear.substats[1].max = Math.min(2, gear.substats[1].max);
            gear.substats[2].max = Math.min(2, gear.substats[2].max);
            gear.substats[3].max = Math.min(2, gear.substats[3].max);
        }
        if (gear.rank == "Normal") {
            gear.substats[0].max = Math.min(2, gear.substats[0].max);
            gear.substats[1].max = Math.min(2, gear.substats[1].max);
            gear.substats[2].max = Math.min(2, gear.substats[2].max);
            gear.substats[3].max = Math.min(2, gear.substats[3].max);
        }

        var rolls = 0
        for (var substat of gear.substats) {
            const value = substat.value;

            substat.scaledDiff = 0;
            substat.rolls = substat.min;
            rolls += substat.rolls;
        }

        const maxRolls = maxRollsByRank[gear.rank];

        if (rolls != maxRolls) {
            var missingRolls = maxRolls - rolls;

            for (var i = 0; i < missingRolls; i++) {
                for (var substat of gear.substats) {
                    if (substat.rolls + 1 > substat.max) {
                        substat.minExpectedValue = 0;
                        substat.scaledDiff = 0;
                        continue;
                    };

                    const value = substat.value;
                    substat.minExpectedValue = substat.rolls * substat.multi;
                    substat.scaledDiff = (value - substat.minExpectedValue) / substat.multi;
                }

                const maxSubstat = gear.substats.reduce((prev, curr) => (prev.scaledDiff > curr.scaledDiff) ? prev : curr);
                maxSubstat.rolls += 1;
                maxSubstat.bonus = true;
            }
        }


        for (var substat of gear.substats) {
            const type = substat.type;
            const value = substat.value;

            calculateReforgeValues(substat);
        }



        // console.log(gear.rank);
        // console.log(rolls);
    } else {

    }
}

function calculateReforgeValues(substat) {
    if (plainStats.includes(substat.type)) {
        substat.reforgedValue = substat.value + plainStatRollsToValue[substat.rolls];
    }
    if (substat.type == "CriticalHitChancePercent") {
        substat.reforgedValue = substat.value + substat.rolls;
    }
    if (substat.type == "CriticalHitDamagePercent") {
        substat.reforgedValue = substat.value + critDamageRollsToValue[substat.rolls];
    }
    if (substat.type == "Attack") {
        substat.reforgedValue = substat.value + 11 * substat.rolls;
    }
    if (substat.type == "Defense") {
        substat.reforgedValue = substat.value + 9 * substat.rolls;
    }
    if (substat.type == "Health") {
        substat.reforgedValue = substat.value + 56 * substat.rolls;
    }
    if (substat.type == "Speed") {
        substat.reforgedValue = substat.value + speedRollsToValue[substat.rolls];
    }

}

const plainStats = [
    "AttackPercent",
    "DefensePercent",
    "HealthPercent",
    "EffectivenessPercent",
    "EffectResistancePercent",
]

const mainStatValuesByStatType = {
    "Attack": 525,
    "Health": 2835,
    "Defense": 310,
    "CriticalHitDamagePercent": 70,
    "CriticalHitChancePercent": 60,
    "HealthPercent": 65,
    "DefensePercent": 65,
    "AttackPercent": 65,
    "EffectivenessPercent": 65,
    "EffectResistancePercent": 65,
    "Speed": 45,

}

const plainStatRollsToValue = {
    1: 1,
    2: 3,
    3: 4,
    4: 5,
    5: 7,
    6: 8,
}

const critDamageRollsToValue = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 6,
    6: 7,
}

const speedRollsToValue = {
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 4,
}

const maxRollsByRank = {
    "Epic": 9,
    "Heroic": 8,
    "Rare": 7,
    "Good": 6,
    "Normal": 5,
}