module.exports = {

    applyPriorityFilters: (params, items, baseStats) => {
        var passed = [];

        if (filterDisabled(params)) {
            console.warn("PRIORITY FILTER NOT ENABLED")
            return items;
        }

        console.log("PRIORITY FILTER ENABLED")

        const groups = groupBy(items, 'gear');
        console.log("GROUPS", groups);

        for (var gearArr of Object.values(groups)) {
            for (var gear of gearArr) {
                calculateScore(gear, params, baseStats);
            }

            gearArr.sort((a, b) => b.score - a.score);
            console.log("GearArr", gearArr)
            const index = Math.round(params.inputFilterPriority / 100 * gearArr.length);
            console.log("Index", index)
            passed = passed.concat(gearArr.slice(0, index));
            console.log("Passed", passed)
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

console.log(groupBy(['one', 'two', 'three'], 'length'));

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

    // console.log("Score: " + score +
    //             "\nAtk rolls: " + atkRolls +
    //             "\nHp rolls: " + hpRolls +
    //             "\nDef rolls: " + defRolls +
    //             "\nSpd rolls: " + spdRolls +
    //             "\nCr rolls: " + crRolls +
    //             "\nCd rolls: " + cdRolls +
    //             "\nEff rolls: " + effRolls +
    //             "\nRes rolls: " + resRolls);

    item.score = score;
}

function filterDisabled(params) {
    return params.inputFilterPriority == 100;
}
