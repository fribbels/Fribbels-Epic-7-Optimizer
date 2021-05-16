const { ipcRenderer } = require('electron');
global.ipcRenderer = ipcRenderer;
const currentVersion = "1.6.6";

global.TEST = false;
/********************************************************************************************
    Release checklist:
    - set TEST = false
    - package jar
    - update version here + package.json
    - update repo in package.json
*********************************************************************************************/

module.exports = {

    getCurrentVersion: () => {
        return currentVersion;
    },

    showNewFeatures: (text) => {
        Dialog.showNewFeatures(
`
<h2>
    New in v1.7.0
</h2>
<ul class="newFeatures">
    <li>Hero importer can now load your ingame units with their ingame gear</li>
    <li>Optimization with substat modification stones</li>
    <li>Drag-and-drop hero priority sorting</li>
    <li>New filter: Hero priority - to allow taking gear from lower priority units</li>
    <li>New filter: Number of conversion reforges</li>
    <li>New priority score column and filter</li>
    <li>Stat priority filter now also considers main stats</li>
    <li>Added 5 star hero stats under bonus stats</li>
    <li>Updated stats for Senya, Researcher Carrot, Chaos Sect Axe</li>
    <li>Windows installer and automatic updates</li>
    <li>New Information tab for updates and links</li>
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
        version.innerText = 'Current version: v' + currentVersion;

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
            ipcRenderer.send('check');
        });
    }
}