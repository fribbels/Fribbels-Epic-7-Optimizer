module.exports = {

    initialize: () => {
        let bgColor = document.getElementById('backgroundColorPicker');
        let textColor = document.getElementById('textColorPicker');
        let accentColor = document.getElementById('accentColorPicker');
        let inputColor = document.getElementById('inputColorPicker');
        let redColor = document.getElementById('redColorPicker');
        let neutralColor = document.getElementById('neutralColorPicker');
        let greenColor = document.getElementById('greenColorPicker');

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

        redColor.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--accent-red', ev.target.value);
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

        neutralColor.addEventListener("input", (ev) => {
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

        greenColor.addEventListener("input", (ev) => {
            document.documentElement.style.setProperty('--accent-green', ev.target.value);
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
    bad:'#7B3B3E', neutral:'#212529', good:'#107162'
}

const tinygradient = require('tinygradient');

var userGradient = {gradient:tinygradient([
    {color: myColors.bad, pos: 0}, // red
    {color: myColors.neutral, pos: 0.5},
    {color: myColors.good, pos: 1} // green
])};

var darkUserGradient = {gradient:tinygradient(LightenDarkenColor(myColors.good, 60), myColors.good)};



