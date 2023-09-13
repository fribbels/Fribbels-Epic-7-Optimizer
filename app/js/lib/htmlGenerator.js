const stringSimilarity = require('string-similarity');

const tippy = require('tippy.js').default;

tippy.setDefaultProps({
    allowHTML: true,
    placement: 'auto',
    maxWidth: 550,
});

function isItemModded(item) {
    return item.substats.filter(x => x.modified).length > 0;
}

function statToText(stat, baseStats, item, checkboxPrefix, showMaxSpeed) {
    if (!stat) {
        return {
            type: '',
            value: ''
        }
    }

    var unpercentedStat = shortenStats(stat.type);
    var value;

    if (Reforge.isReforgeable(item) && stat.modified && (stat.originalType)) {
        value = stat.type.includes('Percent') ? stat.value + "%" : getPercentageEquivalent(stat, baseStats, false);
    } else if (item.alreadyPredictedReforge || !Reforge.isReforgeable(item)) {
        value = stat.type.includes('Percent') ? stat.reforgedValue + "%" : getPercentageEquivalent(stat, baseStats, false);
    } else {
        const unreforgedValue = stat.type.includes('Percent') ? stat.value + "%" : stat.value;
        const reforgedValue = stat.type.includes('Percent') ? stat.reforgedValue + "%" : getPercentageEquivalent(stat, baseStats, true);

        value = unreforgedValue + " ➤ " + reforgedValue
    }

    // Keep the modified text the same for basic case
    var modifiedStat = unpercentedStat;
    var reforge = Reforge.isReforgeable(item) || item.level == 90;
    var rolls = stat.rolls;

    const modifier = ItemsTab.getCurrentModifier();

    // Unless the modified text needs to be displayed
    if (modifier.grade && modifier.stat && stat.rolls) {
        // console.log(stat)
        // console.log(modifiedStat)
        // console.log(modValues['reforged'][modifier.grade])
        // console.log(modValues['reforged'][modifier.grade][modifiedStat])
        // console.log(modValues['reforged'][modifier.grade][modifiedStat][stat.rolls])


        // Make it easier to read
        modifiedStat = shortenStats(modifier.stat);
    }
    // console.log(modifier.grade, modifier.stat, stat.rolls, item, item.level)

    if (stat.type == "Speed" && item.enhance != 15 && showMaxSpeed === true) {
        var speedStats = item.substats.filter(x => x.type == "Speed")
        var roundedEnhance = Math.floor(item.enhance / 3) * 3;
        var maxSpeed = 0;
        if (speedStats.length > 0) {
            var speedStat = speedStats[0];
            var rolls = speedStat.rolls;
            var enhance = item.enhance;
            var rollsLeft = Math.ceil(15 - item.enhance)/3;

            var potentialRolls = Constants.speedByItemTypeAlreadyRolled[item.rank][roundedEnhance];

            var reforgedValue = item.level == 90 ? speedStat.value : speedStat.reforgedValue;

            console.warn(reforgedValue)
            console.warn(Constants.speedRollsToValue[potentialRolls + rolls] - Constants.speedRollsToValue[rolls])
            console.warn("------------------------")
            maxSpeed = reforgedValue + potentialRolls * 4 + (item.level == 85 ? Constants.speedRollsToValue[potentialRolls + rolls] - Constants.speedRollsToValue[rolls] : 0);
        } else {
            var potentialRolls = Constants.speedByItemTypeNotYetRolled[item.rank][roundedEnhance];
            maxSpeed = potentialRolls * 4 + (item.level == 85 ? Constants.speedRollsToValue[potentialRolls] : 0);

            console.warn(potentialRolls)
            console.warn(Constants.speedRollsToValue[potentialRolls])
            console.warn("------------------------")
        }

        unpercentedStat = unpercentedStat + "  (Max: " + maxSpeed + ")";
    }

    return {
        type: unpercentedStat,
        value: value,
        modifiedStat: modifiedStat,
        reforge: reforge,
        rolls: rolls
    }
}

function rateBaseScore(stats, baseStats) {
    const atkScore = (stats.AttackPercent + (stats.Attack / baseStats.atk * 100));
    const hpScore = (stats.HealthPercent  + (stats.Health / baseStats.hp * 100));
    const defScore = (stats.DefensePercent + (stats.Defense / baseStats.def * 100));
    const spdScore = (stats.Speed) * 2;
    const crScore = (stats.CriticalHitChancePercent) * 8/5;
    const cdScore = (stats.CriticalHitDamagePercent) * 8/7;
    const effScore = (stats.EffectivenessPercent);
    const resScore = (stats.EffectResistancePercent);
    const score = atkScore + hpScore + defScore + spdScore + crScore + cdScore + effScore + resScore;

    return score;
}

function hasFlat(item) {
    for (var substat of item.substats) {
        if (substat.type == "Defense" || substat.type == "Attack" || substat.type == "Health") {
            return true;
        }
    }
    return false;
}

function wssToText(item) {
    // console.warn("WSS TO TEXT", item)
    if (item.equippedByName && hasFlat(item)) {
        const baseStats = HeroData.getBaseStatsByName(item.equippedByName).lv60SixStarFullyAwakened;
        baseStats.atk = baseStats.bonusStats.overrideAtk || baseStats.atk;
        baseStats.hp = baseStats.bonusStats.overrideHp || baseStats.hp;
        baseStats.def = baseStats.bonusStats.overrideDef || baseStats.def;

        const score = Math.round(rateBaseScore(item.augmentedStats, baseStats))
        const reforgedScore = Math.round(rateBaseScore(item.reforgedStats, baseStats))

        if (Reforge.isReforgeable(item)) {
            if (isItemModded(item) && item.substats.filter(x => x.originalType).length > 0) {
                return `${item.reforgedWss} (${reforgedScore})`;
            } else {
                return `${item.wss} (${score}) ➤ ${item.reforgedWss} (${reforgedScore})`;
            }
        } else {
            return `${item.wss} (${score})`
        }
    } else {
        if (Reforge.isReforgeable(item)) {
            if (isItemModded(item) && item.substats.filter(x => x.originalType).length > 0) {
                return item.reforgedWss;
            } else {
                return item.wss + " ➤ " + item.reforgedWss;   
            }
        } else {
            return item.wss
        }
    }
}

function shortenStats(stat) {
    const statType = stat.match(/[A-Z][a-z]+/g).filter(x => x != 'Percent').join(' ');

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
    modify: (location, hover, originalStat, originalValue, reforge, rolls, index) => {
        if (location != 'itemsGrid') {
            return;
        }
        const modifier = ItemsTab.getCurrentModifier();
        var displayStat = originalStat;
        var displayValue = originalValue;

        reforge = reforge ? 'reforged' : 'unreforged'

        const needsChange = hover && rolls && modifier.stat;

        if (needsChange) {
            // console.log(modifier, hover, originalStat, originalValue, reforge, rolls, index)
            const rollIndex = rolls ? rolls - 1 : 0;
            var mod = Constants.modValues[reforge][modifier.grade][modifier.stat][rollIndex];
            var isPercent = modifier.stat.includes('Percent');
            var start = "" + mod[0] + (isPercent ? "%" : "")
            var end = "" + mod[1] + (isPercent ? "%" : "")



            displayStat = hover ? shortenStats(modifier.stat) : originalStat;
            displayValue = "" + start + " - " + end;
        } else {

        }

        $('#itemsGridItemDisplaySubstatType' + index).html(i18next.t(displayStat));
        $('#itemsGridItemDisplaySubstatValue' + index).html(displayValue);

        if (needsChange) {
            $('#itemsGridItemDisplaySubstatType' + index).css({ 'text-decoration': 'underline', 'font-weight': 'bold' });
            $('#itemsGridItemDisplaySubstatValue' + index).css({ 'text-decoration': 'underline', 'font-weight': 'bold' });
        } else {
            $('#itemsGridItemDisplaySubstatType' + index).css({ 'text-decoration': 'none', 'font-weight': 'unset' });
            $('#itemsGridItemDisplaySubstatValue' + index).css({ 'text-decoration': 'none', 'font-weight': 'unset' });
        }
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

    buildItemPanel(item, checkboxPrefix, baseStats, mods) {
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

        const main = statToText(item.main, baseStats, item, checkboxPrefix);
        const substat0 = statToText(item.substats[0], baseStats, item, checkboxPrefix);
        const substat1 = statToText(item.substats[1], baseStats, item, checkboxPrefix);
        const substat2 = statToText(item.substats[2], baseStats, item, checkboxPrefix);
        const substat3 = statToText(item.substats[3], baseStats, item, checkboxPrefix);

        const score = wssToText(item);

        const color = colorsByRank[item.rank];
        const gearImage = Assets.getGearAsset(item.gear);
        const setImage = Assets.getSetAsset(item.set);

        const heroImage = getHeroImage(item);

        const materialImage = getMaterialImage(item);

        var html = `
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
  <div class="itemDisplayMainType">${i18next.t(main.type)}</div>
  <div class="itemDisplayMainValue">${main.value}</div>
</div>
<div class="itemDisplaySubstats">
  <div class="itemDisplaySubstat" onmouseover="HtmlGenerator.modify('${checkboxPrefix}', true, '${substat0.modifiedStat}', '${substat0.value}', ${substat0.reforge}, ${substat0.rolls}, 0)" onmouseout="HtmlGenerator.modify('${checkboxPrefix}', false, '${substat0.type}', '${substat0.value}', '${substat0.value}', '${substat0.value}', 0)">
    <div class="itemDisplaySubstatValueAndConversion">
        <div class="itemDisplaySubstatType" id="${checkboxPrefix}ItemDisplaySubstatType0">${i18next.t(substat0.type)}</div>
        ${generateSubstatConversionImage(item, 0)}
    </div>
    <div class="itemDisplaySubstatValue" id="${checkboxPrefix}ItemDisplaySubstatValue0">${substat0.value}</div>
  </div>
  <div class="itemDisplaySubstat" onmouseover="HtmlGenerator.modify('${checkboxPrefix}', true, '${substat1.modifiedStat}', '${substat1.value}', ${substat1.reforge}, ${substat1.rolls}, 1)" onmouseout="HtmlGenerator.modify('${checkboxPrefix}', false, '${substat1.type}', '${substat1.value}', '${substat1.value}', '${substat1.value}', 1)">
    <div class="itemDisplaySubstatValueAndConversion">
        <div class="itemDisplaySubstatType" id="${checkboxPrefix}ItemDisplaySubstatType1">${i18next.t(substat1.type)}</div>
        ${generateSubstatConversionImage(item, 1)}
    </div>
    <div class="itemDisplaySubstatValue" id="${checkboxPrefix}ItemDisplaySubstatValue1">${substat1.value}</div>
  </div>
  <div class="itemDisplaySubstat" onmouseover="HtmlGenerator.modify('${checkboxPrefix}', true, '${substat2.modifiedStat}', '${substat2.value}', ${substat2.reforge}, ${substat2.rolls}, 2)" onmouseout="HtmlGenerator.modify('${checkboxPrefix}', false, '${substat2.type}', '${substat2.value}', '${substat2.value}', '${substat2.value}', 2)">
    <div class="itemDisplaySubstatValueAndConversion">
        <div class="itemDisplaySubstatType" id="${checkboxPrefix}ItemDisplaySubstatType2">${i18next.t(substat2.type)}</div>
        ${generateSubstatConversionImage(item, 2)}
    </div>
    <div class="itemDisplaySubstatValue" id="${checkboxPrefix}ItemDisplaySubstatValue2">${substat2.value}</div>
  </div>
  <div class="itemDisplaySubstat" onmouseover="HtmlGenerator.modify('${checkboxPrefix}', true, '${substat3.modifiedStat}', '${substat3.value}', ${substat3.reforge}, ${substat3.rolls}, 3)" onmouseout="HtmlGenerator.modify('${checkboxPrefix}', false, '${substat3.type}', '${substat3.value}', '${substat3.value}', '${substat3.value}', 3)">
    <div class="itemDisplaySubstatValueAndConversion">
        <div class="itemDisplaySubstatType" id="${checkboxPrefix}ItemDisplaySubstatType3">${i18next.t(substat3.type)}</div>
        ${generateSubstatConversionImage(item, 3)}
    </div>
    <div class="itemDisplaySubstatValue" id="${checkboxPrefix}ItemDisplaySubstatValue3">${substat3.value}</div>
  </div>
  <div class="horizontalLine"></div>
  <div class="itemDisplaySubstat">
    <div class="itemDisplaySubstatType">${i18next.t("Score")}</div>
    <div class="itemDisplaySubstatValue">${score}</div>
  </div>
</div>
<div class="itemDisplayFooter">
  <div class="itemDisplayFooterIconContainer">
      ${checkboxPrefix == "itemsGrid" || checkboxPrefix == "enhanceTab" ? "" : `<input type="checkbox" class="itemPreviewCheckbox" id="${checkboxPrefix + item.gear}" checked>`}
      <div class="itemDisplayFooterSet">
        <img src="${setImage}" class="itemDisplaySetImg"></img>
      </div>
  </div>
  <div class="itemDisplayFooterIconContainer">
      ${storage(item)}
      ${locate(item, checkboxPrefix)}
      ${magnify(item, checkboxPrefix)}
      ${editItemDisplay(item, checkboxPrefix)}
      ${editLockDisplay(item, checkboxPrefix)}
  </div>
</div>
        `

//         if (checkboxPrefix == "itemsGrid") {
//             html +=
// `
// Possible score range: 10 - 22</br>
// Actual score: 15</br>
// Percentage: 56%</br>
// `
//         }

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
    ProtectionSet: "./assets/reforgeG.png",
    CounterSet: "./assets/reforgeB.png",
    ResistSet: "./assets/reforgeB.png",
    UnitySet: "./assets/reforgeA.png",
    RageSet: "./assets/reforgeA.png",
    ImmunitySet: "./assets/reforgeA.png",
    RevengeSet: "./assets/reforgeC.png",
    InjurySet: "./assets/reforgeC.png",
    PenetrationSet: "./assets/reforgeC.png",
    TorrentSet: "./assets/reforgeC.png",
}


function magnify(item, checkboxPrefix) {
    return `<img src="${Assets.getMagnify()}" class="itemDisplayEditImg" onclick='EnhancingTab.redrawEnhanceGuideFromRemoteId("${item.id}")'></img>`
}

function locate(item, checkboxPrefix) {
    return `<img src="${Assets.getLocate()}" class="itemDisplayEditImg locateTooltip${checkboxPrefix}" data-itemId="${item.ingameId}" onclick='Locator.locate("${item.ingameId}", "locateTooltip${checkboxPrefix}")'></img>`
}

function storage(item) {
    const storage = item.storage;
    if (!storage)
        return ""; // blank transparent

    return `<img src="${Assets.getStorage()}" class="itemDisplayEditImg"></img>`
}

function editItemDisplay(item, checkboxPrefix) {
    // if (checkboxPrefix == "enhanceTab") {
    //     return '';
    // }

    if (Reforge.isReforgeableNow(item)) {
        return `<img src="${Assets.getEdit()}"    class="itemDisplayEditImg" onclick='OptimizerTab.editGearFromIcon("${item.id}", false, "${checkboxPrefix}")'></img>
                <img src="${Assets.getReforge()}" class="itemDisplayEditImg" onclick='OptimizerTab.editGearFromIcon("${item.id}", true, "${checkboxPrefix}")'></img>`
    }
    return `<img src="${Assets.getEdit()}" class="itemDisplayEditImg" onclick='OptimizerTab.editGearFromIcon("${item.id}", false, "${checkboxPrefix}")'></img>`
}

function styleEnhance(enhance) {
    if (enhance != "15") {
        return 'style="color: red;font-weight: bold;"'
    }
}

function editLockDisplay(item, checkboxPrefix) {
    // if (checkboxPrefix == "enhanceTab") {
    //     return '';
    // }

    if (!item.locked) {
        return `<img src="${Assets.getLock()}" style="opacity:0.12" class="itemDisplayLockImgTransparent" onclick='OptimizerTab.lockGearFromIcon("${item.id}", "${checkboxPrefix}")'}></img>`
    }
    return `<img src="${Assets.getLock()}" class="itemDisplayLockImg" onclick='OptimizerTab.lockGearFromIcon("${item.id}", "${checkboxPrefix}")'}></img>`
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

function generateSubstatConversionImage(item, index) {
    const substat = item.substats[index];
    // if (substat.isConverted) {
    if (substat && substat.modified) {
        if (substat.originalType) {
            return `<img src="${Assets.getAssetByStat(substat.originalType)}" class="substatConvertedImage"></img>`;
        }
        return `<img src="${Assets.getCycle()}" class="substatConvertedImage"></img>`;
    } else {
        // return `<img src="${Assets.getCycle()}" class="substatConvertedImage" style='opacity:0.25'></img> `;
        return ''
    }
}
