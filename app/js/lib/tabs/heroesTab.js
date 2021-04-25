const { v4: uuidv4 } = require('uuid');
var useReforgedStats = true;

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
            option.innerHTML = i18next.t(hero.name);
            option.label = hero.name;
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
            useReforgedStats = document.getElementById('heroesTabUseReforgedStats').checked;
            console.log("REFORGE CHANGE TO " + useReforgedStats);
            redrawGrid();
            clearPreview();
            HeroesGrid.refreshBuilds();
        });

        document.getElementById('editBuildSubmit').addEventListener("click", async () => {
            console.log("editBuildSubmit");
            const row = HeroesGrid.getSelectedRow();

            const existingBuild = HeroesGrid.getSelectedBuildRow();
            if (!existingBuild) {
                Notifier.warn("Select a build to edit.");
                return;
            }

            const editedBuild = await Dialog.editBuildDialog(existingBuild.name);
            console.warn("EDITBUILD", editedBuild, existingBuild);

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

        document.getElementById('saveAsBuildSubmit').addEventListener("click", async () => {
            console.log("saveAsBuildSubmit");
            const row = HeroesGrid.getSelectedRow();

            row.items = Object.values(row.equipment).map(x => x.id)
            console.warn("Save as build", row);
            console.warn("Save as build", row.items);

            if (row.items.length < 6) {
                Notifier.warn("Hero need a 6 item build before it can be saved");
                return;
            }

            row.items = [
                row.equipment.Weapon.id,
                row.equipment.Helmet.id,
                row.equipment.Armor.id,
                row.equipment.Necklace.id,
                row.equipment.Ring.id,
                row.equipment.Boots.id,
            ]

            Api.addBuild(row.id, row).then(x => {
                HeroesGrid.refreshBuilds();
                Saves.autoSave();
            });
        });

        document.getElementById('equipBuildSubmit').addEventListener("click", async () => {
            console.log("equipBuildSubmit");
            const row = HeroesGrid.getSelectedRow();
            const existingBuild = HeroesGrid.getSelectedBuildRow()

            if (!existingBuild || !existingBuild.items || !row || existingBuild.items.includes(undefined) || existingBuild.items.includes(null)) {
                return;
            }

            Api.equipItemsOnHero(row.id, existingBuild.items).then(x => {
                HeroesGrid.refreshBuilds();
                module.exports.redraw();
                Saves.autoSave();
            })
        });

        document.getElementById('addSubstatModsSubmit').addEventListener("click", async () => {
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;
            console.log("addSubstatModsSubmit", row);

            const modStats = await Dialog.editModStatsDialog(row);

            // mods

            await Api.setModStats(modStats, row.id).then(module.exports.redraw);
            Notifier.success("Saved mod stats");
            Saves.autoSave();
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
            await showBonusStatsWindow(row);
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

    getUseReforgedStats: () => {
        return useReforgedStats;
    },

    getNewHeroByName: (heroName) => {
        const allHeroData = HeroData.getAllHeroData();
        const heroData = allHeroData[heroName];

        if (!heroData) {
            return null;
        }

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

async function showBonusStatsWindow(row) {
    showEditHeroInfoPopups(row.name)
    const bonusStats = await Dialog.editHeroDialog(row);

    if (!bonusStats) return;

    const e7StatToBonusStat = {
        "att_rate": "aeiAttackPercent",
        "max_hp_rate": "aeiHealthPercent",
        "def_rate": "aeiDefensePercent",
        "att": "aeiAttack",
        "max_hp": "aeiHealth",
        "def": "aeiDefense",
        "speed": "aeiSpeed",
        "res": "aeiEffectResistance",
        "cri": "aeiCritChance",
        "cri_dmg": "aeiCritDamage",
        "acc": "aeiEffectiveness",
        "coop": "aeiDualAttackChance"
    }

    console.log("Bonus stats", bonusStats, row.id);

    // Imprint
    const imprintIngameType = bonusStats.heroInfo.self_devotion.type;
    const imprintBonusType = e7StatToBonusStat[imprintIngameType];
    const imprintNumberText = bonusStats.imprintNumber;
    if (imprintNumberText != "None") {
        const imprintNumber = parseFloat(imprintNumberText)

        console.log("ADDING AEI IMPRINT", imprintNumber, imprintBonusType)

        bonusStats[imprintBonusType] += imprintNumber;
    }

    // Artifact
    const artifactName = bonusStats.artifactName;
    if (artifactName != "None") {
        const artifactLevelText = bonusStats.artifactLevel;
        if (artifactLevelText != "None") {
            const artifactLevel = parseInt(artifactLevelText);
            const artifactStats = Artifact.getStats(artifactName, artifactLevel);

            console.log("ADDING AEI ARTIFACT", artifactLevel)
            console.log("ADDING AEI ARTIFACT", artifactLevelText)
            console.log("ADDING AEI ARTIFACT", artifactName)

            bonusStats.aeiHealth += artifactStats.health;
            bonusStats.aeiAttack += artifactStats.attack;
        }
    }

    // EE
    const eeNumberText = bonusStats.eeNumber;
    if (eeNumberText != "None") {
        const eeNumber = parseInt(eeNumberText);
        const eeIngameType = bonusStats.ee.stat.type;
        const eeBonusType = e7StatToBonusStat[eeIngameType];

        console.log("ADDING AEI EE", eeBonusType, eeNumber)

        bonusStats[eeBonusType] += eeNumber;
    }

    await Api.setBonusStats(bonusStats, row.id).then(module.exports.redraw);
    Notifier.success("Saved bonus stats");
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
    const buildRow = HeroesGrid.getSelectedBuildRow()
    if (buildRow) {
        return buildRow.items.map(x => {
            return {
                id: x
            }
        })
    }

    const row = HeroesGrid.getSelectedRow();
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
    newHero.stars = 6;

    Api.addHeroes([newHero]).then(x => {
        module.exports.redrawHeroInputSelector();
        redrawGrid(newHero.id);

        Api.getHeroById(newHero.id).then(async y => {
            const createdHero = y.hero;
            await showBonusStatsWindow(createdHero);
            Saves.autoSave();
        })
    })
}

function redrawGrid(id) {
    Api.getAllHeroes(useReforgedStats).then(response => {
        HeroesGrid.refresh(response.heroes, id);

        HeroesGrid.refreshFilters(filters);
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
    setupFilterListener("iceElementFilter", "elementFilter", "ice");
    setupFilterListener("windElementFilter", "elementFilter", "wind");
    setupFilterListener("lightElementFilter", "elementFilter", "light");
    setupFilterListener("darkElementFilter", "elementFilter", "dark");

    // Classes
    setupFilterListener("knightClassFilter", "classFilter", "knight");
    setupFilterListener("warriorClassFilter", "classFilter", "warrior");
    setupFilterListener("assassinClassFilter", "classFilter", "assassin");
    setupFilterListener("mageClassFilter", "classFilter", "mage");
    setupFilterListener("manauserClassFilter", "classFilter", "manauser");
    setupFilterListener("rangerClassFilter", "classFilter", "ranger");


    document.getElementById('clearHeroFilter').addEventListener('click', () => {
        const keys = Object.keys(elementsByFilter);
        for (var key of keys) {
            elementsByFilter[key].forEach(x => {
                $('#' + x).removeClass("gearTabButtonSelected")
            })
            filters[key] = null;
        }

        HeroesGrid.resetSort();
        HeroesGrid.refreshFilters(filters);
    })

}
