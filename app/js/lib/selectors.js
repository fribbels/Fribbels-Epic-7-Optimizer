var addHeroSelectorOpen = false;

module.exports = {
    initialize: () => {
        const multipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            openOnHover: true,
            selectAll: false
        };
        const nonHoverMultipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: false
        };
        const excludeEquippedSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: false,
            filter: true,
        };
        const heroSelectorOptions = {
            filter: true,
            customFilter: customFilter,
            filterAcceptOnEnter: true
        };
        const addHeroSelectorOptions = {
            filter: true,
            customFilter: customFilter,
            filterAcceptOnEnter: true,

            onOpen: function () {
                if (!addHeroSelectorOpen) {
                    $('#addHeroesSelector').multipleSelect('refresh');
                }
                addHeroSelectorOpen = true;
            },
        };
        const allowGearFromMultipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: false
        };
        $('#inputSet1').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"4 or 2 piece sets"}));
        $('#inputSet2').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"2 piece sets"}));
        $('#inputSet3').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"2 piece sets"}));
        $('#inputNecklaceStat').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"Necklace"}));
        $('#inputRingStat').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"Ring"}));
        $('#inputBootsStat').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"Boots"}));
        $('#inputExcludeSet').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"Exclude sets"}));
        $('#inputHeroAdd').multipleSelect(Object.assign({}, heroSelectorOptions, {placeholder:"Hero"}))
        $('#addHeroesSelector').multipleSelect(Object.assign({}, addHeroSelectorOptions, {placeholder:"Hero"}))

        $('#optionsExcludeGearFrom').multipleSelect(Object.assign({}, excludeEquippedSelectOptions, {placeholder:"Exclude equipped", selectAll: true}));
    },

    refreshAllowGearFrom: () => {
        const selects = $('#optionsExcludeGearFrom').multipleSelect('getSelects');
        $('#optionsExcludeGearFrom').multipleSelect('refresh')
        $('#optionsExcludeGearFrom').multipleSelect('setSelects', selects)
    },

    refreshInputHeroAdd: () => {
        $('#inputHeroAdd').multipleSelect('refresh')
    },

    getExcludeGearFrom: () => {
        const exclude = $('#optionsExcludeGearFrom').multipleSelect('getSelects')

        console.log("Exclude", exclude);
        return exclude;
    },

    getGearMainFilters: () => {
        const inputNecklaceStat = $('#inputNecklaceStat').multipleSelect('getSelects')
        const inputRingStat = $('#inputRingStat').multipleSelect('getSelects')
        const inputBootsStat = $('#inputBootsStat').multipleSelect('getSelects')

        console.log("Main stat selectors", inputNecklaceStat, inputRingStat, inputBootsStat);
        return [inputNecklaceStat, inputRingStat, inputBootsStat];
    },

    getSetFilters: () => {
        const inputSet1 = $('#inputSet1').multipleSelect('getSelects')
        const inputSet2 = $('#inputSet2').multipleSelect('getSelects')
        const inputSet3 = $('#inputSet3').multipleSelect('getSelects')
        const inputExcludeSet = $('#inputExcludeSet').multipleSelect('getSelects')

        console.log("Set selectors", inputSet1, inputSet2, inputSet3, inputExcludeSet);
        return {
            sets: [inputSet1, inputSet2, inputSet3],
            exclude: inputExcludeSet
        }
    },

    clearGearMainAndSets: () => {
        const inputSet1 = $('#inputSet1').multipleSelect('uncheckAll')
        const inputSet2 = $('#inputSet2').multipleSelect('uncheckAll')
        const inputSet3 = $('#inputSet3').multipleSelect('uncheckAll')
        const inputNecklaceStat = $('#inputNecklaceStat').multipleSelect('uncheckAll')
        const inputRingStat = $('#inputRingStat').multipleSelect('uncheckAll')
        const inputBootsStat = $('#inputBootsStat').multipleSelect('uncheckAll')
        const inputExcludeSet = $('#inputExcludeSet').multipleSelect('uncheckAll')
    },

    setGearMainAndSetsFromRequest: (request) => {
        $('#inputSet1').multipleSelect('setSelects', request.inputSetsOne || [])
        $('#inputSet2').multipleSelect('setSelects', request.inputSetsTwo || [])
        $('#inputSet3').multipleSelect('setSelects', request.inputSetsThree || [])
        $('#inputNecklaceStat').multipleSelect('setSelects', request.inputNecklaceStat || [])
        $('#inputRingStat').multipleSelect('setSelects', request.inputRingStat || [])
        $('#inputBootsStat').multipleSelect('setSelects', request.inputBootsStat || [])
        $('#inputExcludeSet').multipleSelect('setSelects', request.inputExcludeSet || [])
    }
}

function customFilter(label, text, originalLabel, originalText) {
    var index = 0;
    var targetText = text;
    var targetLabel = label;

    if ($('input').prop('checked')) {
        targetText = originalText;
        targetLabel = originalLabel;
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

function respondToVisibility(element, callback) {
    console.error("RESPOND");
  var options = {
    root: document.documentElement
  }

  var observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      callback(entry.intersectionRatio > 0);
    });
  }, options);

  observer.observe(element);
}