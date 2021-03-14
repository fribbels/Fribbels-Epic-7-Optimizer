var fs = require('fs');
var os = require('os');
var path = require("path");
var electron = require('electron');

module.exports = {
    listFilesInFolder: (path) => {
        console.log("Finding files in " + path + ": ");

        var files = fs.readdirSync(module.exports.path(path));
        files.forEach(file => {
          console.log(file);
        });

        return files;
    },

    readFile: (path) => {
        return new Promise((resolve, reject) => {
            console.log(11)

            fs.readFile(module.exports.path(path), 'utf8', function read(err, data) {
                console.log(12)

                if (err) {
                    console.log(13)

                    reject(err);
                }

                console.log(14)

                resolve(data);
            });
        })
    },

    readFileSync: (path) => {
        console.log(33)
        data = fs.readFileSync(module.exports.path(path), 'utf8')

        console.log(34)
        return data;
    },

    saveFile: (path, text) => {
        // fs.writeFileSync(module.exports.path(path), text);
        fs.writeFile(module.exports.path(path), text, (err) => {
            if (err)
                return console.log(err);
            console.log('Exported text to: ', path);
        });
    },

    createFolder: (folder) => {
        if (!fs.existsSync(module.exports.path(folder))) {
            fs.mkdirSync(module.exports.path(folder));

            module.exports.saveFile(folder + "/empty-save.json", '{"heroes":[],"items":[]}');
            module.exports.saveFile(folder + "/settings.ini", JSON.stringify(Settings.getDefaultSettings()));
        }
    },

    isMac: () => {
        console.log(22)

        return os.platform() == 'darwin';
    },

    path: (path) => {
        console.log(21)

        return module.exports.isMac() ?
                path.replace(/\//g, "/") :
                path.replace(/\//g, "\\");
    },

    getRootPath: () => {
        if (os.platform() == 'darwin') {
            if (__dirname.includes('app.asar')) {
                return path.resolve(electron.remote.app.getAppPath(), '../../');
            }
            return path.resolve(electron.remote.app.getAppPath(), '../');
        }

        if (__dirname.includes('app.asar')) {
            return path.dirname(electron.remote.app.getPath("exe"));
        }
        return path.resolve(electron.remote.app.getAppPath(), '../')
    },

    getDataPath: () => {
        return module.exports.getRootPath() + "/data"
    },
}