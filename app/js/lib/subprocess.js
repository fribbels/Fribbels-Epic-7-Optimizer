var fs = require('fs');
const { remote } = require('electron');
// var exec = require('child_process').exec, child;
const { exec } = require('child_process');
const { spawn } = require('child_process');
const treekill  = require('tree-kill');
var child;

const electron = require('electron');
const ipc = electron.ipcRenderer;

module.exports = {

    initialize: () => {
        // return;

        child = spawn('java', ['-jar', `"${Path.resolve(__dirname, '../../../resources/gear.jar')}"`], {shell: true, detached: false})

        child.on('close', (code) => {
            console.log(`Java child process exited with code ${code}`);
        });

        child.stderr.on('data', (data) => {
            console.error(data.toString());
        })

        child.stdout.on('data', (data) => {
            // try {
            // var str = data.toString();
            // console.log(str);

            // if (str.includes("PROGRESS:")) {
            //     var progressStr = Number(str.split('[').pop().split(']')[0]).toLocaleString();
            //     var estimationStr = $('#estimatedPermutations').text();
            //     var estimationStrArr = estimationStr.split('/');
            //     var estimationNumStr = estimationStrArr[estimationStrArr.length - 1];
            //     var finalStr = progressStr + " / " + estimationNumStr;

            //     $('#estimatedPermutations').text(finalStr);
            // }
        });

        ipc.on('app-close', _ => {
            treekill(child.pid, 'SIGTERM', () => {
                ipc.send('closed');
            });
        });

        window.onbeforeunload = (e) => {
            // mainWindow.webContents.send('app-unload');
            treekill(child.pid, 'SIGTERM', () => {
                console.log("Terminated child");
            });
        };
        
        return child;
    },

    sendString: (str) => {
        fs.writeFile('request.txt', str, (err) => {
            if (err) 
                return console.error(err);
            console.log('Wrote request to file');

            child.stdin.setEncoding('utf-8');
            child.stdin.write('request.txt' + "\n");
        });
    }
}