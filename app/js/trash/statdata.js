const statData = {
    "critrate": {
        "synonyms": ["cr", "crit", "critrate", "crit"],
        "tiers": {
            "4": {
                "min": 2,
                "max": 4
            },
            "5": {
                "min": 2,
                "max": 4
            },
            "6": {
                "min": 3,
                "max": 5
            },
            "7": {
                "min": 3,
                "max": 6
            }
        }
    },
    "critdmg": {
        "synonyms": ["cd", "cdmg", "critdmg"],
        "tiers": {
            "4": {
                "min": 3,
                "max": 5
            },
            "5": {
                "min": 3,
                "max": 6
            },
            "6": {
                "min": 3,
                "max": 8
            },
            "7": {
                "min": 4,
                "max": 8
            }
        }
    },
    "atk": {
        "synonyms": ["a", "at", "atk"],
        "tiers": baseTier
    },
    // "atk%": {
    //     "synonyms": ["a%", "at%", "atk%"],
    // },
    "hp": {
        "synonyms": ["h", "hp", "health"],
        "tiers": baseTier
    },
    // "hp%": {
    //     "synonyms": ["h%", "hp%", "health%"],
    // },
    "def": {
        "synonyms": ["d", "de", "def"],
        "tiers": baseTier
    },
    // "def%": {
    //     "synonyms": ["d%", "de%", "def%"],
    // },
    "eff": {
        "synonyms": ["e", "ef", "eff"],
        "tiers": baseTier
    },
    "res": {
        "synonyms": ["r", "er", "res", "effres"],
        "tiers": baseTier
    },
    "spd": {
        "synonyms": ["s", "sp", "spd", "speed"],
        "tiers": {
            "4": {
                "min": 1,
                "max": 3
            },
            "5": {
                "min": 1,
                "max": 4
            },
            "6": {
                "min": 1,
                "max": 5
            },
            "7": {
                "min": 1,
                "max": 5
            }
        }
    }
}


const baseTier = {
    "4": {
        "min": 3,
        "max": 6
    },
    "5": {
        "min": 4,
        "max": 7
    },
    "6": {
        "min": 4,
        "max": 8
    },
    "7": {
        "min": 5,
        "max": 9
    }
}



    // if (value.length < 2)
    //     return null;

    // const number = value.match(/\d+/g).join("");
    // const text = value.match(/[a-zA-Z]+/g).join("");
    // const stat = Object.keys(statData)
    //         .find(key => statData[key].synonyms.includes(text));

    // console.log("Value: " + value + " Number: " + number + " Text: " + text + " Stat: " + stat);

    // return {
    //     stat: stat,
    //     number: number
    // }
    
        // if (!data)
        //     continue;

        // const min = statData[data.stat].tiers[tier].min;
        // const max = statData[data.stat].tiers[tier].max;

        // const enhanceMin = min * enhance;
        // const enhanceMax = max * enhance;

        // console.log(enhanceMin + " - " + enhanceMax)
// function getLevel() {
//     const value = document.getElementById('level');
//     if (value.length < 2)
//         return error("Invalid level");
//     return parseInt(value);
// }
