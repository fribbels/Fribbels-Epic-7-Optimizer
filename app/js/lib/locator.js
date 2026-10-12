
const tippy = require('tippy.js').default;

var readableSubstatByName = {
    "Attack": "Flat atk",
    "AttackPercent": "Attack %",
    "Defense": "Flat def",
    "DefensePercent": "Defense %",
    "Health": "Flat hp",
    "HealthPercent": "Health %",
    "Speed": "Speed",
    "CriticalHitChancePercent": "Crit chance",
    "CriticalHitDamagePercent": "Crit dmg",
    "EffectivenessPercent": "Eff",
    "EffectResistancePercent": "Eff res",
}

module.exports = {
    locate: async (ingameId, selectorClass) => {
        const getAllItemsResponse = await Api.getAllItems();
        const items = getAllItemsResponse.items;

        var elements = document.querySelectorAll("." + selectorClass);

        for (var element of elements) {
            var result = locateSingleItem(element.dataset.itemid, items);
            var width = parseInt(Settings.parseNumberValue('settingLocatorWidth') || 5);
            console.log('locate', element, element.dataset.itemid, result);

            if (result) {
                var content = "";

                if (result.unscannedItem) {
                    content = "Rescan items to locate"
                }

                if (result.storage) {
                    content = "Item in storage"
                } else {
                    content = `<div class="locatorTip">Substat: ${readableSubstatByName[result.substat]}</br>
                    Row: ${Math.floor(result.index / width) + 1} Column: ${result.index % width + 1}</br>
                    Sort: Acquisition</br>
                    Width setting: ${width}</div>`
                }

                var tippyInstance;
                if (element._tippy) {
                    tippyInstance = element._tippy
                } else {
                    tippyInstance = tippy(element, {
                        allowHTML: true,
                        trigger: 'focus',
                        placement: 'right',
                        content: content,
                        arrow: false,

                        onHidden(instance) {
                            instance.destroy()
                            return true;
                        },
                    })
                }

                tippyInstance.show();
            }
        }
    },
}

function locateSingleItem(itemId, items) {
    if (!itemId) {
        console.log("No item matching id " + itemId)
        return {
            unscannedItem: true
        };
    }

    var item = items.find(x => x.ingameId == itemId)

    if (!item) {
        console.log("No item matching ingame id " + itemId)
        return {
            unscannedItem: true
        };
    }

    items = items.filter(x => x.gear == item.gear && !x.storage )
    // items = items.filter(x => x.set == item.set && x.gear == item.gear)

    var minIndex = items.length;
    var minIndexSubstat = ""

    for (var substat of item.substats) {
        items.sort((x, y) => {
            var yValue = y.augmentedStats[substat.type] || 0;
            var xValue = x.augmentedStats[substat.type] || 0;
            var difference = yValue - xValue;
            if (difference == 0) {
                return y.ingameId - x.ingameId;
            }
            return difference;
        })

        var currentIndex = items.findIndex(x => x.ingameId == item.ingameId)
        if (currentIndex < minIndex) {
            minIndex = currentIndex;
            minIndexSubstat = substat.type
        }
    }

    return {
        substat: minIndexSubstat,
        index: minIndex,
        storage: item.storage || false
    }
}
