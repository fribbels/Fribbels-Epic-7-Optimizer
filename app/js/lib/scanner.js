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

async function finishedReading(data, scanType) {
    try {
        console.warn(data)
        console.warn(data.map(x => x.length).sort((a, b) => a - b))
        console.warn(data.map(x => x.length).sort((a, b) => a - b).reduce((a, b) => a + b, 0)/1000)

        if (data.length == 0) {
            if (Files.isMac()) {
                Dialog.htmlError("The scanner did not find any data. Please check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#using-the-auto-importer'>Python and Wireshark installed</a> correctly, then try again.")
            } else {
                Dialog.htmlError("The scanner did not find any data. Please check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#using-the-auto-importer'>Python and Npcap installed</a> correctly, then try again.")
            }
            document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("The scanner did not find any data."));
            return;
        }

        const response = await postData(api + '/getItems', {
            data: data
        });
        console.log(response);

        if (response.status == "SUCCESS") {
            const equips = response.data || [];
            const units = response.units || [];
            var rawItems = equips.filter(x => !!x.f)
            const lengths = units.map(a => a.length);
            const index = lengths.indexOf(Math.max(...lengths));

            var rawUnits = index == -1 ? [] : units[index];

            if (rawItems.length == 0) { // This case is impossible?
                document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Item reading failed, please try again."));
                Notifier.error("Failed reading items, please try again. No items were found.");
                return
            }

            var convertedItems = convertItems(rawItems, scanType);
            var lv0items = convertedItems.filter(x => x.level == 0);
            console.log(convertedItems);

            var convertedHeroes = convertUnits(rawUnits, scanType);

            const failedItemsText = lv0items.length > 0 ? `${i18next.t('<br><br>There were <b>')}${lv0items.length}${i18next.t('</b> items with issues.<br>Use the Level=0 filter to fix them on the Gear Tab.')}` : ""
            Dialog.htmlSuccess(`${i18next.t('Finished scanning <b>')}${convertedItems.length}${i18next.t('</b> items.')} ${failedItemsText}`)

            var serializedStr = "{\"items\":" + ItemSerializer.serialize(convertedItems) + ", \"heroes\":" + JSON.stringify(convertedHeroes) + "}";
            document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = serializedStr);
        } else {
            document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Item reading failed, please try again."));
            Notifier.error("Failed reading items, please try again.");
            Dialog.htmlError("Scanner found data, but could not read the gear. Try following the scan instructions again, or visit the <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#contact-me'>Discord server</a> for help.")
        }
    } catch (e) {
        console.error("Failed reading items, please try again " + e);
        console.trace();
        document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Item reading failed, please try again."));
        Dialog.htmlError(i18next.t("Unexpected error while scanning items. Please check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#using-the-auto-importer'>Python and Wireshark installed</a> correctly, then try again. Error: ") + e);
    }
}

global.finishedReading = finishedReading;

function launchScanner(command, scanType) {
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

            if (str.includes("Failed to execute")
            || (str.includes("No IPv4 address"))) {
                // Ignore these mac specific errors
                return;
            }

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
                finishedReading(data, scanType);
            } else {
                data.push(message);
            }
        });
        console.log("Started scanning")
        document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Started scanning..."));
    } catch (e) {
        console.error(e);
        document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Failed to start scanning, make sure you have Python and pcap installed."));
        Notifier.error(e);
    }
}

module.exports = {
    initialize: () => {
        findcommand();
    },

    start: (scanType) => {
        launchScanner(command, scanType)
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
        try {
            if (!child) {
                console.error("No scan was started");
                Notifier.error("No scan was started");
                return
            }
            document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Reading items, this may take up to 30 seconds...\nData will appear here after it is done."));

            console.log("Stop scanning")
            child.stdin.write('END\n');
        } catch (e) {
            Dialog.htmlError(i18next.t("Unexpected error while scanning items. Please check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#using-the-auto-importer'>Python and Wireshark installed</a> correctly, then try again. Error: ") + e);
        }
    }
}

function convertUnits(rawUnits, scanType) {
    console.warn(rawUnits);
    for (var rawUnit of rawUnits) {
        try {
            if (!rawUnit.name || !rawUnit.id) {
                continue;
            }

            rawUnit.stars = rawUnit.g;
            rawUnit.awaken = rawUnit.z;
        } catch (e) {
            console.error(e)
        }
    }

    var filterType = "optimizer"
    if (scanType == "heroes") {
        filterType = $('#importHeroesLimitHeroes').val();
    }

    var filteredUnits = rawUnits.filter(x => !!x.name);
    console.log(filteredUnits);

    return filteredUnits;
}

function convertItems(rawItems, scanType) {
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
        convertEquippedId(rawItem);
    }

    const filteredItems = filterItems(rawItems, scanType);

    return filteredItems;
}

function filterItems(rawItems, scanType) {
    var enhanceLimit = 6;
    if (scanType == "heroes") {
        enhanceLimit = parseInt($('#importHeroesLimitEnhance').val());
    } else if (scanType == "items") {
        enhanceLimit = parseInt($('#importLimitEnhance').val());
    }

    return rawItems.filter(x => x.enhance >= enhanceLimit);
}

function convertId(item) {
    item.ingameId = item.id;
}

function convertEquippedId(item) {
    item.ingameEquippedId = "" + item.p;
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