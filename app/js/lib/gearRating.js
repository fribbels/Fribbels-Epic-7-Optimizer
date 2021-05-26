
module.exports = {

    initialize: () => {

    },

    rate: (item) => {
        // const stats = reforge ? item.reforgedStats : item.augmentedStats;
        const stats = item.augmentedStats;

/*
+ Flat Attack * 3.46 / 39
+ Flat Defense * 4.99 / 31
+ Flat Hp * 3.09 / 174
*/
        const atkRolls = (stats.AttackPercent + (stats.Attack) * 3.46 / 39) / 8;
        const hpRolls = (stats.HealthPercent  + (stats.Health) * 3.09 / 174) / 8;
        const defRolls = (stats.DefensePercent + (stats.Defense) * 4.99 / 31) / 8;
        const spdRolls = (stats.Speed) / 4;
        const crRolls = (stats.CriticalHitChancePercent) / 5;
        const cdRolls = (stats.CriticalHitDamagePercent) / 7;
        const effRolls = (stats.EffectivenessPercent) / 8;
        const resRolls = (stats.EffectResistancePercent) / 8;

        const scoredArchetypes = []
        for (var archetype of archetypes) {
            const scale = (archetype.Attack || 0) +
                          (archetype.Health || 0) +
                          (archetype.Defense || 0) +
                          (archetype.Speed || 0) +
                          (archetype.CriticalHitChancePercent || 0) +
                          (archetype.CriticalHitDamagePercent || 0) +
                          (archetype.EffectivenessPercent || 0) +
                          (archetype.EffectResistancePercent || 0)

            const score = atkRolls * (archetype.Attack || 0) +
                          hpRolls * (archetype.Health || 0) +
                          defRolls * (archetype.Defense || 0) +
                          spdRolls * (archetype.Speed || 0) +
                          crRolls * (archetype.CriticalHitChancePercent || 0) +
                          cdRolls * (archetype.CriticalHitDamagePercent || 0) +
                          effRolls * (archetype.EffectivenessPercent || 0) +
                          resRolls * (archetype.EffectResistancePercent || 0);

            const matchedMains =

            scoredArchetypes.push({
                score: score / scale,
                name: archetype.name
            })
        }

        Utils.sortByAttribute(scoredArchetypes, "score");
        console.warn(JSON.stringify(scoredArchetypes, null, 2));
    }
}

// const archetypes = {
//     "DPS": {
//         Attack: 3,
//         CriticalHitChancePercent: 3,
//         CriticalHitDamagePercent: 3,
//         Speed: 3
//     },
//     "DPS Debuffer": {
//         Attack: 3,
//         CriticalHitChancePercent: 3,
//         CriticalHitDamagePercent: 3,
//         Speed: 3,
//         Effectiveness: 3
//     },
//     "Debuffer": {
//         Speed: 3,
//         Effectiveness: 3
//     },
//     "Speed Opener": {
//         Speed: 3
//     },
//     "Attack Bruiser": {
//         Attack: 3,
//         Defense, 3,
//         Health, 3,
//         Speed: 3
//     },
//     "Resist Support": {
//         EffectResistancePercent: 3,
//         Health: 3,
//         Defense: 3,
//         Speed: 3
//     },
//     "Tank": {
//         Health: 3,
//         Defense: 3,
//         Speed: 3
//     },
//     "Burn": {
//         Attack: 3,
//         Speed: 3,
//         Effectiveness: 3
//     }
// }


const archetypes = [
    {
        name: "DPS",
        necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent", "Attack"],
        ring: ["Attack"],
        boots: ["Speed", "Attack"],
        scale: 12,
        Attack: 2,
        CriticalHitChancePercent: 2,
        CriticalHitDamagePercent: 2,
        Speed: 3
    },
    {
        name: "Damage",
        scale: 9,
        necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent", "Attack"],
        ring: ["Attack"],
        boots: ["Attack"],
        Attack: 3,
        CriticalHitChancePercent: 3,
        CriticalHitDamagePercent: 3
    },
    {
        name: "DPS Debuffer",
        necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent", "Attack"],
        ring: ["EffectivenessPercent", "Attack"],
        boots: ["Speed"],
        scale: 15,
        Attack: 1,
        CriticalHitChancePercent: 1,
        CriticalHitDamagePercent: 1,
        Speed: 3,
        EffectivenessPercent: 2
    },
    {
        name: "Debuffer",
        necklace: ["*"],
        ring: ["EffectivenessPercent"],
        boots: ["Speed"],
        scale: 6,
        Speed: 3,
        EffectivenessPercent: 3
    },
    // {
    //     name: "Attack Bruiser",
    //     scale: 12,
    //     Attack: 3,
    //     Defense: 1,
    //     Health: 1,
    //     Speed: 1
    // },
    {
        name: "Bruiser",
        necklace: ["CriticalHitChancePercent", "CriticalHitDamagePercent", "Health", "Defense", "Attack"],
        ring: ["Health", "Defense", "Attack"],
        boots: ["Speed", "Health", "Defense", "Attack"],
        scale: 18,
        Attack: 1,
        Defense: 2,
        Health: 3,
        CriticalHitChancePercent: 3,
        CriticalHitDamagePercent: 3,
        Speed: 2
    },
    {
        name: "Resist Support",
        necklace: ["Health", "Defense"],
        ring: ["Health", "Defense", "EffectResistancePercent"],
        boots: ["Speed", "Health", "Defense"],
        scale: 7,
        EffectResistancePercent: 3,
        Health: 1,
        Defense: 1,
        Speed: 1
    },
    {
        name: "Tank",
        necklace: ["Health", "DefensePercent"],
        ring: ["HealthPercent", "DefensePercent"],
        boots: ["Speed", "HealthPercent", "DefensePercent"],
        scale: 9,
        Health: 3,
        Defense: 3,
        Speed: 3
    },
    {
        name: "Burn",
        necklace: ["*"],
        ring: ["EffectivenessPercent", "AttackPercent", "HealthPercent", "DefensePercent"],
        boots: ["Speed", "AttackPercent", "HealthPercent", "DefensePercent"],
        scale: 9,
        Attack: 3,
        Speed: 2,
        EffectivenessPercent: 3
    }
]


function mainTypeValue(stats, statType) {
    if (statType == stats.mainType) {
        return stats.mainValue
    }
    return 0;
}