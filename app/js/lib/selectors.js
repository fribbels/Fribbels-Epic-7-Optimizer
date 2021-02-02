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
        const allowGearFromMultipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: false
        };
        $('#inputSet1').multipleSelect(Object.assign({}, multipleSelectOptions, {placeholder:"4 or 2 piece sets"}));
        $('#inputSet2').multipleSelect(Object.assign({}, multipleSelectOptions, {placeholder:"2 piece sets"}));
        $('#inputSet3').multipleSelect(Object.assign({}, multipleSelectOptions, {placeholder:"2 piece sets"}));
        $('#inputNecklaceStat').multipleSelect(Object.assign({}, multipleSelectOptions, {placeholder:"Necklace"}));
        $('#inputRingStat').multipleSelect(Object.assign({}, multipleSelectOptions, {placeholder:"Ring"}));
        $('#inputBootsStat').multipleSelect(Object.assign({}, multipleSelectOptions, {placeholder:"Boots"}));
        $('#inputExcludeSet').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"Exclude sets"}));

        $('#optionsExcludeGearFrom').multipleSelect(Object.assign({}, nonHoverMultipleSelectOptions, {placeholder:"Exclude gear from", selectAll: true}));
    },

    refreshAllowGearFrom: () => {
        $('#optionsExcludeGearFrom').multipleSelect('refresh')
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