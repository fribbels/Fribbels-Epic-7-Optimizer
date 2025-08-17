const gearEnum = {
    'Weapon': 'Weapon',
    'Helmet': 'Helmet',
    'Armor': 'Armor',
    'Necklace': 'Necklace',
    'Ring': 'Ring',
    'Boots': 'Boots'
};

const setEnum = {
    'HEALTH': 'health',
    'DEFENSE': 'defense',
    'ATTACK': 'attack',
    'SPEED': 'speed',
    'CRIT': 'crit',
    'HIT': 'hit',
    'DESTRUCTION': 'destruction',
    'LIFESTEAL': 'lifesteal',
    'COUNTER': 'counter',
    'RESIST': 'resist',
    'UNITY': 'unity',
    'RAGE': 'rage',
    'IMMUNITY': 'immunity',
    'TORRENT': 'torrent',
    'PROTECTION': 'protection',
    'REVERSAL': 'reversal',
    'RIPOSTE': 'riposte',
};

const rankEnum = {
    'NORMAL': 'normal',
    'GOOD': 'good',
    'RARE': 'rare',
    'HEROIC': 'heroic',
    'EPIC': 'epic'
};

const statEnum = {
    'FLATATK': 'flatatk',
    'FLATHP': 'flathp',
    'FLATDEF': 'flatdef',
    'ATK': 'atk',
    'HP': 'hp',
    'DEF': 'def',
    'CR': 'cr',
    'CD': 'cd',
    'EFF': 'eff',
    'RES': 'res',
    'SPD': 'spd'
};

const heroes = {
    'Angelica': {
        'stats': {
            "cp": 14709,
            "atk": 576,
            "hp": 5700,
            "spd": 88,
            "def": 743,
            "chc": 0.15,
            "chd": 1.5,
            "eff": 0,
            "efr": 0,
            "dac": 0.05
        }
    }
}

module.exports = {
    Gears: gearEnum,
    Sets: setEnum,
    Ranks: rankEnum,
    Stats: statEnum,
    Heroes: heroes
}
