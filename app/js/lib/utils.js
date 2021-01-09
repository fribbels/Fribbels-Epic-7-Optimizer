const stringSimilarity = require('string-similarity');

module.exports = {
    sortByAttribute: (arr, attribute) => {
        arr.sort((a,b) => {
            if (a[attribute] < b[attribute]) {
                return -1;
            }
            if (a[attribute] > b[attribute]) {
                return 1;
            }
            return 0;
        })
    },

    stringDistance: (str1, str2) =>{
        return stringSimilarity.compareTwoStrings(str1, str2);
    },
}