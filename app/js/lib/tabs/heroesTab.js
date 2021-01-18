const { v4: uuidv4 } = require('uuid');

module.exports = {
    initialize: () => {
        setupEventListeners();
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

        document.getElementById('heroesTabUseReforgedStats').addEventListener("change", async () => {
            console.log("CHANGE");
            redrawGrid();
            clearPreview();
            HeroesGrid.refreshBuilds();

        });

        document.getElementById('editBuildSubmit').addEventListener("click", async () => {
            console.log("editBuildSubmit");
            const row = HeroesGrid.getSelectedRow();

            const editedBuild = await Dialog.editBuildDialog();

            const existingBuild = HeroesGrid.getSelectedBuildRow();
            console.warn("EDITBUILD", editedBuild, existingBuild);
            if (!existingBuild) return;
            const buildName = editedBuild.buildName;

            existingBuild.name = buildName;

            Api.editBuild(row.id, existingBuild).then(x => {
                HeroesGrid.refreshBuilds();
                Saves.autoSave();
            })
        });

        document.getElementById('removeBuildSubmit').addEventListener("click", async () => {
            console.log("removeBuildSubmit");
            const row = HeroesGrid.getSelectedRow();
            const existingBuild = HeroesGrid.getSelectedBuildRow();

            console.warn("REMOVEBUILD", row, existingBuild);

            Api.removeBuild(row.id, existingBuild).then(x => {
                HeroesGrid.refreshBuilds();
                Saves.autoSave();
            })
        });

        document.getElementById('equipBuildSubmit').addEventListener("click", async () => {
            console.log("equipBuildSubmit");
            const row = HeroesGrid.getSelectedRow();
            const existingBuild = HeroesGrid.getSelectedBuildRow()

            console.warn("EQUIP BUILD", row, existingBuild);
            if (!existingBuild || !row) return;

            Api.equipItemsOnHero(row.id, existingBuild.items).then(x => {
                HeroesGrid.refreshBuilds();
                module.exports.redraw();
                Saves.autoSave();
            })
        });

        document.getElementById('addHeroStatsSubmit').addEventListener("click", async () => {
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;
            console.log("addHeroStatsSubmit", row);

            // Api.removeHeroById(row.id).then(response => {
            //     console.log("RESPONSE", response)
            //     HeroesGrid.refresh(response.heroes)
            //     redrawHeroInputSelector();
            // });

            showEditHeroInfoPopups(row.name)
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


        const useReforgedStats = $('#heroesTabUseReforgedStats').prop('checked');
        Api.getAllHeroes(useReforgedStats).then(response => {
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

function showEditHeroInfoPopups(name) {
    if (name == "Eaton") {
        Notifier.info("Eaton's 20% total Health bonus from S2 is already automatically added.")
    }
    if (name == "Gunther") {
        Notifier.info("Gunther's 75% total Attack bonus from S2 is already automatically added.")
    }
    if (name == "Lena") {
        Notifier.info("Lena's 50% Crit Chance bonus from S2 is already automatically added.")
    }
    if (name == "Apocalypse Ravi") {
        Notifier.info("Apocalypse Ravi's 30% Crit Chance bonus from S2 is already automatically added.")
    }
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

function addHero(heroName, isBuild) {
    const newHero = module.exports.getNewHeroByName(heroName);
    newHero.rarity = newHero.data.rarity;
    newHero.attribute = newHero.data.attribute;
    newHero.role = newHero.data.role;
    newHero.path = heroName;

    Api.addHeroes([newHero]).then(x => {
        module.exports.redrawHeroInputSelector();
        redrawGrid(newHero.id);
        Saves.autoSave();
    })
}

function redrawGrid(id) {
    const useReforgedStats = $('#heroesTabUseReforgedStats').prop('checked');
    Api.getAllHeroes(useReforgedStats).then(response => {
        HeroesGrid.refresh(response.heroes, id);
    });
}

function clearPreview() {
    for (var i = 0; i < 6; i++) {
        const displayId = Constants.gearDisplayIdByIndex[i];
        document.getElementById(displayId).innerHTML = "";
    }
}


const filters = {
    classFilter: null,
    elementFilter: null,
}

const elementsByFilter = {
    elementFilter: [
        "fireElementFilter",
        "iceElementFilter",
        "windElementFilter",
        "lightElementFilter",
        "darkElementFilter",
    ],
    classFilter: [
        "knightClassFilter",
        "warriorClassFilter",
        "assassinClassFilter",
        "mageClassFilter",
        "manauserClassFilter",
        "rangerClassFilter",
    ],
}
function setupFilterListener(elementId, filter, filterContent) {
    document.getElementById(elementId).addEventListener('click', () => {
        console.log("test")
        const element = $('#' + elementId);
        element.toggleClass("gearTabButtonSelected");
        elementsByFilter[filter].forEach(x => {
            if (x != elementId) {
                $('#' + x).removeClass("gearTabButtonSelected")
            }
        })
        if (element.hasClass("gearTabButtonSelected")) {
            filters[filter] = filterContent
        } else {
            filters[filter] = null;
        }
        HeroesGrid.refreshFilters(filters);
    })
}

function setupClearListener(elementId, filter) {
    document.getElementById(elementId).addEventListener('click', () => {
        elementsByFilter[filter].forEach(x => {
            $('#' + x).removeClass("gearTabButtonSelected")
        })
        filters[filter] = null;
        HeroesGrid.refreshFilters(filters);
    })
}

function setupEventListeners() {
    // Elements
    setupFilterListener("fireElementFilter", "elementFilter", "fire");
    setupFilterListener("waterElementFilter", "elementFilter", "ice");
    setupFilterListener("grassElementFilter", "elementFilter", "wind");
    setupFilterListener("lightElementFilter", "elementFilter", "light");
    setupFilterListener("darkElementFilter", "elementFilter", "dark");

    // Classes
    setupFilterListener("knightClassFilter", "classFilter", "knight");
    setupFilterListener("warriorClassFilter", "classFilter", "warrior");
    setupFilterListener("assassinClassFilter", "classFilter", "assassin");
    setupFilterListener("mageClassFilter", "classFilter", "mage");
    setupFilterListener("manauserClassFilter", "classFilter", "manauser");
    setupFilterListener("rangerClassFilter", "classFilter", "ranger");
}