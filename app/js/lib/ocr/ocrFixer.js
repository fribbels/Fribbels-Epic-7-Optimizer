module.exports = {
    fixOcr: (data) => {
        return {
            gearText: fixGearText(data),
            gearName: fixGearName(data),
            mainStatText: fixMainStatText(data),
            subStatText: fixSubStatText(data),
            setText: fixSetText(data),
            subStatNumbers: fixSubStatNumbers(data),
            mainStatNumbers: fixMainStatNumbers(data), 
            levelNumbers: fixLevelNumbers(data),
            enhanceNumbers: fixEnhanceNumbers(data)
        };
    }
}
/*
enhanceNumbers: "+13↵"
gearText: "EpicRing↵BloodBeasts↵Ring↵"
levelNumbers: "57↵"
mainStatNumbers: "31%↵"
mainStatText: "Attack↵"
setText: "LifestealSet↵"
subStatNumbers: "10%↵2↵7%↵15%↵"
subStatText: "Health↵↵Speed↵CriticalHitChance↵Effectiveness↵"
=================================================
{
  "gearText": "EpicRing",
  "gearName": "BloodBeastsRing",
  "mainStatText": "Attack",
  "subStatText": [
    "Health",
    "Speed",
    "CriticalHitChance",
    "Effectiveness"
  ],
  "setText": "LifestealSet",
  "subStatNumbers": [
    "10%",
    "2",
    "7%",
    "15%"
  ],
  "mainStatNumbers": "31%",
  "levelNumbers": "57",
  "enhanceNumbers": "13"
}
*/
function fixGearText(data) {
    return getFirstLine(data.gearText);
}

function fixGearName(data) {
    return data.gearText
            .split('\n')
            .map(trimString)
            .filter(isNotBlankString)
            .slice(1)
            .join("");
}

function fixMainStatText(data) {
    return getFirstLine(data.mainStatText).replace(/[\s,]/g, '');
}

function fixSubStatText(data) {
    return data.subStatText
            .map(trimString)
            .map(x => x.replace(/[\s,]/g, ''))
            .filter(isNotBlankString);
}

function fixSetText(data) {
    return getFirstLine(data.setText);
}

function fixSubStatNumbers(data) {
    return data.subStatNumbers
            .map(trimString)
            .map(x => x.replace(/[\s,]/g, ''))
            .filter(isNotBlankString);
}

function fixMainStatNumbers(data) {
    return getFirstLine(data.mainStatNumbers).replace(/[\s,]/g, '');
}

function fixLevelNumbers(data) {
    const line = getFirstLine(data.levelNumbers).replace(/\s/g, '').substring(0, 2);
    return replaceErrorLevel(line);
}

function fixEnhanceNumbers(data) {
    const enhanceNumbers = data.enhanceNumbers;
    if (isBlankString(enhanceNumbers)) {
        return 0;
    }

    const parsed = getFirstLine(enhanceNumbers);
    const num = parseInt(parsed.replace(/[+\s]*/g, ''));

    return isNaN(num) ? 0 : num;
}

function isNotBlankString(str) {
    return !isBlankString(str);
}

function isBlankString(str) {
    return str == null 
    ||     str == undefined 
    ||     str.length == 0;
}

function trimString(str) {
    return str.trim();
}

function getFirstLine(str) {
    return str
            .split('\n')
            .map(trimString)
            .filter(isNotBlankString)
            [0];
}

function replaceErrorLevel(str) {
    if (Object.keys(levelErrors).includes(str)) {
        return levelErrors[str];
    }

    return str.substring(0, 2);
}

const levelErrors = {
    "9": "90"
}