var childProcess = require('child_process')

global.scannerChild = null;
global.itemTrackerChild = null;
global.data = [];

// global.api = "http://127.0.0.1:5000";
global.api = "https://krivpfvxi0.execute-api.us-west-2.amazonaws.com/dev";

global.command = 'python'
global.findCommandSpawn = null;

var killItemDetectorInterval;

var detectorState = false;
function setDetector(state) {
    detectorState = state;
    if (detectorState == false) {
        // $('#detectorStatus').html("Off");
        $('#statusText').html("Status: Off");
        $('#statusSymbol').css("background-color", "red");
    }
    if (detectorState == true) {
        // $('#detectorStatus').html("On");
        $('#statusText').html("Status: On");
        $('#statusSymbol').css("background-color", "green");
    }
}

var net = require('net');

var HOST = '127.0.0.1';
var PORT = 8129;

// const http = require('http');

// http.createServer(async function (req, res) {
//     res.socket.setNoDelay(true);

//     const buffers = [];

//     for await (const chunk of req) {
//         buffers.push(chunk);
//     }

//     const data = Buffer.concat(buffers).toString();

//     console.log(data); // 'Buy the milk'
//     res.end();
// }).listen(8081);

const express = require('express');
const bodyParser = require('body-parser');

var app;
var processes = [];

// Create a server instance, and chain the listen function to it
// net.createServer(function(socket) {
//     console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort, socket);

//     // Add a 'data' event handler to this instance of socket
//     socket.on('data', function(data) {
//         // console.log('DATA ' + socket.remoteAddress + ': ' + data);
//         // socket.write('This is your request: "' + data + '"');
//         handleSocketResponse(data);
//     });

//     // Add a 'close' event handler to this instance of socket
//     socket.on('close', async function(data) {
//         console.log('Socket connection closed... ');
//         // await itemTrackerChild.stdin.pause();
//         // await itemTrackerChild.kill();

//         // for (p of processes) {
//         //     await p.kill();
//         // }
//         setDetector(false);
//     });

//     socket.on('error', function (error) {
//         console.warn(error);
//     });


//     socket.on('timeout',function(){
//       console.log('Socket timed out !');
//       socket.end('Timed out!');
//       // can call socket.destroy() here too.
//     });


//     socket.on('end',function(data){
//       console.log('Socket ended from other end!');
//       console.log('End data : ' + data);
//     });

//     socket.on('drain',function(){
//       console.log('write buffer is empty now .. u can resume the writable stream');
//       socket.resume();
//     });

//     setDetector(true);
// }).listen(PORT, HOST);

// console.log('Server listening on ' + HOST +':'+ PORT);



// let bufferArray = []
// async function handleSocketResponse(message) {
//     if (!message) {
//         return;
//     }
//     message = message.toString()

//     bufferArray = [];
//     console.log("data", message);

//     const response = await postData(api + '/read', {
//         data: message
//     });
//     console.log(response);

//     if (!response || response.status == "ERROR" || !response.event) {
//         return;
//     }

//     if (response.event == "lockunlock") {
//         const result = await Api.getItemByIngameId(response.equip);
//         console.log(result.item);
//         const item = result.item;

//         if (!item) {
//             return;
//         }


//         EnhancingTab.redrawEnhanceGuide(item);

//         console.warn(response.equip)
//     }

//     if (response.event == "remove") {
//         for (var toRemove of response.removed) {
//             const result = await Api.getItemByIngameId(toRemove);
//             console.log(result.item);
//             const item = result.item;

//             if (!item) {
//                 continue;
//             }
//             Api.deleteItems([item.id])
//         }

//         ItemsGrid.redraw()
//     }

//     if (response.event == "craft1") {
//         console.log(response.item);
//         const items = response.items;
//         if (!items || items.length == 0) {
//             return
//         }

//         const rawItem = items[0];

//         convertGear(rawItem);
//         convertRank(rawItem);
//         convertSet(rawItem);
//         convertName(rawItem);
//         convertLevel(rawItem);
//         convertEnhance(rawItem);
//         convertMainStat(rawItem);
//         convertSubStats(rawItem);
//         convertId(rawItem);
//         convertEquippedId(rawItem);

//         ItemAugmenter.augment([rawItem]);
//         await Api.addItems([rawItem])

//         const result = await Api.getItemByIngameId(rawItem.ingameId);

//         EnhancingTab.redrawEnhanceGuide(result.item);

//         ItemsGrid.redraw()
//     }

//     if (response.event == "craft10") {
//         console.log(response.item);
//         const items = response.items;
//         if (!items || items.length == 0) {
//             return
//         }

//         var newItems = []

//         for (var rawItem of items) {
//             convertGear(rawItem);
//             convertRank(rawItem);
//             convertSet(rawItem);
//             convertName(rawItem);
//             convertLevel(rawItem);
//             convertEnhance(rawItem);
//             convertMainStat(rawItem);
//             convertSubStats(rawItem);
//             convertId(rawItem);
//             convertEquippedId(rawItem);

//             ItemAugmenter.augment([rawItem]);

//             newItems.push(rawItem)
//         }

//         await Api.addItems(newItems)

//         ItemsGrid.redraw()
//     }

//     if (response.event == "enhance") {
//         const result = await Api.getItemByIngameId(response.equip);
//         console.log(result.item);
//         const item = result.item;

//         if (!item) {
//             return;
//         }

//         var tempItem = {
//             op: response.data,
//             rank: item.rank
//         }

//         convertSubStats(tempItem)
//         convertEnhance(tempItem)

//         console.error("TEMPITEM", tempItem);

//         item.substats = tempItem.substats;
//         item.enhance = tempItem.enhance;

//         EnhancingTab.redrawEnhanceGuide(item);

//         Api.editItems([item])

//         console.warn(response.equip)

//         for (var toRemove of response.removed) {
//             const result = await Api.getItemByIngameId(toRemove);
//             console.log(result.item);
//             const item = result.item;

//             if (!item) {
//                 continue;
//             }
//             Api.deleteItems([item.id])
//         }

//         ItemsGrid.redraw()
//     }
// }

function findcommand() {
    var commands = ["py", "python", "python3"];

    if (Files.isMac()) {
        commands = ["python3", "python", "py"];
    }
    
    commands.find((command) => {
        const { error, status } = childProcess.spawnSync(command);

        if (error || status !== 0) {
            console.debug(`Unable to use ${command}`);
        } else {
            console.log(`Using ${command}`);
            global.command = command;
            return true;
        }
    });
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

async function launchItemTracker(command) {
    try {
        // $('#detectorStatus').html("Loading");
        $('#statusText').html("Status: Loading");
        $('#statusSymbol').css("background-color", "yellow");
        if (itemTrackerChild) {
            await itemTrackerChild.stdin.pause();
            await itemTrackerChild.kill();
        }

        for (p of processes) {
            if (p) {
                processes = processes.filter(x => x != p)
                await p.kill();
            }
        }
        processes = []

        try {
            itemTrackerChild = await childProcess.spawn(command, [Files.path(Files.getDataPath() + '/py/itemscanner.py')], {
            })
            // itemTrackerChild = await childProcess.spawn(command, ['--version'], {
            // })
            processes.push(itemTrackerChild);
            setDetector(true);
            Notifier.info("Item detector has launched and will deactivate after an hour.")

            console.log("spawn");

            if (killItemDetectorInterval) {
                clearTimeout(killItemDetectorInterval)
            }

            killItemDetectorInterval = setTimeout(async () => {
                setDetector(false);

                if (itemTrackerChild) {
                    await itemTrackerChild.stdin.pause();
                    await itemTrackerChild.kill();
                }

                Notifier.warn("Item detector has been deactivated after an hour. Please restart the detector if needed.")
            }, 60 * 60 * 1000)
        } catch (e) {
            console.error(e)
            Notifier.error(i18next.t("Unable to start python script ") + e)
        }

        // itemTrackerChild.on('close', (code) => {
        //     console.log(`Python child process exited with code ${code}`);
        // });

        // itemTrackerChild.stderr.on('data', (data) => {
        //     const str = data.toString()

        //     if (str.includes("Failed to execute")
        //     || (str.includes("No IPv4 address"))) {
        //         // Ignore these mac specific errors
        //         return;
        //     }

        //     console.error(str);
        // })


        // // let bufferArray = []
        itemTrackerChild.stdout.on('data', async (message) => {
            console.warn("scanner", message);

            message = message.toString()

            console.warn("scanner", message);

        });
        console.log("Started tracking")
    } catch (e) {
        console.error(e);
        Notifier.error(e);
    }
}

function launchScanner(command, scanType) {
    try {
        data = [];

        if (scannerChild) {
            scannerChild.kill()
        }

        if (findCommandSpawn) {
            findCommandSpawn.kill()
            findCommandSpawn = null;
        }

        let bufferArray = []

        try {
            scannerChild = childProcess.spawn(command, [Files.path(Files.getDataPath() + '/py/scanner.py')])
        } catch (e) {
            console.error(e)
            Notifier.error(i18next.t("Unable to start python script ") + e)
        }

        scannerChild.on('close', (code) => {
            console.log(`Python child process exited with code ${code}`);
        });

        scannerChild.stderr.on('data', (data) => {
            const str = data.toString()

            if (str.includes("Failed to execute")
            || (str.includes("No IPv4 address"))) {
                // Ignore these mac specific errors
                return;
            }

            console.error(str);
        })

        scannerChild.stdout.on('data', (message) => {
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
        const server = require('server');
        const { get, post } = server.router;
        const { render, redirect } = server.reply;

        // server(8129, ctx => {
        //     console.log("data", ctx.data)
        //     handleSocketResponse(ctx.data.data);
        //     return 'Hello world'
        // });
        findcommand();

        // document.getElementById('startCompanion').addEventListener("click", () => {
        //     module.exports.startItemTracker();
        // });
        // document.getElementById('stopCompanion').addEventListener("click", () => {
        //     console.log("Stopping companion")
        //     // itemTrackerChild.stdin.write('END\n');
        //     itemTrackerChild.stdin.pause();
        //     itemTrackerChild.kill();

        //     setDetector(false);
        // });
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

    startItemTracker: () => {
        // launchItemTracker(command);
    },

    end: async () => {
        try {
            scannerChild.stdin.write('END\n');

            if (!scannerChild) {
                console.error("No scan was started");
                Notifier.error("No scan was started");
                return
            }
            document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = i18next.t("Reading items, this may take up to 30 seconds...\nData will appear here after it is done."));

            console.log("Stop scanning")
            scannerChild.stdin.write('END\n');
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
        filterType = document.querySelector('input[name="heroImporterHeroRadio"]:checked').value;
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
        enhanceLimit = parseInt(document.querySelector('input[name="heroImporterEnhanceRadio"]:checked').value);
    } else if (scanType == "items") {
        enhanceLimit = parseInt(document.querySelector('input[name="gearImporterEnhanceRadio"]:checked').value);
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
                statAcc[type].ingameRolls += 1;
            }
        } else {
            // New stat
            statAcc[type] = {
                value: value,
                rolls: 1,
                ingameRolls: 1
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
    var mainValue = isFlat(mainOpType) ? mainOpValue : Utils.round10ths(mainOpValue * 100);
    if (mainValue == undefined || mainValue == null || isNaN(mainValue)) {
        mainValue = 0;
    }
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
    "set_shield": "ProtectionSet",
    "set_torrent": "TorrentSet",
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