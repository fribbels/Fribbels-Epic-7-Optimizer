var fs = require('fs');

module.exports = {
    listFilesInFolder: (path) => {
        console.log("Finding files in " + path + ": ");

        var files = fs.readdirSync(path);
        files.forEach(file => {
          console.log(file);
        });

        return files;
    },

    readFile: (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', function read(err, data) {
                if (err) {
                    throw err;
                }

                resolve(data);
            });
        })
    },

    saveFile: (path, text) => {
        fs.writeFile(path, text, (err) => {
            if (err) 
                return console.log(err);
            console.log('Exported text to: ', path);
        });
    }
}