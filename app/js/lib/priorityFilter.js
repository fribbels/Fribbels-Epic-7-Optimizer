module.exports = {

    applyPriorityFilters: (params, items, baseStats, allItems) => {
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
                calculateScore(gear, params, baseStats);
            }

            gearArr.sort((a, b) => b.score - a.score);

            console.log("SORTED", key, gearArr);

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

function calculateScore(item, params, baseStats) {
    const atkRolls = item.augmentedStats.AttackPercent/9 + item.augmentedStats.Attack/baseStats.atk*100/9;
    const hpRolls = item.augmentedStats.HealthPercent/9 + item.augmentedStats.Health/baseStats.hp*100/9;
    const defRolls = item.augmentedStats.DefensePercent/9 + item.augmentedStats.Defense/baseStats.def*100/9;
    const spdRolls = item.augmentedStats.Speed/5;
    const crRolls = item.augmentedStats.CriticalHitChancePercent/6;
    const cdRolls = item.augmentedStats.CriticalHitDamagePercent/8;
    const effRolls = item.augmentedStats.EffectivenessPercent/9;
    const resRolls = item.augmentedStats.EffectResistancePercent/9;

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
}

function filterDisabled(params) {
    return params.inputFilterPriority == 100;
}
