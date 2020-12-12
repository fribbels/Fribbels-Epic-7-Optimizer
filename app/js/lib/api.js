const axios = require('axios')

const endpoint = "http://localhost:8001";

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
            speed: bonusStats.speed,
            cr: bonusStats.critChance,
            cd: bonusStats.critDamage,
            eff: bonusStats.effectiveness,
            res: bonusStats.effectResistance,

            heroId: heroId
        });
    },

    setBaseStats: async (baseStatsByName) => {
        return post('/heroes/setBaseStats', {
            baseStatsByName: baseStatsByName
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

    lockItems: async (itemIds) => {
        return post('/items/lockItems', {
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

    getAllHeroes: async () => {
        return post('/heroes/getAllHeroes');
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

    unequipItem: async (id) => {
        return post('/heroes/unequipItem', {
            id: id
        });
    },

    getHeroById: async (id) => {
        return post('/heroes/getHeroById', {
            id: id
        });
    },

    equipItemsOnHero: async (heroId, itemIds) => {
        return post('/heroes/equipItemsOnHero', {
            heroId: heroId,
            itemIds: itemIds
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
            console.log(api, response);
            resolve(response.data);
        })
        .catch(error => {
            console.error(api, error);
            reject(error);
        })
    })
}