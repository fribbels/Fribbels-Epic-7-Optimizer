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
        tippy('#forceModeTooltip', {
            content:
`
<p>
Choose how many substats you want to match the force filters.
"Force at least 2 substats" means to search only gears matching at least 2 stat rows from the force panel.
</p>
<p>
The substat priority filter should be doing most of the filtering for you. Only this when you have have a very specific substat requirement.
</p>

<p>
Examples:</br>
Force at least one: Speed > 10 for speed units.</br>
Force at least one: Hp % / Def % / Speed, for tanks.</br>
Force at least two: Atk / Atk % / Cr / Cd / Speed, for dps units.</br>
</p>
`
        });

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

        tippy('#forceTooltip', {
            content:
`
<p>
See the force mode tooltip for more info.
</p>

<p>
Select required substats to use with the force mode. Left column is min (inclusive) and right column is max (inclusive).
</p>

<p>
Force filter is automatically disabled when no forced substats are specified.
</p>
`
        });

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
<p><b>Cp - </b> Combat power, as you would find it ingame, but without factoring in skill enhances. Useful for workd boss units. </p>
<p><b>HpS - </b> Hp * Speed rating, for comparing fast/health builds, disregaring defense. Example health scaling units: Krau, Fceci. </p>
<p><b>Ehp - </b> Effective Hp, for comparing how much damage a unit can take. Formula: HP * (Defense/300 + 1). </p>
<p><b>EhpS - </b> Effective Hp * Speed rating, for comparing fast/tanky builds. </p>
<p><b>Dmg - </b> Average damage rating, measures how much damage your unit will deal on average, factoring in crit chance & damage.</p>
<p><b>DmgS - </b> Average damage * Speed rating, measures average damage vs speed. </p>
<p><b>Mcd - </b> Max crit damage rating, measures damage at 100% crit chance. Example units: Arby, JKise. </p>
<p><b>McdS - </b> Max crit damage * Speed rating, measures damage at 100% crit chance vs speed. </p>
`
        });

        tippy('#substatPriorityTooltip', {
            content:
`
<p><b>This is the most useful filter but please read before using it. Using this wrong can exclude good results from the search.</b></p>

<p>Assign a priority to each substat type from -1 to 3. This will go through every gear, and calculates the # of max rolls of each stat.

The # of rolls is then multiplied by the stat priority you chose. It adds up all the stat scores for a gear, and sorts your gear by their highest substat score.</p>

<p>After that, it chooses only the Top X% of scored gears to use for the search.
For example, if you select Atk: 3 / Cr: 3 / Cd: 3 / Top 40%, this will use only the best 40% of your gears sorted by Atk / Cr / Cd substats.</p>

<p>This filter does nothing when Top X% is 100.
I find 40-50% to be a good range to start with, and adjust the Top X% lower/higher based on your own gear and the results you get.
Lowering the percent narrows down your best gears to make the search faster, but going too low will exclude possible good builds and will be less optimal.
</p>

<p>This works best when accessory stats and set options are selected.</p>
`
        });

        tippy('#heroTooltip', {
            content:
`
<p>Select the hero you want to optimize.</p>
<p><b>Start - </b> Start a search using the current settings. </p>
<p><b>Filter - </b> Keep the current optimization results, but re-apply the stat and rating filters. Useful for narrowing down a search. </p>
<p><b>Cancel - </b> Attempts to cancel an ongoing search. This won't always cancel immediately, if the process is busy. </p>
<p><b>Load filters - </b> Loads the optimization filters from the last search for this hero. </p>
<p><b>Reset filters - </b> Resets all optimization filters to their default values. </p>
`
        });

        tippy('#optionsTooltip', {
            content:
`
<p><b>Use reforged stats - </b> Predict the reforged stats on +15 level 85 gear to use in the search. Warning: the substat prediction is not always accurate. </p>
<p><b>At least one lv 85 - </b> Search only for builds that contain at least one level 85 gear. </p>
<p><b>Only +15 gear - </b> Search only for builds that contain all +15 gear. </p>
<p><b>Locked items - </b> Allow locked items in the search. </p>
<p><b>Equipped items - </b> Allow items equipped by other heroes in the search. </p>
<p><b>Keep current - </b> Keep any existing gears on the unit, and search only for the missing gear pieces. </p>
`
        });

        tippy('#searchDetailsTooltip', {
            content:
`
<p><b>Permutations - </b> Number of permutations of the filtered gear that need to be searched.
Make this number lower to make searches faster, but you will be searching less options. </p>
<p><b>Searched - </b> Number permutations already searched. </p>
<p><b>Results - </b> Number of search results that satisfy the stat filters.
There is a maximum of 5,000,000 results before the search stops (for memory limitations). </p>
`
        });

        tippy('#filterDetailsTooltip', {
            content:
`
<p>Shows how many pieces of gear will be used in the search, after filters are applied.
<p>If you notice for example, you only have 2 rings being used, try expanding your filters to use more ring options. Or if you see too much gear being used, reduce your Top % filter to be more selective.</p>
</p>
`
        });

        tippy('#actionsTooltip', {
            content:
`
<p><b>Equip/Unequip Items - </b> Equips/Unequip the current selected gears onto your hero. Automatically saves the build. </p>
<p><b>Lock/Unlock Items - </b> Locks/Unlocks the current selected gears that you want to be excluded from other searches. </p>
<p><b>Select/Deselect All - </b> Select/Deselects all the items. You can manually check/uncheck each checkbox as well. </p>
<p><b>Save/Remove Build - </b> Saves/Removes the currently selected row as a build. This will mark it with a star, and the build will be visible on the Heroes tab. </p>
`
        });

        tippy('#gearTableTooltip', {
            content:
`
<p>View and edit gears here. Multiple gears can be selected with Ctrl + click or Shift + click. The number of selected gear can be found in the top right corner.</p>

<p>Score - Gear score.
This score measures how well your gear rolled, scaled by the max roll for 85 gear (assuming 4 for speed).
Similar to WSS, except flat stats rolls are included, with a 50% score penalty.</p>

<code>
Score = Attack %</br>
+ Defense %</br>
+ Hp %</br>
+ Effectiveness</br>
+ Effect Resistance</br>
+ Speed * (8/4)</br>
+ Crit Damage * (8/7)</br>
+ Crit Chance * (8/5)</br>
+ Flat Attack / 39 * 0.5</br>
+ Flat Defense / 31 * 0.5</br>
+ Flat Hp / 174 * 0.5</br>
</code>

<p>dScore - DPS Score. This is the Score formula but only counting Attack/%, Crit Chance, Crit Damage, and Speed. </p>
<p>sScore - Support Score. This is the Score formula but only counting Hp/%, Defense/%, Effect Resist, and Speed. </p>
<p>cScore - Combat Score. This is the Score formula excluding Effectiveness and Effect Resist.</p>
`
        });

        tippy('#gearActionsTooltip', {
            content:
`
<p>Edit Selected Item - Change an items stats, levels, or equip it onto someone. </p>
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
