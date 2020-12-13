function handlePercent(stat) {
    if (!stat) {
        return {
            type: '',
            value: ''
        }
    }

    const unpercentedStat = stat.type.match(/[A-Z][a-z]+/g).filter(x => x != 'Percent').join(' ');
    const percentedValue = stat.type.includes('Percent') ? stat.value + "%" : stat.value;
    
    return {
        type: unpercentedStat,
        value: percentedValue
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
        return "https://i.imgur.com/IuUKPRw.png"; // blank transparent

    const data = HeroData.getHeroExtraInfo(heroName);
    return data.assets.icon;
}

module.exports = {
    initialize: () => {
        module.exports.buildFilterSetsBar();
        module.exports.buildFilterGearBar();
    },

    buildFilterSetsBar: () => {
        const clearUrl = "https://i.imgur.com/NI8rtdF.png"; // black x
        const html = buildFilter("ClearSets", clearUrl, true);
        document.getElementById('setsFilterBar').innerHTML += html;

        const assetsBySet = Assets.getAssetsBySet();
        for (var set of Object.keys(assetsBySet)) {
            const url = assetsBySet[set];
            const html = buildFilter(set, url, false);

            document.getElementById('setsFilterBar').innerHTML += html;
        }
    },

    buildFilterGearBar: () => {
        const clearUrl = "https://i.imgur.com/NI8rtdF.png"; // black x
        const html = buildFilter("ClearGears", clearUrl, true);
        document.getElementById('gearFilterBar').innerHTML += html;

        const assetsByGear = Assets.getAssetsByGear();
        for (var gear of Object.keys(assetsByGear)) {
            const url = assetsByGear[gear];
            const html = buildFilter(gear, url, false);

            document.getElementById('gearFilterBar').innerHTML += html;
        }
    },

    buildItemPanel(item, checkboxPrefix) {
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
<div class="itemDisplayMainStat">
  <div class="itemDisplayMainType"></div>
  <div class="itemDisplayMainValue"></div>
</div>
<div class="itemDisplaySubstats">
</div>
<div class="itemDisplayFooter">
</div>
            `
        }
        console.log("!!", item)
        const main = handlePercent(item.main);
        const substat0 = handlePercent(item.substats[0]);
        const substat1 = handlePercent(item.substats[1]);
        const substat2 = handlePercent(item.substats[2]);
        const substat3 = handlePercent(item.substats[3]);

        const color = colorsByRank[item.rank];
        const gearImage = Assets.getGearAsset(item.gear);
        const setImage = Assets.getSetAsset(item.set);

        const heroImage = getHeroImage(item);


        const html = `
<div class="itemDisplayHeader">
  <img src="${gearImage}" class="gearTypeImg"></img>
  <div class="itemDisplayHeaderData">
    <div class="itemDisplayHeaderDataTop">
      <div class="itemDisplayLevel">+${item.enhance}, level ${item.level}</div>
    </div>
    <div class="itemDisplayHeaderDataBot">
      <div class="itemDisplayGearRank" style='color: ${color}'>${item.rank}</br>${item.gear}</div>
    </div>
  </div>
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
    <div class="itemDisplaySetType">${item.set}</div>
  </div>
  <input type="checkbox" id="${checkboxPrefix + item.gear}" checked>
</div>
        `
        return html;
    }
}
