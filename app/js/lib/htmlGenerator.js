const stringSimilarity = require('string-similarity');

function statToText(stat, baseStats, item) {
    if (!stat) {
        return {
            type: '',
            value: ''
        }
    }

// ${substat3.reforgedValue ? " [" + substat3.reforgedValue + "]" : ""}

    const unpercentedStat = shortenStats(stat.type.match(/[A-Z][a-z]+/g).filter(x => x != 'Percent').join(' '));
    var value;

    if (Reforge.isReforgeable(item)) {
        const unreforgedValue = stat.type.includes('Percent') ? stat.value + "%" : stat.value;
        const reforgedValue = stat.type.includes('Percent') ? stat.reforgedValue + "%" : getPercentageEquivalent(stat, baseStats, true);

        value = unreforgedValue + " ➤ " + reforgedValue
    } else {
        value = stat.type.includes('Percent') ? stat.value + "%" : getPercentageEquivalent(stat, baseStats, false);
    }


    return {
        type: unpercentedStat,
        value: value
    }
}

function wssToText(item) {
    if (Reforge.isReforgeable(item)) {
        return item.wss + " ➤ " + item.reforgedWss;
    } else {
        return item.wss
    }
}

function shortenStats(statType) {
    if (statType == "Effect Resistance")
        return "Effect Resist"
    if (statType == "Critical Hit Chance")
        return "Crit Chance"
    if (statType == "Critical Hit Damage")
        return "Crit Damage"
    return statType;
}

function getPercentageEquivalent(stat, baseStats, useReforged) {
    const value = useReforged ? stat.reforgedValue : stat.value;

    if (!baseStats) {
        return value;
    }

    if (stat.type == "Health") {
        var num = value/baseStats.hp*100;
        return value + ` (${Math.round(num)}%)`;
    }
    if (stat.type == "Defense") {
        var num = value/baseStats.def*100;
        return value + ` (${Math.round(num)}%)`;
    }
    if (stat.type == "Attack") {
        var num = value/baseStats.atk*100;
        return value + ` (${Math.round(num)}%)`;
    }
    if (stat.type == "Speed") {
        return value;
    }
}

const colorsByRank = {
    'Normal': 'grey',
    'Good': 'green',
    'Rare': 'blue',
    'Heroic': 'mediumorchid',
    'Epic': 'crimson'
}

function buildFilter(name, url, isChecked) {
    const html = `
<div class="pretty p-icon p-toggle">
    <input type="checkbox" id="checkboxImage${name}" ${isChecked ? 'checked' : ''}/>
    <div class="state p-success-o p-on">
        <img class="image onImage" src="${url}">
        <label class="imageLabel"></label>
    </div>
    <div class="state p-info-o p-off">
        <img class="image offImage" src="${url}">
        <label class="imageLabel"></label>
    </div>
</div>
`;
    return html;
}

function getHeroImage(item) {
    const heroName = item.equippedByName;
    if (!heroName)
        return Assets.getBlank(); // blank transparent

    const data = HeroData.getHeroExtraInfo(heroName);
    return data.assets.icon;
}

module.exports = {

    buildFilterSetsBar: () => {
        const clearUrl = Assets.getX(); // black x
        const html = buildFilter("ClearSets", clearUrl, true);
        document.getElementById('setsFilterBar').innerHTML += html;

        const assetsBySet = Assets.getAssetsBySet();
        for (var set of Object.keys(assetsBySet)) {
            const url = assetsBySet[set];
            const html = buildFilter(set, url, false);

            document.getElementById('setsFilterBar').innerHTML += html;
        }
    },

    buildFilterLevelBar: () => {
        const clearUrl = Assets.getX(); // black x
        const html = buildFilter("ClearLevels", clearUrl, true);
        document.getElementById('levelFilterBar').innerHTML += html;

        const assetsByLevel = Assets.getAssetsByLevel();
        for (var level of Object.keys(assetsByLevel)) {
            const url = assetsByLevel[level];
            const html = buildFilter(level, url, false);

            document.getElementById('levelFilterBar').innerHTML += html;
        }
    },

    buildFilterEnhanceBar: () => {
        const clearUrl = Assets.getX(); // black x
        const html = buildFilter("ClearEnhances", clearUrl, true);
        document.getElementById('enhanceFilterBar').innerHTML += html;

        const assetsByEnhance = Assets.getAssetsByEnhance();
        for (var enhance of Object.keys(assetsByEnhance)) {
            const url = assetsByEnhance[enhance];
            const html = buildFilter(enhance, url, false);

            document.getElementById('enhanceFilterBar').innerHTML += html;
        }
    },

    buildFilterGearBar: () => {
        const clearUrl = Assets.getX(); // black x
        const html = buildFilter("ClearGears", clearUrl, true);
        document.getElementById('gearFilterBar').innerHTML += html;

        const assetsByGear = Assets.getAssetsByGear();
        for (var gear of Object.keys(assetsByGear)) {
            const url = assetsByGear[gear];
            const html = buildFilter(gear, url, false);

            document.getElementById('gearFilterBar').innerHTML += html;
        }
    },


    buildFilterStatBar: () => {
        const clearUrl = Assets.getX(); // black x
        const html = buildFilter("ClearStats", clearUrl, true);
        document.getElementById('statFilterBar').innerHTML += html;

        const assetsByStat = Assets.getAssetsByStat();
        for (var stat of Object.keys(assetsByStat)) {
            const url = assetsByStat[stat];
            const html = buildFilter(stat, url, false);

            document.getElementById('statFilterBar').innerHTML += html;
        }
    },

    buildItemPanel(item, checkboxPrefix, baseStats) {
        if (!item) {
            return `

<div class="itemDisplayHeader">
  <div class="itemDisplayHeaderData">
    <div class="itemDisplayHeaderDataTop">
      <div class="itemDisplayLevel"></div>
    </div>
    <div class="itemDisplayHeaderDataBot">
      <div class="itemDisplayGearRank"></div>
    </div>
  </div>
</div>
<div class="itemDisplaySubstats">
</div>
<div class="itemDisplayFooter">
</div>
            `
        }

        ItemAugmenter.augment([item])

        const main = statToText(item.main, baseStats, item);
        const substat0 = statToText(item.substats[0], baseStats, item);
        const substat1 = statToText(item.substats[1], baseStats, item);
        const substat2 = statToText(item.substats[2], baseStats, item);
        const substat3 = statToText(item.substats[3], baseStats, item);

        const score = wssToText(item);

        const color = colorsByRank[item.rank];
        const gearImage = Assets.getGearAsset(item.gear);
        const setImage = Assets.getSetAsset(item.set);

        const heroImage = getHeroImage(item);

        const materialImage = getMaterialImage(item);

        const html = `
<div class="itemDisplayHeader">
  <img src="${gearImage}" class="gearTypeImg" ${styleForImage(item.rank)}></img>
  <div class="itemDisplayHeaderData">
    <div class="itemDisplayHeaderDataTop">
      <div class="itemDisplayLevel" ${styleEnhance(item.enhance)}>+${item.enhance}</div>
    </div>
    <div class="itemDisplayHeaderDataTop">
      <div class="itemDisplayLevel" ${styleLevel(item)}>${item.level}</div>
    </div>
  </div>
  <img src="${materialImage}" class="itemDisplayMaterial"></img>
  <img src="${heroImage}" class="itemDisplayEquippedHero"></img>
</div>
<div class="itemDisplayMainStat">
  <div class="itemDisplayMainType">${main.type}</div>
  <div class="itemDisplayMainValue">${main.value}</div>
</div>
<div class="itemDisplaySubstats">
  <div class="itemDisplaySubstat">
    <div class="itemDisplaySubstatType">${substat0.type}</div>
    <div class="itemDisplaySubstatValue">${substat0.value}</div>
  </div>
  <div class="itemDisplaySubstat">
    <div class="itemDisplaySubstatType">${substat1.type}</div>
    <div class="itemDisplaySubstatValue">${substat1.value}</div>
  </div>
  <div class="itemDisplaySubstat">
    <div class="itemDisplaySubstatType">${substat2.type}</div>
    <div class="itemDisplaySubstatValue">${substat2.value}</div>
  </div>
  <div class="itemDisplaySubstat">
    <div class="itemDisplaySubstatType">${substat3.type}</div>
    <div class="itemDisplaySubstatValue">${substat3.value}</div>
  </div>
  <div class="horizontalLine"></div>
  <div class="itemDisplaySubstat">
    <div class="itemDisplaySubstatType">Score</div>
    <div class="itemDisplaySubstatValue">${score}</div>
  </div>
</div>
<div class="itemDisplayFooter">
  <div class="itemDisplayFooterIconContainer">
      <input type="checkbox" class="itemPreviewCheckbox" id="${checkboxPrefix + item.gear}" checked>
      <div class="itemDisplayFooterSet">
        <img src="${setImage}" class="itemDisplaySetImg"></img>
      </div>
  </div>
  <div class="itemDisplayFooterIconContainer">
      ${editItemDisplay(item)}
      ${editLockDisplay(item)}
  </div>
</div>
        `
        return html;
    }
}

function getMaterialImage(item) {
    if (!item.material || item.material == "Unknown") {
        return Assets.getBlank();
    }

    if (item.material == "Conversion") {
        return "./assets/reforgeConversion.png";
    }

    if (item.material == "Hunt") {
        return huntImageBySet[item.set]
    }

    return Assets.getBlank();
}

const huntImageBySet = {
    HealthSet: "./assets/reforgeG.png",
    DefenseSet: "./assets/reforgeG.png",
    AttackSet: "./assets/reforgeG.png",
    SpeedSet: "./assets/reforgeW.png",
    CriticalSet: "./assets/reforgeW.png",
    HitSet: "./assets/reforgeW.png",
    DestructionSet: "./assets/reforgeB.png",
    LifestealSet: "./assets/reforgeB.png",
    CounterSet: "./assets/reforgeB.png",
    ResistSet: "./assets/reforgeB.png",
    UnitySet: "./assets/reforgeA.png",
    RageSet: "./assets/reforgeA.png",
    ImmunitySet: "./assets/reforgeA.png",
    RevengeSet: "./assets/reforgeC.png",
    InjurySet: "./assets/reforgeC.png",
    PenetrationSet: "./assets/reforgeC.png",
}

function editItemDisplay(item) {
    if (Reforge.isReforgeableNow(item)) {
        return `<img src="${Assets.getEdit()}"    class="itemDisplayEditImg" onclick='OptimizerTab.editGearFromIcon("${item.id}", false)'></img>
                <img src="${Assets.getReforge()}" class="itemDisplayEditImg" onclick='OptimizerTab.editGearFromIcon("${item.id}", true)'></img>`
    }
    return `<img src="${Assets.getEdit()}" class="itemDisplayEditImg" onclick='OptimizerTab.editGearFromIcon("${item.id}")'></img>`
}

function styleEnhance(enhance) {
    if (enhance != "15") {
        return 'style="color: red;font-weight: bold;"'
    }
}

function editLockDisplay(item) {
    if (!item.locked) {
        return `<img src="${Assets.getLock()}" style="opacity:0.1" class="itemDisplayLockImgTransparent" onclick='OptimizerTab.lockGearFromIcon("${item.id}")'}></img>`
    }
    return `<img src="${Assets.getLock()}" class="itemDisplayLockImg" onclick='OptimizerTab.lockGearFromIcon("${item.id}")'}></img>`
}

function styleLevel(item) {
    if (Reforge.isReforgeable(item)) {
        return 'style="color: #00b306;font-weight: bold;"'
    }
}

function styleForImage(rank) {
    if (rank == "Epic")
        return 'style="border: solid 2px #a20707;background: #ff58588a;"'
    if (rank == "Heroic")
        return 'style="border: solid 2px #ca56ff;background: #eda6ff99;"'
    if (rank == "Rare")
        return 'style="border: solid 2px #1722f9;background: #6db5ffab;"'
    if (rank == "Good")
        return 'style="border: solid 2px #009208;background: #93ffaaab;"'
    if (rank == "Normal")
        return 'style="border: solid 2px #616161;background: #d2d4d2ab;"'
    return "";
}
