const { v4: uuidv4 } = require('uuid');

module.exports = {
    augmentStats: (items) => {
        for (var item of items) {
            augmentStats(item);

            item.id = uuidv4();
        }
        console.log("Augmented items", items);
    },

    augmentReforge: (items) => {
        for (var item of items) {
            if (item.level == 85) {
                augmentStats(item);
            }
        }
        console.log("Augmented items", items);
    },
}

function augmentStats(item) {
    item.augmentedStats = {};
    item.augmentedStats.mainType = item.main.type;
    item.augmentedStats.mainValue = item.main.value;

    for (var subStat of item.substats) {
        item.augmentedStats[subStat.type] = subStat.value;
    }
}