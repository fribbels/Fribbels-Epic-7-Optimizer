var count = 0;
module.exports = {
    initialize: () => {
        allHeroData = HeroData.getAllHeroData();
    },

    convertItem: (item) => {
        const substats = [];
        for (var substat of item.substats) {
            substats.push(buildStat(substat))
        }

        return {
            "ID": count++,
            "Type": indexByGear[item.gear],
            "Set": indexBySet[item.set],
            "Grade": indexByRank[item.rank],
            "Ilvl": item.level > 100 ? parseInt(item.level/100) : item.level,
            "Enhance": item.enhance,
            "Main": buildStat(item.main),
            "SubStats": substats,
            "Locked": false
        }
    },

    attachItemsToHeroes: (items, heroes) => {
        const itemsById = items.reduce(function(map, obj) {
            map[obj.zarrocId] = obj;
            return map;
        }, {});

        for (const hero of heroes) {
            hero.equipment = {};

            const zarrocItems = hero.zarrocGear;

            for (const zarrocItem of zarrocItems) {
                const item = itemsById[zarrocItem.ID];
                hero.equipment[item.gear] = item;

                item.equippedById = hero.id;
                item.equippedByName = hero.name;
            }
        }

        console.log("ITEMSBYID", itemsById)
    },

    reverseConvertItem: (item) => {
        const substats = [];
        for (var substat of item.SubStats) {
            substats.push(reverseBuildStat(substat))
        }

        return {
            "id": null,
            "gear": swap(indexByGear)[item.Type],
            "rank": swap(indexByRank)[item.Grade],
            "set": swap(indexBySet)[item.Set],
            "enhance": item.Enhance,
            "level": item.Ilvl,
            "main": reverseBuildStat(item.Main),
            "substats": substats,
            "zarrocId": item.ID,
            "locked": item.Locked
        }
    },

    reverseConvertHero: (hero) => {
        const convertedHero = HeroesTab.getNewHeroByName(hero.Name);
        convertedHero.rarity = convertedHero.data.rarity;
        convertedHero.attribute = convertedHero.data.attribute;
        convertedHero.role = convertedHero.data.role;
        convertedHero.zarrocGear = hero.Gear;

        return convertedHero;
    }
}

function swap(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}

function buildStat(stat) {
    const typeIndex = indexByStats[stat.type]
    const value = typeIndex == 1 || typeIndex == 2 || typeIndex == 6 || typeIndex == 8 ? stat.value : stat.value / 100;

    return {
        "Name": typeIndex,
        "Value": value
    }
}
function reverseBuildStat(stat) {
    const type = swap(indexByStats)[stat.Name]
    const value = type == "Attack" || type == "Speed" || type == "Health" || type == "Defense" ? stat.Value : stat.Value * 100;

    return {
        "type": type,
        "value": Math.round(value)
    }
}

const indexByGear = {
    "Weapon": 0,
    "Helmet": 1,
    "Armor": 2,
    "Necklace": 3,
    "Ring": 4,
    "Boots": 5
}

const indexBySet = {
    "SpeedSet": 0,
    "HitSet": 1,
    "CriticalSet": 2,
    "DefenseSet": 3,
    "HealthSet": 4,
    "AttackSet": 5,
    "CounterSet": 6,
    "LifestealSet": 7,
    "DestructionSet": 8,
    "ResistSet": 9,
    "RageSet": 10,
    "ImmunitySet": 11,
    "UnitySet": 12
}

const indexByRank = {
    "Epic": 0,
    "Heroic": 1,
    "Rare": 2,
    "Good": 3,
    "Normal": 4
}

const indexByStats = {
    "AttackPercent": 0,
    "Attack": 1,
    "Speed": 2,
    "CriticalHitChancePercent": 3,
    "CriticalHitDamagePercent": 4,
    "HealthPercent": 5,
    "Health": 6,
    "DefensePercent": 7,
    "Defense": 8,
    "EffectivenessPercent": 9,
    "EffectResistancePercent": 10
}

