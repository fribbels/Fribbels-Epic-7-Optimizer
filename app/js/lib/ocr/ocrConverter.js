const stringSimilarity = require('string-similarity');

module.exports = {
    convertOcr: (data) => {

        const gear = constructGear(data);
        const rank = constructRank(data);
        const set = constructSet(data);
        const name = constructName(data);

        const level = constructNumber(data.levelNumbers);
        const enhance = constructNumber(data.enhanceNumbers);

        const mainStat = constructMainStat(data, gear, level, enhance);
        const subStats = constructSubStats(data);

        return new Item(gear, rank, set, level, enhance, mainStat, subStats, name)
    }
}

/*
{
  "gearText": "EpicRing",
  "gearName": "BloodBeastsRing",
  "mainStatText": "Attack", //
  "subStatText": [
    "Health",
    "Speed",
    "CriticalHitChance",
    "Effectiveness"
  ],
  "setText": "LifestealSet",
  "subStatNumbers": [
    "10%",
    "2",
    "7%",
    "15%"
  ],
  "mainStatNumbers": "31%",
  "levelNumbers": "57",
  "enhanceNumbers": "13"
}
*/

function constructNumber(num) {
    if (num == undefined || num == null) {
        return 0;
    }
    return parseInt(num);
}

function constructGear(data) {
    return match(data.gearText, gearOptions);
}

function constructRank(data) {
    return match(data.gearText, rankOptions);
}

function constructSet(data) {
    return match(data.setText, setOptions);
}

function constructName(data) {
    return data.gearName;
}

function constructMainStat(data, gear, level, enhance) {
    const mainStatNumbers = MainStatFixer.fix(data, gear, level, enhance);
    return constructStat(data.mainStatText, mainStatNumbers);
}

function constructSubStats(data) {
    const len = Math.min(data.subStatNumbers.length, data.subStatText.length);
    const stats = [];
    for (var i = 0; i < len; i++) {
        const text = data.subStatText[i];
        const numbers = data.subStatNumbers[i];

        stats.push(constructStat(text, numbers));
    }

    return stats;
}

function constructStat(text, numbers) {
    const isPercent = numbers.includes('%');
    const statNumbers = numbers.replace('%', '');
    const statText = match(text, statOptions) + (isPercent ? PERCENT : '');

    return new Stat(statText, parseInt(statNumbers));
}

function match(str, arr) {
    return stringSimilarity.findBestMatch(str, arr).bestMatch.target;
}

const PERCENT = "Percent";

const gearOptions = [
    "Weapon", "Helmet", "Armor", "Necklace", "Ring", "Boots"
];

const rankOptions = [
    "Normal", "Good", "Rare", "Heroic", "Epic"
];

const statOptions = [
    "Attack", "Health", "Defense", "CriticalHitChance", "CriticalHitDamage", "Effectiveness", "EffectResistance", "Speed"
];

const setOptions = [
    "HealthSet", "DefenseSet", "AttackSet", "SpeedSet", "CriticalSet", "HitSet", "DestructionSet", "LifestealSet", "CounterSet", "ResistSet", "UnitySet", "RageSet", "ImmunitySet", "PenetrationSet", "RevengeSet", "InjurySet"
]

