
# Fribbels Epic 7 Gear Optimizer

This is a tool for organizing gear and optimizing gear and unit builds for Epic 7. Gearing units can be time consuming and it's not easy to find optimal combinations of gear within the game, so I made this to help make the gearing process easier.

Come join the Fribbels E7 Optimizer Discord server for announcements, troubleshooting, or ideas and suggestions! https://discord.gg/rDmB4Un7qg

Please see the [**Getting Started**](https://github.com/fribbels/Fribbels-Epic-7-Optimizer#getting-started) section for instructions on how to use the optimizer.

Features include:
 - Automatically import gear from the game
 - Filter gear optimizer with main stats/sub stats/sets/etc
 - Automatic data updates for new heroes
 - Hero bonus stats for imprints/artifacts/EEs
 - Gear substat efficiency scoring
 - Reforged stat prediction & editing
 - Color coded results sorting

Here's what it looks like currently:

![](https://i.imgur.com/vQ3tnol.png)

## Requirements
- 64-bit Windows or MacOS
- Java 8, 64-Bit installed (Please download if you don't yet have it: https://java.com/en/download/manual.jsp. For Windows, use the 'Windows Offline (64-bit)' installer)
_________________

- [Fribbels Epic 7 Gear Optimizer](#fribbels-epic-7-gear-optimizer)
  * [Requirements](#requirements)
  * [Optimizer Tab](#optimizer-tab)
    + [Settings panel](#settings-panel)
    + [Stat filters](#stat-filters)
    + [Rating filters](#rating-filters)
    + [Substat priority filter](#substat-priority-filter)
    + [Main stat and set filters](#main-stat-and-set-filters)
    + [Optimization Results](#optimization-results)
  * [Gear Tab](#gear-tab)
  * [Heroes Tab](#heroes-tab)
  * [Importer tab](#importer-tab)
    + [Creating gear data from screenshots](#creating-gear-data-from-screenshots)
    + [Importing gear data](#importing-gear-data)
    + [Save/Load all optimizer data](#save-load-all-optimizer-data)
    + [Import gear from Zarroc optimizer](#import-gear-from-zarroc-optimizer)
  * [Getting Started](#getting-started)
    + [Installing the app](#installing-the-app)
      - [Windows](#windows)
      - [Mac OS](#mac-os)
    + [Using the auto importer](#using-the-auto-importer)
        * [First time  setup for the automatic importer on Windows](#first-time--setup-for-the-automatic-importer-on-windows)
        * [First time  setup for the automatic importer on Mac](#first-time--setup-for-the-automatic-importer-on-mac)
        * [Running the automatic importer from an emulator](#running-the-automatic-importer-from-an-emulator)
        * [Running the automatic importer from a phone](#running-the-automatic-importer-from-a-phone)
    + [Using the screenshot importer](#using-the-screenshot-importer)
        * [First time setup for the screenshot importer on Windows](#first-time-setup-for-the-screenshot-importer-on-windows)
        * [First time setup for the screenshot importer on Mac](#first-time-setup-for-the-screenshot-importer-on-mac)
        * [Screenshotting gear](#screenshotting-gear)
    + [Optimizing a unit](#optimizing-a-unit)
    + [Updating your gear](#updating-your-gear)
    + [Tips to get good optimization results:](#tips-to-get-good-optimization-results-)
  * [TODO List](#todo-list)
  * [Troubleshooting](#troubleshooting)
    + [Automatic importer](#automatic-importer)
    + [Optimizer](#optimizer)
  * [Contact me](#contact-me)


## Optimizer Tab

Here I'll go through the different parts of the optimizer tab, using a tank Ruele build as an example. There are a bunch of panels with options for filtering the gear that I'll walk through in detail.

_________________

### Settings panel

![](https://i.imgur.com/8pJAu7Q.png)

This panel tracks settings for the other panels to use.

- **Hero**: Select the hero you want to optimize for from the drop down.
- **Use reforged stats**: Predict the reforged stats on +15 level 85 gear to use in the search.
- **Use substat mods**: ..
- **Locked items**: When checked, locked items will be used in the optimization. When unchecked, locked items are ignored.
- **Equipped items**: When checked, equipped items will be used in the optimization. When unchecked, equipped items are ignored EXCEPT for the unit's own equipped items.
- **Keep current**: When checked, the unit will be forced to use the gear that it currently has, and the optimizer will only try to optimize the gear slots that the unit has unequipped.
- **Start**: Click to start to optimization request.
- **Filter**: Once an optimization is complete, click to filter the results by the stats on the filter panels.
- **Cancel**: Interrupts and cancels an ongoing optimization request.
- **Load settings**: Loads the optimization settings from the last search for this hero.
- **Reset settings**: Sets all optimization settings to their default values.

_________________

### Stat filters

![](https://i.imgur.com/tVgubaV.png)

This panel defines the stats to filter your optimization results by. The left boxes are the minimum (inclusive) and the right boxes are the maximum (inclusive). In this example, we're looking for a Ruele build with:
- At least 20,000 HP
- At least 2,400 def
- Between 180 and 200 speed

The filter will apply on your optimization results after you click Submit. Once the results have been generated, you can apply more restrictive filters by changing the numbers here, then clicking the **Filter** button. This will narrow down your results without having to do another search.

_________________

### Rating filters

![](https://i.imgur.com/xmhk8ml.png)

This panel is similar to the primary stats panel, but applies for calculated stats. These stats you won't see in-game but are various ratings that can help decide between different builds.

- **HpS** -- `Health * Speed` rating. Useful for optimizing units where you want a combination of speed and pure health.
- **Ehp** -- Effective HP, calculated by: `HP * (Defense/300 + 1)`. EHP is a measure of how much damage your unit can take before dying and is useful for rating the tankiness of units.
- **EhpS** -- `Effective HP * Speed` rating. Useful for optimizing units where you want a combination of speed and hp/def for tankiness.
- **Dmg** --  Average damage, calculated by: `Attack * Crit Chance * Crit Damage`. Measures how much damage your unit will deal on average. Note that this takes crit chance into account, so lowering your crit chance impacts the Dmg rating because you'll crit less often, which lowers your average output.
- **DmgS** -- DPS rating, calculated by: `Attack * Crit Chance * Crit Damage * Speed`. This measures how fast your unit can dish out damage.
- **Mcd** -- Max Crit Damage, calculated by: `Attack * Crit Damage`. This does not take into account Crit Chance, as opposed to Dmg, and assumes your unit is at 100% Crit Chance. Useful for measuring damage of units like CDom that only need 50% Crit Chance, or PVE units that only need 85% with elemental advantage.
- **McdS** -- Max DPS rating, calculated by `Attack * Crit Damage * Speed`. Similar to DmgS, just without Crit Chance.
 - **DmgH** -- Bruiser rating, calculated by `Health * Crit Damage`. Useful for health scaling bruisers.
- **CP** -- This is the CP you would see on the unit's stat page ingame, but doesn't take skill enhances into account. Useful for optimizing unused characters with leftover gear for world boss.
_________________

### Substat priority filter

![](https://i.imgur.com/i60uzCg.png)

**This is probably the most useful filter but please read before using it. Using this wrong can exclude good results from the search.**

Assign a priority to each substat type from -1 to 3. This will go through every gear, and calculates the # of max rolls of each stat. The # of rolls is then multiplied by the stat priority you chose. It adds up all the stat scores for a gear, and sorts your gear by their highest substat score.

 In this example we're mostly looking for a fast and tanky Ruele so we assign:
- HP and Def a high rating of 3, since those are the highest priority stats
- Speed a slightly lower rating of 2
- And Res a rating of 1, as its a nice-to-have stat and can still be useful for her
- We don't particularly care about Attack/Crit Chance/Crit Damage/Effectiveness, so we leave those at 0

Then, we set the Top % slider to 30%. This will take all your weapons, score them based on the priority defined above, then only considers the Top 30% of the scores for optimization. Then it does the same for helmets, armors, etc, and then the optimizer generates permutations based on those Top 30% gears.

**The Top % slider must be set to something other than 100% for this filter to work**, otherwise you're just using the Top 100% of your gears and nothing is being filtered. Worth noting that this rating is a heuristic so it doesn't always produce optimal results if your percent is set too low. I find that 30-50% is a good range to work with, because 50% filters out most of the irrelevant gears (like dps stats on a tank build, or vice versa). Below 30%, the filter gets very sensitive and you might not have enough gears to produce optimal results, so the results can be missing some permutations when some useful gears get filtered out. Try playing around with different Top % values.

An example priority filter for a DPS unit like Arby could be something like this, where you only want damage stats:

![](https://i.imgur.com/sdIG6xQ.png)

Or for a tanky Champion Zerato, where you want a mix of tankiness, damage, and effectiveness, but NOT resistance, you can set resistance to -1 to decrease the gear rating if it has resist substats:

![](https://i.imgur.com/CF3KmxT.png)

Choosing a good priority filter makes the optimization a lot easier since you won't have to consider irrelevant or low-rolled gears.

_________________

### Main stat and set filters

![](https://i.imgur.com/fYOaDPB.png)

This one's fairly straightforward, we're looking for:
- Necklaces with Health % OR Defense %
- Rings with Health % OR Defense %
- Boots with Speed
- Speed set
- Resist set OR immunity set

If we don't care about sets as much for a tanky/damage ML Ken or something, this allows for broken sets as well. Here we only care that he has an immunity set, and no preference for any other sets, so they're left blank.

![](https://i.imgur.com/8HEsbvY.png)

_________________

### Optimization Results

![](https://i.imgur.com/zF1xKlE.png)

Here you can see all the results from the optimization, sort by stat, and equip/lock the results.
- The top row shows your currently equipped gear stats
- Each column is color coded based on the min/max ranges of the stat on each page
- You can use the arrows at the bottom to navigate between multiple pages of results
- Select All/Deselect All modifies the little checkbox on each gear, or alternatively you can click individual boxes
- Equip Selected will equip those checked gears onto the hero (while unequipping anything they were holding before)
- Lock Selected will mark those checked gears as locked, which affects later optimizations that have "Locked Items" unchecked in settings.
- Clicking on the pencil/hammer icons will allow you to edit/reforge item stats.

## Gear Tab

![](https://i.imgur.com/W6bHn4Y.png)

Here you can find a table of all your gears, and sort/filter them. The icons at the bottom enable filters for set and gear slot, and the X clears the filters.
The **Score** column is a stat I made up which is similar to WSS, with the difference that it takes flat stats into consideration while WSS ignores them. The calculation is:

    Score = Attack %
    + Defense %
    + Hp %
    + Effectiveness
    + Effect Resistance
    + Speed * (8/4)
    + Crit Damage * (8/7)
    + Crit Chance * (8/5)
    + Flat Attack * 3.46 / 39
    + Flat Defense * 4.99 / 31
    + Flat Hp * 3.09 / 174

Its used as a measure of how well your gear rolled, scaled by the max roll for 85 gear (using max of 4, not 5 for speed). I found the average rolls for flat stats and compared it to the average stats of a 5* unit, and used that as a measure of how well the flat stats rolled.

![](https://i.imgur.com/ms6HybN.png)

You can edit existing gears or add new gears with this page, and filling in the relevant fields.

## Heroes Tab

![](https://i.imgur.com/FnMbGWO.png)

Here you can add new heroes and manage existing ones. I think most of the buttons are fairly self explanatory, the one thing worth noting is the **Add Bonus Stats** page, which lets you add artifact/imprint stats to the hero for optimization.

![](https://i.imgur.com/x40j3um.png)

## Importer tab

![](https://i.imgur.com/LyJq3Lr.png)

This tab lets you do various things with importing/exporting files.
_________________

### Creating gear data from screenshots

Select the folder you have your screenshots in and the app will start reading your screenshots. Make sure the folder only contains your screenshots and nothing else. This will then output your gear.txt file, and you can export it somewhere for the next step. If there are any errors reading the screenshots, the list of failed files will be shown.

### Importing gear data

Once you have the gear.txt file, choose the file to import the gear into the optimizer. Most of the time you will want the **Merge** option.

* **Merge data** will combine your new gear screenshots with your currently loaded gear while keeping your heroes' equipped gear and builds intact.
* *Append data* will add the new gears to your existing gears.
* *Overwrite data* will load in the new data, removing all previous items and heroes

If you want to wipe all your data and start clean with gear screenshots, use Overwrite.

If you have new screenshot files to add to a save, use the Append option.

If you already have a save, and you want to update your gear, use Merge to replace old items with new items.

### Save/Load all optimizer data

Once you make changes to your items/heroes, the changes should be saved before you close the app. You can choose a file to save it to, and then later on load that file to import the data back in.

The app also does autosave to an 'autosave.json' upon changes being made, and will autoload whatever was saved to the autosave file the next time the app opens.


### Import gear from Zarroc optimizer

If were a user of Zarroc's gear optimizer, this lets you import your data directly from your existing Zarroc save file. All gear, heroes, and artifacts will be imported.


## Getting Started

Please read these instructions carefully!

### Installing the app

#### Windows

1. On the [Releases](https://github.com/fribbels/Fribbels-Epic-7-Optimizer/releases) page, choose the latest release, and download the file that looks like ``FribbelsE7Optimizer-x.x.x-windows.zip``
    * Do not download the Source Code options, those won't work
2. Install **Java 8 - 64 bit** https://java.com/en/download/manual.jsp - Get the Windows Offline (64-bit) installer
    * After installing, restart your computer (required!)
  3. Follow the steps to use either the auto importer or screenshot importer

#### Mac OS

1. On the [Releases](https://github.com/fribbels/Fribbels-Epic-7-Optimizer/releases) page, choose the latest release, and download the file that looks like ``FribbelsE7Optimizer-x.x.x-mac.dmg``
    * There is a dmg file and a zip file. Try the dmg first and if it doesn't work, try the zip.
    * Do not download the Source Code options, those won't work
2. Install **Java 8 - 64 bit**
    * Mac needs both JRE and JDK:
    * JRE: https://java.com/en/download/manual.jsp - Get the 64-bit offline installer
    * JDK: https://www.oracle.com/java/technologies/javase-downloads.html
    * After installing, restart your computer (required!)
  3. Follow the steps to use either the auto importer or screenshot importer

_________________

### Using the auto importer
There are two importer options, one that automatically imports gear directly from your game, and one using screenshots. The automatic importer is recommended and requires these additional steps:

##### First time  setup for the automatic importer on Windows
1. Install [Python 3.4+](https://www.python.org/downloads/release/python-392/) using the Windows installer (64-bit) option. Click for [direct download link to 3.9.2](https://www.python.org/ftp/python/3.9.2/python-3.9.2-amd64.exe). **IMPORTANT: Enable the option to add Python to PATH**
2. Install [Npcap](https://nmap.org/npcap/#download) for Windows. Click for [direct download link](https://nmap.org/npcap/dist/npcap-1.31.exe). During installation ,enable the setting to "Support raw 802.11 traffic (and monitor mode) for wireless adapters".
3. Restart your computer

##### First time  setup for the automatic importer on Mac
1. Install [Python 3.4+](https://www.python.org/downloads/release/python-392/)
2. Install [Wireshark](https://www.wireshark.org/download.html)
3. During the Wireshark installation, also install ChmodBPF.pkg: [See image](https://i.imgur.com/FqV0BA5.png)
3. Restart your computer

##### Running the automatic importer from an emulator
1. Install requirements from the instructions above
2. Leave your emulator open, and close Epic 7
3. Click Start scanning
4. Open Epic 7, and load into the lobby
5. Click Stop scanning
6. Wait up to 30 secs, then once the data appears, click Export to save it to a "gear.txt"
7. Import the "gear.txt" with the Replace/Add/Merge options below
8. Go to the Gear tab, and use the Level = 0 filter to manually fix any level 0 items

##### Running the automatic importer from a phone
1. On Windows 10 machines, enable Mobile Hotspot: [See image](https://i.imgur.com/89o8NfG.png)
  2. On Mac, enable Internet Sharing in preferences. (May not be available for all machines)
2. Connect to the mobile hotspot from your phone
3. Follow steps 3-8 in the previous 'Running the automatic importer from an emulator' section, using your phone instead of the emulator

_________________

### Using the screenshot importer
If you cannot use the automatic importer, or would prefer to use screenshots, follow the following steps.

##### First time setup for the screenshot importer on Windows
1. Install an emulator to run Epic 7 on
    * I used LDPlayer, but others have worked as well: MeMu, Nox, etc. Bluestacks works fine with the automatic importer, but has issues with screen resolution for the screenshot importer. See a solution for getting Bluestacks screenshots working [here](https://github.com/fribbels/Fribbels-Epic-7-Optimizer/commit/94b8730e94e6323b278265ab46f6602ed7822c22#r45552268)
2. Set the emulator's screen resolution to **1600 x 900**. [Example](https://i.imgur.com/kyUQ86a.png)
3. Set Epic 7 to **English** and enable **High Quality Support** in settings. [Example](https://i.imgur.com/iEbfVN3.png)
4. Unzip the downloaded file, and run FribbelsE7Optimizer.exe (or FribbelsE7Optimizer.dmg/app on Mac) [Example](https://i.imgur.com/jltdg0U.png)

##### First time setup for the screenshot importer on Mac

1. Install [Bluestacks](https://www.bluestacks.com/download.html)
    * Set the emulator's screen resolution to **1600x900** in the Preference menu
2. Configure keyboard shortcut for Screenshot
    * On your Mac: System Preference > Keyboard > Shortcuts Tab
      * Left Sidebar: Select App Shortcuts
      * Click the [+] button to add a shortcut
      * Application: Bluestacks
      * Menu Title: `Take screenshot` (any typo here will make it not work)
      * Keyboard Shortcut: Anything you want it to be
3. Back to Bluestacks: Install E7 from the Play Store and launch the game
   * Set Epic 7 to **English** and enable **High Quality Support** in settings. [Example](https://i.imgur.com/iEbfVN3.png)
4. Make sure to enter Full Screen Mode (Cmd+Shift+F) before starting your gear capture

##### Screenshotting gear

1. Open the Gear Management screen in Epic 7 and sort by Max Enhance<br>
2. Click each of the gears that you want to import, and screenshot it with your emulator's hotkey. Every screenshot should be **1600x900** and look **EXACTLY** like this: https://i.imgur.com/68A8Uf0.jpg

![https://i.imgur.com/ny7uaa8.jpg](https://i.imgur.com/ny7uaa8.jpg)

* Most emulators have a screenshot hotkey to make this easier: Ctrl + 0 for LDPlayer
* I would recommend screenshotting 10-20 gears to start with, then testing the rest of the steps to make sure the screenshots work before doing them all. I usually only screenshot the +9 to +15 gears for the optimizer.
3. Create an empty folder and collect all your screenshots into that folder.
4. Go to the Importer tab, click on "Choose folder" under *Creating gear data from screenshots*, find your screenshots folder, and click Open Folder.
5. The app will start reading the screenshots and your progress will be displayed. Once it is done, click Export, and save the *gear.txt* file.
6. Under the *Importing gear data* section, click on Append data, and select your *gear.txt* file.
7. Now you should see your imported gears under the Gears tab.

_________________

### Optimizing a unit

1. Add a unit on the Heroes tab, by selecting their name and clicking Add New Hero.
2. Select the new hero and click Add Bonus Stats. Here add any stats from your artifact, imprint, or EE. [Example](https://i.imgur.com/2aC22mN.png)
3. Go to the Optimizer tab, then select the hero. Fill in the main stats and set that you want into the right panel. [Example](https://i.imgur.com/3yfbkrE.png)
4. Fill in any filters you would like to apply. Each filter is described in detail in this section: https://github.com/fribbels/Fribbels-Epic-7-Optimizer#optimizer-tab
5. Hit Submit, and after processing a bit you should see a table of results.
6. Navigate the results with your arrow keys or mouse, select the result you want, and click Equip Selected.
7. You should now see your hero using those gears.
8. If you want to manually equip a certain item on a unit, go to the Gear tab -> Edit Selected Item -> Equipped. [Example](https://i.imgur.com/Bqs3ETL.png)

Here's a video that covers most of the importing process: https://www.youtube.com/watch?v=i_QW4INcZIE

_________________

### Updating your gear

* After enhancing/reforging/modifying your gear, you'll need to update it in the optimizer
* Run the auto importer again, or use the screenshot importer, to generate a new gear.txt
* Use the Merge (or other options) button on the Importer tab to update your existing save with the new gear

_________________

### Tips to get good optimization results:

Here's some quick tips on getting the best results. This is assuming you've read the [Optimization panel](https://github.com/fribbels/Fribbels-Epic-7-Optimizer#optimizer-tab) descriptions.

* **Input the sets and main stats whenever possible.** This is the easiest way to narrow down results.
* **Use the substat priority filter and make sure to set your stat priority correctly!**
  * DPS units should have high priority on Atk / Cr / Cd / Speed for example.
  * Tank units should have high priority on Hp / Def / Speed for example.
  * Bad priorities will lead to bad results because good options get filtered out.
* **Lower the Top % to make the search faster, or increase Top % to search more results.** Most of the time I use 25-40%, sometimes lower if I want only my best gear on the unit.
* If you want a certain piece of gear to stay on a hero, go to the Gear tab -> Edit Selected Item -> Equipped and equip it on them first. [Example](https://i.imgur.com/oNO9ivL.png) Then you can use the optimizer with "Keep current" checked to keep that piece on them.

_________________

## TODO List

There's still a lot of room to improve and I plan on adding new stuff as feedback comes in. I only work on this in my spare time, so please be patient with new features.

**Done for 1.7.0**
 - Optimization with substat mods
 - Drag and drop hero sorting
 - Conversion filter
 - Arrow keys on heroes/items
 - Use main stat gear for priority filter
 - Add 5 star base stats
 - Windows installer
 - Double reforge bug
 - Auto import equipped units
 - Priority score column
 - Merge bug
 - Add bonus stats
 - Confirmation dialog

**Working on:**
 - v1.7.0
 - Auto updater

 **Medium priority:**
 - Safer autosave folder loading https://cdn.discordapp.com/attachments/819494928077553684/831868290019229726/unknown.png
 - Save subprocess ids in settings and kill at startup

 **Low priority:**
 - Read file sync everything
 - Customizable optimization column formulas
 - Clear out item previews on refresh
 - Optimizer broken set priority
 - Hero priority equipping
 - Different pinned builds
 - Bug: Comparison method violates its general contract
 - Move save/load to File menu
 - Optimize multiple heroes at once
 - Gear page, option to use more than one set/gear filter at time
 - Auto copy gear image
 - Recolor on filter

 **Probably not doing:**
 - See unit stats for whatever gear they have currently, not just for 6 pieces
 - Cancel ongoing request when start is clicked again
 - Update permutations on 4 piece set
 - Select/interact with multiple heroes at once
 - Verify all imported screenshots are image files
 - Date newly added gear
 - Enable cross platform for Linux
 - Have two windows open at once
 - Optimize results with a missing piece(s)
 - Reapply all filters on Filter button press
 - Check if any gear is an upgrade to a unit
 - Option to equip gear from heroes page

## Troubleshooting


### Automatic importer
* If it takes longer than 30 seconds and no error shows up.
  * Make sure the requirements are installed (Python and Npcap for Windows, Python and Wireshark for Mac), or try reinstalling them.
  * Restart your computer
  * If you're on VPN, either disable it or change encryption to UDP
  * If you have Hyper-V enabled, there's a couple options:
    * Open the View Network Connections menu, and disable the Hyper-V Bluestacks network adapter, then use the mobile hotspot import option.
    * Or modify the scanner code to hardcode your network interface: https://github.com/fribbels/Fribbels-Epic-7-Optimizer/issues/50#issuecomment-804275567
* Shows an error
  * Try it again a couple times, it does fail occasionally

* Feel free to drop by the Discord server for help debugging other issues: https://discord.gg/rDmB4Un7qg

### Optimizer

- If you're seeing Java issues:
  - Make sure Java 8 - 64 bit is installed.
  - Make sure that Java is in your path environment variable: https://mkyong.com/java/how-to-set-java_home-on-windows-10/
  - Try restarting your computer, and reopen the app (there might be a subprocess still kicking around)

- If you're having trouble running the app after downloading:
  - If you don't see the .exe file, you might have downloaded the Source code instead of the binaries. Go to https://github.com/fribbels/Fribbels-Epic-7-Optimizer/releases and click on the 'FribbelsE7Optimizer-x.x.x...' file (for your specific OS), not the Souce code
  - Error about a missing "ffmpeg.dll", you might have opened the file without unzipping it. Make sure to unzip/extract the .zip file after downloading it.

- If you see a "Error: EPERM: operation not permitted" error pop up while importing, there are a couple potential fixes:
  - Restart your computer, especially if you installed Java recently
  - Your antivirus might be blocking the app, try disabling it. I've seen issues with Avast specifically, and disabling Avast temporarily solves it.
  - Your file or folder contents might be compressed, uncheck this box on the folder: https://i.imgur.com/kSzTqek.png
  - Run the app as administrator
  - Move the app and screenshots folder to a new file location
  - Disable Windows security randomware protection: https://www.majorgeeks.com/content/page/how_to_enable_or_disable_windows_defender_exploit_guard_controlled_folder_access.html

- If you get a error that contains "Current relative path is C:\Windows\system32..."
  - I don't actually know the cause of this one, but one way to fix it is copying the data/tessdata/eng.traineddata/eng.traineddata file into the system32 path that its looking for

- If you're having trouble using it on Mac - "The application "FribbelsE7Optimizer" can't be opened":
  - Try unzipping the file using Unarchiver from the app store instead of Archive Utility. [Example](https://i.imgur.com/y9uGQcH.png)
  - Try downloading the .dmg file if you were using the zip/app file.
- If you're having trouble with Bluestacks/unable to resize the screenshots to 1600x900:
  - Windows: See possible Bluestacks workaround [here](https://github.com/fribbels/Fribbels-Epic-7-Optimizer/commit/94b8730e94e6323b278265ab46f6602ed7822c22#r45552268).
  - Mac: Resize to 1600x900 through Bluestacks options, then restart Bluestacks, then click the green button to fullscreen Bluestacks. After its fullscreened, screenshots will come out as 1600x900.

- If a hero is missing from the drop down list, contact me to add it.

- If you see a bunch of optimization result rows with the same stats, you probably have duplicate gear. [Example](https://i.imgur.com/hUcyN1I.png)
  - Use the Duplicates filter on the Gear screen to find and fix your duplicate gear. Alternatively Overwrite/Merge your gear data to start over. Be careful when using the Append option, because that can result in duplicate gear being added. Most of the time you'll want to use Merge.

- If you're having problems with importing screenshot files:
 - Inspect your screenshots and make sure they are exactly **1600x900** resolution.
 - Make sure your Epic 7 settings have **English** and **High Quality Support** enabled.
 - Try moving your app and screenshot folder to a different location. (try the desktop)

* Drop by the Discord server for help debugging other issues: https://discord.gg/rDmB4Un7qg

## Contributing to the project

If you want to contribute, come by the discord server to have a chat about what you want to do. There's a huge list of todo items and I'm happy to have people add to the code.

We also have an ongoing translation project to translate the optimizer into various languages.

To run the code locally,

1. Install requirements
  1. Install node.js: https://nodejs.org/
  2. Install python2 and python3: https://www.python.org/downloads/
  3. Install yarn: ``npm install --global yarn``
2. Check out the code
3. Run ``npm install`` in the app's root directory
4. To run the development version locally: ``yarn dev``
5. To build and package the production executables: ``yarn package``

## Contact me

Come join the Fribbels E7 Optimizer Discord server for questions or comments or ideas/suggestions: https://discord.gg/rDmB4Un7qg. If you ran into any issues, please check the [troubleshooting](https://github.com/fribbels/Fribbels-Epic-7-Optimizer/#troubleshooting) section above first.

If you want to show support for the optimizer, you can [buy me a coffee](https://www.buymeacoffee.com/fribbels) or come say hi on Discord!