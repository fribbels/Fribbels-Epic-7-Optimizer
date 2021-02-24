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
        const selectAllMultipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: true
        };
        const groupSelectMultipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            // hideOptgroupCheckboxes: true,
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
            // customFilter: Utils.customFilter,
            filterAcceptOnEnter: true
        };
        const addHeroSelectorOptions = {
            filter: true,
            // customFilter: Utils.customFilter,
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
        $('#inputSet1').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder:"4 or 2 piece sets"}));
        $('#inputSet2').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder:"2 piece sets"}));
        $('#inputSet3').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder:"2 piece sets"}));
        $('#inputNecklaceStat').multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder:"Necklace"}));
        $('#inputRingStat').multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder:"Ring"}));
        $('#inputBootsStat').multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder:"Boots"}));
        $('#inputExcludeSet').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder:"Exclude sets"}));
        $('#inputHeroAdd').multipleSelect(Object.assign({}, heroSelectorOptions, {placeholder:"Hero"}))
        $('#addHeroesSelector').multipleSelect(Object.assign({}, addHeroSelectorOptions, {placeholder:"Hero"}))

        $('#optionsExcludeGearFrom').multipleSelect(Object.assign({}, excludeEquippedSelectOptions, {placeholder:"Exclude equipped", selectAll: true}));

        console.log("DONE INITIALIZING SELECTORS");
    },

    refreshAllowGearFrom: () => {
        const selects = Settings.getExcludeSelects();
        // const selects = $('#optionsExcludeGearFrom').multipleSelect('getSelects');
        $('#optionsExcludeGearFrom').multipleSelect('refresh')
        $('#optionsExcludeGearFrom').multipleSelect('setSelects', selects)
        console.log("DONE REFRESH EXCLUDE", selects);
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