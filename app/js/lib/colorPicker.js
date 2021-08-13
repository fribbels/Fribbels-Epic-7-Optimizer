/*

default
bg = #212529
text = #e2e2e2
accent = #F84C48
textbox/button #2D3136

text #e2e2e2
red f84c48
neutral 212529
green  00be9b


*/
function redraw() {
    userGradient.gradient = tinygradient([
        {color: myColors.bad, pos: 0}, // red
        {color: myColors.neutral, pos: 0.5},
        {color: myColors.good, pos: 1} // green
    ]);


    try {
        global.itemsGrid.gridOptions.api.redrawRows();
        global.buildsGrid.gridOptions.api.redrawRows();
        global.optimizerGrid.gridOptions.api.redrawRows();
    } catch (e) {

    }
}

module.exports = {
    loadColorSettings: (settings) => {
        if (settings.settingBackgroundColor) {
            document.documentElement.style.setProperty('--bg-color', settings.settingBackgroundColor);
            document.getElementById('backgroundColorPicker').value = settings.settingBackgroundColor;
        }
        if (settings.settingTextColorPicker) {
            document.documentElement.style.setProperty('--font-color', settings.settingTextColorPicker);
            document.documentElement.style.setProperty('--inactive-color', settings.settingTextColorPicker + '3f');
            document.getElementById('textColorPicker').value = settings.settingTextColorPicker;
        }
        if (settings.settingAccentColorPicker) {
            document.documentElement.style.setProperty('--accent-color', settings.settingAccentColorPicker);
            document.documentElement.style.setProperty('--outline-color', settings.settingAccentColorPicker + '60');
            document.getElementById('accentColorPicker').value = settings.settingAccentColorPicker;
        }
        if (settings.settingInputColorPicker) {
            document.documentElement.style.setProperty('--input-color', settings.settingInputColorPicker);
            document.documentElement.style.setProperty('--btn-color', settings.settingInputColorPicker);
            document.getElementById('inputColorPicker').value = settings.settingInputColorPicker;
        }
        if (settings.settingGridTextColorPicker) {
            document.documentElement.style.setProperty('--grid-font-color', settings.settingGridTextColorPicker);
            document.getElementById('gridTextColorPicker').value = settings.settingGridTextColorPicker;
        }
        if (settings.settingRedColorPicker) {
            document.getElementById('redColorPicker').value = settings.settingRedColorPicker;
            myColors.bad = settings.settingRedColorPicker;

            redraw();
        }
        if (settings.settingNeutralColorPicker) {
            myColors.neutral = settings.settingNeutralColorPicker;
            document.getElementById('neutralColorPicker').value = settings.settingNeutralColorPicker;

            redraw();
        }
        if (settings.settingGreenColorPicker) {
            document.documentElement.style.setProperty('--accent-green', settings.settingGreenColorPicker);
            myColors.good = settings.settingGreenColorPicker;
            document.getElementById('greenColorPicker').value = settings.settingGreenColorPicker;
            // darkUserGradient.gradient = tinygradient(LightenDarkenColor(myColors.good, 60), myColors.good);

            darkUserGradient.gradient = tinygradient(myColors.neutral, myColors.good);

            redraw();
        }
    },

    initialize: () => {
        let bgColor = document.getElementById('backgroundColorPicker');
        let textColor = document.getElementById('textColorPicker');
        let accentColor = document.getElementById('accentColorPicker');
        let inputColor = document.getElementById('inputColorPicker');
        let gridTextColorPicker = document.getElementById('gridTextColorPicker')
        let redColor = document.getElementById('redColorPicker');
        let neutralColor = document.getElementById('neutralColorPicker');
        let greenColor = document.getElementById('greenColorPicker');

        const settingsToChange = [
            "backgroundColorPicker",
            "textColorPicker",
            "accentColorPicker",
            "inputColorPicker",
            "gridTextColorPicker",
            "redColorPicker",
            "neutralColorPicker",
            "greenColorPicker"
        ]

        for (toChange of settingsToChange) {
            document.getElementById(toChange).addEventListener("change", (ev) => {
                Settings.saveSettings();
            }, false);
        }

        // const defaults = {
        //     backgroundColorPickerText: ["#212529", "backgroundColorPicker"],
        //     textColorPickerText: ["#E2E2E2", "textColorPicker"],
        //     accentColorPickerText: ["#F84C48", "accentColorPicker"],
        //     textboxColorPickerText: ["#2D3136", "inputColorPicker"],
        //     // gridTextColorPickerText: ["#e2e2e2", redColor],
        //     gridRedColorPickerText: ["#f84c48", "redColorPicker"],
        //     gridNeutralColorPickerText: ["#212529", "neutralColorPicker"],
        //     gridGreenColorPickerText: ["#00be9b", "greenColorPicker"]
        // }

        // for (label of Object.keys(defaults)) {
        //     const value = defaults[label];

        //     document.getElementById(label).addEventListener("click", (ev) => {
        //         document.documentElement.style.setProperty('--bg-color', value[0]);
        //         document.getElementById(value[]).value = value[0];
        //     }, false);

        // }

        document.getElementById('backgroundColorPickerText').addEventListener("click", (ev) => {
            document.documentElement.style.setProperty('--bg-color', "#212529");
            document.getElementById('backgroundColorPicker').value = "#212529";
            Settings.saveSettings();
        }, false)

        document.getElementById('textColorPickerText').addEventListener("click", (ev) => {
            document.documentElement.style.setProperty('--font-color', "#E2E2E2");
            document.documentElement.style.setProperty('--inactive-color', '#E2E2E2' + '3f');
            document.getElementById('textColorPicker').value = "#E2E2E2";
            Settings.saveSettings();
        }, false)

        document.getElementById('accentColorPickerText').addEventListener("click", (ev) => {
            document.documentElement.style.setProperty('--accent-color', "#F84C48");
            document.documentElement.style.setProperty('--outline-color', "#F84C48" + '60');
            document.getElementById('accentColorPicker').value = "#F84C48";
            Settings.saveSettings();
        }, false)

        document.getElementById('textboxColorPickerText').addEventListener("click", (ev) => {
            document.documentElement.style.setProperty('--input-color', "#2D3136");
            document.documentElement.style.setProperty('--btn-color', "#2D3136");
            document.getElementById('inputColorPicker').value = "#2D3136";
            Settings.saveSettings();
        }, false)

        document.getElementById('gridTextColorPickerText').addEventListener("click", (ev) => {
            document.documentElement.style.setProperty('--grid-font-color', "#E2E2E2");
            document.getElementById('gridTextColorPicker').value = "#E2E2E2";
            Settings.saveSettings();
        }, false)

        document.getElementById('gridRedColorPickerText').addEventListener("click", (ev) => {
            // document.documentElement.style.setProperty('--accent-red', '#5A1A06');
            document.getElementById('redColorPicker').value = "#5A1A06";
            myColors.bad = '#5A1A06';

            redraw();
            Settings.saveSettings();
        }, false)

        document.getElementById('gridNeutralColorPickerText').addEventListener("click", (ev) => {
            myColors.neutral = '#343127';
            document.getElementById('neutralColorPicker').value = "#343127";

            redraw();
            Settings.saveSettings();
        }, false);

        document.getElementById('gridGreenColorPickerText').addEventListener("click", (ev) => {
            document.documentElement.style.setProperty('--accent-green', '#00BE9B');
            myColors.good = '#38821F';
            document.getElementById('greenColorPicker').value = "#38821F";
            // darkUserGradient.gradient = tinygradient(LightenDarkenColor(myColors.good, 60), myColors.good);

            darkUserGradient.gradient = tinygradient(myColors.neutral, myColors.good);

            redraw();
            Settings.saveSettings();
        }, false);


        bgColor.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--bg-color', ev.target.value);
        }, false);

        textColor.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--font-color', ev.target.value);
            document.documentElement.style.setProperty('--inactive-color', ev.target.value + '3f');
        }, false);

        accentColor.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--accent-color', ev.target.value);
            document.documentElement.style.setProperty('--outline-color', ev.target.value + '60');
        }, false);

        inputColor.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--input-color', ev.target.value);
            document.documentElement.style.setProperty('--btn-color', ev.target.value);
        }, false);


        gridTextColorPicker.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--grid-font-color', ev.target.value);
        }, false);

        redColor.addEventListener("change", (ev) => {
            // document.documentElement.style.setProperty('--accent-red', ev.target.value);
            myColors.bad = ev.target.value;

            userGradient.gradient = tinygradient([
                {color: myColors.bad, pos: 0}, // red
                {color: myColors.neutral, pos: 0.5},
                {color: myColors.good, pos: 1} // green
            ]);

        
            try {
                global.itemsGrid.gridOptions.api.redrawRows();
                global.buildsGrid.gridOptions.api.redrawRows();
                global.optimizerGrid.gridOptions.api.redrawRows();
            } catch (e) {
        
            }

            
            //add red value for the grids
        }, false);

        neutralColor.addEventListener("change", (ev) => {
            myColors.neutral = ev.target.value;

            userGradient.gradient = tinygradient([
                {color: myColors.bad, pos: 0}, // red
                {color: myColors.neutral, pos: 0.5},
                {color: myColors.good, pos: 1} // green
            ]);

        
            try {
                global.itemsGrid.gridOptions.api.redrawRows();
                global.buildsGrid.gridOptions.api.redrawRows();
                global.optimizerGrid.gridOptions.api.redrawRows();
            } catch (e) {
        
            }
            
            //add middle value for the grids
        }, false);

        greenColor.addEventListener("change", (ev) => {
            // document.documentElement.style.setProperty('--accent-green', ev.target.value);
            myColors.good = ev.target.value;

            userGradient.gradient = tinygradient([
                {color: myColors.bad, pos: 0}, // red
                {color: myColors.neutral, pos: 0.5},
                {color: myColors.good, pos: 1} // green
            ]);

            darkUserGradient.gradient = tinygradient(LightenDarkenColor(myColors.good, 60), myColors.good);
        
            try {
                global.itemsGrid.gridOptions.api.redrawRows();
                global.buildsGrid.gridOptions.api.redrawRows();
                global.optimizerGrid.gridOptions.api.redrawRows();
            } catch (e) {
        
            }
            
            //add green value for the grids
        }, false);


    },

    
    getColors: () => {
        return userGradient;
    },

    get2Colors: () => {
        return darkUserGradient;
    },
}

function LightenDarkenColor(col, amt) {
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

var myColors = {
    bad:'#5A1A06', neutral:'#343127', good:'#38821F'
}

const tinygradient = require('tinygradient');

var userGradient = {gradient:tinygradient([
    {color: myColors.bad, pos: 0}, // red
    {color: myColors.neutral, pos: 0.5},
    {color: myColors.good, pos: 1} // green
])};

var darkUserGradient = {gradient:tinygradient(myColors.good, myColors.neutral)};
