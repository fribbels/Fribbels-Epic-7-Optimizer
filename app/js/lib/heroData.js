var heroesByName = {};
var currentAggregate = {};

module.exports = {
    
    initialize: async () => {
/*

disabled for throttling

        const heroListResults = await fetch('https://api.epicsevendb.com/hero');
        const heroListStr = await heroListResults.text();
        const heroList = JSON.parse(heroListStr).results.map(x => x._id);

        const promises = Promise.allSettled(heroList.map(x => 'https://api.epicsevendb.com/hero/' + x)
                                                    .map(x => fetch(x)));

        var results = await promises;

        results = results.filter(x => x.status != 'rejected');
        results = results.map(x => x.value.json())
        results = await Promise.allSettled(results);

        results = results.filter(x => x.status != 'rejected' && !x.value.error);
        results = results.map(x => x.value.results[0])

        heroesByName = {};

        for (var result of results) {
            heroesByName[result.name] = result;
        }
*/
        const heroesByNameStr = await Files.readFile(Path.resolve(__dirname, './fullData.json'));
        heroesByName = JSON.parse(heroesByNameStr);

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
        }
    })

    console.log(heroesByName);
}
