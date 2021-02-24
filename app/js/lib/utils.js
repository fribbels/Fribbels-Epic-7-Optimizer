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

    stringDistance: (str1, str2) => {
        return stringSimilarity.compareTwoStrings(str1, str2);
    },

    round10ths: (number) => {
        return Math.round(number * 10) / 10
    },


    customFilter: (label, text, originalLabel, originalText) => {
        var index = 0;
        var targetText = text;
        var targetLabel = label;

        if ($('input').prop('checked')) {
            targetText = originalText.toLowerCase();
            targetLabel = originalLabel.toLowerCase();
        }

        targetText = targetText.toLowerCase();
        targetLabel = targetLabel.toLowerCase();

        if (targetText[0] != targetLabel[0]) {
            return false;
        }

        var index = 0;
        for (var i = 0; i < targetText.length; i++) { //
            const letter = targetText[i];
            var found = false;

            for (var j = index; j < targetLabel.length; j++) { // briar w
                const letterMatch = targetLabel[j];

                if (letter == letterMatch) {
                    found = true;
                    index = j + 1;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

}