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

    if (item.level == 85 && item.enhance == 15) {
        const unreforgedValue = stat.type.includes('Percent') ? stat.value + "%" : stat.value;
        const reforgedValue = stat.type.includes('Percent') ? stat.reforgedValue + "%" : stat.reforgedValue;

        value = unreforgedValue + " ⯈ " + reforgedValue
    } else {
        value = stat.type.includes('Percent') ? stat.value + "%" : getPercentageEquivalent(stat, baseStats);
    }


    return {
        type: unpercentedStat,
        value: value
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

function getPercentageEquivalent(stat, baseStats) {
    if (stat.type == "Health") {
        var num = stat.value/baseStats.hp*100;
        return stat.value + ` (${Math.round(num)}%)`;
    }
    if (stat.type == "Defense") {
        var num = stat.value/baseStats.def*100;
        return stat.value + ` (${Math.round(num)}%)`;
    }
    if (stat.type == "Attack") {
        var num = stat.value/baseStats.atk*100;
        return stat.value + ` (${Math.round(num)}%)`;
    }
    if (stat.type == "Speed") {
        return stat.value;
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
    initialize: () => {
        module.exports.buildFilterSetsBar();
        module.exports.buildFilterGearBar();
        module.exports.buildFilterLevelBar();
    },

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

        Reforge.getReforgeStats(item);

        const main = statToText(item.main, baseStats, item);
        const substat0 = statToText(item.substats[0], baseStats, item);
        const substat1 = statToText(item.substats[1], baseStats, item);
        const substat2 = statToText(item.substats[2], baseStats, item);
        const substat3 = statToText(item.substats[3], baseStats, item);

        const color = colorsByRank[item.rank];
        const gearImage = Assets.getGearAsset(item.gear);
        const setImage = Assets.getSetAsset(item.set);

        const heroImage = getHeroImage(item);


        const html = `
<div class="itemDisplayHeader">
  <img src="${gearImage}" class="gearTypeImg" ${styleForImage(item.rank)}></img>
  <div class="itemDisplayHeaderData">
    <div class="itemDisplayHeaderDataTop">
      <div class="itemDisplayLevel" ${styleEnhance(item.enhance)}>+${item.enhance}</div>
    </div>
    <div class="itemDisplayHeaderDataTop">
      <div class="itemDisplayLevel" ${styleLevel(item.level)}>${item.level}</div>
    </div>
  </div>
  <img src="${Assets.getLock()}" class="itemDisplayLockImg" ${styleLocked(item.locked)}></img>
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
</div>
<div class="itemDisplayFooter">
  <div class="itemDisplayFooterSet">
    <img src="${setImage}" class="itemDisplaySetImg"></img>
    <div class="itemDisplaySetType">${item.set.replace("Set", "")}</div>
  </div>
  <div class="itemDisplayFooterIconContainer">
      <input type="checkbox" class="itemPreviewCheckbox" id="${checkboxPrefix + item.gear}" checked>
  </div>
</div>
        `
        return html;
    }
}

function editItem() {
      // <img src="${Assets.getEdit()}" class="itemDisplayEditImg"></img>
}

function styleEnhance(enhance) {
    if (enhance != "15") {
        return 'style="color: red;font-weight: bold;"'
    }
}

function styleLocked(locked) {
    if (!locked) {
        return 'style="opacity:0"'
    }
}

function styleLevel(level) {
    if (level == "85") {
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
