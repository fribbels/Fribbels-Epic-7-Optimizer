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

        return Utils.stringDistance("Gaveleet's", gear.name) > 0.45 && gear.level == 85;
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

        const huntNameBySet = gear.level == 90 ? reforgedNameBySetByGear[gear.gear] : nameBySetByGear[gear.gear]

        const huntName = huntNameBySet[gear.set]
        const conversionName = conversionNameByGear[gear.gear]

        const huntDistance = Utils.stringDistance(name, huntName)
        const conversionDistance = Utils.stringDistance(name, conversionName)

        // if (!module.exports.isReforgeable(gear)) {
        //     gear.material = null;
        // } else
        if (conversionDistance > huntDistance && conversionDistance > 0.85) {
            gear.material = "Conversion";
            gear.mconfidence = "" + Math.round(100 * Utils.stringDistance(name, conversionName))
            gear.convertable = 1;
        } else if (huntDistance > conversionDistance && huntDistance > 0.85) {
            gear.material = "Hunt";
            gear.mconfidence = "" + Math.round(100 * Utils.stringDistance(name, huntName));
        } else {
            gear.material = "Unknown";
        }
    },

    unreforgeItem: (gear) => {
        const substats = gear.substats;

        if (gear.level == 90) {
            for (var i = 0; i < substats.length; i++) {
                const substat = substats[i];
                const statTypeChanged = plainStats.includes(substat.type) ? "Plain" : substat.type;

                if (statTypeChanged == "Plain") {
                    const added = plainStatRollsToValue[substat.rolls];
                    substat.unreforgedValue = substat.value - added;
                }
                if (substat.type == "CriticalHitChancePercent") {
                    const added = substat.rolls;
                    substat.unreforgedValue = substat.value - added;
                }
                if (substat.type == "CriticalHitDamagePercent") {
                    const added = critDamageRollsToValue[substat.rolls];
                    substat.unreforgedValue = substat.value - added;
                }
                if (substat.type == "Attack") {
                    const added = 11 * substat.rolls;
                    substat.unreforgedValue = substat.value - added;
                }
                if (substat.type == "Defense") {
                    const added = 9 * substat.rolls;
                    substat.unreforgedValue = substat.value - added;
                }
                if (substat.type == "Health") {
                    const added = 56 * substat.rolls;
                    substat.unreforgedValue = substat.value - added;
                }
                if (substat.type == "Speed") {
                    const added = speedRollsToValue[substat.rolls];
                    substat.unreforgedValue = substat.value - added;
                }
            }
        }

        const power = powers[gear.rank];
        const flats = flatsByLevel[gear.level == 88 ? 88 : 85]
        const statRanges = plainStatsByLevel[gear.level == 88 ? 88 : 85]

        // const power = powers[gear.rank];
        // const flats = flatsByLevel[gear.level == 88 ? 88 : 85]
        // const statRanges = plainStatsByLevel[gear.level == 88 ? 88 : 85]

        for (var i = 0; i < substats.length; i++) {
            const substat = substats[i];
            const statTypeChanged = plainStats.includes(substat.type) ? "Plain" : substat.type;

            if (gear.level != 90) {
                substat.unreforgedValue = substat.value;
            }

            if (statTypeChanged == "Plain") {
                substat.unreforgedMin = substat.rolls * statRanges["Plain"].min;
                substat.unreforgedMax = substat.rolls * statRanges["Plain"].max;
            }
            if (substat.type == "CriticalHitChancePercent") {
                substat.unreforgedMin = substat.rolls * statRanges["CriticalHitChancePercent"].min;
                substat.unreforgedMax = substat.rolls * statRanges["CriticalHitChancePercent"].max;
            }
            if (substat.type == "CriticalHitDamagePercent") {
                substat.unreforgedMin = substat.rolls * statRanges["CriticalHitDamagePercent"].min;
                substat.unreforgedMax = substat.rolls * statRanges["CriticalHitDamagePercent"].max;
            }
            if (substat.type == "Attack") {
                substat.unreforgedMin = substat.rolls * flats.Attack.min * modifiers.Attack.min * power;
                substat.unreforgedMax = substat.rolls * flats.Attack.max * modifiers.Attack.max * power;
            }
            if (substat.type == "Defense") {
                substat.unreforgedMin = substat.rolls * flats.Defense.min * modifiers.Defense.min * power;
                substat.unreforgedMax = substat.rolls * flats.Defense.max * modifiers.Defense.max * power;
            }
            if (substat.type == "Health") {
                substat.unreforgedMin = substat.rolls * flats.Health.min * modifiers.Health.min * power;
                substat.unreforgedMax = substat.rolls * flats.Health.max * modifiers.Health.max * power;
            }
            if (substat.type == "Speed") {
                substat.unreforgedMin = substat.rolls * statRanges["Speed"].min;
                substat.unreforgedMax = substat.rolls * statRanges["Speed"].max;
            }
        }

        var maxPossibleUnreforgedScore = 0;
        var minPossibleUnreforgedScore = 0;
        var actualUnreforgedScore = 0;

        for (var i = 0; i < substats.length; i++) {
            const substat = substats[i];

            const statTypeChanged = plainStats.includes(substat.type) ? "Plain" : substat.type;
            const plainStatRanges = gear.level == 88 ? plainStatsByLevel["88"] : plainStatsByLevel["85"];

            var minMultiplier;
            var maxMultiplier;
            if (flatStats.includes(substat.type)) {
                const flatMultiplier = flatMultipliersByLevel[gear.level == 88 ? "88" : "85"];
                minMultiplier = flatMultiplier[substat.type].min;
                maxMultiplier = flatMultiplier[substat.type].max;
            } else {
                minMultiplier = plainStatRanges[statTypeChanged].min;
                maxMultiplier = plainStatRanges[statTypeChanged].max;
            }

            minPossibleUnreforgedScore += substat.rolls * minMultiplier * substatWeights[substat.type];
            maxPossibleUnreforgedScore += substat.rolls * maxMultiplier * substatWeights[substat.type];

            actualUnreforgedScore += substat.unreforgedValue * substatWeights[substat.type];
        }

        console.warn(JSON.stringify(gear.substats, null, 2));

        console.warn("range: " + minPossibleUnreforgedScore + " - " + maxPossibleUnreforgedScore);
        console.warn("actual", actualUnreforgedScore);
        console.warn("percent", (actualUnreforgedScore - minPossibleUnreforgedScore) / (maxPossibleUnreforgedScore - minPossibleUnreforgedScore) * 100);
    },

    calculateMaxes: (gear) => {
        console.log("calculateMaxes1", JSON.parse(JSON.stringify(gear)))
        getItemReforgedStats(gear)
        console.log("calculateMaxes2", JSON.parse(JSON.stringify(gear)))

/*
            min   max   t1   t2   t3   t4   t5  t6  t7
max_hp      3.5   2.25  0.6  0.7  0.8  0.9  1   1   1
att         2.37  1.67  0.6  0.7  0.8  0.9  1   1   1
def         4     2.5   0.6  0.7  0.8  0.9  1   1   1

grade  power
1      0.8
2      0.85
3      0.9
4      0.95
5      1.0
6      9.99

// 88 FLAT
// HP 51 - 102
// ATT 16 - 32
// DEF 8 - 16

// 85 FLAT
// HP 45 - 90
// DEF 7 - 14
// ATT 14 - 28

Reforge
hp + 56
def + 9
atk + 11

min atk = 2.37 * 14 * 1 = 33.18
min hp = 3.5 * 45 * 1 = 157.5
min def = 4 * 7 * 1 = 28

max atk = 1.67 * 28 * 1 = 46.76
max hp = 2.25 * 90 * 1 = 202.5
max def = 2.5 * 14 * 1 = 35

11/9/56
346.56
1551
264

prereforge 85
atk range: 33 - 46
def range: 28 - 35
hp range: 157 - 202

postreforge 90
atk range: 44 - 57
def range: 37 - 44
hp range: 213 - 258

90s

min atk = 2.37 * 16 * 1 = 37.92
min hp = 3.5 * 51 * 1 = 178.5
min def = 4 * 8 * 1 = 32

max atk = 1.67 * 32 * 1 = 53.44
max hp = 2.25 * 102 * 1 = 229.5
max def = 2.5 * 16 * 1 = 40

90s
atk range: 37 - 53 (45)
def range: 32 - 40 (36)
hp range: 178 - 229 (203.5)

*/

        const substats = gear.substats;
        var tMax = 0;
        var tMin = 0;
        var tValue = 0;
        var tPot = 0;
        var tRolls = 0;

        const power = powers[gear.rank];
        const flats = flatsByLevel[gear.level == 88 ? 88 : 85]
        const statRanges = plainStatsByLevel[gear.level == 88 ? 88 : 85]

        for (var i = 0; i < substats.length; i++) {
            const substat = substats[i];
            const statTypeChanged = plainStats.includes(substat.type) ? "Plain" : substat.type;

            if (statTypeChanged == "Plain") {
                substat.min = substat.rolls * statRanges["Plain"].min;
                substat.max = substat.rolls * statRanges["Plain"].max;
            }
            if (substat.type == "CriticalHitChancePercent") {
                substat.min = substat.rolls * statRanges["CriticalHitChancePercent"].min;
                substat.max = substat.rolls * statRanges["CriticalHitChancePercent"].max;
            }
            if (substat.type == "CriticalHitDamagePercent") {
                substat.min = substat.rolls * statRanges["CriticalHitDamagePercent"].min;
                substat.max = substat.rolls * statRanges["CriticalHitDamagePercent"].max;
            }
            if (substat.type == "Attack") {
                substat.min = substat.rolls * flats.Attack.min * modifiers.Attack.min * power;
                substat.max = substat.rolls * flats.Attack.max * modifiers.Attack.max * power;
            }
            if (substat.type == "Defense") {
                substat.min = substat.rolls * flats.Defense.min * modifiers.Defense.min * power;
                substat.max = substat.rolls * flats.Defense.max * modifiers.Defense.max * power;
            }
            if (substat.type == "Health") {
                substat.min = substat.rolls * flats.Health.min * modifiers.Health.min * power;
                substat.max = substat.rolls * flats.Health.max * modifiers.Health.max * power;
            }
            if (substat.type == "Speed") {
                substat.min = substat.rolls * statRanges["Speed"].min;
                substat.max = substat.rolls * statRanges["Speed"].max;

                if (substat.min == 1 && (gear.rank == "Epic")) {
                    substat.min = 2;
                }
            }

            const gaveleets = module.exports.isGaveleets(gear);
            const reforgedMin = calculateReforgeValuesTypeValueAndRolls(gaveleets, substat.type, substat.min, substat.rolls, gear.level);
            const reforgedMax = calculateReforgeValuesTypeValueAndRolls(gaveleets, substat.type, substat.max, substat.rolls, gear.level);
            const reforgedValue = calculateReforgeValuesTypeValueAndRolls(gaveleets, substat.type, substat.value, substat.rolls, gear.level);

            substat.reforgedMin = reforgedMin;
            substat.reforgedMax = reforgedMax;
            substat.reforgedValue = reforgedValue;

            const potential = (reforgedValue - reforgedMin) / (reforgedMax - reforgedMin)
            substat.potential = potential;

            tMax += reforgedMax;
            tMin += reforgedMin;
            tValue += reforgedValue;
            tPot += potential * substat.rolls;
            tRolls += substat.rolls;
        }
        const maxRolls15 = {
            "Epic": 9,
            "Heroic": 8,
            "Rare": 7,
            "Good": 6,
            "Normal": 5,
        }

        const lostRolls = Math.ceil((15 - gear.enhance)/3);

        console.warn(substats);
        console.warn("tmax", tMax);
        console.warn("tmin", tMin);
        console.warn("tvalue", tValue);
        console.warn("tpot", tPot);
        console.warn("possible pot", tPot / tRolls) // possible pot
        console.warn("max pot", tPot / 9)      // max pot
        // console.warn(tPot / maxRolls15[gear.rank])
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
        ProtectionSet: "Dark Steel Saber",
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
        TorrentSet: "Demons Cursed Double Edged Sword",
    },
    Helmet: {
        HealthSet: "Dark Steel Helm",
        DefenseSet: "Dark Steel Helm",
        AttackSet: "Dark Steel Helm",
        ProtectionSet: "Dark Steel Helm",
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
        TorrentSet: "Demon's Cursed Horned Helm",
    },
    Armor: {
        HealthSet: "Dark Steel Armor",
        DefenseSet: "Dark Steel Armor",
        AttackSet: "Dark Steel Armor",
        ProtectionSet: "Dark Steel Armor",
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
        TorrentSet: "Demons Cursed Heavy Armor",
    },
    Necklace: {
        HealthSet: "Dark Steel Warmer",
        DefenseSet: "Dark Steel Warmer",
        AttackSet: "Dark Steel Warmer",
        ProtectionSet: "Dark Steel Warmer",
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
        TorrentSet: "Demons Cursed Necklace",
    },
    Ring: {
        HealthSet: "Dark Steel Gauntlet",
        DefenseSet: "Dark Steel Gauntlet",
        AttackSet: "Dark Steel Gauntlet",
        ProtectionSet: "Dark Steel Gauntlet",
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
        TorrentSet: "Demons Cursed Ring",
    },
    Boots: {
        HealthSet: "Dark Steel Boots",
        DefenseSet: "Dark Steel Boots",
        AttackSet: "Dark Steel Boots",
        ProtectionSet: "Dark Steel Boots",
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
        TorrentSet: "Demons Cursed Fine Boots",
    }
}


const reforgedNameBySetByGear = {
    Weapon: {
        HealthSet: "Dark Saber",
        DefenseSet: "Dark Saber",
        AttackSet: "Dark Saber",
        ProtectionSet: "Dark Saber",
        SpeedSet: "Ancient Drake Bonesword",
        CriticalSet: "Ancient Drake Bonesword",
        HitSet: "Ancient Drake Bonesword",
        DestructionSet: "Twilight Essence Orb",
        LifestealSet: "Twilight Essence Orb",
        CounterSet: "Twilight Essence Orb",
        ResistSet: "Twilight Essence Orb",
        UnitySet: "Origin Spider Queen's Mace",
        RageSet: "Origin Spider Queen's Mace",
        ImmunitySet: "Origin Spider Queen's Mace",
        RevengeSet: "Dark Soul's Double-Edged Sword",
        InjurySet: "Dark Soul's Double-Edged Sword",
        PenetrationSet: "Dark Soul's Double-Edged Sword",
        TorrentSet: "Dark Soul's Double-Edged Sword",
    },
    Helmet: {
        HealthSet: "Dark Helm",
        DefenseSet: "Dark Helm",
        AttackSet: "Dark Helm",
        ProtectionSet: "Dark Helm",
        SpeedSet: "Ancient Drake Mask",
        CriticalSet: "Ancient Drake Mask",
        HitSet: "Ancient Drake Mask",
        DestructionSet: "Twilight Essence Crown",
        LifestealSet: "Twilight Essence Crown",
        CounterSet: "Twilight Essence Crown",
        ResistSet: "Twilight Essence Crown",
        UnitySet: "Queen Origin Spider's Helm",
        RageSet: "Queen Origin Spider's Helm",
        ImmunitySet: "Queen Origin Spider's Helm",
        RevengeSet: "Dark Soul's Horned Helm",
        InjurySet: "Dark Soul's Horned Helm",
        PenetrationSet: "Dark Soul's Horned Helm",
        TorrentSet: "Dark Soul's Horned Helm",
    },
    Armor: {
        HealthSet: "Dark Armor",
        DefenseSet: "Dark Armor",
        AttackSet: "Dark Armor",
        ProtectionSet: "Dark Armor",
        SpeedSet: "Ancient Drake Leather Tunic",
        CriticalSet: "Ancient Drake Leather Tunic",
        HitSet: "Ancient Drake Leather Tunic",
        DestructionSet: "Twilight Essence Robe",
        LifestealSet: "Twilight Essence Robe",
        CounterSet: "Twilight Essence Robe",
        ResistSet: "Twilight Essence Robe",
        UnitySet: "Origin Spider Queen's Breastplate",
        RageSet: "Origin Spider Queen's Breastplate",
        ImmunitySet: "Origin Spider Queen's Breastplate",
        RevengeSet: "Dark Soul's Heavy Armor",
        InjurySet: "Dark Soul's Heavy Armor",
        PenetrationSet: "Dark Soul's Heavy Armor",
        TorrentSet: "Dark Soul's Heavy Armor",
    },
    Necklace: {
        HealthSet: "Dark Warmer",
        DefenseSet: "Dark Warmer",
        AttackSet: "Dark Warmer",
        ProtectionSet: "Dark Warmer",
        SpeedSet: "Dark Abyss Necklace",
        CriticalSet: "Dark Abyss Necklace",
        HitSet: "Dark Abyss Necklace",
        DestructionSet: "Bloodstone Amulet",
        LifestealSet: "Bloodstone Amulet",
        CounterSet: "Bloodstone Amulet",
        ResistSet: "Bloodstone Amulet",
        UnitySet: "Origin Spider Queen's Pendant",
        RageSet: "Origin Spider Queen's Pendant",
        ImmunitySet: "Origin Spider Queen's Pendant",
        RevengeSet: "Dark Soul's Necklace",
        InjurySet: "Dark Soul's Necklace",
        PenetrationSet: "Dark Soul's Necklace",
        TorrentSet: "Dark Soul's Necklace",
    },
    Ring: {
        HealthSet: "Dark Gauntlet",
        DefenseSet: "Dark Gauntlet",
        AttackSet: "Dark Gauntlet",
        ProtectionSet: "Dark Gauntlet",
        SpeedSet: "Dark Red Dragon Gem",
        CriticalSet: "Dark Red Dragon Gem",
        HitSet: "Dark Red Dragon Gem",
        DestructionSet: "Bloodstone Ring",
        LifestealSet: "Bloodstone Ring",
        CounterSet: "Bloodstone Ring",
        ResistSet: "Bloodstone Ring",
        UnitySet: "Origin Spider Queen's Ring",
        RageSet: "Origin Spider Queen's Ring",
        ImmunitySet: "Origin Spider Queen's Ring",
        RevengeSet: "Dark Soul's Ring",
        InjurySet: "Dark Soul's Necklace",
        PenetrationSet: "Dark Soul's Necklace",
        TorrentSet: "Dark Soul's Necklace",
    },
    Boots: {
        HealthSet: "Dark Boots",
        DefenseSet: "Dark Boots",
        AttackSet: "Dark Boots",
        ProtectionSet: "Dark Boots",
        SpeedSet: "Ancient Drake Boots",
        CriticalSet: "Ancient Drake Boots",
        HitSet: "Ancient Drake Boots",
        DestructionSet: "Twilight Essence Treads",
        LifestealSet: "Twilight Essence Treads",
        CounterSet: "Twilight Essence Treads",
        ResistSet: "Twilight Essence Treads",
        UnitySet: "Origin Spider Queen's Boots",
        RageSet: "Origin Spider Queen's Boots",
        ImmunitySet: "Origin Spider Queen's Boots",
        RevengeSet: "Dark Soul's Fine Boots",
        InjurySet: "Dark Soul's Fine Boots",
        PenetrationSet: "Dark Soul's Fine Boots",
        TorrentSet: "Dark Soul's Fine Boots",
    }
}

// We can get reforged stats of non +15 gear however
function getItemReforgedStats(gear) {
    var mainValue = gear.main.value;
    if (module.exports.isReforgeable(gear)) {
        mainValue = mainStatValuesByStatType[gear.main.type];
    }

    if (gear.alreadyPredictedReforge) {
        return;
    }

    if (!gear.substats) {
        Notifier.error(i18next.t("Cannot calculate reforged stats. Find the item and fix it: ") + JSON.stringify(gear));
        return;
    }

    gear.main.reforgedValue = mainValue
    const length = gear.substats.length;

    for (var i = 0; i < length; i++) {
        const substat = gear.substats[i];
        const value = substat.value;
        if (plainStats.includes(substat.type)) {
            substat.max = Math.floor(value/(gear.level == 88 ? 5 : 4))
            substat.min = Math.ceil(value/(gear.level == 88 ? 9 : 8))
            substat.multi = (gear.level == 88 ? 7 : 6);
        }
        if (substat.type == "CriticalHitChancePercent") {
            substat.max = Math.floor(value/(gear.level == 88 ? 3 : 3))
            substat.min = Math.ceil(value/(gear.level == 88 ? 6 : 5))
            substat.multi = (gear.level == 88 ? 4.5 : 4);
        }
        if (substat.type == "CriticalHitDamagePercent") {
            substat.max = Math.floor(value/(gear.level == 88 ? 4 : 4))
            substat.min = Math.ceil(value/(gear.level == 88 ? 8 : 7))
            substat.multi = (gear.level == 88 ? 6 : 5.5);
        }
        if (substat.type == "Attack") {
            substat.max = Math.round(value/(gear.level == 88 ? 45 : 39))
            substat.min = substat.max;
            substat.multi = (gear.level == 88 ? 45 : 39);
        }
        if (substat.type == "Defense") {
            substat.max = Math.round(value/(gear.level == 88 ? 36 : 31))
            substat.min = substat.max;
            substat.multi = (gear.level == 88 ? 36 : 31);
        }
        if (substat.type == "Health") {
            substat.max = Math.round(value/(gear.level == 88 ? 203 : 174))
            substat.min = substat.max;
            substat.multi = (gear.level == 88 ? 203 : 174);
        }
        if (substat.type == "Speed") {
            substat.max = Math.round(value/(gear.level == 88 ? 2 : 2));
            substat.min = Math.ceil(value/(gear.level == 88 ? 5 : 4));
            substat.multi = (gear.level == 88 ? 3.5 : 3);
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

    if (module.exports.isReforgeable(gear)) {
        for (var substat of gear.substats) {
            const type = substat.type;
            const value = substat.value;

            calculateReforgeValues(substat);
        }
    } else {
        for (var substat of gear.substats) {
            substat.reforgedValue = substat.value
        }
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

function calculateReforgeValuesTypeValueAndRolls(gaveleets, type, value, rolls, level) {
    if (level != 85 && level != 90) {
        return value;
    }

    if (gaveleets) {
        return value;
    }

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

const substatWeights = {
    "AttackPercent": 1,
    "DefensePercent": 1,
    "HealthPercent": 1,
    "EffectivenessPercent": 1,
    "EffectResistancePercent": 1,
    "Attack": (3.46 / 39),
    "Health": (3.09 / 174),
    "Defense": (4.99 / 31),
    "CriticalHitDamagePercent": (8/7),
    "CriticalHitChancePercent": (8/5),
    "Speed": (8/4),
}

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

const powers = {
    Normal: 0.8,
    Good: 0.85,
    Rare: 0.9,
    "Heroic": 0.95,
    "Epic": 1
}

const modifiers = {
    Health: {
        min: 3.5,
        max: 2.25
    },
    Attack: {
        min: 2.37,
        max: 1.67
    },
    Defense: {
        min: 4,
        max: 2.5
    },
}

const flatsByLevel = {
    "88": {
        Health: {
            min: 51,
            max: 102
        },
        Attack: {
            min: 16,
            max: 32
        },
        Defense: {
            min: 8,
            max: 16
        },
    },
    "85": {
        Health: {
            min: 45,
            max: 90
        },
        Attack: {
            min: 14,
            max: 28
        },
        Defense: {
            min: 7,
            max: 14
        },
    }
}

const flatStats = [
    "Attack",
    "Defense",
    "Health"
]

const flatMultipliersByLevel = {
    "88": {
        Attack: {
            min: flatsByLevel["88"].Attack.min * modifiers.Attack.min,
            max: flatsByLevel["88"].Attack.max * modifiers.Attack.max,
        },
        Health: {
            min: flatsByLevel["88"].Health.min * modifiers.Health.min,
            max: flatsByLevel["88"].Health.max * modifiers.Health.max,
        },
        Defense: {
            min: flatsByLevel["88"].Defense.min * modifiers.Defense.min,
            max: flatsByLevel["88"].Defense.max * modifiers.Defense.max,
        }
    },
    "85": {
        Attack: {
            min: flatsByLevel["85"].Attack.min * modifiers.Attack.min,
            max: flatsByLevel["85"].Attack.max * modifiers.Attack.max,
        },
        Health: {
            min: flatsByLevel["85"].Health.min * modifiers.Health.min,
            max: flatsByLevel["85"].Health.max * modifiers.Health.max,
        },
        Defense: {
            min: flatsByLevel["85"].Defense.min * modifiers.Defense.min,
            max: flatsByLevel["85"].Defense.max * modifiers.Defense.max,
        }
    }
}

const plainStatsByLevel = {
    "88": {
        Plain: {
            min: 5,
            max: 9
        },
        CriticalHitChancePercent: {
            min: 3,
            max: 6
        },
        CriticalHitDamagePercent: {
            min: 4,
            max: 8
        },
        Speed: {
            min: 3,
            max: 5
        }
    },
    "85": {
        Plain: {
            min: 4,
            max: 8
        },
        CriticalHitChancePercent: {
            min: 3,
            max: 5
        },
        CriticalHitDamagePercent: {
            min: 4,
            max: 7
        },
        Speed: {
            min: 1,
            max: 4
        }
    }
}

/*

        if (gear.enhance < 15 && gear.enhance >= 0) {
            const rollsLeft = Math.ceil(15 - gear.enhance);

            const permutations = [];
            permutations.push()

            for (var rollCount = 0; rollCount < rollsLeft; rollCount++) {
                var copies = []
                for (var copyN = 0; copyN <= permutations.length; copyN++) {
                    copies.push(JSON.parse(JSON.stringify(permutations[copyN])))
                }
                permuations.concat(copies);


                for (var subN = 0; subN < 4; subN++) {
                    if (gear.rank == "Heroic") {
                        if (subN == 3 && gear.enhance <= 9) {
                            continue;
                        }
                    }

                    if (gear.rank == "Rare") {
                        if (subN == 2 && gear.enhance <= 6) {
                            continue;
                        }
                        if (subN == 3 && gear.enhance <= 9) {
                            continue;
                        }
                    }

                    if (gear.rank == "Good") {
                        if (subN == 1 && gear.enhance <= 3) {
                            continue;
                        }
                        if (subN == 2 && gear.enhance <= 6) {
                            continue;
                        }
                        if (subN == 3 && gear.enhance <= 9) {
                            continue;
                        }
                    }

                    if (gear.rank == "Normal") {
                        if (subN == 0 && gear.enhance <= 0) {
                            continue;
                        }
                        if (subN == 1 && gear.enhance <= 3) {
                            continue;
                        }
                        if (subN == 2 && gear.enhance <= 6) {
                            continue;
                        }
                        if (subN == 3 && gear.enhance <= 9) {
                            continue;
                        }
                    }

                    if (subN >= gear.substats.length) {
                        console.error("Error predicting item substats");
                        return;
                    }

                    const substat = gear.substats[subN];

                    // statRanges
                    const statTypeChanged = plainStats.includes(substat.type) ? "Plain" : substat.type;
                    var minRoll;
                    var maxRoll;

                    const isFlat = false;
                    if (substat.type == "Attack") {
                        isFlat = true;
                        minRoll = flats.Attack.min * modifiers.Attack.min * power;
                        maxRoll = flats.Attack.max * modifiers.Attack.max * power;
                    } else if (substat.type == "Defense") {
                        isFlat = true;
                        minRoll = flats.Health.min * modifiers.Health.min * power;
                        maxRoll = flats.Health.max * modifiers.Health.max * power;
                    } else if (substat.type == "Health") {
                        isFlat = true;
                        minRoll = flats.Defense.min * modifiers.Defense.min * power;
                        maxRoll = flats.Defense.max * modifiers.Defense.max * power;
                    } else {
                        minRoll = Math.floor(statRanges[statTypeChanged].min);
                        maxRoll = Math.ceil(statRanges[statTypeChanged].max);
                    }

                    console.warn(minRoll)
                    console.warn(maxRoll)

                    var increment = 0;
                    if (isFlat) {
                        increment = Math.floor((minRoll - maxRoll) / 5)
                    } else {
                        increment = 1
                    }

                    for (var subRoll = minRoll; subRoll <= maxRoll; subRoll += increment) {
                        // subRoll +
                    }
                }
            }
        }
*/