var fs = require('fs');
const { remote } = require('electron');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const treekill  = require('tree-kill');
global.child = null;
global.pid = null;

const electron = require('electron');
const ipc = electron.ipcRenderer;

const { killPortProcess } = require('kill-port-process');
// const { default: i18next } = require('i18next');

var errors = "";
var killed = false;
var initialized = false;

const defaultJavaError = `Unable to load Java. Please check that you have the <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#installing-the-app'>64-bit version of Java 8</a> installed and restart your computer. If you already have Java installed, follow this guide to <a href='https://www.geeksforgeeks.org/how-to-set-java-path-in-windows-and-linux/amp/'>set your Java path.</a>`;

module.exports = {
    kill: async() => {
        try {
            console.log("Try killport")
            const killPortOutput = await killPortProcess(8130)
            console.log("Done killport", killPortOutput);
        } catch (e) {
            console.warn("Error killing existing subprocess", e);
        }
    },

    initialize: async (callback) => {
        console.log("Initialize backend, checking javaversion")
        javaversion(function(err, notRecognized, notCorrectVersion, not64Bit) {
            if (err) {
                Notifier.warn("Unable to detect java version");
                return;
            }

            if (notRecognized) {
                Dialog.htmlError(defaultJavaError);
                return;
            }

            if (not64Bit) {
                Dialog.htmlError(defaultJavaError);
                return;
            }
        })

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        console.log("Finished calling javaversion")

        if (TEST == false) {
            // try {
            //     await module.exports.kill();
            // } catch (e) {
            //     console.warn("Error killing port")
            // }
        }

        console.log("Spawning backend child")

        var maxRamGb = parseInt(Settings.parseNumberValue('settingMaxRamGb') || 6);

        // child = spawn('java', ['-jar', '-XX:MaxRAMFraction=1', `"${Files.getDataPath() + '/jar/backend.jar'}"`], {
        child = spawn('java', ['-jar', `-Xmx${maxRamGb}G`, `"${Files.getDataPath() + '/jar/backend.jar'}"`], {
            shell: true, stdio: ['pipe', 'pipe', 'pipe'], detached: false
        })
        pid = child.pid;

        console.log("Child PID: ", pid, initialized)

        child.stdout.on('data', (data) => {
            if (!initialized) {
                initialized = true;
                callback()
                var str = data.toString();
                console.log(str);
            } else {

            }
        });

        setInterval(() => {
            if (child) {
                try {
                    child.stdout.write("");
                } catch (e) {
                    console.warn(e)
                }
            }
        }, 100)

        child.on('close', (code) => {
            console.log(`Java child process exited with code ${code}`);

            if (code == 0 || killed == true) {
                return;
            }

            Notifier.error(`${i18next.t("Java subprocess errors")}: ${errors}`)
            Dialog.htmlError(defaultJavaError);
        });

        child.on('error', (e) => {
            console.error("Subprocess error: " + e);
            console.warn(e)
        });

        child.stderr.on('data', (data) => {
            const str = data.toString()

            if (str.includes("aparapi") && str.includes("Ensure that OpenCL is in your PATH (windows) or in LD_LIBRARY_PATH (linux).")) {
                
            } else if (str.includes("untested")) {
                
            } else if (str.includes("aparapi")) {
                Notifier.error("Subprocess error. If you are using GPU acceleration, try disabling it on the settings tab.\n" + str);
            } else {
                Notifier.error("Subprocess error - " + str);
            }

            errors += data.toString();
        })

        ipc.on('app-close', _ => {
            killed = true;
            treekill(child.pid, 'SIGTERM', () => {
                ipc.send('closed');
            });
            if (scannerChild)
                scannerChild.kill()
            if (itemTrackerChild)
                itemTrackerChild.kill()
            if(findCommandSpawn)
                findCommandSpawn.kill()
        });

        window.onbeforeunload = (e) => {
            killed = true;
            // mainWindow.webContents.send('app-unload');
            treekill(child.pid, 'SIGTERM', () => {
                console.log("Terminated child");
            });
            if (scannerChild)
                scannerChild.kill()
            if (itemTrackerChild)
                itemTrackerChild.kill()
            if(findCommandSpawn)
                findCommandSpawn.kill()
            Scanner.end();
        };

        console.log("Finished initializing subprocess")

        return child;
    },

    sendString: (str) => {
        fs.writeFile('request.txt', str, (err) => {
            if (err) {
                Notifier.error("Failed to send string to subprocess");
                return console.error(err);
            }
            console.log('Wrote request to file');

            child.stdin.setEncoding('utf-8');
            child.stdin.write('request.txt' + "\n");
        });
    }
}

function javaversion(callback) {
    var spawn = require('child_process').spawn('java', ['-version']);

    spawn.on('error', function(err){
        return callback(err, null);
    })

    spawn.stderr.on('data', function(data) {
        data = data.toString()

        console.log("Detecting java:", data);

        if (data && data.includes("VM") && !data.includes("64-Bit")) {
            return callback(null, false, false, true);
        }

        if (data && data.includes("not recognized")) {
            return callback(null, true, false, true);
        }
    });
}
