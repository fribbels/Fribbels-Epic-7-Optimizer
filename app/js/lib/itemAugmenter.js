const { v4: uuidv4 } = require('uuid');

module.exports = {
    augmentStats: (items) => {
        for (var item of items) {
            augmentStats(item);

            item.id = uuidv4();
        }

        console.log("Augmented items", items.length);
    },

    augmentReforge: (items) => {
        for (var item of items) {
            if (item.level == 85) {
                augmentStats(item);
            }
        }
        console.log("Augmented reforged items", items.length);
    },

    augmentReforgeStats: (items) => {
        for (var item of items) {
            augmentReforgeStats(item);
        }
    }
}

function augmentStats(item) {
    item.augmentedStats = {
        AttackPercent: 0,
        HealthPercent: 0,
        DefensePercent: 0,
        Attack: 0,
        Health: 0,
        Defense: 0,
        Speed: 0,
        CriticalHitChancePercent: 0,
        CriticalHitDamagePercent: 0,
        EffectivenessPercent: 0,
        EffectResistancePercent: 0,
    };
    item.augmentedStats.mainType = item.main.type;
    item.augmentedStats.mainValue = item.main.value;

    for (var subStat of item.substats) {
        item.augmentedStats[subStat.type] = subStat.value;
    }
}

function augmentReforgeStats(item) {
    item.reforgedStats = {
        AttackPercent: 0,
        HealthPercent: 0,
        DefensePercent: 0,
        Attack: 0,
        Health: 0,
        Defense: 0,
        Speed: 0,
        CriticalHitChancePercent: 0,
        CriticalHitDamagePercent: 0,
        EffectivenessPercent: 0,
        EffectResistancePercent: 0,
    };

    if (Reforge.isReforgeable(item)) {
        item.reforgedStats.mainType = item.main.type;
        item.reforgedStats.mainValue = item.main.reforgedValue;

        for (var subStat of item.substats) {
            item.reforgedStats[subStat.type] = subStat.reforgedValue;
        }
    } else {
        item.reforgedStats.mainType = item.main.type;
        item.reforgedStats.mainValue = item.main.value;

        for (var subStat of item.substats) {
            item.reforgedStats[subStat.type] = subStat.value;
        }
    }
}