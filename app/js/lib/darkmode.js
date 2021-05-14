var dark = false;

/*
Handles the toggle between light/dark mode. Switches the CSS and each changed asset.
*/

module.exports = {

    isDark: () => {
        return dark;
    },

    toggle: () => {
        dark = document.getElementById('darkSlider').checked;
        if (dark) {
            $("#darkThemeCss").attr("disabled", false);
            dark = true;

            $("#mainStatAttackPercentFilterIcon").attr("src", "./assets/statatkpercent_dt.png")
            $("#mainStatCdFilterIcon").attr("src", "./assets/statcd_dt.png")
            $("#mainStatAttackFilterIcon").attr("src", "./assets/statatk_dt.png")
            $("#mainStatCrFilterIcon").attr("src", "./assets/statcr_dt.png")
            $("#mainStatHealthPercentFilterIcon").attr("src", "./assets/stathppercent_dt.png")
            $("#mainStatEffFilterIcon").attr("src", "./assets/stateff_dt.png")
            $("#mainStatHealthFilterIcon").attr("src", "./assets/stathp_dt.png")
            $("#mainStatEffResFilterIcon").attr("src", "./assets/statres_dt.png")
            $("#mainStatSpeedFilterIcon").attr("src", "./assets/statspd.png")
            $("#mainStatDefenseFilterIcon").attr("src", "./assets/statdef_dt.png")
            $("#mainStatDefensePercentFilterIcon").attr("src", "./assets/statdefpercent_dt.png")

            $("#subStatAttackPercentFilterIcon").attr("src", "./assets/statatkpercent_dt.png")
            $("#subStatCdFilterIcon").attr("src", "./assets/statcd_dt.png")
            $("#subStatAttackFilterIcon").attr("src", "./assets/statatk_dt.png")
            $("#subStatCrFilterIcon").attr("src", "./assets/statcr_dt.png")
            $("#subStatHealthPercentFilterIcon").attr("src", "./assets/stathppercent_dt.png")
            $("#subStatEffFilterIcon").attr("src", "./assets/stateff_dt.png")
            $("#subStatHealthFilterIcon").attr("src", "./assets/stathp_dt.png")
            $("#subStatEffResFilterIcon").attr("src", "./assets/statres_dt.png")
            $("#subStatSpeedFilterIcon").attr("src", "./assets/statspd.png")
            $("#subStatDefenseFilterIcon").attr("src", "./assets/statdef_dt.png")
            $("#subStatDefensePercentFilterIcon").attr("src", "./assets/statdefpercent_dt.png")

            $("#clearAllFilterIcon").attr("src", "./assets/trash_dt.png")
            $("#duplicateFilterIcon").attr("src", "./assets/copy_dt.png")
            $("#unequippedFilterIcon").attr("src", "./assets/unequipped_dt.png")
            $("img.tooltipImageLeft").attr("src", "./assets/tooltip_dt.png")
            $("img.tooltipImageRight").attr("src", "./assets/tooltip_dt.png")

            OptimizerGrid.toggleDarkMode(true);
            ItemsGrid.toggleDarkMode(true);
            HeroesGrid.toggleDarkMode(true);
        } else {
            $("#darkThemeCss").attr("disabled", true);
            dark = false;

            $("#mainStatAttackPercentFilterIcon").attr("src", "./assets/statatkpercentdark.png")
            $("#mainStatCdFilterIcon").attr("src", "./assets/statcddark.png")
            $("#mainStatAttackFilterIcon").attr("src", "./assets/statatkdark.png")
            $("#mainStatCrFilterIcon").attr("src", "./assets/statcrdark.png")
            $("#mainStatHealthPercentFilterIcon").attr("src", "./assets/stathppercentdark.png")
            $("#mainStatEffFilterIcon").attr("src", "./assets/stateffdark.png")
            $("#mainStatHealthFilterIcon").attr("src", "./assets/stathpdark.png")
            $("#mainStatEffResFilterIcon").attr("src", "./assets/statresdark.png")
            $("#mainStatSpeedFilterIcon").attr("src", "./assets/statspddark.png")
            $("#mainStatDefenseFilterIcon").attr("src", "./assets/statdefdark.png")
            $("#mainStatDefensePercentFilterIcon").attr("src", "./assets/statdefpercentdark.png")

            $("#subStatAttackPercentFilterIcon").attr("src", "./assets/statatkpercentdark.png")
            $("#subStatCdFilterIcon").attr("src", "./assets/statcddark.png")
            $("#subStatAttackFilterIcon").attr("src", "./assets/statatkdark.png")
            $("#subStatCrFilterIcon").attr("src", "./assets/statcrdark.png")
            $("#subStatHealthPercentFilterIcon").attr("src", "./assets/stathppercentdark.png")
            $("#subStatEffFilterIcon").attr("src", "./assets/stateffdark.png")
            $("#subStatHealthFilterIcon").attr("src", "./assets/stathpdark.png")
            $("#subStatEffResFilterIcon").attr("src", "./assets/statresdark.png")
            $("#subStatSpeedFilterIcon").attr("src", "./assets/statspddark.png")
            $("#subStatDefenseFilterIcon").attr("src", "./assets/statdefdark.png")
            $("#subStatDefensePercentFilterIcon").attr("src", "./assets/statdefpercentdark.png")

            $("#clearAllFilterIcon").attr("src", "./assets/trash.png")
            $("#duplicateFilterIcon").attr("src", "./assets/copy.png")
            $("#unequippedFilterIcon").attr("src", "./assets/unequipped.png")
            $("img.tooltipImageLeft").attr("src", "./assets/tooltip.png")
            $("img.tooltipImageRight").attr("src", "./assets/tooltip.png")

            OptimizerGrid.toggleDarkMode(false);
            ItemsGrid.toggleDarkMode(false);
            HeroesGrid.toggleDarkMode(false);
        }
    },

    initialize: () => {
        document.getElementById('darkSlider').addEventListener("click", () => {
            module.exports.toggle();
        });
    }
}
