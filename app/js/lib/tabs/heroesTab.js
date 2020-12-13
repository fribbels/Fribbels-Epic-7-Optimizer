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
            console.warn("BONUS STATS", bonusStats, row.id);

            Api.setBonusStats(bonusStats, row.id).then(module.exports.redraw);
        });

        document.getElementById('removeHeroesSubmit').addEventListener("click", async () => {
            console.log("removeHeroesSubmit");
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            Api.removeHeroById(row.id).then(response => {
                console.log("RESPONSE", response)
                HeroesGrid.refresh(response.heroes)
                redrawHeroInputSelector();
            });
        });

        document.getElementById('unequipHeroesSubmit').addEventListener("click", async () => {
            console.log("unequipHeroesSubmit", HeroesGrid.getSelectedRow());
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            Api.unequipHeroById(row.id).then(response => {
                console.log("RESPONSE", response)
                HeroesGrid.refresh(response.heroes)
                redrawGrid();
                clearPreview();
            })
        });

        document.getElementById('unlockHeroesSubmit').addEventListener("click", async () => {
            console.log("unlockHeroesSubmit", HeroesGrid.getSelectedRow());
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            Api.unlockHeroById(row.id).then(response => {
                console.log("RESPONSE", response)
                HeroesGrid.refresh(response.heroes)
                redrawGrid();
                clearPreview();
            })
        });

        document.getElementById('lockHeroesSubmit').addEventListener("click", async () => {
            console.log("lockHeroesSubmit", HeroesGrid.getSelectedRow());
            const row = HeroesGrid.getSelectedRow();
            if (!row) return;

            Api.lockHeroById(row.id).then(response => {
                console.log("RESPONSE", response)
                HeroesGrid.refresh(response.heroes)
                redrawGrid();
                clearPreview();
            })
        });

        document.getElementById('tab4label').addEventListener("click", () => {
            module.exports.redraw();
        });

        Api.getAllHeroes().then(response => {
            console.warn("HEROESRESPONSE", response);

            if (response.heroes.length == 0) {
                addHero("Maid Chloe")
            } else {
                redrawHeroInputSelector();
            }
            HeroesGrid.refresh(response.heroes);
        })
    },

    redraw: () => {
        Api.getAllHeroes().then(response => {
            console.warn("HEROESRESPONSE", response);

            HeroesGrid.refresh(response.heroes);
        })
    }
}

function addHero(heroName) {
    const newHero = getNewHeroByName(heroName);
    newHero.rarity = newHero.data.rarity;
    newHero.attribute = newHero.data.attribute;
    newHero.role = newHero.data.role;
    Api.addHeroes([newHero]).then(x => {
        redrawHeroInputSelector();
        redrawGrid();
        Saves.autoSave();
    })
}

function getNewHeroByName(heroName) {
    const allHeroData = HeroData.getAllHeroData();
    const heroData = allHeroData[heroName];
    const id = new Date().getTime();

    return {
        id: id,
        name: heroName,
        data: JSON.parse(JSON.stringify(heroData)),
        equipped: new Array(6)
    }
}

function redrawGrid() {
    Api.getAllHeroes().then(response => {
        HeroesGrid.refresh(response.heroes);
    });
}

function redrawHeroInputSelector() {
    Api.getAllHeroes().then(getAllHeroesResponse => {
        clearOptions("inputHeroAdd");
        const optimizerHeroSelector = document.getElementById('inputHeroAdd')
        const heroes = getAllHeroesResponse.heroes;
        console.log("getAllHeroesResponse", getAllHeroesResponse)
        for (var hero of heroes) {
            const option = document.createElement('option');
            option.innerHTML = hero.name;
            option.value = hero.id;
                
            optimizerHeroSelector.add(option);
        }
    })
}

function clearPreview() {
    for (var i = 0; i < 6; i++) {
        const displayId = Constants.gearDisplayIdByIndex[i];
        document.getElementById(displayId).innerHTML = "";    
    }
}

function clearOptions(id) {
    var select = document.getElementById(id);
    var length = select.options.length;
    for (i = length-1; i >= 0; i--) {
      select.options[i] = null;
    }
}