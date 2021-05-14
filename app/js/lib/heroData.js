var heroesByName = {};
var artifactsByName = {};
var eesByName = {};

var HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json";
var ARTIFACT_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json";


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

try {
    UrlExists('http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json', function(status) {
        if(status === 200) {
           // file was found
           console.log('Amazon is available, using aws');
           HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json";
           ARTIFACT_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json";
        } else {
           // file not found
           console.log('Amazon is not available, using gitee');
           HERO_CACHE = "https://triatk.gitee.io/fribbels-epic-7-optimizer/data/cache/herodata.json";
           ARTIFACT_CACHE = "https://triatk.gitee.io/fribbels-epic-7-optimizer/data/cache/artifactdata.json";
        }
    });
} catch (e) {
    console.log("Error checking url, using aws", e);
}

module.exports = {

    initialize: async () => {
        try {
            var heroesByNameStr = await Files.readFileSync(Files.getDataPath() + '/cache/herodata.json');
            heroesByName = JSON.parse(heroesByNameStr);
            // const heroNameList = Object.keys(heroesByName);
        } catch (e) {
            console.warn("Error loading hero data from file", e)
        }

        try {
            var artifactsByNameStr = await Files.readFileSync(Files.getDataPath() + '/cache/artifactdata.json');
            artifactsByName = JSON.parse(artifactsByNameStr);
            // const artifactNameList = Object.keys(artifactsByName);
        } catch (e) {
            console.warn("Error loading artifact data from file", e)
        }

        try {
            if (global.TEST) {
                const heroOverride = JSON.parse(await Files.readFileSync(Files.getDataPath() + "/cache/herodata.json"));
                heroesByName = heroOverride;
            } else {
                const heroOverride = await fetchCache(HERO_CACHE);
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
        function baseToStatObj(stats) {
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

        const status = heroesByName[name].calculatedStatus;
        return {
            lv50FiveStarFullyAwakened: baseToStatObj(status.lv50FiveStarFullyAwakened),
            lv60SixStarFullyAwakened: baseToStatObj(status.lv60SixStarFullyAwakened)
        }
    },

    getBaseStatsByStars: (name, stars) => {
        const baseStats = module.exports.getBaseStatsByName(name);

        if (stars == 5) {
            return baseStats.lv50FiveStarFullyAwakened;
        }
        return baseStats.lv60SixStarFullyAwakened;
    },
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
