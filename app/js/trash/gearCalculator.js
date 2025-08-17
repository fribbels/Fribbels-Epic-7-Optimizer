module.exports = {

    initialize: () => {

    },

    parseResults: (resultIndices, base, filteredItems) => {
        const items = JSON.parse(JSON.stringify(filteredItems))
        const itemsByGear = buildItemsByGear(items);
        items.forEach(x => x.setIndex = indexBySetType[x.set]);

        const wLength = itemsByGear[Gears.Weapon].length;
        const hLength = itemsByGear[Gears.Helmet].length;
        const aLength = itemsByGear[Gears.Armor].length;
        const nLength = itemsByGear[Gears.Necklace].length;
        const rLength = itemsByGear[Gears.Ring].length;
        const bLength = itemsByGear[Gears.Boots].length;

        const accumulatorArrsByItem = {};
        const setsBuffer = new Array(13).fill();
        const parsedResults = [];

        console.log("STARTINGPARSING", resultIndices.length)
        for (var i of resultIndices) {
            [w, h, a, n, r, b] = calculateIndex(i, wLength, hLength, aLength, nLength, rLength, bLength);

            const weapon = itemsByGear[Gears.Weapon][w];
            const helmet = itemsByGear[Gears.Helmet][h];
            const armor = itemsByGear[Gears.Armor][a];
            const necklace = itemsByGear[Gears.Necklace][n];
            const ring = itemsByGear[Gears.Ring][r];
            const boots = itemsByGear[Gears.Boots][b];

            // if (i % 1000 == 0) {
            //     console.log(weapon, helmet, armor, necklace, ring, boots);
            //     console.log(w, h, a, n, r, b);
            //     console.log(i, wLength, hLength, aLength, nLength, rLength, bLength);
            // }

            const weaponAccumulatorArr = getStatAccumulatorArr(base, weapon, accumulatorArrsByItem);
            const helmetAccumulatorArr = getStatAccumulatorArr(base, helmet, accumulatorArrsByItem);
            const armorAccumulatorArr = getStatAccumulatorArr(base, armor, accumulatorArrsByItem);
            const necklaceAccumulatorArr = getStatAccumulatorArr(base, necklace, accumulatorArrsByItem);
            const ringAccumulatorArr = getStatAccumulatorArr(base, ring, accumulatorArrsByItem);
            const bootsAccumulatorArr = getStatAccumulatorArr(base, boots, accumulatorArrsByItem);

            const itemCombinationStats = addAccumulatorArrsToHero(
                base,
                [weaponAccumulatorArr, helmetAccumulatorArr, armorAccumulatorArr, necklaceAccumulatorArr, ringAccumulatorArr, bootsAccumulatorArr],
                [weapon, helmet, armor, necklace, ring, boots],
                setsBuffer.slice()
            );

            itemCombinationStats.weapon = weapon;
            itemCombinationStats.helmet = helmet;
            itemCombinationStats.armor = armor;
            itemCombinationStats.necklace = necklace;
            itemCombinationStats.ring = ring;
            itemCombinationStats.boots = boots;

            parsedResults.push(itemCombinationStats);
        }

        return parsedResults;
    }
}

function buildItemsByGear(items) {
    const itemsByGear = {};
    Object.keys(Gears)
            .forEach(gear => itemsByGear[gear] = items.filter(x => x.gear == gear))

    return itemsByGear;
}

function calculateIndex(i, wLength, hLength, aLength, nLength, rLength, bLength) {
    const b = i % bLength;
    const r = Math.floor(i / bLength) % rLength;
    const n = Math.floor(i / (bLength*rLength)) % nLength;
    const a = Math.floor(i / (bLength*rLength*nLength)) % aLength;
    const h = Math.floor(i / (bLength*rLength*nLength*aLength)) % hLength;
    const w = Math.floor(i / (bLength*rLength*nLength*aLength*hLength)) % wLength;

    return [w, h, a, n, r, b];
}

function addAccumulatorArrsToHero(base, accs, items, setsBuffer) {
    const sets = calculateSets(items, setsBuffer);

    const atk = Math.floor(base.atk + addStatAccumulators(0, accs)  + (sets[2] > 1 ? Math.floor(sets[2] / 4) * 0.35 * base.atk : 0));
    const hp =  Math.floor(base.hp  + addStatAccumulators(1, accs)  + (sets[0] > 1 ? Math.floor(sets[0] / 2) * 0.15 * base.hp  : 0));
    const def = Math.floor(base.def + addStatAccumulators(2, accs)  + (sets[1] > 1 ? Math.floor(sets[1] / 2) * 0.15 * base.def : 0));
    const spd = (base.spd + addStatAccumulators(10, accs) + (sets[3] > 1 ? Math.floor(sets[3] / 4) * 0.25 * base.spd : 0));
    const cr =  (base.cr  + addStatAccumulators(6, accs)  + (sets[4] > 1 ? Math.floor(sets[4] / 2) * 12 : 0));
    const cd =  (base.cd  + addStatAccumulators(7, accs)  + (sets[6] > 1 ? Math.floor(sets[6] / 4) * 40 : 0));
    const eff = (base.eff + addStatAccumulators(8, accs)  + (sets[5] > 1 ? Math.floor(sets[5] / 2) * 20 : 0));
    const res = (base.res + addStatAccumulators(9, accs)  + (sets[9] > 1 ? Math.floor(sets[9] / 2) * 20 : 0));
    const dac = base.dac + Math.floor(sets[10] / 2) * 4;

    return {
        atk,
        hp,
        def,
        cr,
        cd,
        eff,
        res,
        dac,
        spd,
        sets
    }
}

function calculateSets(items, setsBuffer) {
    setsBuffer.fill(0);
    setsBuffer[items[0].setIndex]++;
    setsBuffer[items[1].setIndex]++;
    setsBuffer[items[2].setIndex]++;
    setsBuffer[items[3].setIndex]++;
    setsBuffer[items[4].setIndex]++;
    setsBuffer[items[5].setIndex]++;

    return setsBuffer;
}

function addStatAccumulators(index, accs) {
    return accs[0][index]
         + accs[1][index]
         + accs[2][index]
         + accs[3][index]
         + accs[4][index]
         + accs[5][index];
}

function getStatAccumulatorArr(base, item, accumulatorArrsByItem) {
    if (item.id in accumulatorArrsByItem) {
        return accumulatorArrsByItem[item.id];
    }

    const accumulator = buildStatAccumulatorArr(base, item);
    accumulatorArrsByItem[item.id] = accumulator;
    return accumulator;
}

function buildStatAccumulatorArr(base, item) {
    const stats = item.augmentedStats;
    const statAccumulatorArr = new Array(12).fill(0);

    statAccumulatorArr[0]  += (stats.Attack || 0) + (stats.AttackPercent || 0)/100 * base.atk;
    statAccumulatorArr[1]  += (stats.Health || 0) + (stats.HealthPercent || 0)/100 * base.hp;
    statAccumulatorArr[2]  += (stats.Defense || 0) + (stats.DefensePercent || 0)/100 * base.def;
    statAccumulatorArr[10] += (stats.Speed || 0)
    statAccumulatorArr[6]  += (stats.CriticalHitChancePercent || 0)
    statAccumulatorArr[7]  += (stats.CriticalHitDamagePercent || 0)
    statAccumulatorArr[8]  += (stats.EffectivenessPercent || 0)
    statAccumulatorArr[9]  += (stats.EffectResistancePercent || 0)

    const mainType = item.main.type;
    const mainValue = item.main.value;
    const mainTypeIndex = indexByStatType[mainType];

    if (mainTypeIndex == 3) {
        statAccumulatorArr[0] += mainValue/100 * base.atk;
    } else if (mainTypeIndex == 4) {
        statAccumulatorArr[1] += mainValue/100 * base.hp;
    } else if (mainTypeIndex == 5) {
        statAccumulatorArr[2] += mainValue/100 * base.def;
    } else {
        statAccumulatorArr[mainTypeIndex] += mainValue;
    }

    return statAccumulatorArr;
}

const indexByStatType = {
    "Attack": 0,
    "Health": 1,
    "Defense": 2,
    "AttackPercent": 3,
    "HealthPercent": 4,
    "DefensePercent": 5,
    "Speed": 10,
    "CriticalHitChancePercent": 6,
    "CriticalHitDamagePercent": 7,
    "EffectivenessPercent": 8,
    "EffectResistancePercent": 9,
}

const indexBySetType = {
    "HealthSet": 0,
    "DefenseSet": 1,
    "AttackSet": 2,
    "SpeedSet": 3,
    "CriticalSet": 4,
    "HitSet": 5,
    "DestructionSet": 6,
    "LifestealSet": 7,
    "CounterSet": 8,
    "ResistSet": 9,
    "UnitySet": 10,
    "RageSet": 11,
    "ImmunitySet": 12,
    "PenetrationSet": 13,
    "RevengeSet": 14,
    "InjurySet": 15,
    "ProtectionSet": 16,
    "TorrentSet": 17,
    "ReversalSet": 18,
    "RiposteSet": 19,
}
