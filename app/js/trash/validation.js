
module.exports = {
    validate() {
        
    }
}







function getLevel(str) {
    return getInt(str, 1, 88);
}

function getPlus(str) {
    return getInt(str, 0, 15);
}

function getEnum(str, enumInput) {
    for (var entry of Object.entries(enumInput)) {
        if (str == entry[1]) {
            console.log(entry[0]);
            return entry[0];
        }
    }

    throw 'Invalid enum ' + str;
}

function getStat(str) {
    if (str == null || str.length == 0)
        return null;

    const stat = {
        'value': getStatValue(str),
        'type': getStatType(str)
    }
    console.log(stat);
    return stat;
}

function getStatValue(str) {
    const numStr = str.replace(/\D/g, '');
    return getInt(numStr, 1, 99999);
}

function getStatType(str) {
    const strStr = str.replace(/[^%a-zA-Z]/g, '');
    return getEnum(strStr, statEnum);
}

function getInt(str, min, max) {
    const int = parseInt(str);
    if (int != NaN && int >= min && int <= max) {
        console.log(int);
        return int;
    }

    throw 'Invalid input: ' + str;
}

function getTierFromLevel(level) {
    if (level <= 57)
        return 4;
    if (level <= 71)
        return 5;
    if (level <= 85)
        return 6
    return 7;
}

function getEnumArray(str, enumInput) {
    const strArr = str.split('/');
    console.log(strArr);

    const enumArr = strArr.map(s => getEnum(s, enumInput));
    console.log(enumArr);

    return enumArr;
}
