var table;
var heroesById = {};
var grid;


function onRowSelected(event) {
    console.log("onRowSelected", event);
    if (event.node.selected) {
        const hero = Object.values(heroesById)[event.rowIndex];

        console.log(hero);
        const equipped = hero.equipped;

        for (var i = 0; i < 6; i++) {
            const gear = equipped[i];
            const displayId = gearDisplayIdByIndex[i];
            if (!gear) {
                document.getElementById(displayId).innerHTML = "";    
                continue;
            }

            const html = HtmlGenerator.buildItemPanel(gear, "heroPanel")
            document.getElementById(displayId).innerHTML = html;
        }
    }
}

module.exports = {

    getAllHeroes: () => {
        return heroesById;
    },

    getHeroById: (id) => {
        return heroesById[id];
    },

    equipGearOnHero: async (id, gears) => {
        const hero = heroesById[id];

        for (var gear of gears) {
            const gearIndex = indexByGearType[gear.gear];
            const realGear = Db.getItemById(gear.id); // Retrieve real version

            // Unlink the unequipped gear from the new owner
            const previousGear = hero.equipped[gearIndex];
            if (previousGear) {
                delete previousGear.equippedHero;
            }

            // Unlink the equipped gear from its previous owner
            if (realGear.equippedHero) {
                const previousHeroId = realGear.equippedHero;
                const previousHero = heroesById[previousHeroId]
                console.log("Previous Gear", previousGear)
                console.log("Previous Hero", previousHero)
                previousHero.equipped[gearIndex] = null;     
                console.log("Previous Gear", previousGear)
                console.log("Previous Hero", previousHero)               
            }

            // Equip
            hero.equipped[gearIndex] = realGear;
            realGear.equippedHero = id;
        }
    },

    addHero: (heroName) => {
        const allHeroData = HeroData.getAllHeroData();
        const heroData = allHeroData[heroName];
        const id = new Date().getTime();

        heroesById[id] = {
            id: id,
            name: heroName,
            data: JSON.parse(JSON.stringify(heroData)),
            equipped: new Array(6)
        }

        // Clear options
        module.exports.redraw();
        module.exports.redrawHeroInputSelector();
    },

    redrawHeroInputSelector: () => {
        clearOptions("inputHeroAdd");
        const optimizerHeroSelector = document.getElementById('inputHeroAdd')

        // Re-add options
        for (var id of Object.keys(heroesById)) {
            const hero = heroesById[id];

            console.log("DEBUG", hero)
            const option = document.createElement('option');
            option.innerHTML = hero.name;
            option.value = hero.id;
                
            optimizerHeroSelector.add(option);
        }
    },

    initialize: () => {
        const gridOptions = {
            defaultColDef: {
                width: 50,
                sortable: true,
                sortingOrder: ['desc', 'asc'],
                // valueFormatter: numberFormatter,
            },

            columnDefs: [
                {headerName: 'Name', field: 'data.name', width: 100},
                {headerName: 'Stars', field: 'data.rarity', width: 50},
                {headerName: 'Element', field: 'data.attribute', width: 70, filter: 'agTextColumnFilter', filterParams: {
                    comparator: function(arg1, arg2, arg3) {
                        console.log(arg1, arg2, arg3);
                        // var dateAsString = cellValue;
                        // var dateParts = dateAsString.split("/");
                        // var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

                        // if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                        //     return 0;
                        // }

                        // if (cellDate < filterLocalDateAtMidnight) {
                        //     return -1;
                        // }

                        // if (cellDate > filterLocalDateAtMidnight) {
                        //     return 1;
                        // }
                    }
                }},
                {headerName: 'Class', field: 'data.role', width: 100},
                {headerName: 'Sets', field: 'cr'},
                {headerName: 'Atk', field: 'cd'},
                {headerName: 'Spd', field: 'eff'},
                {headerName: 'Cr', field: 'res'},
                {headerName: 'Cd', field: 'dac'},
                {headerName: 'Hp', field: ''},
                {headerName: 'Hp/spd', field: ''},
                {headerName: 'Def', field: ''},
                {headerName: 'Res', field: ''},
                {headerName: 'Dac', field: ''},
                {headerName: 'Ehp', field: ''},
                {headerName: 'Ehp/spd', field: ''},
                {headerName: 'Dmg', field: ''},
                {headerName: 'Dmg/spd', field: ''},
            ],
            // rowModelType: 'infinite',
            // pagination: true,
            // paginationPageSize: 100,
            rowSelection: 'single',
            rowData: Object.values(heroesById),
            onRowSelected: onRowSelected,
        };

        let gridDiv = document.getElementById('heroes-table');
        grid = new Grid(gridDiv, gridOptions);
        console.log("!!!!!", grid);
        document.getElementById('addHeroesSubmit').addEventListener("click", async () => {
            console.log("SUBMIT");
            const id = selector.value;
            module.exports.addHero(id)
        });

        const selector = document.getElementById('addHeroesSelector')
        const allHeroData = HeroData.getAllHeroData();
        const names = Object.keys(allHeroData);

        console.log(names)
        console.log(allHeroData)

        for (var name of names) {
            const hero = allHeroData[name];
            const option = document.createElement('option');
            option.innerHTML = name;
            option.value = name;
            selector.add(option);
        }

        module.exports.addHero('Angelica');
        module.exports.redraw();
    },

    redraw: () => {
        console.log("Redraw heroes");
        const heroesArr = Object.keys(heroesById).map(id => heroesById[id]);
        grid.gridOptions.api.setRowData(heroesArr)
    },
}

function clearOptions(id) {
    var select = document.getElementById(id);
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
      select.options[i] = null;
    }
}
 

function filterTest(params) {
    console.log(params);
}