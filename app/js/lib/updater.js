const { ipcRenderer } = require('electron');
global.ipcRenderer = ipcRenderer;
const currentVersion = "1.8.0";

global.TEST = false;
/********************************************************************************************
    Release checklist:
    - update changelog
    - set TEST = false
    - package jar
    - update version here
    - update version in app package.json
    - update repo in project package.json
    - yarn package
*********************************************************************************************/

/********************************************************************************************
    TODO:
    - Update grid initialization with languages
*********************************************************************************************/

module.exports = {

    getCurrentVersion: () => {
        return currentVersion;
    },
/*
- Hero tab double click
- Magnifying glass
*/
    showNewFeatures: (text) => {
        Dialog.showNewFeatures(

`
<h2>
    New in v1.8
</h2>
<ul class="newFeatures">
    <li>GPU acceleration for optimizer. (Disable in settings if issues arise)</li>
    <li>Multi-Optimizer tab for optimizing multiple units simultaneously</li>
    <li>Enhancing tab with item & substat rolls analyzer</li>
    <li>Click on the magnifying glass on an item to load analysis</li>
    <li>Customizable dark mode colors for the UI</li>
    <li>Penetration set damage bonus will be added to Dmg/Mcd calculations</li>
    <li>Double click a hero on the Heroes tab to load them in Optimizer tab</li>
    <li>Added an item attribute to disable modifications on the item</li>
    <li>Ehp and Mcd values can be previewed in filters</li>
    <li>Heroes tab now shows 5* hero indicators</li>
    <li>All scores now use reforged values</li>
    <li>Storage items can now be imported - Open storage menu during scan</li>
    <li>Added "Erase all data" button on Importer tab</li>
    <li>Added Japanese translation</li>
    <li>Added +0/3/6/9/12/15 gear and above optimizer setting</li>
    <li>Added score evaluation based on each unit's base stats</li>
</ul>
`
        );
    },

    checkForUpdates: async () => {
        //
        // try {
        //     const latestData = await fetch('https://api.github.com/repos/fribbels/Fribbels-Epic-7-Optimizer/releases/latest')
        //     const latestDataText = await latestData.text();
        //     const latestDataJson = JSON.parse(latestDataText);
        //     const latestVersion = latestDataJson.tag_name;

        //     if (latestVersion != currentVersion) {
        //         const shell = require('electron').shell;

        //         // assuming $ is jQuery
        //         $(document).on('click', 'a[href^="http"]', function(event) {
        //             event.preventDefault();
        //             shell.openExternal(this.href);
        //         });

        //         Dialog.htmlSuccessDisableOutsideClick(i18next.t("New version available: <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer/releases'>") + latestVersion + "<a>");
        //     }

        //     // console.error(latestDataJson);
        // } catch (e) {
        //     console.error(e)
        // }

        const version = document.getElementById('version');
        const versionPrefixText = i18next.t("Current version");
        version.innerText = versionPrefixText + ": v" + currentVersion;

        ipcRenderer.on('update_available', () => {
            Notifier.info(i18next.t("New version available, downloading now"));
        });
        ipcRenderer.on('update-not-available', () => {
        });
        ipcRenderer.on('test', (arg1, arg2) => {
            console.log("test", arg1, arg2)
        });
        ipcRenderer.on('check', (arg1, arg2) => {
            console.log("check", arg1, arg2)
            try {
                if (typeof arg2 === 'string' || arg2 instanceof String) {
                    const response = JSON.parse(arg2);
                    console.log(response);
                    const updateVersion = response.updateInfo.version;

                    if (currentVersion == updateVersion) {
                        Notifier.info(i18next.t("No new updates found"));
                    }
                } else {
                    const response = arg2;
                    console.log(response);
                    const updateVersion = response.updateInfo.version;

                    if (currentVersion == updateVersion) {
                        Notifier.info(i18next.t("No new updates found"));
                    }
                }
            } catch (e) {
                console.warn("Failed to parse IPC response", e)
                Notifier.info(i18next.t("No new updates found"));
            }
        });
        ipcRenderer.on('update_downloaded', async (arg1, arg2) => {
            console.log("update_downloaded", arg1, arg2)
            var response = await Dialog.updatePrompt("Update downloaded. It will be installed on restart. Restart app now?")

            if (response == 'restart') {
                await Subprocess.kill();
                restartApp();
            }
        });

        function restartApp() {
            ipcRenderer.send('restart_app');
        }


        document.getElementById('checkForUpdatesSubmit').addEventListener("click", async () => {
            Notifier.info(i18next.t("Checking for updates"));

            try {
                await HeroData.initialize();
            } catch (e) {
                console.error("Error refreshing hero data " + e)
            }

            ipcRenderer.send('check');
        });
    }
}