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
// <p>
// Choose how many substats you want to match the force filters.
// "Force at least 2 substats" means to search only gears matching at least 2 stat rows from the force panel.
// </p>
// <p>
// The substat priority filter should be doing most of the filtering for you. Only this when you have have a very specific substat requirement.
// </p>

// <p>
// Examples:</br>
// Force at least one: Speed > 10 for speed units.</br>
// Force at least one: Hp % / Def % / Speed, for tanks.</br>
// Force at least two: Atk / Atk % / Cr / Cd / Speed, for dps units.</br>
// </p>
// `
//         });

        tippy('#accessoryMainStatsTooltip', {
            content:
`
<p>
Choose the desired main stats for accessories. Multiple options can be selected per slot.
</p>
`
        });

        tippy('#setsTooltip', {
            content:
`
<p>
Choose the desired gear sets. Multiple options can be selected per slot. The first slot must be either only 4 piece or 2 piece sets.
</p>
`
        });

        tippy('#excludeTooltip', {
            content:
`
<p>
Choose any sets you don't want included in the search.
</p>
`
        });

//         tippy('#forceTooltip', {
//             content:
// `
// <p>
// See the force mode tooltip for more info.
// </p>

// <p>
// Select required substats to use with the force mode. Left column is min (inclusive) and right column is max (inclusive).
// </p>

// <p>
// Force filter is automatically disabled when no forced substats are specified.
// </p>
// `
//         });

        tippy('#filterStatsTooltip', {
            content:
`
<p>
Select substat filters to filter results by. Left column is min (inclusive) and right column is max (inclusive).
</p>
`
        });

        tippy('#filterRatingsTooltip', {
            content:
`
<p>Select rating filters to filter results by. Ratings are stats that aren't seen in the game, but are useful for comparing builds.  Left column is min (inclusive) and right column is max (inclusive).</p>
<p><b>Cp - </b> <a>Combat power, as you would find it ingame, but without factoring in skill enhances. Useful for workd boss units.</a> </p>
<p><b>HpS - </b> <a>Hp * Speed rating, for comparing fast/health builds, disregaring defense. Example health scaling units: Krau, Fceci.</a> </p>
<p><b>Ehp - </b> <a>Effective Hp, for comparing how much damage a unit can take. Formula: HP * (Defense/300 + 1).</a> </p>
<p><b>EhpS - </b> <a>Effective Hp * Speed rating, for comparing fast/tanky builds.</a> </p>
<p><b>Dmg - </b> <a>Average damage rating, measures how much damage your unit will deal on average, factoring in crit chance & damage.</a></p>
<p><b>DmgS - </b> <a>Average damage * Speed rating, measures average damage vs speed.</a> </p>
<p><b>Mcd - </b> <a>Max crit damage rating, measures damage at 100% crit chance. Example units: Arby, JKise.</a> </p>
<p><b>McdS - </b> <a>Max crit damage * Speed rating, measures damage at 100% crit chance vs speed.</a> </p>
<p><b>DmgH - </b> <a>Dmg * Hp rating, average damage rating, scaled by your units health. Useful for HP scaling bruisers.</a> </p>
<p><b>Score - </b> <a>Sum of gear score of all 6 pieces.</a> </p>
<p><b>Upg - </b> <a>Number items to upgrade - including reforges and enhances.</a> </p>
`
        });

        tippy('#substatPriorityTooltip', {
            content:
`
<p><b>This is the most useful filter but please read before using it. Using this wrong can exclude good results from the search.</b></p>

<p><a>Assign a priority to each substat type from -1 to 3. This will go through every gear, and calculates the # of max rolls of each stat.</a>

<a>The # of rolls is then multiplied by the stat priority you chose. It adds up all the stat scores for a gear, and sorts your gear by their highest substat score.</a></p>

<p><a>After that, it chooses only the Top X% of scored gears to use for the search.</a>
<a>For example, if you select Atk: 3 / Cr: 3 / Cd: 3 / Top 40%, this will use only the best 40% of your gears sorted by Atk / Cr / Cd substats.</a></p>

<p><a>This filter does nothing when Top X% is 100.</a>
<a>I find 40-50% to be a good range to start with, and adjust the Top X% lower/higher based on your own gear and the results you get.</a>
<a>Lowering the percent narrows down your best gears to make the search faster, but going too low will exclude possible good builds and will be less optimal.</a>
</p>

<p>This works best when accessory stats and set options are selected.</p>
`
        });

        tippy('#heroTooltip', {
            content:
`
<p>Select the hero you want to optimize.</p>
<p><b>Start - </b> <a>Start a search using the current settings.</a> </p>
<p><b>Filter - </b> <a>Keep the current optimization results, but re-apply the stat and rating filters. Useful for narrowing down a search.</a> </p>
<p><b>Cancel - </b> <a>Attempts to cancel an ongoing search. This won't always cancel immediately, if the process is busy.</a> </p>
<p><b>Reset filters - </b> <a>Resets all optimization filters to their default values.</a> </p>
`
        });

        tippy('#previewTooltip', {
            content:
`
<p>The left shows your unit's current stats. The middle shows the stats after the stat change. Right side shows the difference.</p>
`
        });

        tippy('#optionsTooltip', {
            content:
`
<p><b>Use reforged stats - </b> <a>Predict the reforged stats on +15 level 85 gear to use in the search. Warning: the substat prediction is not always accurate.</a> </p>
<p><b>Only maxed gear - </b> <a>Search only for builds that contain all +15 and reforged gear.</a> </p>
<p><b>Locked items - </b> <a>Allow locked items in the search.</a> </p>
<p><b>Equipped items - </b> <a>Allow items equipped by other heroes in the search.</a></p>
<p><b>Keep current - </b> <a>Keep any existing gears on the unit, and search only for the missing gear pieces.</a> </p>
<p><b>Exclude equipped - </b> <a>Ignores the dropdown selected units' currently equipped gear in optimization. Only works when 'Equipped items' is checked.</a> </p>
`
        });

        tippy('#filterDetailsTooltip', {
            content:
`
<p>Shows how many pieces of gear will be used in the search, after filters are applied.</p>
<p>If you notice for example, you only have 2 rings being used, try expanding your filters to use more ring options. Or if you see too much gear being used, reduce your Top % filter to be more selective.</p>
</p>
<p><b>Permutations - </b> <a>Number of permutations of the filtered gear that need to be searched.</a>
<a>Make this number lower to make searches faster, but you will be searching less options.</a> </p>
<p><b>Searched - </b> <a>Number permutations already searched.</a> </p>
<p><b>Results - </b> <a>Number of search results that satisfy the stat filters.</a>
<a>There is a maximum of 5,000,000 results before the search stops (for memory limitations).</a> </p>
`
        });

        tippy('#actionsTooltip', {
            content:
`
<p><b>Equip/Unequip Items - </b> <a>Equips/Unequip the current selected gears onto your hero. Automatically saves the build.</a> </p>
<p><b>Lock/Unlock Items - </b> <a>Locks/Unlocks the current selected gears that you want to be excluded from other searches.</a> </p>
<p><b>Select/Deselect All - </b> <a>Select/Deselects all the items. You can manually check/uncheck each checkbox as well.</a> </p>
<p><b>Save/Remove Build - </b> <a>Saves/Removes the currently selected row as a build. This will mark it with a star, and the build will be visible on the Heroes tab.</a> </p>
`
        });

        tippy('#gearTableTooltip', {
            content:
`
<p>View and edit gears here. Multiple gears can be selected with Ctrl + click or Shift + click. The number of selected gear can be found in the top right corner.</p>

<p><a>Score - Gear score.</a>
<a>This score measures how well your gear rolled, scaled by the max roll for 85 gear (assuming 4 for speed).</a>
<a>Similar to WSS, except flat stats rolls are included. Flat stats account to percentage equivalent was determined using the average stats of 5* units divided by the average flat roll.</a>
<a>By this metric, a single flat roll corresponds to ~3.5 Atk %, ~5.0 Def %, ~3.1 Hp %.</a></p>

<code>
Score = Attack %</br>
+ Defense %</br>
+ Hp %</br>
+ Effectiveness</br>
+ Effect Resistance</br>
+ Speed * (8/4)</br>
+ Crit Damage * (8/7)</br>
+ Crit Chance * (8/5)</br>
+ Flat Attack * 3.46 / 39</br>
+ Flat Defense * 4.99 / 31</br>
+ Flat Hp * 3.09 / 174</br>
</code>

<p>dScore - DPS Score. This is the Score formula but only counting Attack/%, Crit Chance, Crit Damage, and Speed.</p>
<p>sScore - Support Score. This is the Score formula but only counting Hp/%, Defense/%, Effect Resist, and Speed.</p>
<p>cScore - Combat Score. This is the Score formula excluding Effectiveness and Effect Resist.</p>
`
        });

        tippy('#gearActionsTooltip', {
            content:
`
<p>Edit Selected Item - Change an items stats, levels, or equip it onto someone.</p>
<p>Reforge Item - Only works on +15 level 85 gears, predicts the item's reforged stats and generates the edited version. </p>
<p>Add New Item - Create a new item and fill in its stats. </p>
<p>Duplicate Item - Create a copy of the selected item and lets you change its stats. </p>
<p>Remove Items - Unequips and then deletes the items. Multiple selection enabled. </p>
<p>Unequip Items - Unequips the items from their units. Multiple selection enabled. </p>
<p>Lock/Unlock Items - Locks/Unlocks the items that you want to be excluded from searches. </p>
`
        });

        tippy('#gearFiltersTooltip', {
            content:
`
<p>Select filters to filter the gear table by. Only one filter allowed per section for now. </p>
<p>Use the Duplicates filter to find gear with the same stats, and remove if they were mistakenly added.</p>
`
        });
    },
}
