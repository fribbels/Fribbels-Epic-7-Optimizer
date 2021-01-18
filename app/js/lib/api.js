const axios = require('axios')

const endpoint = "http://localhost:8120";

module.exports = {

    ocr: async(id) => {
        return post('/ocr', {
            id: id
        });
    },

    ocr2: async(id, shifted) => {
        return post('/ocr2', {
            id: id,
            shifted: shifted
        });
    },

    getBonusStats: async (id) => {
        return post('/heroes/getBonusStats', {
            id: id
        });
    },

    setBonusStats: async (bonusStats, heroId) => {
        return post('/heroes/setBonusStats', {
            atk: bonusStats.attack,
            def: bonusStats.defense,
            hp: bonusStats.health,
            atkPercent: bonusStats.attackPercent,
            defPercent: bonusStats.defensePercent,
            hpPercent: bonusStats.healthPercent,
            speed: bonusStats.speed,
            cr: bonusStats.critChance,
            cd: bonusStats.critDamage,
            eff: bonusStats.effectiveness,
            res: bonusStats.effectResistance,
            scRes: bonusStats.scRes,

            heroId: heroId
        });
    },

    setBaseStats: async (baseStatsByName) => {
        return post('/heroes/setBaseStats', {
            baseStatsByName: baseStatsByName
        });
    },

    getBaseStats: async (name) => {
        return post('/heroes/getBaseStats', {
            id: name
        });
    },

    cancelOptimizationRequest: async () => {
        return post('/system');
    },

    getOptimizationProgress: async () => {
        return post('/optimization/getProgress');
    },

    getAllItems: async () => {
        return post('/items/getAllItems');
    },

    getItemById: async (id) => {
        return post('/items/getItemById', {
            id: id
        });
    },

    addItems: async (items) => {
        return post('/items/addItems', {
            items: items
        });
    },

    setItems: async (items) => {
        return post('/items/setItems', {
            items: items
        });
    },

    editItems: async (items) => {
        return post('/items/editItems', {
            items: items
        });
    },

    deleteItems: async (itemIds) => {
        return post('/items/deleteItems', {
            ids: itemIds
        });
    },

    lockItems: async (itemIds) => {
        return post('/items/lockItems', {
            ids: itemIds
        });
    },

    unlockItems: async (itemIds) => {
        return post('/items/unlockItems', {
            ids: itemIds
        });
    },

    addHeroes: async (heroes) => {
        return post('/heroes/addHeroes', {
            heroes: heroes
        });
    },

    setHeroes: async (heroes) => {
        return post('/heroes/setHeroes', {
            heroes: heroes
        });
    },

    getAllHeroes: async (useReforgeStats) => {
        return post('/heroes/getAllHeroes', {
            useReforgeStats: useReforgeStats
        });
    },

    removeHeroById: async (id) => {
        return post('/heroes/removeHeroById', {
            id: id
        });
    },

    unequipHeroById: async (id) => {
        return post('/heroes/unequipHeroById', {
            id: id
        });
    },

    unlockHeroById: async (id) => {
        return post('/heroes/unlockHeroById', {
            id: id
        });
    },

    lockHeroById: async (id) => {
        return post('/heroes/lockHeroById', {
            id: id
        });
    },

    unequipItems: async (ids) => {
        return post('/heroes/unequipItems', {
            ids: ids
        });
    },

    getHeroById: async (id, useReforgeStats) => {
        return post('/heroes/getHeroById', {
            id: id,
            useReforgeStats: useReforgeStats
        });
    },

    equipItemsOnHero: async (heroId, itemIds) => {
        return post('/heroes/equipItemsOnHero', {
            heroId: heroId,
            itemIds: itemIds
        });
    },

    addBuild: async (heroId, build) => {
        return post('/heroes/addBuild', {
            heroId: heroId,
            build: build
        });
    },
    editBuild: async (heroId, build) => {
        return post('/heroes/editBuild', {
            heroId: heroId,
            build: build
        });
    },
    removeBuild: async (heroId, build) => {
        return post('/heroes/removeBuild', {
            heroId: heroId,
            build: build
        });
    },
    editResultRows: async (index, property) => {
        return post('/optimization/editResultRows', {
            index: index,
            property: property
        });
    },

    submitOptimizationRequest: async (request) => {
        return post('/optimization/optimizationRequest', request);
    },

    submitOptimizationFilterRequest: async (request) => {
        return post('/optimization/optimizationFilterRequest', request);
    },

    getResultRows: async (request) => {
        return post('/optimization/getResultRows', request);
    },
}

function post(api, request) {
    return new Promise((resolve, reject) => {
        axios.post(endpoint + api, request)
        .then(response => {
            console.log("Api call", api, request, response);
            resolve(response.data);
        })
        .catch(error => {
            console.error("Api call", api, request, error);
            Notifier.error("Failed call to " + api + " - " + error);
            reject(error);
        })
    })
}