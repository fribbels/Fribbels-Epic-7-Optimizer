var heroesGrid;
var currentHeroes = [];

module.exports = {

    initialize: () => {
        buildGrid();
    },

    refresh: (heroes) => {
        currentHeroes = heroes;
        heroesGrid.gridOptions.api.setRowData(heroes)
        heroesGrid.gridOptions.api.redrawRows();
    },

    getSelectedRow: () => {
        const selectedRows = heroesGrid.gridOptions.api.getSelectedRows();
        if (selectedRows.length > 0) {
            const row = selectedRows[0];
            console.log("SELECTED ROW", row)
            return row;
        }
        return null;
    },
}

function buildGrid(heroes) {
    const gridOptions = {
        defaultColDef: {
            width: 50,
            sortable: true,
            sortingOrder: ['desc', 'asc'],
        },

        columnDefs: [
            {headerName: 'icon', field: 'name', width: 60, cellRenderer: (params) => renderIcon(params.value)},
            {headerName: 'element', field: 'attribute', width: 70, cellRenderer: (params) => renderElement(params.value)},
            {headerName: 'name', field: 'name', width: 130},
            // {headerName: 'Stars', field: 'rarity', width: 50},
            // {headerName: 'Class', field: 'role', width: 100, cellRenderer: (params) => renderClass(params.value)},
            {headerName: 'sets', field: 'equipment', width: 85, cellRenderer: (params) => renderSets(params.value)},
            {headerName: 'atk', field: 'atk'},
            {headerName: 'hp', field: 'hp'},
            {headerName: 'def', field: 'def'},
            {headerName: 'spd', field: 'spd'},
            {headerName: 'cr', field: 'cr'},
            {headerName: 'cd', field: 'cd'},
            {headerName: 'eff', field: 'eff'},
            {headerName: 'res', field: 'res'},
            {headerName: 'cp', field: 'cp'},
            {headerName: 'hp*s', field: 'hpps'},
            {headerName: 'ehp', field: 'ehp'},
            {headerName: 'ehp*s', field: 'ehpps'},
            {headerName: 'dmg', field: 'dmg'},
            {headerName: 'dmg*s', field: 'dmgps'},
            {headerName: 'mdmg', field: 'mcdmg', width: 55},
            {headerName: 'mdmg*s', field: 'mcdmgps', width: 55},
        ],
        rowSelection: 'single',
        rowData: heroes,
        rowHeight: 52,
        onRowSelected: onRowSelected,
    };

    const gridDiv = document.getElementById('heroes-table');
    heroesGrid = new Grid(gridDiv, gridOptions);
    console.log("HeroesGrid", heroesGrid);
}

function renderElement(element) {
    var file = Assets.getElementAsset(element);
    return `<img class='optimizerSetIcon' src='${file}'></img>`;

    // return {
    //     "light": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_promlight.png'></img>",
    //     "fire": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_profire.png'></img>",
    //     "ice": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_proice.png'></img>",
    //     "wind": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_proearth.png'></img>",
    //     "dark": "<img class='optimizerSetIcon' src='https://assets.epicsevendb.com/attribute/cm_icon_promdark.png'></img>",
    // }[element];
}

function renderSets(equipment) {
    console.log("EQUIPMENT", equipment);
    if (!equipment) return;

    const setNames = Object.values(equipment).map(x => x.set);
    const setCounters = [
        Math.floor(setNames.filter(x => x == "HealthSet").length),
        Math.floor(setNames.filter(x => x == "DefenseSet").length),
        Math.floor(setNames.filter(x => x == "AttackSet").length),
        Math.floor(setNames.filter(x => x == "SpeedSet").length),
        Math.floor(setNames.filter(x => x == "CriticalSet").length),
        Math.floor(setNames.filter(x => x == "HitSet").length),
        Math.floor(setNames.filter(x => x == "DestructionSet").length),
        Math.floor(setNames.filter(x => x == "LifestealSet").length),
        Math.floor(setNames.filter(x => x == "CounterSet").length),
        Math.floor(setNames.filter(x => x == "ResistSet").length),
        Math.floor(setNames.filter(x => x == "UnitySet").length),
        Math.floor(setNames.filter(x => x == "RageSet").length),
        Math.floor(setNames.filter(x => x == "ImmunitySet").length),
        Math.floor(setNames.filter(x => x == "PenetrationSet").length),
        Math.floor(setNames.filter(x => x == "RevengeSet").length),
        Math.floor(setNames.filter(x => x == "InjurySet").length)
    ]

    console.log("SETCOUNTERS", setCounters)

    const sets = [];
    for (var i = 0; i < setCounters.length; i++) {
        const setsFound = Math.floor(setCounters[i] / Constants.piecesBySetIndex[i]);
        for (var j = 0; j < setsFound; j++) {
            sets.push(Constants.setsByIndex[i]);
        }
    }

    const images = sets.map(x => '<img class="optimizerSetIcon" src=' + Assets.getSetAsset(x) + '></img>');
    // console.log("RenderSets images", images);
    return images.join("");
}

function renderIcon(name) {
    const url = HeroData.getHeroExtraInfo(name).assets.icon
    const image = '<img class="heroIcon" src=' + url + '></img>';
    return image;
}

function renderClass(value) {
    if (value == 'manauser')
        return 'Soul Weaver';
    if (value == 'mage')
        return 'Mage';
    if (value == 'ranger')
        return 'Ranger';
    if (value == 'knight')
        return 'Knight';
    if (value == 'warrior')
        return 'Warrior';
    if (value == 'assassin')
        return 'Thief';
    return value;
}

function onRowSelected(event) {
    console.log("onRowSelected", event);
    if (event.node.selected) {
        const heroId = event.data.id;

        Api.getHeroById(heroId).then(response => {
            const hero = response.hero;
            console.log(hero);

            const equipmentMap = hero.equipment ? hero.equipment : {};
            const equipment = [
                equipmentMap["Weapon"],
                equipmentMap["Helmet"],
                equipmentMap["Armor"],
                equipmentMap["Necklace"],
                equipmentMap["Ring"],
                equipmentMap["Boots"],
            ]

            for (var i = 0; i < 6; i++) {
                const gear = equipment[i];
                const displayId = Constants.gearDisplayIdByIndex[i];

                const html = HtmlGenerator.buildItemPanel(gear, "heroesGrid")
                document.getElementById(displayId).innerHTML = html;
            }
        })
    }
}