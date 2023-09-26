const { ipcRenderer } = require('electron');
global.ipcRenderer = ipcRenderer;
const currentVersion = "1.9.2";

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

    Patch update checklist
    - Update server temp unit ids
    - Update server temp items
    - Scan artifact ids, update artifact file
    - Download unit images
    - Upload herodata copy to server
    - Skill multipliers

*********************************************************************************************/

/********************************************************************************************
    TODO:
    - Update grid initialization with languages
*********************************************************************************************/

module.exports = {

    getCurrentVersion: () => {
        return currentVersion;
    },
    showNewFeatures: (text) => {
        Dialog.showNewFeatures(

`
<h2>
    New in v1.9.2
</h2>
<ul class="newFeatures">
    <li>Artifact & self imprint display on optimizer tab</li>
    <li>Per-item gs filter for optimization</li>
    <li>Equipped column in optimizer tab</li>
    <li>Automatic importer improvements & added support for CN server</li>
    <li>Added final atk/hp/def multipliers in bonus stats for calculating Lethe artifact for example</li>
    <li>Resizable item/hero/build grids</li>
</ul>
<h2>
    New in v1.9.0
</h2>
<ul class="newFeatures">
    <li>Added damage calculations for hero S1/S2/S3 scaling multipliers</li>
    <li>Added item enhancing simulator on Enhancing tab which predicts the probabilities of gear score ranges of upgrading an unfinished item to +15, along with its maximum substat mod potential</li>
    <li>Added build score (BS) rating which takes into account gear score, along item main stats and hero-specific flat stat to percent equivalents</li>
    <li>Added inventory item finder. Set your inventory width in settings, and click the target icon on items to locate them in your inventory</li>
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
        version.innerText = ": v" + currentVersion;

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
