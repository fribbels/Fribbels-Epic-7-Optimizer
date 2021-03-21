var heroesByName = {};
var artifactsByName = {};
var eesByName = {};

function UrlExists(url, cb){
    jQuery.ajax({
        url:      url,
        dataType: 'text',
        type:     'GET',
        complete:  function(xhr){
            if(typeof cb === 'function')
               cb.apply(this, [xhr.status]);
        }
    });
}

var HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json";
var ARTIFACT_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json";

UrlExists('http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json', function(status){
    if(status === 200){
       // file was found
       console.log('Amazon is available, using aws');
       HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json";
       ARTIFACT_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json";
    }
    else {
       // file not found
       console.log('Amazon is not available, using gitee');
       HERO_CACHE = "https://triatk.gitee.io/fribbels-epic-7-optimizer/data/cache/herodata.json";
       ARTIFACT_CACHE = "https://triatk.gitee.io/fribbels-epic-7-optimizer/data/cache/artifactdata.json";
    }
});

module.exports = {

    initialize: async () => {
        var heroesByNameStr = await Files.readFileSync(Files.getDataPath() + '/cache/herodata.json');
        heroesByName = JSON.parse(heroesByNameStr);
        const heroNameList = Object.keys(heroesByName);

        var artifactsByNameStr = await Files.readFileSync(Files.getDataPath() + '/cache/artifactdata.json');
        artifactsByName = JSON.parse(artifactsByNameStr);
        const artifactNameList = Object.keys(artifactsByName);

        try {
            if (global.TEST) {
                const heroOverride = JSON.parse(await Files.readFileSync(Files.getDataPath() + "/cache/herodata.json"));
                heroesByName = heroOverride;
            } else {
                console.log(1)
                const heroOverride = await fetchCache(HERO_CACHE);
                console.log(2)
                heroesByName = heroOverride;
            }
            console.warn("HERO OVERRIDES")
            console.warn(heroesByName)
        } catch (e) {
            console.error(e)
        }

        try {
            if (global.TEST) {
                const artifactOverride = JSON.parse(await Files.readFileSync(Files.getDataPath() + "/cache/artifactdata.json"));
                artifactsByName = artifactOverride;
            } else {
                const artifactOverride = await fetchCache(ARTIFACT_CACHE);
                artifactsByName = artifactOverride;
            }
            console.warn("ARTIFACT OVERRIDES")
            console.warn(artifactsByName)
        } catch (e) {
            console.error(e)
        }

        const baseStatsByName = {};
        Object.keys(heroesByName)
                .forEach(x => {
                    const baseStats = module.exports.getBaseStatsByName(x);
                    baseStatsByName[x] = baseStats;
                });

        await Api.setBaseStats(baseStatsByName);
    },

    oldinitialize: async () => {
        const heroOverride = await fetchOverride(HERO_OVERRIDE);
        const eeOverride = await fetchOverride(EE_OVERRIDE);
        const artifactOverride = await fetchOverride(ARTIFACT_OVERRIDE);

        var heroesByNameStr = await Files.readFileSync(Files.getDataPath() + '/e7db/e7dbherodata.json');
        heroesByName = JSON.parse(heroesByNameStr);
        const heroNameList = Object.keys(heroesByName);

        var artifactsByNameStr = await Files.readFileSync(Files.getDataPath() + '/e7db/e7dbartifactdata.json');
        artifactsByName = JSON.parse(artifactsByNameStr);
        const artifactNameList = Object.keys(artifactsByName);

        var eesByNameStr = await Files.readFileSync(Files.getDataPath() + '/e7db/e7dbeedata.json');
        eesByName = JSON.parse(eesByNameStr);
        const eeNameList = Object.keys(eesByName);

        try {
            const newHeroListResults = await fetch('https://api.epicsevendb.com/hero');
            const newHeroListStr = await newHeroListResults.text();
            const newHeroesList = JSON.parse(newHeroListStr).results;
            const newHeroIdList = newHeroesList.map(x => x._id);
            const newHeroNameList = newHeroesList.map(x => x.name)
            const newHeroesByName = newHeroesList.reduce((map, obj) => (map[obj.name] = obj, map), {});

            const diff = newHeroNameList.filter(x => !heroNameList.includes(x)).filter(x => !x.includes("MISSING_TRANSLATION_VALUE"))
            console.log("HERO DIFF", diff);

            if (diff.length != 0) {
                const ids = diff.map(x => newHeroesByName[x]).map(x => x._id);
                const promises = Promise.allSettled(ids.map(x => 'https://api.epicsevendb.com/hero/' + x)
                                                       .map(x => fetch(x)));
                var results = await promises;

                console.warn(results);

                results = results.filter(x => x.status != 'rejected');
                results = results.map(x => x.value.json())
                results = await Promise.allSettled(results);

                results = results.filter(x => x.status != 'rejected' && !x.value.error);
                results = results.map(x => x.value.results[0])

                for (var result of results) {
                    heroesByName[result.name] = result;
                }

                if (newHeroesList.length >= heroNameList.length) {
                    Files.saveFile(Files.getDataPath() + '/e7db/e7dbherodata.json', JSON.stringify(heroesByName));
                }
            }

            // Artifacts

            const newArtifactResults = await fetch('https://api.epicsevendb.com/artifact');
            const newArtifactListStr = await newArtifactResults.text();
            const newArtifactsList = JSON.parse(newArtifactListStr).results;
            const newArtifactIdList = newArtifactsList.map(x => x._id);
            const newArtifactNameList = newArtifactsList.map(x => x.name)
            const newArtifactsByName = newArtifactsList.reduce((map, obj) => (map[obj.name] = obj, map), {});

            const artifactDiff = newArtifactNameList.filter(x => !artifactNameList.includes(x));
            console.log("ARTIFACT DIFF", artifactDiff);

            if (artifactDiff.length != 0) {
                const ids = artifactDiff.map(x => newArtifactsByName[x]).map(x => x._id);
                const promises = Promise.allSettled(ids.map(x => 'https://api.epicsevendb.com/artifact/' + x)
                                                       .map(x => fetch(x)));
                var results = await promises;

                console.warn(results);

                results = results.filter(x => x.status != 'rejected');
                results = results.map(x => x.value.json())
                results = await Promise.allSettled(results);

                results = results.filter(x => x.status != 'rejected' && !x.value.error);
                results = results.map(x => x.value.results[0])

                for (var result of results) {
                    artifactsByName[result.name] = result;
                }

                if (newArtifactsList.length >= artifactNameList.length) {
                    Files.saveFile(Files.getDataPath() + '/e7db/e7dbartifactdata.json', JSON.stringify(artifactsByName));
                }
            }


            // EE

            const newEeResults = await fetch('https://api.epicsevendb.com/ex_equip');
            const newEeListStr = await newEeResults.text();
            const newEesList = JSON.parse(newEeListStr).results;
            const newEeIdList = newEesList.map(x => x._id);
            const newEeNameList = newEesList.map(x => x.name)
            const newEesByName = newEesList.reduce((map, obj) => (map[obj.name] = obj, map), {});

            const eeDiff = newEeNameList.filter(x => !eeNameList.includes(x));
            console.log("EE DIFF", eeDiff);

            if (eeDiff.length != 0) {
                const ids = eeDiff.map(x => newEesByName[x]).map(x => x._id);
                const promises = Promise.allSettled(ids.map(x => 'https://api.epicsevendb.com/ex_equip/' + x)
                                                       .map(x => fetch(x)));
                var results = await promises;

                console.warn(results);

                results = results.filter(x => x.status != 'rejected');
                results = results.map(x => x.value.json())
                results = await Promise.allSettled(results);

                results = results.filter(x => x.status != 'rejected' && !x.value.error);
                results = results.map(x => x.value.results[0])

                for (var result of results) {
                    eesByName[result.name] = result;
                }

                if (newEesList.length >= eeNameList.length) {
                    Files.saveFile(Files.getDataPath() + '/e7db/e7dbeedata.json', JSON.stringify(eesByName));
                }
            }

            Object.assign(heroesByName, heroOverride);
            Object.assign(artifactsByName, artifactOverride);
            Object.assign(eesByName, eeOverride);

            console.log("Used hero overrides:", heroOverride);
            console.log("Used artifact overrides:", artifactOverride);
            console.log("Used ee overrides:", eeOverride);

            console.log("Finished loading from E7DB");
        } catch (e) {
            console.error("Unable to finish loading from E7DB");
            console.error(e);
            Notifier.error("Unable to load data from Epic7DB - " + e);
        }

        const baseStatsByName = {};
        Object.keys(heroesByName)
                .forEach(x => {
                    const baseStats = module.exports.getBaseStatsByName(x);
                    baseStatsByName[x] = baseStats;
                });

        await Api.setBaseStats(baseStatsByName);
    },

    getAllHeroData: () => {
        return heroesByName;
    },

    getHeroExtraInfo: (name) => {
        const heroInfo = heroesByName[name];
        return heroInfo;
    },

    getAllArtifactData: () => {
        return artifactsByName;
    },

    getArtifactByName: (name) => {
        return artifactsByName[name]
    },

    getAllEeData: () => {
        return eesByName;
    },

    getEeByName: (name) => {
        return eesByName[name]
    },

    getBaseStatsByName: (name) => {
        const stats = heroesByName[name].calculatedStatus.lv60SixStarFullyAwakened;

        return {
            atk: stats.atk,
            hp: stats.hp,
            def: stats.def,
            cr: Math.round(stats.chc * 100),
            cd: Math.round(stats.chd * 100),
            eff: Math.round(stats.eff * 100),
            res: Math.round(stats.efr * 100),
            spd: stats.spd,
            dac: Math.round(stats.dac * 100),
        }
    }
}

async function fetchCache(url) {
    console.log("Fetching from url: " + url);
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text);
    console.log("Finished fetching from url: " + url);

    return json;
}

function manualFetchData() {
    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    prefix = "https://api.epicsevendb.com/hero/"
    heroesById = {};
    heroesByName = {};

    basicData.forEach(x => heroesById[x._id] = x)

    Object.keys(heroesById).forEach(id => {
        data = httpGet(prefix + id)
        try {
            const results = JSON.parse(data);
            if (results.error)  {
                delete heroesById[id]
                return;
            }
            const fullData = results.results[0];
            const name = fullData.name;

            heroesByName[name] = fullData;
        } catch (e) {
            console.error(e);
            Notifier.error("Unable to load data from Epic7DB - " + e);
        }
    })

    console.log(heroesByName);
}
