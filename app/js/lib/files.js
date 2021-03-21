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
            fs.readFile(module.exports.path(path), 'utf8', function read(err, data) {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        })
    },

    readFileSync: (path) => {
        data = fs.readFileSync(module.exports.path(path), 'utf8')

        return data;
    },

    saveFile: (path, text) => {
        fs.writeFileSync(module.exports.path(path), text);
        // fs.writeFile(module.exports.path(path), text, (err) => {
        //     if (err)
        //         return console.log(err);
        //     console.log('Exported text to: ', path);
        // });
    },

    createFolder: (folder) => {
        if (!fs.existsSync(module.exports.path(folder))) {
            fs.mkdirSync(module.exports.path(folder));
        }

        if (!fs.existsSync(module.exports.path(folder + "/empty-save.json"))) {
            module.exports.saveFile(folder + "/empty-save.json", '{"heroes":[],"items":[]}');
        }

        if (!fs.existsSync(module.exports.path(folder + "/autosave.json"))) {
            module.exports.saveFile(folder + "/autosave.json", '{"heroes":[],"items":[]}');
        }

        if (!fs.existsSync(module.exports.path(folder + "/settings.ini"))) {
            module.exports.saveFile(folder + "/settings.ini", JSON.stringify(Settings.getDefaultSettings()));
        }
    },

    isMac: () => {
        return os.platform() == 'darwin';
    },

    path: (path) => {
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