var childProcess = require('child_process')

global.child = null;
global.data = [];

// global.api = "http://127.0.0.1:5000";
global.api = "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev";

global.command = 'python'
var findCommandSpawn = null;
function findcommand() {
    if (Files.isMac()) {
        console.log("Detecting python on mac, using python");
        return;
    } else {
        command = 'py'
    }

    console.log("Detecting python, using py for now");
    try {
        findCommandSpawn = childProcess.spawn('py');
        findCommandSpawn.on('error', function(err){
            console.warn("Error spawning python detector, using python instead", err)
            command = 'python'
        })
    } catch (e) {
        console.warn("Error trying to detect py, using python instead", e)
        command = 'python';
    }
}

async function finishedReading(data) {
    try {
        console.warn(data)
        console.warn(data.map(x => x.length).sort((a, b) => a - b))
        console.warn(data.map(x => x.length).sort((a, b) => a - b).reduce((a, b) => a + b, 0)/1000)

        const response = await postData(api + '/getItems', {
            data: data
        });
        console.log(response);

        if (response.status == "SUCCESS") {
            const equips = response.data;
            var rawItems = equips.filter(x => !!x.f)

            if (rawItems.length == 0) {
                document.getElementById('loadFromGameExportOutputText').value = i18next.t("Item reading failed, please try again.");
                Notifier.error("Failed reading items, please try again. No items were found.");
                return
            }

            var convertedItems = convertItems(rawItems);
            var lv0items = convertedItems.filter(x => x.level == 0);
            console.log(convertedItems);

            const failedItemsText = lv0items.length > 0 ? `${i18next.t('<br><br>There were <b>')}${lv0items.length}${i18next.t('</b> items with issues.<br>Use the Level=0 filter to fix them on the Heroes Tab.')}` : ""
            Dialog.htmlSuccess(`${i18next.t('Finished scanning <b>')}${convertedItems.length}${i18next.t('</b> items.')} ${failedItemsText}`)

            var serializedStr = "{\"items\":" + ItemSerializer.serialize(convertedItems) + "}";
            document.getElementById('loadFromGameExportOutputText').value = serializedStr;
        } else {
            document.getElementById('loadFromGameExportOutputText').value = i18next.t("Item reading failed, please try again.");
            Notifier.error("Failed reading items, please try again. Unable to read items.");
        }
    } catch (e) {
        console.error(e);
        document.getElementById('loadFromGameExportOutputText').value = i18next.t("Item reading failed, please try again.");
        Notifier.error(i18next.t("Failed reading items, please try again. ") + e);
    }
}

global.finishedReading = finishedReading;

function launchScanner(command) {
    try {
        data = [];

        if (child) {
            child.kill()
        }

        if (findCommandSpawn) {
            findCommandSpawn.kill()
            findCommandSpawn = null;
        }

        let bufferArray = []

        try {
            child = childProcess.spawn(command, [Files.path(Files.getDataPath() + '/py/scanner.py')])
        } catch (e) {
            console.error(e)
            Notifier.error(i18next.t("Unable to start python script ") + e)
        }

        child.on('close', (code) => {
            console.log(`Python child process exited with code ${code}`);
        });

        child.stderr.on('data', (data) => {
            const str = data.toString()
            console.error(str);
        })

        child.stdout.on('data', (message) => {
            message = message.toString()
            console.log(message)

            bufferArray.push(message)

            if (message.includes('DONE')) {
                console.log(bufferArray.join('').split('&').filter(x => !x.includes('DONE')))
                data = bufferArray.join('').split('&').filter(x => !x.includes('DONE')).map(x => x.replace(/\s/g,''))
                // data = bufferArray.join('').split('&').filter(x => !x.includes('DONE')).map(x => x.replaceAll('↵', '')).map(x => x.replaceAll('\n', '')).map(x => x.replaceAll('\r', ''))
                finishedReading(data);
            } else {
                data.push(message);
            }
        });
        console.log("Started scanning")
        document.getElementById('loadFromGameExportOutputText').value = i18next.t("Started scanning...");
    } catch (e) {
        console.error(e);
        document.getElementById('loadFromGameExportOutputText').value = i18next.t("Failed to start scanning, make sure you have Python and pcap installed.");
        Notifier.error(e);
    }
}

module.exports = {
    initialize: () => {
        findcommand();
    },

    start: () => {
        launchScanner(command)
    },

    switchApi: () => {
        if (api == "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev") {
            api = "http://127.0.0.1:5000";
        } else {
            api = "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev";
        }
        console.log("Switched to: " + api)
    },

    end: async () => {
        if (!child) {
            console.error("No scan was started");
            Notifier.error("No scan was started");
            return
        }
        document.getElementById('loadFromGameExportOutputText').value = i18next.t("Reading items, this may take up to 30 seconds...\nData will appear here after it is done.");

        console.log("Stop scanning")
        child.stdin.write('END\n');
    }
}

function convertItems(rawItems) {
    for (var rawItem of rawItems) {
        convertGear(rawItem);
        convertRank(rawItem);
        convertSet(rawItem);
        convertName(rawItem);
        convertLevel(rawItem);
        convertEnhance(rawItem);
        convertMainStat(rawItem);
        convertSubStats(rawItem);
        convertId(rawItem);
    }

    const filteredItems = filterItems(rawItems);

    return filteredItems;
}

function filterItems(rawItems) {
    const enhanceLimit = parseInt($('#importLimitEnhance').val());

    return rawItems.filter(x => x.enhance >= enhanceLimit);
}

function convertId(item) {
    item.ingameId = item.id;
}

// temp1.filter(x => x.id == "4229824545")[0]
function convertSubStats(item) {
    const statAcc = {};

    for (var i = 1; i < item.op.length; i++) {
        const op = item.op[i];

        const opType = op[0];
        const opValue = op[1];
        const annotation = op[2];
        const modification = op[3];

        const type = statByIngameStat[opType];
        const value = isFlat(opType) ? opValue : Utils.round10ths(opValue * 100);

        if (Object.keys(statAcc).includes(type)) {
            // Already found this stat

            statAcc[type].value += value;

            if (annotation == 'u') {

            } else if (annotation == 'c') {
                statAcc[type].modified = true;
            } else {
                statAcc[type].rolls += 1;
            }
        } else {
            // New stat
            statAcc[type] = {
                value: value,
                rolls: 1
            };
        }
    }

    const substats = []

    for (var key of Object.keys(statAcc)) {
        const acc = statAcc[key];
        const value = acc.value;
        const stat = new Stat(key, value, acc.rolls, acc.modified);
        substats.push(stat);
    }

    item.substats = substats;
}

function convertMainStat(item) {
    const mainOp = item.op[0];
    const mainOpType = mainOp[0];
    const mainOpValue = item.mainStatValue;
    const mainType = statByIngameStat[mainOpType];
    const mainValue = isFlat(mainOpType) ? mainOpValue : Utils.round10ths(mainOpValue * 100);
    const fixedMainValue = mainValue;

    item.main = new Stat(mainType, fixedMainValue);
}

function constructStat(text, numbers) {
    const isPercent = numbers.includes('%');
    const statNumbers = numbers.replace('%', '');
    const statText = match(text, statOptions) + (isPercent ? PERCENT : '');

    return new Stat(statText, parseInt(statNumbers));
}

function convertEnhance(item) {
    const rank = item.rank;
    const subs = item.op;
    const count = Math.min(subs.length - 1, countByRank[rank]);
    const offset = offsetByRank[rank];

    item.enhance = Math.max((count-offset) * 3, 0);
}

function isFlat(text) {
    return text == "max_hp" || text == "speed" || text == "att" || text == "def";
}

const countByRank = {
    "Normal": 5,
    "Good": 6,
    "Rare": 7,
    "Heroic": 8,
    "Epic": 9
}

const offsetByRank = {
    "Normal": 0,
    "Good": 1,
    "Rare": 2,
    "Heroic": 3,
    "Epic": 4
}

const statByIngameStat = {
    "att_rate": "AttackPercent",
    "max_hp_rate": "HealthPercent",
    "def_rate": "DefensePercent",
    "att": "Attack",
    "max_hp": "Health",
    "def": "Defense",
    "speed": "Speed",
    "res": "EffectResistancePercent",
    "cri": "CriticalHitChancePercent",
    "cri_dmg": "CriticalHitDamagePercent",
    "acc": "EffectivenessPercent",
    "coop": "DualAttackChancePercent"
}

function convertLevel(item) {
    if (!item.level) item.level = 0;
}

function convertName(item) {
    if (!item.name) item.name = "Unknown";
}

function convertRank(item) {
    item.rank = rankByIngameGrade[item.g]
}

function convertGear(item) {
    if (!item.type) {
        const baseCode = item.code.split("_")[0];
        const gearLetter = baseCode[baseCode.length - 1]

        item.gear = gearByGearLetter[gearLetter]
    } else {
        item.gear = gearByIngameType[item.type]
    }
}

function convertSet(item) {
    item.set = setsByIngameSet[item.f]
}

const rankByIngameGrade = [
    "Unknown",
    "Normal",
    "Good",
    "Rare",
    "Heroic",
    "Epic"
]

const gearByIngameType = {
    "weapon": "Weapon",
    "helm": "Helmet",
    "armor": "Armor",
    "neck": "Necklace",
    "ring": "Ring",
    "boot": "Boots"
}

const gearByGearLetter = {
    "w": "Weapon",
    "h": "Helmet",
    "a": "Armor",
    "n": "Necklace",
    "r": "Ring",
    "b": "Boots"
}

const setsByIngameSet = {
    "set_acc": "HitSet",
    "set_att": "AttackSet",
    "set_coop": "UnitySet",
    "set_counter": "CounterSet",
    "set_cri_dmg": "DestructionSet",
    "set_cri": "CriticalSet",
    "set_def": "DefenseSet",
    "set_immune": "ImmunitySet",
    "set_max_hp": "HealthSet",
    "set_penetrate": "PenetrationSet",
    "set_rage": "RageSet",
    "set_res": "ResistSet",
    "set_revenge": "RevengeSet",
    "set_scar": "InjurySet",
    "set_speed": "SpeedSet",
    "set_vampire": "LifestealSet",
}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function isPercent(stat) {
    return stat == "CriticalHitChancePercent"
    ||     stat == "CriticalHitDamagePercent"
    ||     stat == "AttackPercent"
    ||     stat == "HealthPercent"
    ||     stat == "DefensePercent"
    ||     stat == "EffectivenessPercent"
    ||     stat == "EffectResistancePercent";
}