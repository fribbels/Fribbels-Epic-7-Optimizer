module.exports = {
    initialize: () => {
    },

    getReforgeStats: (gear) => {
        getItemReforgedStats(gear);
        ItemAugmenter.augment([gear]);
    },

    isGaveleets: (gear) => {
        if (!gear || !gear.name) {
            return false;
        }
        return Utils.stringDistance("Gaveleets", gear.name) > 0.4;
    },

    // Allow only reforging of +15 gear
    isReforgeable: (gear) => {
        return gear.level == 85 && !module.exports.isGaveleets(gear);
    },

    isReforgeableNow: (gear) => {
        return gear.level == 85 && gear.enhance == 15 && !module.exports.isGaveleets(gear);
    }
}

// We can get reforged stats of non +15 gear however
function getItemReforgedStats(gear) {
    if (gear.level == 85 && !Reforge.isGaveleets(gear)) {
        if (!gear.substats) {
            Notifier.error("Cannot calculate reforged stats. Find the item and fix it: " + JSON.stringify(gear));
            return;
        }

        gear.main.reforgedValue = mainStatValuesByStatType[gear.main.type]
        const length = gear.substats.length;

        for (var i = 0; i < length; i++) {
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

        if (gear.enhance == 15) {
            if (gear.rank == "Heroic") {
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            } else if (gear.rank == "Rare") {
                gear.substats[2].max = Math.min(2, gear.substats[2].max);
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            } else if (gear.rank == "Good") {
                gear.substats[1].max = Math.min(2, gear.substats[1].max);
                gear.substats[2].max = Math.min(2, gear.substats[2].max);
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            } else if (gear.rank == "Normal") {
                gear.substats[0].max = Math.min(2, gear.substats[0].max);
                gear.substats[1].max = Math.min(2, gear.substats[1].max);
                gear.substats[2].max = Math.min(2, gear.substats[2].max);
                gear.substats[3].max = Math.min(2, gear.substats[3].max);
            }
        } else if (gear.enhance >= 12) {
            if (gear.rank == "Heroic") {
                gear.substats[3].max = Math.min(1, gear.substats[3].max);
            } else if (gear.rank == "Rare") {
                gear.substats[2].max = Math.min(1, gear.substats[2].max);
                gear.substats[3].max = Math.min(1, gear.substats[3].max);
            } else if (gear.rank == "Good") {
                gear.substats[1].max = Math.min(1, gear.substats[1].max);
                gear.substats[2].max = Math.min(1, gear.substats[2].max);
                gear.substats[3].max = Math.min(1, gear.substats[3].max);
            } else if (gear.rank == "Normal") {
                gear.substats[0].max = Math.min(1, gear.substats[0].max);
                gear.substats[1].max = Math.min(1, gear.substats[1].max);
                gear.substats[2].max = Math.min(1, gear.substats[2].max);
                gear.substats[3].max = Math.min(1, gear.substats[3].max);
            }
        } else if (gear.enhance >= 9) {
            if (gear.rank == "Heroic") {

            } else if (gear.rank == "Rare") {
                gear.substats[2].max = Math.min(1, gear.substats[2].max);
            } else if (gear.rank == "Good") {
                gear.substats[1].max = Math.min(1, gear.substats[1].max);
                gear.substats[2].max = Math.min(1, gear.substats[2].max);
            } else if (gear.rank == "Normal") {
                gear.substats[0].max = Math.min(1, gear.substats[0].max);
                gear.substats[1].max = Math.min(1, gear.substats[1].max);
                gear.substats[2].max = Math.min(1, gear.substats[2].max);
            }
        } else if (gear.enhance >= 6) {
            if (gear.rank == "Heroic") {

            } else if (gear.rank == "Rare") {

            } else if (gear.rank == "Good") {
                gear.substats[1].max = Math.min(1, gear.substats[1].max);
            } else if (gear.rank == "Normal") {
                gear.substats[0].max = Math.min(1, gear.substats[0].max);
                gear.substats[1].max = Math.min(1, gear.substats[1].max);
            }
        } else if (gear.enhance >= 3) {
            if (gear.rank == "Heroic") {

            } else if (gear.rank == "Rare") {

            } else if (gear.rank == "Good") {

            } else if (gear.rank == "Normal") {
                gear.substats[0].max = Math.min(1, gear.substats[0].max);
            }
        }

        var rolls = 0
        for (var substat of gear.substats) {
            const value = substat.value;

            substat.scaledDiff = 0;
            substat.rolls = substat.min;
            rolls += substat.rolls;
        }

        const maxRolls = getMaxRolls(gear.rank, gear.enhance);

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

const maxRolls15 = {
    "Epic": 9,
    "Heroic": 8,
    "Rare": 7,
    "Good": 6,
    "Normal": 5,
}

const maxRolls12 = {
    "Epic": 9,
    "Heroic": 8,
    "Rare": 7,
    "Good": 6,
    "Normal": 5,
}

function getMaxRolls(rank, enhance) {
    if (enhance == 15) {
        return maxRolls15[rank];
    } else if (enhance >= 12) {
        return maxRolls15[rank] - 1;
    } else if (enhance >= 9) {
        return maxRolls15[rank] - 2;
    } else if (enhance >= 6) {
        return maxRolls15[rank] - 3;
    } else if (enhance >= 3) {
        return maxRolls15[rank] - 4;
    }
    return maxRolls15[rank] - 5;
}