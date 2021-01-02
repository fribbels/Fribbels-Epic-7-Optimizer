const { v4: uuidv4 } = require('uuid');

module.exports = {
    initialize: () => {
        const selector = document.getElementById('addHeroesSelector')
        const allHeroData = HeroData.getAllHeroData();
        console.log("ALLHERODATA", allHeroData)
        const names = Object.keys(allHeroData).sort();

        console.log(names)

        for (var name of names) {
            const hero = allHeroData[name];
            const option = document.createElement('option');
            option.innerHTML = name;
            option.value = name;
            selector.add(option);
        }

        document.getElementById('heroPreviewSelectAll').addEventListener("click", () => {
            $('#heroesGridWeapon').prop('checked', true);
            $('#heroesGridHelmet').prop('checked', true);
            $('#heroesGridArmor').prop('checked', true);
            $('#heroesGridNecklace').prop('checked', true);
            $('#heroesGridRing').prop('checked', true);
            $('#heroesGridBoots').prop('checked', true);
        });
        document.getElementById('heroPreviewDeselectAll').addEventListener("click", () => {
            $('#heroesGridWeapon').prop('checked', false);
            $('#heroesGridHelmet').prop('checked', false);
            $('#heroesGridArmor').prop('checked', false);
            $('#heroesGridNecklace').prop('checked', false);
            $('#heroesGridRing').prop('checked', false);
            $('#heroesGridBoots').prop('checked', false);
        });

        document.getElementById('addHeroesSubmit').addEventListener("click", async () => {
            console.log("addHeroesSubmit");
            const id = selector.value;
            addHero(id);
        });

        document.getElementById('addHeroStatsSubmit').addEventListener("click", async () => {
            console.log("addHeroStatsSubmit");
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            // Api.removeHeroById(row.id).then(response => {
            //     console.log("RESPONSE", response)
            //     HeroesGrid.refresh(response.heroes)
            //     redrawHeroInputSelector();
            // });

            const bonusStats = await Dialog.editHeroDialog(row);
            console.log("Bonus stats", bonusStats, row.id);

            await Api.setBonusStats(bonusStats, row.id).then(module.exports.redraw);
            Notifier.success("Saved bonus stats");
            Saves.autoSave();
        });

        document.getElementById('removeHeroesSubmit').addEventListener("click", async () => {
            console.log("removeHeroesSubmit");
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            Api.removeHeroById(row.id).then(response => {
                console.log("RESPONSE", response)
                module.exports.redrawHeroInputSelector();
                redrawGrid();
                Saves.autoSave();
            });
        });

        document.getElementById('unequipHeroesSubmit').addEventListener("click", async () => {
            console.log("unequipHeroesSubmit", HeroesGrid.getSelectedRow());
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            Api.unequipItems(getSelectedGearIds()).then(response => {
                console.log("RESPONSE", response)
                redrawGrid();
                clearPreview();
                Saves.autoSave();
            })
        });

        document.getElementById('unlockHeroesSubmit').addEventListener("click", async () => {
            console.log("unlockHeroesSubmit", HeroesGrid.getSelectedRow());
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            // Api.unlockHeroById(row.id).then(response => {
            //     console.log("RESPONSE", response)
            //     HeroesGrid.refresh(response.heroes)
            //     redrawGrid();
            //     clearPreview();
            //     Saves.autoSave();
            // })

            Api.unlockItems(getSelectedGearIds()).then(response => {
                console.log("RESPONSE", response)
                redrawGrid();
                clearPreview();
                Saves.autoSave();
            })
        });

        document.getElementById('lockHeroesSubmit').addEventListener("click", async () => {
            console.log("lockHeroesSubmit", HeroesGrid.getSelectedRow());
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            // Api.lockHeroById(row.id).then(response => {
            //     console.log("RESPONSE", response)
            //     HeroesGrid.refresh(response.heroes)
            //     redrawGrid();
            //     clearPreview();
            //     Saves.autoSave();
            // })

            Api.lockItems(getSelectedGearIds()).then(response => {
                console.log("RESPONSE", response)
                redrawGrid();
                clearPreview();
                Saves.autoSave();
            })
        });

        document.getElementById('tab4label').addEventListener("click", () => {
            module.exports.redraw();
        });

        Api.getAllHeroes().then(response => {
            console.log("Heroes response", response);

            if (response.heroes.length == 0) {
                // addHero("Maid Chloe")
            } else {
                module.exports.redrawHeroInputSelector();
            }
            HeroesGrid.refresh(response.heroes);
        })
    },

    redrawHeroInputSelector: () => {
        OptimizerTab.redrawHeroSelector();
    },

    redraw: () => {
        redrawGrid();
    },

    getNewHeroByName: (heroName) => {
        const allHeroData = HeroData.getAllHeroData();
        const heroData = allHeroData[heroName];
        const id = uuidv4();
        const data = JSON.parse(JSON.stringify(heroData));

        return {
            id: id,
            name: heroName,
            data: data,
            equipped: new Array(6)
        }
    },
}

function getSelectedGear() {
    const row = HeroesGrid.getSelectedRow()
    if (!row || !row.equipment) return [];

    var results = [];
    if (row.equipment.Weapon && $('#heroesGridWeapon').prop('checked')) results.push(row.equipment.Weapon);
    if (row.equipment.Helmet && $('#heroesGridHelmet').prop('checked')) results.push(row.equipment.Helmet);
    if (row.equipment.Armor && $('#heroesGridArmor').prop('checked')) results.push(row.equipment.Armor);
    if (row.equipment.Necklace && $('#heroesGridNecklace').prop('checked')) results.push(row.equipment.Necklace);
    if (row.equipment.Ring && $('#heroesGridRing').prop('checked')) results.push(row.equipment.Ring);
    if (row.equipment.Boots && $('#heroesGridBoots').prop('checked')) results.push(row.equipment.Boots);

    return results;
}

function getSelectedGearIds() {
    return getSelectedGear().map(x => x.id);
}

function addHero(heroName) {
    const newHero = module.exports.getNewHeroByName(heroName);
    newHero.rarity = newHero.data.rarity;
    newHero.attribute = newHero.data.attribute;
    newHero.role = newHero.data.role;
    Api.addHeroes([newHero]).then(x => {
        module.exports.redrawHeroInputSelector();
        redrawGrid(newHero.id);
        Saves.autoSave();
    })
}

function redrawGrid(id) {
    Api.getAllHeroes().then(response => {
        HeroesGrid.refresh(response.heroes, id);
    });
}

function clearPreview() {
    for (var i = 0; i < 6; i++) {
        const displayId = Constants.gearDisplayIdByIndex[i];
        document.getElementById(displayId).innerHTML = "";
    }
}
