const currentVersion = "v1.5.0";

module.exports = {
    checkForUpdates: async () => {
        //
        try {
            const latestData = await fetch('https://api.github.com/repos/fribbels/Fribbels-Epic-7-Optimizer/releases/latest')
            const latestDataText = await latestData.text();
            const latestDataJson = JSON.parse(latestDataText);
            const latestVersion = latestDataJson.tag_name;

            if (latestVersion != currentVersion) {
                const shell = require('electron').shell;

                // assuming $ is jQuery
                $(document).on('click', 'a[href^="http"]', function(event) {
                    event.preventDefault();
                    shell.openExternal(this.href);
                });

                Dialog.htmlSuccess("New version available: <a href='https://github.com/fribbels/Fribbels-Epic-7-Optimizer/releases'>" + latestVersion + "<a>");
            }

            // console.error(latestDataJson);
        } catch (e) {
            console.error(e)
        }
    }
}
