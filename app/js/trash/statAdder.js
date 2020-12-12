
function updateBonusStats(stat, bonusStats) {
    if (!stat) {
        return
    }
    bonusStats[stat.type] += stat.value;
}

function addStatPercent(stats, bonusStats, statName) {
    stats[statName] *= (bonusStats[statName]/100)
    console.log("1-" + bonusStats[statName]/100);
    console.log("2-" + angelica.stats);
}

function updateStats(stats, bonusStats) {
    stats[Stats.ATK] *= 1 + bonusStats[Stats.ATK]/100;
    stats[Stats.HP] *= 1 + bonusStats[Stats.HP]/100;
    stats[Stats.DEF] *= 1 + bonusStats[Stats.DEF]/100;

    stats[Stats.ATK] += bonusStats[Stats.FLATATK];
    stats[Stats.HP] += bonusStats[Stats.FLATHP];
    stats[Stats.DEF] += bonusStats[Stats.FLATDEF];

    stats[Stats.CR] += bonusStats[Stats.CR]/100;
    stats[Stats.CD] += bonusStats[Stats.CD]/100;

    stats[Stats.EFF] += bonusStats[Stats.EFF]/100;
    stats[Stats.RES] += bonusStats[Stats.RES]/100;

    stats[Stats.SPD] += stats[Stats.SPD]*0.25;
    stats[Stats.SPD] += bonusStats[Stats.SPD];
}

// const equipped = TestItems.slice(0, 6);
function testBonusStats(equipped) {
    const angelica = JSON.parse(JSON.stringify(Heroes.Angelica));

    const bonusStats = {
        [Stats.FLATATK]: 0,
        [Stats.FLATHP]: 0,
        [Stats.FLATDEF]: 0,
        [Stats.ATK]: 0,
        [Stats.HP]: 0,
        [Stats.DEF]: 0,
        [Stats.CR]: 0,
        [Stats.CD]: 0,
        [Stats.EFF]: 0,
        [Stats.RES]: 0,
        [Stats.SPD]: 0,
    }

    // console.log("Base Angelica", Heroes.Angelica)

    for (var equipment of equipped) {
        updateBonusStats(equipment.main, bonusStats);
        updateBonusStats(equipment.substats[0], bonusStats);
        updateBonusStats(equipment.substats[1], bonusStats);
        updateBonusStats(equipment.substats[2], bonusStats);
        updateBonusStats(equipment.substats[3], bonusStats);
    }
    // console.log("Equipped", equipped);
    // console.log("BonusStats", bonusStats);

    updateStats(angelica.stats, bonusStats);

    // console.log("Angelica updated stats", angelica.stats);
    return angelica.stats;
}