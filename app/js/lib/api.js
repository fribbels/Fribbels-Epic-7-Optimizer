/*
    Contains all the api paths that the java backend uses.
*/

const axios = require('axios')

const endpoint = "http://localhost:8130";

module.exports = {

    setSettings: async(settings) => {
        return post('/system/setSettings', settings);
    },

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

            finalAtkMultiplier: bonusStats.finalAtkMultiplier,
            finalDefMultiplier: bonusStats.finalDefMultiplier,
            finalHpMultiplier: bonusStats.finalHpMultiplier,

            aeiAtk: bonusStats.aeiAttack,
            aeiDef: bonusStats.aeiDefense,
            aeiHp: bonusStats.aeiHealth,
            aeiAtkPercent: bonusStats.aeiAttackPercent,
            aeiDefPercent: bonusStats.aeiDefensePercent,
            aeiHpPercent: bonusStats.aeiHealthPercent,
            aeiSpeed: bonusStats.aeiSpeed,
            aeiCr: bonusStats.aeiCritChance,
            aeiCd: bonusStats.aeiCritDamage,
            aeiEff: bonusStats.aeiEffectiveness,
            aeiRes: bonusStats.aeiEffectResistance,

            artifactName: bonusStats.artifactName,
            artifactLevel: bonusStats.artifactLevel,
            artifactAttack: bonusStats.artifactAttack,
            artifactHealth: bonusStats.artifactHealth,
            imprintNumber: bonusStats.imprintNumber,
            eeNumber: bonusStats.eeNumber,

            stars: bonusStats.stars,

            heroId: heroId
        });
    },

    getSkillOptions: async (id) => {
        return post('/heroes/getSkillOptions', {
            id: id
        });
    },

    setSkillOptions: async (skillOptions, heroId) => {
        return post('/heroes/setSkillOptions', {
            heroId: heroId,
            skillOptions: skillOptions
        });
    },

    setModStats: async (modStats, heroId) => {
        return post('/heroes/setModStats', {
            discardStats: modStats.discardStats,
            ignoreStats: modStats.ignoreStats,
            keepStats: modStats.keepStats,
            modGrade: modStats.modGrade,
            keepStatOptions: modStats.keepStatOptions,
            rollQuality: modStats.rollQuality,
            limitRolls: modStats.limitRolls,

            heroId: heroId
        });
    },

    setBaseStats: async (baseStatsByName) => {
        return post('/heroes/setBaseStats', {
            baseStatsByName: baseStatsByName
        });
    },

    setArtifacts: async (artifactsByName) => {
        var fixedModel = JSON.parse(JSON.stringify(artifactsByName))
        for (var value of Object.values(fixedModel)) {
            value.attack = value.stats.attack;
            value.health = value.stats.health;
        }
        return post('/heroes/setArtifactStats', {
            artifactStatsByName: fixedModel
        });
    },

    getBaseStats: async (name) => {
        return post('/heroes/getBaseStats', {
            id: name
        });
    },

    reorderHeroes: async (id, destinationIndex) => {
        return post('/heroes/reorderHeroes', {
            id: id,
            destinationIndex: destinationIndex
        });
    },

    cancelOptimizationRequest: async () => {
        return post('/system/interrupt');
    },

    getOptimizationProgress: async () => {
        return post('/optimization/getProgress');
    },

    getOptimizationInProgress: async () => {
        return post('/optimization/inProgress');
    },

    getAllItems: async () => {
        return post('/items/getAllItems');
    },

    getItemById: async (id) => {
        return post('/items/getItemById', {
            id: id
        });
    },

    getItemByIngameId: async (id) => {
        return post('/items/getItemByIngameId', {
            id: id
        });
    },

    getItemsByIds: async (ids) => {
        return post('/items/getItemsByIds', {
            ids: ids
        });
    },

    getModItems: async (ids) => {
        return post('/optimization/getModItems', {
            ids: ids
        });
    },

    addItems: async (items) => {
        return post('/items/addItems', {
            items: items
        });
    },

    mergeItems: async (items, enhanceLimit) => {
        return post('/items/mergeItems', {
            items: items,
            enhanceLimit: enhanceLimit
        });
    },

    mergeHeroes: async (items, mergeHeroes, enhanceLimit, heroFilter) => {
        return post('/items/mergeHeroes', {
            items: items,
            mergeHeroes: mergeHeroes,
            enhanceLimit: enhanceLimit,
            heroFilter: heroFilter
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
        const useReforgeStatsOverride = HeroesTab.getUseReforgedStats();
        return post('/heroes/getAllHeroes', {
            useReforgeStats: useReforgeStatsOverride
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
        // Autosave interferes with the reforge display
        const useReforgeStatsOverride = HeroesTab.getUseReforgedStats();
        return post('/heroes/getHeroById', {
            id: id,
            useReforgeStats: useReforgeStatsOverride
        });
    },

    equipItemsOnHero: async (heroId, itemIds, useReforgeStats) => {
        return post('/heroes/equipItemsOnHero', {
            heroId: heroId,
            itemIds: itemIds,
            useReforgeStats: useReforgeStats
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
    editResultRows: async (index, property, executionId) => {
        return post('/optimization/editResultRows', {
            index: index,
            property: property,
            executionId: executionId
        });
    },

    prepareExecution: async () => {
        return post('/optimization/prepareExecution');
    },

    deleteExecution: async (id) => {
        return post('/optimization/deleteExecution', {
            id: id
        });
    },

    submitOptimizationRequest: async (request) => {
        return post('/optimization/optimizationRequest', request);
    },

    saveOptimizationRequest: async (request) => {
        return post('/heroes/saveOptimizationRequest', request);
    },

    submitOptimizationFilterRequest: async (request) => {
        return post('/optimization/optimizationFilterRequest', request);
    },

    getResultRows: async (request) => {
        return post('/optimization/getResultRows', request);
    },
}

function post(api, request) {
    console.log("Call: ", api);
    return new Promise((resolve, reject) => {
        axios.post(endpoint + api, request)
        .then(response => {
            // console.trace("Api call", api, request, response);
            console.log("Api call", api, request, response);

            if (response.data == "ERROR") {

                if (api.includes("/optimization")) {
                    console.error("Subprocess error. If you are using GPU acceleration, try disabling it on the settings tab.\n" + api);
                    Notifier.error("Subprocess error. If you are using GPU acceleration, try disabling it on the settings tab.\n" + api);
                } else {
                    console.error("Subprocess error: " + api);
                    Notifier.error("Subprocess error - " + api);
                }
            }

            resolve(response.data);
        })
        .catch(error => {
            var errStr = error.toString() + error.stack
            if (errStr && errStr.includes("aparapi") && errStr.includes("Ensure that OpenCL is in your PATH (windows) or in LD_LIBRARY_PATH (linux).")) {

            } else if (errStr.includes("untested")) {

            } else if (errStr && errStr.includes("aparapi")) {
                console.error("Java process failed. If you are using GPU acceleration, try disabling it on the settings tab. Please try restarting your app and check that you've installed the correct version of Java.", api, request, error);
                Notifier.error("Java process failed. If you are using GPU acceleration, try disabling it on the settings tab. Please try restarting your app and check that you've installed the correct version of Java");
                reject(error);
            } else {
                console.error("Java process failed. Please try restarting your app and check that you've installed the correct version of Java.", api, request, error);
                Notifier.error("Java process failed. Please try restarting your app and check that you've installed the correct version of Java");
                reject(error);
            }
        })
    })
}