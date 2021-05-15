var fs = require('fs');
const { remote } = require('electron');
const { exec } = require('child_process');
const { spawn } = require('child_process');
const treekill  = require('tree-kill');
global.child = null;
global.pid = null;

const electron = require('electron');
const ipc = electron.ipcRenderer;

const killPort = require('kill-port')

var errors = "";
var killed = false;
var initialized = false;

const defaultJavaError = `Unable to load Java. Please check that you have the <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#installing-the-app'>64-bit version of Java 8</a> installed and restart your computer.`;

module.exports = {
    kill: async() => {
        try {
            const killPortOutput = await killPort(8130, 'tcp')
            console.log(killPortOutput);
        } catch (e) {
            console.warn("Error killing existing subprocess", e);
        }
    },

    initialize: async (callback) => {
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

        await module.exports.kill();

        child = spawn('java', ['-jar', '-Xmx4096m', `"${Files.getDataPath() + '/jar/backend.jar'}"`], {shell: true, detached: false})
        pid = child.pid;

        child.on('close', (code) => {
            console.log(`Java child process exited with code ${code}`);

            if (code == 0 || killed == true) {
                return;
            }

            Notifier.error(`Java subprocess errors: ${errors}`)
            Dialog.htmlError(defaultJavaError);
        });

        child.stderr.on('data', (data) => {
            const str = data.toString()
            console.error(str);
            Notifier.error("Subprocess error - " + str);
            errors += data.toString();
        })

        child.stdout.on('data', (data) => {
            if (!initialized) {
                initialized = true;
                callback()
                // var str = data.toString();
                // console.log(str);
            } else {

            }
        });

        ipc.on('app-close', _ => {
            killed = true;
            treekill(child.pid, 'SIGTERM', () => {
                ipc.send('closed');
            });
        });

        window.onbeforeunload = (e) => {
            killed = true;
            // mainWindow.webContents.send('app-unload');
            treekill(child.pid, 'SIGTERM', () => {
                console.log("Terminated child");
            });
        };

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
console.log('1');
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
