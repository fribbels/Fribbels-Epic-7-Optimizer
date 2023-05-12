var heroesByName = {};
var artifactsByName = {};
var eesByName = {};

var HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json?";
var ARTIFACT_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json?";


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
    UrlExists('http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json?', function(status) {
        if(status === 200) {
           // file was found
           console.log('Amazon is available, using aws');
           HERO_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/herodata.json?";
           ARTIFACT_CACHE = "http://e7-optimizer-game-data.s3-accelerate.amazonaws.com/artifactdata.json?";
        } else {
           // file not found
           console.log('Amazon is not available, using Azure');
           HERO_CACHE = "https://fribbels-epic-7-optimizer-cn.azurewebsites.net/data/cache/herodata.json?";
           ARTIFACT_CACHE = "https://fribbels-epic-7-optimizer-cn.azurewebsites.net/data/cache/artifactdata.json?";
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
                    if (!heroesByName[x].skills) {
                        heroesByName[x].skills = {
      "S1": {
        "hitTypes": ["normal"],
        "targets": 0,
        "rate": 0,
        "pow": 0,
        "options": []
      },
      "S2": {
        "hitTypes": ["normal"],
        "targets": 0,
        "rate": 0,
        "pow": 0,
        "options": []
      },
      "S3": {
        "hitTypes": ["normal"],
        "targets": 0,
        "rate": 0,
        "pow": 0,
        "options": []
      }
    }
                    }


                    var s = heroesByName[x].skills;
                    for (var skill of ["S1", "S2", "S3"]) {
                        var skillData = s[skill];

                        if (skillData) {
                            for (var z of skillData.hitTypes) {
                                if (!skillData.options.find(y => y.name.includes(z))) {
                                    skillData.options.push({
                                        name: skill + " " + z,
                                        rate: skillData.rate,
                                        pow: skillData.pow,
                                        targets: skillData.targets,
                                        selfHpScaling: skillData.selfHpScaling,
                                        selfAtkScaling: skillData.selfAtkScaling,
                                        selfDefScaling: skillData.selfDefScaling,
                                        selfSpdScaling: skillData.selfSpdScaling,
                                        increasedValue: skillData.increasedValue,
                                        extraSelfHpScaling: skillData.extraSelfHpScaling,
                                        extraSelfDefScaling: skillData.extraSelfDefScaling,
                                        extraSelfAtkScaling: skillData.extraSelfAtkScaling,
                                        cdmgIncrease: skillData.cdmgIncrease,
                                        penetration: skillData.penetration,
                                    });
                                }
                            }
                        }

                        if (!skillData) {
                            s[skill] = {}
                        }

                        if (!s[skill].options || s[skill].options.length == 0) {
                            s[skill].options = [];
                            s[skill].options.push({
                                name: skill + " n/a",
                                targets: 0,
                                rate: 0,
                                pow: 0,
                            })
                        }
                    }

                    const baseStats = module.exports.getBaseStatsByName(x);
                    baseStatsByName[x] = baseStats;
                });

        await Api.setArtifacts(artifactsByName);
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
                bonusStats: {
                    bonusMaxAtkPercent: stats.bonusMaxAtkPercent,
                    bonusMaxDefPercent: stats.bonusMaxDefPercent,
                    bonusMaxHpPercent: stats.bonusMaxHpPercent,
                    overrideAtk: stats.overrideAtk,
                    overrideHp: stats.overrideHp,
                    overrideDef: stats.overrideDef,
                    overrideAdditionalCr: Math.round(stats.overrideAdditionalCr * 100),
                    overrideAdditionalCd: Math.round(stats.overrideAdditionalCd * 100),
                    overrideAdditionalSpd: stats.overrideAdditionalSpd,
                    overrideAdditionalEff: Math.round(stats.overrideAdditionalEff * 100),
                    overrideAdditionalRes: Math.round(stats.overrideAdditionalRes * 100),
                }
            }
        }

        const status = heroesByName[name].calculatedStatus;
        return {
            lv50FiveStarFullyAwakened: baseToStatObj(status.lv50FiveStarFullyAwakened),
            lv60SixStarFullyAwakened: baseToStatObj(status.lv60SixStarFullyAwakened),
            skills: {
                S1: heroesByName[name].skills.S1.options,
                S2: heroesByName[name].skills.S2.options,
                S3: heroesByName[name].skills.S3.options
            }
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
    var myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');

    const response = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
    });
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
            Notifier.error(i18next.t("Unable to load data from Epic7DB - ") + e);
        }
    })

    console.log(heroesByName);
}
