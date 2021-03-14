const statList = [
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
]

module.exports = {

    apply: (items) => {
        const keepList = [
            "Defense",
            "DefensePercent",
            "Health",
            "HealthPercent",
            "Speed",
        ];
        const discardList = [
            "Attack",
            "AttackPercent",
            "CriticalHitChancePercent",
            "CriticalHitDamagePercent",
            "EffectivenessPercent",
            "EffectResistancePercent"
        ];

        const rollLimit = 2;
        const rollQuality = 0.5;

        const newItems = []

        console.log("MOD1", items)
        for (item of items) {
            newItems.push(item);

            const existingSubstats = item.substats.map(x => x.type);
            const elegibleSubstats = item.substats.filter(x => x.rolls <= rollLimit && discardList.includes(x.type));

            console.log("E", elegibleSubstats)
            if (item.enhance != 15 || elegibleSubstats.length == 0) {
                continue;
            }

            const tempNewItems = []
            for (var i = 0; i < item.substats.length; i++) {
                const substat = item.substats[i];

                if (!discardList.includes(substat.type) || substat.rolls > rollLimit) {
                    continue;
                }

                for (replacementStat of keepList) {
                    if (existingSubstats.includes(replacementStat) || replacementStat == item.main.type) {
                        continue;
                    }

                    const itemCopy = JSON.parse(JSON.stringify(item));
                    const substatCopy = itemCopy.substats[i];

                    substatCopy.originalType = substatCopy.type;
                    substatCopy.originalValue = substatCopy.value;
                    substatCopy.type = replacementStat;

                    const reforged = Reforge.isReforgeable(item) ? 'reforged' : 'unreforged';
                    const grade = 'greater'
                    const valueRange = Constants.modValues[reforged][grade][replacementStat][substat.rolls];

                    item.augmentedStats[replacementStat] = valueRange[1]
                    item.augmentedStats[substatCopy.originalType] = 0;

                    item.reforgedStats[replacementStat] = valueRange[1]
                    item.reforgedStats[substatCopy.originalType] = 0;

                    substatCopy.value = valueRange[1];
                    // tempNewItems.push(itemCopy);
                    newItems.push(itemCopy)
                    console.log("mod")
                }
            }

            console.log(item);
            // console.log(tempNewItems);
            // newItems.push.apply(newItems, tempNewItems)
            console.log("====================");
        }

        console.warn(newItems);

        return newItems;
    }
}