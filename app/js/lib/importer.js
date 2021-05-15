const fs = require('fs');
const { remote } = require('electron')
const dialog = remote.dialog;
const currentWindow = remote.getCurrentWindow();

const documentsPath = remote.app.getPath('documents');
const savesFolder = documentsPath + '/FribbelsOptimizerSaves';

const defaultPath = savesFolder;

module.exports = {

    addEventListener: () => {
        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                var disable = document.getElementsByClassName("collapsible");
                for (var j = 0; j < disable.length; j++) {
                    if (disable[j] == this) {
                        continue;
                    }
                    disable[j].classList.remove('active')
                    var content = disable[j].nextElementSibling;
                    content.style.display = "none";
                }

                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }

        document.querySelectorAll('[id=loadIngameGearStart]').forEach(x => x.addEventListener("click", async () => {
            Scanner.start("items");
        }));

        document.querySelectorAll('[id=loadIngameGearHeroesStart]').forEach(x => x.addEventListener("click", async () => {
            Scanner.start("heroes");
        }));

        document.querySelectorAll('[id=loadIngameGearEnd]').forEach(x => x.addEventListener("click", async () => {
            Scanner.end();
        }));

        document.getElementById('fileReadSubmit').addEventListener("click", async () => {
            const options = {
                title: "Open folder",
                defaultPath : Files.path(Settings.getDefaultPath() + 'gear.txt'),
                buttonLabel : "Open folder",
                properties: ['openDirectory'],
                // filters :[
                //     {name: 'TEXT', extensions: ['txt']},
                // ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];
            const filesInFolder = Files.listFilesInFolder(Files.path(path));
            const fullFilenames = filesInFolder.filter(x => !x.includes('debug'))
                                               .map(x => path + "/" + x);

            console.log("FILENAMES", fullFilenames);

            $('#fileReadSubmitOutputText').text(`${i18next.t('Reading data from')} ${fullFilenames.length} ${i18next.t('screenshots.')}.`)

            Ocr.readGearFiles(fullFilenames).then((data) => {
                const items = data.items;
                const failed = data.failed;

                Notifier.success("Finished reading screenshots");
                $('#fileReadSubmitOutputText').html(`${i18next.t('Finished reading')} ${fullFilenames.length} ${i18next.t('screenshots.')} \n${items.length} ${i18next.t('screenshots succeded')}, ${failed.length} ${i18next.t('failed')}. ${failed.length > 0 ? i18next.t("Failed files are:")+ "<br>" + failed.join("<br>") : ""} `)

                console.log("SERIALIZING");
                var serializedStr = "{\"items\":" + ItemSerializer.serialize(items) + "}";

                document.getElementById('exportOutputText').value = serializedStr;
            }).catch(e => {
                console.error(e)
                Dialog.error(i18next.t("Error occurred while reading screenshots")+"\n" + e);
            });
        });

        function isEpermError(e) {
            return e != null && JSON.stringify(e).includes('EPERM');
        }


        document.getElementById('saveExportOutput').addEventListener("click", async () => {
            const output = document.getElementById('exportOutputText').value;

            if (!output || output.length == 0) {
                Notifier.error("Nothing to export yet, please select a folder");
                return;
            }

            if (output.includes('Reading screenshots in progress...')) {
                Notifier.error("Screenshot reading in progress, please wait");
                return;
            }

            const options = {
                title: "Save file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Save file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filename = dialog.showSaveDialogSync(currentWindow, options);
            if (!filename) return;

            fs.writeFile(Files.path(filename), output, (err) => {
                if (err) {
                    console.error(err)
                    if (isEpermError(err)) {
                        Dialog.error("Unable to save file. Please try disabling your antivirus, or add the app as an exception, then restarting the app in admin mode.")
                    } else {
                        Notifier.error(i18next.t("Unable to write file") + filename + " - " + err);
                    }
                    return;
                }
                console.log('Exported gear.txt');
                $('#screenshotExportOutputText').text(`${i18next.t('Exported data to')} ${filename}`)
            });
        });

        document.querySelectorAll('[id=saveLoadFromGameExportOutput]').forEach(x => x.addEventListener("click", async () => {
            const output = document.getElementById('loadFromGameExportOutputText').value;

            if (!output || output.length == 0) {
                Notifier.error("Nothing to export yet, please follow the steps to import gear");
                return;
            }

            if (output.includes('Started scanning') || output.includes('Reading items')) {
                Notifier.error("Item reading in progress, please wait");
                return;
            }

            const options = {
                title: "Save file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Save file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }

            const filename = dialog.showSaveDialogSync(currentWindow, options);
            if (!filename) return;

            fs.writeFile(Files.path(filename), output, (err) => {
                if (err) {
                    console.error(err)
                    if (isEpermError(err)) {
                        Dialog.error("Unable to save file. Please try disabling your antivirus, or add the app as an exception, then restarting the app in admin mode.")
                    } else {
                        Notifier.error(i18next.t("Unable to write file") + filename + " - " + err);
                    }
                    return;
                }
                console.log('Exported gear.txt');
                document.querySelectorAll('[id=loadFromGameExportOutputText]').forEach(x => x.value = `${i18next.t('Exported data to')} ${filename}`);
            });
        }));

        // document.getElementById('importFileSelect').addEventListener("click", async () => {
        //     const options = {
        //         title: "Load file",
        //         defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
        //         buttonLabel : "Load file",
        //         filters :[
        //             {name: 'TEXT/JSON', extensions: ['txt', 'json']},
        //         ]
        //     }
        //     const filenames = dialog.showOpenDialogSync(currentWindow, options);
        //     console.log(filenames);

        //     if (!filenames || filenames.length < 1) {
        //         return console.warn("Invalid filename")
        //     };

        //     const path = filenames[0];pps":0,"dmg":0,"

        //     fs.readFile(Files.path(path), 'utf8', async function read(err, data) {
        //         if (err) {
        //             throw err;
        //         }

        //         $('#importOutputText').text(i18next.t('Parsing data..'))

        //         const parsedData = JSON.parse(data);
        //         console.log("PARSEDDATA", parsedData);
        //         const items = parsedData.items;
        //         const heroes = parsedData.heroes;
        //         // const deserializedData = ItemSerializer.deserialize(data);
        //         // const items = deserializedData.items;
        //         console.log("ITEMS", items);
        //         ItemAugmenter.augment(items);

        //         await Api.setItems(items);
        //         await Api.setHeroes([]);

        //         $('#importOutputText').text(`${i18next.t('Imported')} ${items.length} ${i18next.t('items from')} ${path}`)
        //     });
        // })

        document.getElementById('importScreenshotsFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];

            const data = await Files.readFileSync(Files.path(path));

            try {
                $('#importScreenshotsOutputText').text(i18next.t('Parsing data..'))

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes;

                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                await Api.mergeItems(items, 0);

                $('#importScreenshotsOutputText').text(`${i18next.t('Merged')} ${items.length} ${i18next.t('items from')} ${path}`)
            } catch (e) {
                Dialog.htmlError(i18next.t("Error occurred while parsing gear. Check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#installing-the-app'>64-bit version of Java 8</a> installed and try again.") + e);
                console.error(e)
            }
        })

        document.getElementById('importAppendFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];

            const data = await Files.readFileSync(Files.path(path));

            try {
                $('#importAppendOutputText').text(i18next.t('Parsing data..'))

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes;

                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                const confirm = await Dialog.confirmation("Add new items to your existing items? This can cause duplicate items if screenshots include existing gear. Use this only for the screenshot importer. If you want to update your existing gear with new screenshots, use the Merge option instead.");
                if (!confirm) {
                    return;
                }

                await Api.addItems(items);

                $('#importAppendOutputText').text(`${i18next.t('Appended')} ${items.length} ${i18next.t('items from')} ${path}`)
            } catch (e) {
                Dialog.htmlError(i18next.t("Error occurred while parsing gear. Check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#installing-the-app'>64-bit version of Java 8</a> installed and try again.") + e);
                console.error(e)
            }
        })


        document.getElementById('importMergeFileSelect').addEventListener("click", async () => {
            const enhanceLimit = parseInt($('#importLimitEnhance').val());
            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];


            try {
                const data = Files.readFileSync(Files.path(path));
                $('#importMergeOutputText').text(i18next.t('Parsing data..'))

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes;

                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                await Api.mergeItems(items, enhanceLimit);

                $('#importMergeOutputText').text(`${i18next.t('Merged')} ${items.length} ${i18next.t('items from')} ${path}`)

                Saves.autoSave()
            } catch (e) {
                Dialog.htmlError(i18next.t("Error occurred while parsing gear. Check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#installing-the-app'>64-bit version of Java 8</a> installed and try again.") + e);
                console.error(e);
            }
        })

        document.getElementById('importMergeHeroesFileSelect').addEventListener("click", async () => {
            const enhanceLimit = parseInt($('#importHeroesLimitEnhance').val());
            const heroFilter = $('#importHeroesLimitHeroes').val();

            const options = {
                title: "Load file",
                defaultPath : Files.path(Settings.getDefaultPath() + '/gear.txt'),
                buttonLabel : "Load file",
                filters :[
                    {name: 'TEXT', extensions: ['txt']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const path = filenames[0];

            var data = fs.readFileSync(Files.path(path), {encoding:'utf8', flag:'r'});

            $('#importMergeHeroesOutputText').text(i18next.t('Opening file..'))

            try {
                $('#importMergeHeroesOutputText').text(i18next.t('Parsing data..'))

                const parsedData = JSON.parse(data);
                console.log("PARSEDDATA", parsedData);
                const items = parsedData.items;
                const heroes = parsedData.heroes || [];
                const filteredHeroes = []


                for (var hero of heroes) {
                    const heroName = hero.name;
                    const newHero = HeroesTab.getNewHeroByName(heroName);
                    if (!newHero) {
                        continue;
                    }

                    newHero.rarity = newHero.data.rarity;
                    newHero.attribute = newHero.data.attribute;
                    newHero.role = newHero.data.role;
                    newHero.path = heroName;
                    newHero.stars = hero.stars;

                    hero.data = newHero;
                    filteredHeroes.push(hero);
                }

                console.log("ITEMS", items);
                ItemAugmenter.augment(items);

                const confirm = await Dialog.confirmation("Are you sure you want to overwrite the optimizer's hero data with ingame hero data?");
                if (!confirm) {
                    return;
                }

                await Api.mergeHeroes(items, filteredHeroes, enhanceLimit, heroFilter);

                $('#importMergeHeroesOutputText').text(`${i18next.t('Merged')} ${items.length} ${i18next.t('items from')} ${path}`)

                Saves.autoSave()
            } catch (e) {
                Dialog.htmlError(i18next.t("Error occurred while parsing gear. Check that you have <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer#installing-the-app'>64-bit version of Java 8</a> installed and try again.") + e);
                console.error(e)
            }
        });

        document.getElementById('importZarrocSaveFileSelect').addEventListener("click", async () => {
            const options = {
                title: "Load file",
                // defaultPath : defaultPath,
                buttonLabel : "Load file",
                filters :[
                    {name: 'JSON', extensions: ['json']},
                ]
            }
            const filenames = dialog.showOpenDialogSync(currentWindow, options);
            console.log(filenames);

            if (!filenames || filenames.length < 1) {
                return console.warn("Invalid filename")
            };

            const data = await Files.readFileSync(filenames[0]);

            const parsedData = JSON.parse(data);
            console.log("PARSEDDATA", parsedData);
            var items = parsedData.items || [];
            var heroes = parsedData.heroes || [];

            console.log("ITEMS", items);

            items = items.map(item => ZarrocConverter.reverseConvertItem(item))
            heroes = heroes.map(hero => ZarrocConverter.reverseConvertHero(hero))
            console.log("CONVERTEDITEMS", items);
            console.log("CONVERTEDHEROES", heroes);
            ItemAugmenter.augment(items);

            ZarrocConverter.attachItemsToHeroes(items, heroes);
            await Api.setItems(items);
            await Api.setHeroes(heroes);

            HeroesTab.redrawHeroInputSelector();

            $('#importZarrocSaveFileSelectOutputText').text(`${i18next.t('Loaded')} ${heroes.length} ${i18next.t('heroes and')} ${items.length} ${i18next.t('items from')} ${filenames[0]}`)
        })
    }
}
