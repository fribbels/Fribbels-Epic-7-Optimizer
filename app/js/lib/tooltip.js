/* eslint-disable */
const tippy = require('tippy.js').default;

tippy.setDefaultProps({
    allowHTML: true,
    placement: 'auto',
    maxWidth: 550,
});

module.exports = {
    displayItem: (element, html) => {
        tippy('#' + element, {
            allowHTML: true,
            placement: 'auto',
            maxWidth: 550,
            content: html
        })
    },

    initialize: () => {
//         tippy('#forceModeTooltip', {
//             content:
// `
// '<p>'+i18next.t("
// Choose how many substats you want to match the force filters.
// "Force at least 2 substats" means to search only gears matching at least 2 stat rows from the force panel.
// ")+'</p>'
// '<p>'+i18next.t("
// The substat priority filter should be doing most of the filtering for you. Only this when you have have a very specific substat requirement.
// ")+'</p>'

// '<p>'+i18next.t("
// Examples:</br>
// Force at least one: Speed > 10 for speed units.</br>
// Force at least one: Hp % / Def % / Speed, for tanks.</br>
// Force at least two: Atk / Atk % / Cr / Cd / Speed, for dps units.</br>
// ")+'</p>'
// `
//         });

        tippy('#accessoryMainStatsTooltip', {
          content: '<p>'+i18next.t("Choose the desired main stats for accessories. Multiple options can be selected per slot.")+'</p>'
        });

        tippy('#setsTooltip', {
          content: '<p>'+i18next.t("Choose the desired gear sets. Multiple options can be selected per slot. The first slot must be either only 4 piece or 2 piece sets.")+'</p>'
        });

        tippy('#excludeTooltip', {
          content: '<p>'+i18next.t("Choose any sets you don't want included in the search.")+'</p>'
        });

//         tippy('#forceTooltip', {
//             content:
// `
// '<p>'+i18next.t("
// See the force mode tooltip for more info.
// ")+'</p>'

// '<p>'+i18next.t("
// Select required substats to use with the force mode. Left column is min (inclusive) and right column is max (inclusive).
// ")+'</p>'

// '<p>'+i18next.t("
// Force filter is automatically disabled when no forced substats are specified.
// ")+'</p>'
// `
//         });

        tippy('#filterStatsTooltip', {
            content: '<p>'+i18next.t("Select substat filters to filter results by. Left column is min (inclusive) and right column is max (inclusive).")+'</p>'});

        tippy('#filterRatingsTooltip', {
            content:

'<p>'+i18next.t("Select rating filters to filter results by. Ratings are stats that aren't seen in the game, but are useful for comparing builds.  Left column is min (inclusive) and right column is max (inclusive).")+'</p>'
+'<p>'+i18next.t("<b>Cp - </b> Combat power, as you would find it ingame, but without factoring in skill enhances. Useful for workd boss units.")+'</p>'
+'<p>'+i18next.t("<b>HpS - </b> Hp * Speed rating, for comparing fast/health builds, disregaring defense. Example health scaling units: Krau, Fceci.")+'</p>'
+'<p>'+i18next.t("<b>Ehp - </b> Effective Hp, for comparing how much damage a unit can take. Formula: HP * (Defense/300 + 1).")+'</p>'
+'<p>'+i18next.t("<b>EhpS - </b> Effective Hp * Speed rating, for comparing fast/tanky builds.")+'</p>'
+'<p>'+i18next.t("<b>Dmg - </b> Average damage rating, measures how much damage your unit will deal on average, factoring in crit chance & damage.")+'</p>'
+'<p>'+i18next.t("<b>DmgS - </b> Average damage * Speed rating, measures average damage vs speed.")+'</p>'
+'<p>'+i18next.t("<b>Mcd - </b> Max crit damage rating, measures damage at 100% crit chance. Example units: Arby, JKise.")+'</p>'
+'<p>'+i18next.t("<b>McdS - </b> Max crit damage * Speed rating, measures damage at 100% crit chance vs speed.")+'</p>'
+'<p>'+i18next.t("<b>DmgH - </b> Dmg * Hp rating, average damage rating, scaled by your units health. Useful for HP scaling bruisers.")+'</p>'
+'<p>'+i18next.t("<b>Score - </b> Sum of gear score of all 6 pieces.")+'</p>'
+'<p>'+i18next.t("<b>Prio - </b> Sum of priority score of all 6 pieces, calculated using the Substat Priority filter values.")+'</p>'
+'<p>'+i18next.t("<b>Upg - </b> Number of items to upgrade - including reforges and enhances. When substat mods are enabled, modified gear is considered upgradable.")+'</p>'
+'<p>'+i18next.t("<b>Conv - </b> Number of conversion reforges in the results.")+'</p>'

        });

        tippy('#substatPriorityTooltip', {
            content:

'<p>'+i18next.t("<b>This is the most useful filter but please read before using it. Using this wrong can exclude good results from the search.</b>")+'</p>'

+'<p>'+i18next.t("Assign a priority to each substat type from -1 to 3. This will go through every gear, and calculates the # of max rolls of each stat. The # of rolls is then multiplied by the stat priority you chose. It adds up all the stat scores for a gear, and sorts your gear by their highest substat score.")+'</p>'

+'<p>'+i18next.t("After that, it chooses only the Top X% of scored gears to use for the search.For example, if you select Atk: 3 / Cr: 3 / Cd: 3 / Top 40%, this will use only the best 40% of your gears sorted by Atk / Cr / Cd substats.")+'</p>'

+'<p>'+i18next.t("This filter does nothing when Top X% is 100. I find 40-50% to be a good range to start with, and adjust the Top X% lower/higher based on your own gear and the results you get. Lowering the percent narrows down your best gears to make the search faster, but going too low will exclude possible good builds and will be less optimal.")+'</p>'

+'<p>'+i18next.t("This works best when accessory stats and set options are selected.")+'</p>'

        });

        tippy('#heroTooltip', {
            content:

'<p>'+i18next.t("Select the hero you want to optimize.")+'</p>'
+'<p>'+i18next.t("<b>Start - </b> Start a search using the current settings.")+'</p>'
+'<p>'+i18next.t("<b>Filter - </b> Keep the current optimization results, but re-apply the stat and rating filters. Useful for narrowing down a search.")+'</p>'
+'<p>'+i18next.t("<b>Cancel - </b> Attempts to cancel an ongoing search. This won't always cancel immediately, if the process is busy.")+'</p>'
+'<p>'+i18next.t("<b>Reset filters - </b> Resets all optimization filters to their default values.")+'</p>'

        });

        tippy('#previewTooltip', {
            content:

'<p>'+i18next.t("The left shows your unit's current stats. The middle shows the stats after the stat change. Right side shows the difference.")+'</p>'

        });

        tippy('#optionsTooltip', {
            content:

'<p>'+i18next.t("<b>Use reforged stats - </b> Predict the reforged stats on +15 level 85 gear to use in the search. Warning: the substat prediction is not always accurate.")+'</p>'
+'<p>'+i18next.t("<b>Use substat mods - </b> Run the optimization using substat modification stones. Each hero's optimization settings must first be selected on the heroes tab before this can be used.")+'</p>'
+'<p>'+i18next.t("<b>Only maxed gear - </b> Search only for builds that contain all +15 and reforged gear.")+'</p>'
+'<p>'+i18next.t("<b>Locked items - </b> Allow locked items in the search.")+'</p>'
+'<p>'+i18next.t("<b>Equipped items - </b> Allow items equipped by other heroes in the search.")+'</p>'
+'<p>'+i18next.t("<b>Keep current - </b> Keep any existing gears on the unit, and search only for the missing gear pieces.")+'</p>'
+'<p>'+i18next.t("<b>Exclude equipped - </b> Ignores the dropdown selected units' currently equipped gear in optimization. Only works when 'Equipped items' is checked.")+'</p>'

        });

        tippy('#filterDetailsTooltip', {
            content:

'<p>'+i18next.t("Shows how many pieces of gear will be used in the search, after filters are applied.")+'</p>'
+'<p>'+i18next.t("If you notice for example, you only have 2 rings being used, try expanding your filters to use more ring options. Or if you see too much gear being used, reduce your Top % filter to be more selective.")+'</p>'
+'<p>'+i18next.t("<b>Permutations - </b> Number of permutations of the filtered gear that need to be searched. Make this number lower to make searches faster, but you will be searching less options.")+'</p>'
+'<p>'+i18next.t("<b>Searched - </b> Number permutations already searched.")+'</p>'
+'<p>'+i18next.t("<b>Results - </b> Number of search results that satisfy the stat filters. There is a maximum of 5,000,000 results before the search stops (for memory limitations).")+'</p>'

        });

        tippy('#actionsTooltip', {
            content:

'<p>'+i18next.t("<b>Equip/Unequip Items - </b> Equips/Unequip the current selected gears onto your hero. Automatically saves the build.")+'</p>'
+'<p>'+i18next.t("<b>Lock/Unlock Items - </b> Locks/Unlocks the current selected gears that you want to be excluded from other searches.")+'</p>'
+'<p>'+i18next.t("<b>Select/Deselect All - </b> Select/Deselects all the items. You can manually check/uncheck each checkbox as well.")+'</p>'
+'<p>'+i18next.t("<b>Save/Remove Build - </b> Saves/Removes the currently selected row as a build. This will mark it with a star, and the build will be visible on the Heroes tab.")+'</p>'

        });

        tippy('#gearTableTooltip', {
            content:

'<p>'+i18next.t("View and edit gears here. Multiple gears can be selected with Ctrl + click or Shift + click. The number of selected gear can be found in the top right corner.")+'</p>'

+'<p>'+i18next.t("Score - Gear score. This score measures how well your gear rolled, scaled by the max roll for 85 gear (assuming 4 for speed). Similar to WSS, except flat stats rolls are included. Flat stats account to percentage equivalent was determined using the average stats of 5* units divided by the average flat roll. By this metric, a single flat roll corresponds to ~3.5 Atk %, ~5.0 Def %, ~3.1 Hp %.")+'</p>'

+'<code>'
+i18next.t("Score = Attack %</br>")
+i18next.t("+ Defense %</br>")
+i18next.t("+ Hp %</br>")
+i18next.t("+ Effectiveness</br>")
+i18next.t("+ Effect Resistance</br>")
+i18next.t("+ Speed * (8/4)</br>")
+i18next.t("+ Crit Damage * (8/7)</br>")
+i18next.t("+ Crit Chance * (8/5)</br>")
+i18next.t("+ Flat Attack * 3.46 / 39</br>")
+i18next.t("+ Flat Defense * 4.99 / 31</br>")
+i18next.t("+ Flat Hp * 3.09 / 174</br>")
+'</code>'

+'<p>'+i18next.t("dScore - DPS Score. This is the Score formula but only counting Attack/%, Crit Chance, Crit Damage, and Speed.")+'</p>'
+'<p>'+i18next.t("sScore - Support Score. This is the Score formula but only counting Hp/%, Defense/%, Effect Resist, and Speed.")+'</p>'
+'<p>'+i18next.t("cScore - Combat Score. This is the Score formula excluding Effectiveness and Effect Resist.")+'</p>'

        });

        tippy('#gearActionsTooltip', {
            content:

'<p>'+i18next.t("Edit Selected Item - Change an items stats, levels, or equip it onto someone.")+'</p>'
+'<p>'+i18next.t("Reforge Item - Only works on +15 level 85 gears, predicts the item's reforged stats and generates the edited version.")+'</p>'
+'<p>'+i18next.t("Add New Item - Create a new item and fill in its stats.")+'</p>'
+'<p>'+i18next.t("Duplicate Item - Create a copy of the selected item and lets you change its stats.")+'</p>'
+'<p>'+i18next.t("Remove Items - Unequips and then deletes the items. Multiple selection enabled.")+'</p>'
+'<p>'+i18next.t("Unequip Items - Unequips the items from their units. Multiple selection enabled.")+'</p>'
+'<p>'+i18next.t("Lock/Unlock Items - Locks/Unlocks the items that you want to be excluded from searches.")+'</p>'

        });

        tippy('#gearFiltersTooltip', {
            content:

'<p>'+i18next.t("Select filters to filter the gear table by. Only one filter allowed per section for now.")+'</p>'
+'<p>'+i18next.t("Use the Duplicates filter to find gear with the same stats, and remove if they were mistakenly added.")+'</p>'

        });
    },
}
