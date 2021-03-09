module.exports = {
    serialize: (items) => {
        return JSON.stringify(items);
    },

    serializeToArr: (items) => {
        return items.map(x => JSON.stringify(x));
    },

    deserialize: (str) => {
        const arr = JSON.parse(str);
        const results = [];
        for (var element of arr) {
            const mainStat = buildStat(element.main);
            const subStats = element.substats.map(x => buildStat(x));

            results.push(new Item(element.gear, element.rank, element.set, element.level, element.enhance, mainStat, subStats, element.name));
        }

        return results;
    }
}

function buildStat(obj) {
    const rolls = parseInt(obj.rolls);
    return new Stat(obj.type, parseInt(obj.value), isNaN(rolls) ? undefined : rolls, obj.modified);
}

