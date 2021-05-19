module.exports = {
    initialize: () => {
    },

    getReforgeStats: (gear) => {
        getItemReforgedStats(gear);
    },

    isGaveleets: (gear) => {
        if (!gear || !gear.name) {
            return false;
        }
        return Utils.stringDistance("Gaveleets", gear.name) > 0.4 && gear.level == 85;
    },

    // Allow only reforging of +15 gear
    isReforgeable: (gear) => {
        return gear.level == 85 && !module.exports.isGaveleets(gear);
    },

    isReforgeableNow: (gear) => {
        return gear.level == 85 && gear.enhance == 15 && !module.exports.isGaveleets(gear);
    },

    augmentMaterial: (gear) => {
        gear.convertable = 0;
        if (!gear || !gear.gear || !gear.set) return;
        const name = gear.name;

        if (!name || name.length < 2) {
            return;
        }

        const huntNameBySet = nameBySetByGear[gear.gear]
        const huntName = huntNameBySet[gear.set]
        const conversionName = conversionNameByGear[gear.gear]

        const huntDistance = Utils.stringDistance(name, huntName)
        const conversionDistance = Utils.stringDistance(name, conversionName)

        if (!module.exports.isReforgeable(gear)) {
            gear.material = null;
        } else if (conversionDistance > huntDistance && conversionDistance > 0.2) {
            gear.material = "Conversion";
            gear.mconfidence = "" + Math.round(100 * Utils.stringDistance(name, conversionName))
            gear.convertable = 1;
        } else if (huntDistance > conversionDistance && huntDistance > 0.2) {
            gear.material = "Hunt";
            gear.mconfidence = "" + Math.round(100 * Utils.stringDistance(name, huntName));
        } else {
            gear.material = "Unknown";
        }
    },

    calculateMaxes: (gear) => {
        const powers = {
            "Normal": 0.8,
            "Good": 0.85,
            "Rare": 0.9,
            "Heroic": 0.95,
            "Epic": 1
        }

        const substats = gear.substats;
        const power = gear.rank;

        for (var i = 0; i < substats.length; i++) {
            const substat = substats[i];

            if (plainStats.includes(substat.type)) {
                substat.min = substat.rolls * 4;
                substat.max = substat.rolls * 8;
            }
            if (substat.type == "CriticalHitChancePercent") {
                substat.min = substat.rolls * 3;
                substat.max = substat.rolls * 5;
            }
            if (substat.type == "CriticalHitDamagePercent") {
                substat.min = substat.rolls * 4;
                substat.max = substat.rolls * 7;
            }
            if (substat.type == "Attack") {
                substat.min = substat.rolls * 14 * 2.37 * power; // 33.18 * power
                substat.max = substat.rolls * 28 * 1.67 * power; // 66.36
            }
            if (substat.type == "Defense") {
                substat.min = substat.rolls * 7 * 4 * power; // 28
                substat.max = substat.rolls * 14 * 2.5 * power; // 56
            }
            if (substat.type == "Health") {
                substat.min = substat.rolls * 45 * 3.5 * power; // 157.5
                substat.max = substat.rolls * 90 * 2.25 * power; // 315
            }
            if (substat.type == "Speed") {
                substat.min = substat.rolls * 1; // 157.5
                substat.max = substat.rolls * 4; // 315
            }

            const reforgedMin = calculateReforgeValuesTypeValueAndRolls(substat.type, substat.min, substat.rolls);
            const reforgedMax = calculateReforgeValuesTypeValueAndRolls(substat.type, substat.max, substat.rolls);
            const reforgedValue = calculateReforgeValuesTypeValueAndRolls(substat.type, substat.value, substat.rolls);

            substat.reforgedMin = reforgedMin;
            substat.reforgedMax = reforgedMax;

            const potential = (reforgedValue - reforgedMin) / (reforgedMax - reforgedMin)
            substat.potential = potential;
        }

        console.warn(substats);
    }
}
                // substat.multi = 39;
                // substat.multi = 31;
                // substat.multi = 174;

const conversionNameByGear = {
    Weapon: "Corinoa",
    Helmet: "Elsquare",
    Armor: "Corimescent",
    Necklace: "Corselium",
    Ring: "Seekers Ring",
    Boots: "Practical Boots"
}

const nameBySetByGear = {
    Weapon: {
        HealthSet: "Dark Steel Saber",
        DefenseSet: "Dark Steel Saber",
        AttackSet: "Dark Steel Saber",
        SpeedSet: "Abyss Drake Bonesword",
        CriticalSet: "Abyss Drake Bonesword",
        HitSet: "Abyss Drake Bonesword",
        DestructionSet: "Hellish Essence Orb",
        LifestealSet: "Hellish Essence Orb",
        CounterSet: "Hellish Essence Orb",
        ResistSet: "Hellish Essence Orb",
        UnitySet: "Indomitable Spider Mace",
        RageSet: "Indomitable Spider Mace",
        ImmunitySet: "Indomitable Spider Mace",
        RevengeSet: "Demons Cursed Double Edged Sword",
        InjurySet: "Demons Cursed Double Edged Sword",
        PenetrationSet: "Demons Cursed Double Edged Sword",
    },
    Helmet: {
        HealthSet: "Dark Steel Helm",
        DefenseSet: "Dark Steel Helm",
        AttackSet: "Dark Steel Helm",
        SpeedSet: "Abyss Drake Mask",
        CriticalSet: "Abyss Drake Mask",
        HitSet: "Abyss Drake Mask",
        DestructionSet: "Hellish Essence Crown",
        LifestealSet: "Hellish Essence Crown",
        CounterSet: "Hellish Essence Crown",
        ResistSet: "Hellish Essence Crown",
        UnitySet: "Indomitable Spider Helm",
        RageSet: "Indomitable Spider Helm",
        ImmunitySet: "Indomitable Spider Helm",
        RevengeSet: "Demon's Cursed Horned Helm",
        InjurySet: "Demon's Cursed Horned Helm",
        PenetrationSet: "Demon's Cursed Horned Helm",
    },
    Armor: {
        HealthSet: "Dark Steel Armor",
        DefenseSet: "Dark Steel Armor",
        AttackSet: "Dark Steel Armor",
        SpeedSet: "Abyss Drake Hide Tunic",
        CriticalSet: "Abyss Drake Hide Tunic",
        HitSet: "Abyss Drake Hide Tunic",
        DestructionSet: "Hellish Essence Robe",
        LifestealSet: "Hellish Essence Robe",
        CounterSet: "Hellish Essence Robe",
        ResistSet: "Hellish Essence Robe",
        UnitySet: "Indomitable Spider Breastplate",
        RageSet: "Indomitable Spider Breastplate",
        ImmunitySet: "Indomitable Spider Breastplate",
        RevengeSet: "Demons Cursed Heavy Armor",
        InjurySet: "Demons Cursed Heavy Armor",
        PenetrationSet: "Demons Cursed Heavy Armor",
    },
    Necklace: {
        HealthSet: "Dark Steel Warmer",
        DefenseSet: "Dark Steel Warmer",
        AttackSet: "Dark Steel Warmer",
        SpeedSet: "Abyss Blade Necklace",
        CriticalSet: "Abyss Blade Necklace",
        HitSet: "Abyss Blade Necklace",
        DestructionSet: "Obsidian Amulet",
        LifestealSet: "Obsidian Amulet",
        CounterSet: "Obsidian Amulet",
        ResistSet: "Obsidian Amulet",
        UnitySet: "Indomitable Spider Pendant",
        RageSet: "Indomitable Spider Pendant",
        ImmunitySet: "Indomitable Spider Pendant",
        RevengeSet: "Demons Cursed Necklace",
        InjurySet: "Demons Cursed Necklace",
        PenetrationSet: "Demons Cursed Necklace",
    },
    Ring: {
        HealthSet: "Dark Steel Gauntlet",
        DefenseSet: "Dark Steel Gauntlet",
        AttackSet: "Dark Steel Gauntlet",
        SpeedSet: "Awakened Dragon Gem",
        CriticalSet: "Awakened Dragon Gem",
        HitSet: "Awakened Dragon Gem",
        DestructionSet: "Obsidian Ring",
        LifestealSet: "Obsidian Ring",
        CounterSet: "Obsidian Ring",
        ResistSet: "Obsidian Ring",
        UnitySet: "Indomitable Spider Ring",
        RageSet: "Indomitable Spider Ring",
        ImmunitySet: "Indomitable Spider Ring",
        RevengeSet: "Demons Cursed Ring",
        InjurySet: "Demons Cursed Ring",
        PenetrationSet: "Demons Cursed Ring",
    },
    Boots: {
        HealthSet: "Dark Steel Boots",
        DefenseSet: "Dark Steel Boots",
        AttackSet: "Dark Steel Boots",
        SpeedSet: "Abyss Drake Boots",
        CriticalSet: "Abyss Drake Boots",
        HitSet: "Abyss Drake Boots",
        DestructionSet: "Hellish Essence Treads",
        LifestealSet: "Hellish Essence Treads",
        CounterSet: "Hellish Essence Treads",
        ResistSet: "Hellish Essence Treads",
        UnitySet: "Indomitable Spider Boots",
        RageSet: "Indomitable Spider Boots",
        ImmunitySet: "Indomitable Spider Boots",
        RevengeSet: "Demons Cursed Fine Boots",
        InjurySet: "Demons Cursed Fine Boots",
        PenetrationSet: "Demons Cursed Fine Boots",
    }
}

// We can get reforged stats of non +15 gear however
function getItemReforgedStats(gear) {

    if (module.exports.isReforgeable(gear)) {
        if (gear.alreadyPredictedReforge) {
            return;
        }

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
            if (substat.rolls == undefined || substat.rolls == null) {
                substat.rolls = substat.min;
            }
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

function calculateReforgeValuesTypeValueAndRolls(type, value, rolls) {
    if (plainStats.includes(type)) {
        return value + plainStatRollsToValue[rolls];
    }
    if (type == "CriticalHitChancePercent") {
        return value + rolls;
    }
    if (type == "CriticalHitDamagePercent") {
        return value + critDamageRollsToValue[rolls];
    }
    if (type == "Attack") {
        return value + 11 * rolls;
    }
    if (type == "Defense") {
        return value + 9 * rolls;
    }
    if (type == "Health") {
        return value + 56 * rolls;
    }
    if (type == "Speed") {
        return value + speedRollsToValue[rolls];
    }
    return 0;
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