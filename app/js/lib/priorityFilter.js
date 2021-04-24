module.exports = {

    applyPriorityFilters: (params, items, baseStats, allItems, reforge) => {
        var passed = [];

        if (filterDisabled(params)) {
            console.log("Priority filter disabled")
            return items;
        }

        console.log("Priority filter enabled")

        const groups = groupBy(items, 'gear');
        const allItemsGroups = groupBy(allItems, 'gear');

        console.log("Grouped gears", groups);

        for (var key of Object.keys(groups)) {
            var gearArr = groups[key];
            for (var gear of gearArr) {
                calculateScore(gear, params, baseStats, reforge);
            }

            gearArr.sort((a, b) => b.score - a.score);

            // console.log("SORTED", key, gearArr);

            const index = Math.round(params.inputFilterPriority / 100 * allItemsGroups[key].length);
            passed = passed.concat(gearArr.slice(0, index));
        }

        return passed;
    },
}

var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function mainTypeValue(stats, statType) {
    if (statType == stats.mainType) {
        return stats.mainValue
    }
    return 0;
}

function calculateScore(item, params, baseStats, reforge) {
    const stats = reforge ? item.reforgedStats : item.augmentedStats;

    const atkRolls = (stats.AttackPercent + mainTypeValue(stats, "AttackPercent") + (stats.Attack + mainTypeValue(stats, "Attack"))/baseStats.atk*100) / 8;
    const hpRolls = (stats.HealthPercent + mainTypeValue(stats, "HealthPercent") + (stats.Health + mainTypeValue(stats, "Health"))/baseStats.hp*100) / 8;
    const defRolls = (stats.DefensePercent + mainTypeValue(stats, "DefensePercent") + (stats.Defense + mainTypeValue(stats, "Defense"))/baseStats.def*100) / 8;
    const spdRolls = (stats.Speed + mainTypeValue(stats, "Speed")) / 4;
    const crRolls = (stats.CriticalHitChancePercent + mainTypeValue(stats, "CriticalHitChancePercent")) / 5;
    const cdRolls = (stats.CriticalHitDamagePercent + mainTypeValue(stats, "CriticalHitDamagePercent")) / 7;
    const effRolls = (stats.EffectivenessPercent + mainTypeValue(stats, "EffectivenessPercent")) / 8;
    const resRolls = (stats.EffectResistancePercent + mainTypeValue(stats, "EffectResistancePercent")) / 8;

    const score = atkRolls * params.inputAtkPriority +
                  hpRolls * params.inputHpPriority +
                  defRolls * params.inputDefPriority +
                  spdRolls * params.inputSpdPriority +
                  crRolls * params.inputCrPriority +
                  cdRolls * params.inputCdPriority +
                  effRolls * params.inputEffPriority +
                  resRolls * params.inputResPriority;

    if (isNaN(score)) {
        console.error(item, params, baseStats);
    }
    item.score = score;
    item.priority = Math.round(score);
}

function filterDisabled(params) {
    return params.inputFilterPriority == 100;
}
