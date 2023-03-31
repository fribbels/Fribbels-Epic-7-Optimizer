const n = 25000;

function possibleSubstatsByGear(item, substatTypes) {
    var gear = item.gear;
    return {
        "Weapon": [
            "AttackPercent",
            "Health",
            "HealthPercent",
            "Speed",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ],
        "Helmet": [
            "Attack",
            "AttackPercent",
            "Defense",
            "DefensePercent",
            "HealthPercent",
            "Speed",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ],
        "Armor": [
            "DefensePercent",
            "Health",
            "HealthPercent",
            "Speed",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ],
        "Necklace": [
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
        ].filter(x => x != item.main.type && !substatTypes.includes(x)),
        "Ring": [
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
        ].filter(x => x != item.main.type && !substatTypes.includes(x)),
        "Boots": [
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
        ].filter(x => x != item.main.type && !substatTypes.includes(x)),
    }[gear]
}
module.exports = {

    initialize: () => {

    },

    getSimulationN: () => {
        return n;
    },

    simulate: (item) => {
        if (item.enhance >= 15) {
            return;
        }

        var reforgeable = Reforge.isReforgeable(item);

        var tier = 85;
        if (item.level == 88) {
            tier = 88
        }
        if (item.level < 72) {
            tier = 71
        }

        var grade = "Rare";
        if (item.rank == "Epic") {
            grade = "Epic"
        }
        if (item.rank == "Heroic") {
            grade = "Heroic"
        }


        var baseSubstats = item.substats;
        var substatTypeArr = []
        var gsArr = []
        var moddedGsArr = []
        for (var i = 0; i < n; i++) {
            var substats = []
            for (var j = 0; j < 4; j++) {
                if (baseSubstats[j]) {
                    substats[j] = {
                        type: baseSubstats[j].type,
                        rolls: baseSubstats[j].rolls,
                        value: baseSubstats[j].value
                    }
                    substatTypeArr[j] = baseSubstats[j].type
                } else {
                    var possibleSubstats = possibleSubstatsByGear(item, substatTypeArr);
                    var randomSubstat = possibleSubstats[Math.floor(Math.random() * possibleSubstats.length)];
                    substats[j] = {
                        type: randomSubstat,
                        rolls: 0,
                        value: 0
                    }
                    substatTypeArr[j] = randomSubstat
                }
            }

            for (var j = Math.floor(item.enhance/3)*3; j < 15; j += 3) {
                var substat = substats[Math.floor(Math.random() * 4)];
                if (grade == "Heroic") {
                    if (j == 12) {
                        substat = substats[3]
                    }
                }
                if (grade == "Rare") {
                    if (j == 12) {
                        substat = substats[3]
                    }
                    if (j == 9) {
                        substat = substats[2]
                    }
                }
                if (grade == "Good") {
                    if (j == 12) {
                        substat = substats[3]
                    }
                    if (j == 9) {
                        substat = substats[2]
                    }
                    if (j == 6) {
                        substat = substats[1]
                    }
                }
                if (grade == "Normal") {
                    if (j == 12) {
                        substat = substats[3]
                    }
                    if (j == 9) {
                        substat = substats[2]
                    }
                    if (j == 6) {
                        substat = substats[1]
                    }
                    if (j == 3) {
                        substat = substats[0]
                    }
                }
                // console.log(Math.floor(Math.random() * 4))
                // console.log(substats)
                // console.log(substats[Math.floor(Math.random() * 4)])
                // console.log(substat)
                // console.log("--------------")
                var group = substatGroupByType[substat.type]

                if (group == "Flat") {
                    var range = flatRollsByTier[tier][substat.type][grade]
                    var value = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]

                    substat.value += value;
                    substat.rolls += 1
                } else {
                    var probs = percentProbabilitiesByTier[tier][group][grade];
                    var value = valueFromProbabilities(probs);

                    substat.value += value;
                    substat.rolls += 1
                }
            }

            var gs = 0;
            for (var substat of substats) {
                if (reforgeable) {
                    var plain = false
                    if (plainStats.includes(substat.type)) {
                        plain = true;
                    }

                    if (plain) {
                        const added = plainStatRollsToValue[substat.rolls];
                        substat.value = substat.value + added;
                    }
                    if (substat.type == "CriticalHitChancePercent") {
                        const added = substat.rolls;
                        substat.value = substat.value + added;
                    }
                    if (substat.type == "CriticalHitDamagePercent") {
                        const added = critDamageRollsToValue[substat.rolls];
                        substat.value = substat.value + added;
                    }
                    if (substat.type == "Attack") {
                        const added = 11 * substat.rolls;
                        substat.value = substat.value + added;
                    }
                    if (substat.type == "Defense") {
                        const added = 9 * substat.rolls;
                        substat.value = substat.value + added;
                    }
                    if (substat.type == "Health") {
                        const added = 56 * substat.rolls;
                        substat.value = substat.value + added;
                    }
                    if (substat.type == "Speed") {
                        const added = speedRollsToValue[substat.rolls];
                        substat.value = substat.value + added;
                    }
                }

                substat.gs = substatWeights[substat.type] * substat.value
                substat.potentialGs = potentialGsByRolls[substat.rolls - 1]

                gs += substat.gs
            }

            var maxGsDiff = 0;
            var maxGsDiffIndex = 0;
            for (var substatIndex = 0; substatIndex < substats.length; substatIndex++) {
                var substat = substats[substatIndex]
                var diff = substats[substatIndex].potentialGs - substatWeights[substat.type] * substat.value
                if (diff > maxGsDiff) {
                    maxGsDiff = diff;
                    maxGsDiffIndex = substatIndex
                }
            }

            var moddedGs = 0;
            if (maxGsDiff > 0) {
                for (var substatIndex = 0; substatIndex < substats.length; substatIndex++) {
                    var substat = substats[substatIndex]
                    if (substatIndex == maxGsDiffIndex) {
                        moddedGs += substat.potentialGs
                    } else {
                        moddedGs += substat.gs
                    }
                }
            } else {
                moddedGs = gs
            }

            // console.log("----------------")
            // console.log(substats)
            // console.log(gs)
            // console.log(moddedGs)

            gsArr.push(Math.round(gs))
            moddedGsArr.push(Math.round(moddedGs))
        }

        // console.log(gsArr)
        // console.log(reforgeable)

        return {
            gsArr: gsArr,
            moddedGsArr: moddedGsArr
        }

    },
}

const potentialGsByRolls = {
    0: 9,
    1: 14,
    2: 18,
    3: 22,
    4: 25,
    5: 27
}

const substatGroupByType = {
    "Attack": "Flat",
    "AttackPercent": "Default",
    "Defense": "Flat",
    "DefensePercent": "Default",
    "Health": "Flat",
    "HealthPercent": "Default",
    "Speed": "Speed",
    "CriticalHitChancePercent": "CriticalHitChancePercent",
    "CriticalHitDamagePercent": "CriticalHitDamagePercent",
    "EffectivenessPercent": "Default",
    "EffectResistancePercent": "Default"
}
const plainStats = [
    "AttackPercent",
    "DefensePercent",
    "HealthPercent",
    "EffectivenessPercent",
    "EffectResistancePercent",
]
function valueFromProbabilities(probs) {
    var sum = 0;
    for (var x of Object.values(probs)) {
        sum += x
    }
    var rand = Math.random() * sum;
    var value = Object.keys(probs)[0]
    var cumulative = 0

    for (var x of Object.entries(probs)) {
        if (rand >= cumulative) {
            cumulative += x[1]
            value = x[0]
        } else {
            break
        }
    }
    return parseInt(value)
}

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

const flatRollsByTier = {
    "88": {
        Attack: {
            Epic: [37, 53],
            Heroic: [36, 50],
            Rare: [34, 48]
        },
        Defense: {
            Epic: [32, 40],
            Heroic: [30, 38],
            Rare: [28, 36]
        },
        Health: {
            Epic: [178, 229],
            Heroic: [169, 218],
            Rare: [160, 206]
        }
    },
    "85": {
        Attack: {
            Epic: [33, 46],
            Heroic: [31, 44],
            Rare: [29, 42]
        },
        Defense: {
            Epic: [28, 35],
            Heroic: [26, 33],
            Rare: [25, 31]
        },
        Health: {
            Epic: [157, 202],
            Heroic: [149, 192],
            Rare: [141, 182]
        }
    },
    "71": {
        Attack: {
            Epic: [28, 40],
            Heroic: [27, 38],
            Rare: [25, 36]
        },
        Defense: {
            Epic: [24, 30],
            Heroic: [22, 28],
            Rare: [21, 27]
        },
        Health: {
            Epic: [136, 175],
            Heroic: [129, 166],
            Rare: [122, 157]
        }
    }
}

const percentProbabilitiesByTier = {
    "88": {
        Default: {
            Epic: {
                5: 0.2,
                6: 0.2,
                7: 0.2,
                8: 0.2,
                9: 0.2,
            },
            Heroic: {
                5: 0.2,
                6: 0.2,
                7: 0.2,
                8: 0.2,
                9: 0.2,
            },
            Rare: {
                5: 0.4,
                6: 0.2,
                7: 0.2,
                8: 0.2,
            }
        },
        Speed: {
            Epic: {
                3: 0.49751,
                4: 0.49751,
                5: 0.00498,
            },
            Heroic: {
                2: 0.08333,
                3: 0.52083,
                4: 0.39583,
            },
            Rare: {
                3: 0.17033,
                4: 0.54945,
                5: 0.28022,
            }
        },
        CriticalHitDamagePercent: {
            Epic: {
                4: 0.2,
                5: 0.2,
                6: 0.2,
                7: 0.2,
                8: 0.2,
            },
            Heroic: {
                4: 0.2,
                5: 0.2,
                6: 0.2,
                7: 0.2,
                8: 0.2,
            },
            Rare: {
                4: 0.2,
                5: 0.4,
                6: 0.2,
                7: 0.2,
            }
        },
        CriticalHitChancePercent: {
            Epic: {
                3: 0.25,
                4: 0.25,
                5: 0.25,
                6: 0.25,
            },
            Heroic: {
                3: 0.25,
                4: 0.25,
                5: 0.25,
                6: 0.25,
            },
            Rare: {
                3: 0.25,
                4: 0.25,
                5: 0.5,
            }
        }
    },
    "85": {
        Default: {
            Epic: {
                4: 0.2,
                5: 0.2,
                6: 0.2,
                7: 0.2,
                8: 0.2,
            },
            Heroic: {
                4: 0.2,
                5: 0.2,
                6: 0.2,
                7: 0.2,
                8: 0.2,
            },
            Rare: {
                4: 0.2,
                5: 0.4,
                6: 0.2,
                7: 0.2,
            }
        },
        Speed: {
            Epic: {
                2: 0.33223,
                3: 0.33223,
                4: 0.33223,
                5: 0.00332,
            },
            Heroic: {
                1: 0.03833,
                2: 0.34843,
                3: 0.34843,
                4: 0.26481,
            },
            Rare: {
                1: 0.07721,
                2: 0.36765,
                3: 0.36765,
                4: 0.18750,
            }
        },
        CriticalHitDamagePercent: {
            Epic: {
                4: 0.25,
                5: 0.25,
                6: 0.25,
                7: 0.25,
            },
            Heroic: {
                4: 0.25,
                5: 0.25,
                6: 0.25,
                7: 0.25,
            },
            Rare: {
                4: 0.25,
                5: 0.50,
                6: 0.25,
            }
        },
        CriticalHitChancePercent: {
            Epic: {
                3: 0.33333,
                4: 0.33333,
                5: 0.33333,
            },
            Heroic: {
                3: 0.33333,
                4: 0.33333,
                5: 0.33333,
            },
            Rare: {
                3: 0.33333,
                4: 0.33333,
                5: 0.33333,
            }
        }
    },
    "71": {
        Default: {
            Epic: {
                4: 0.25,
                5: 0.25,
                6: 0.25,
                7: 0.25,
            },
            Heroic: {
                4: 0.25,
                5: 0.25,
                6: 0.25,
                7: 0.25,
            },
            Rare: {
                4: 0.25,
                5: 0.50,
                6: 0.25,
            }
        },
        Speed: {
            Epic: {
                2: 0.49751,
                3: 0.49751,
                4: 0.00498,
            },
            Heroic: {
                1: 0.05729,
                2: 0.52083,
                3: 0.42188,
            },
            Rare: {
                1: 0.11538,
                2: 0.54945,
                3: 0.33516,
            }
        },
        CriticalHitDamagePercent: {
            Epic: {
                3: 0.25,
                4: 0.25,
                5: 0.25,
                6: 0.25,
            },
            Heroic: {
                3: 0.25,
                4: 0.25,
                5: 0.25,
                6: 0.25,
            },
            Rare: {
                3: 0.25,
                4: 0.25,
                5: 0.50,
            }
        },
        CriticalHitChancePercent: {
            Epic: {
                2: 0.33333,
                3: 0.33333,
                4: 0.33333,
            },
            Heroic: {
                2: 0.33333,
                3: 0.33333,
                4: 0.33333,
            },
            Rare: {
                2: 0.33333,
                3: 0.33333,
                4: 0.33333,
            }
        }
    }
}