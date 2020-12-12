module.exports = {
    initialize: () => {
        const multipleSelectOptions = {
            maxHeight: 450,
            showClear: true,
            hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: false
        };
        $('#inputSet1').multipleSelect(multipleSelectOptions);
        $('#inputSet2').multipleSelect(multipleSelectOptions);
        $('#inputSet3').multipleSelect(multipleSelectOptions);
        $('#inputNecklaceStat').multipleSelect(multipleSelectOptions);
        $('#inputRingStat').multipleSelect(multipleSelectOptions);
        $('#inputBootsStat').multipleSelect(multipleSelectOptions);
    }, 

    getGearMainFilters: () => {
        const inputNecklaceStat = $('#inputNecklaceStat').multipleSelect('getSelects')
        const inputRingStat = $('#inputRingStat').multipleSelect('getSelects')
        const inputBootsStat = $('#inputBootsStat').multipleSelect('getSelects')

        console.log(inputNecklaceStat, inputRingStat, inputBootsStat);
        return [inputNecklaceStat, inputRingStat, inputBootsStat];
    },

    getSetFilters: () => {
        const inputSet1 = $('#inputSet1').multipleSelect('getSelects')
        const inputSet2 = $('#inputSet2').multipleSelect('getSelects')
        const inputSet3 = $('#inputSet3').multipleSelect('getSelects')

        console.log(inputSet1, inputSet2, inputSet3);
        return [inputSet1, inputSet2, inputSet3];
    },
}