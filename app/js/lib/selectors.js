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

        const assetsBySet = Assets.getAssetsBySet();
        const groupSelectMultipleSelectOptions = {
            maxHeight: 500,
            showClear: true,
            // hideOptgroupCheckboxes: true,
            minimumCountSelected: 99,
            displayTitle: true,
            displayValues: true,
            selectAll: false,
            textTemplate: function (el) {
                const val = el.html();
                const assetKey = val + "Set";

                if (Object.keys(assetsBySet).includes(assetKey)) {
                    const asset = assetsBySet[assetKey];
                    return `<div class="selectorSetContainer"><img class="selectorSetImage" src="${asset}"></img><div class="selectorSetText">${el.html()}</div></div>`
                }

                return el.html()
            },
            styler: function (row) {
                return '';
            }
        };
        const enhanceOptions = {
            maxHeight: 500,
            showClear: false,
            minimumCountSelected: 99,
            displayTitle: true,
            selectAll: false,
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
        $('#inputSet1').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("4 or 2 piece sets")}));
        $('#inputSet2').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("2 piece sets")}));
        $('#inputSet3').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("2 piece sets")}));
        $('#inputNecklaceStat').multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder: i18next.t("Necklace")},{formatSelectAll () {return i18next.t('[Select all]')}}));
        $('#inputRingStat').multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder: i18next.t("Ring")},{formatSelectAll () {return i18next.t('[Select all]')}}));
        $('#inputBootsStat').multipleSelect(Object.assign({}, selectAllMultipleSelectOptions, {placeholder: i18next.t("Boots")},{formatSelectAll () {return i18next.t('[Select all]')}}));
        $('#inputExcludeSet').multipleSelect(Object.assign({}, groupSelectMultipleSelectOptions, {placeholder: i18next.t("Exclude sets")}));
        $('#inputHeroAdd').multipleSelect(Object.assign({}, heroSelectorOptions, {placeholder: i18next.t("Hero")}))
        $('#addHeroesSelector').multipleSelect(Object.assign({}, addHeroSelectorOptions, {placeholder: i18next.t("Hero")}))

        $('#optionsExcludeGearFrom').multipleSelect(Object.assign({}, excludeEquippedSelectOptions, {placeholder: i18next.t("Exclude equipped"), selectAll: true},{formatSelectAll () {return i18next.t('[Select all]')}}));
        $('#optionsEnhanceLimit').multipleSelect(Object.assign({}, enhanceOptions, {placeholder: i18next.t("Minimum enhance"), selectAll: false}));

        // $('#optionsExcludeGearFrom' + index).multipleSelect('setSelects', ["0", "3", "6", "9", "12", "15"])

        console.log("DONE INITIALIZING SELECTORS");
    },

    refreshMultiHeroSelector: (id) => {
        const heroSelectorOptions = {
            filter: true,
            // customFilter: Utils.customFilter,
            filterAcceptOnEnter: true
        };
        // $('#' + id).multipleSelect(Object.assign({}, heroSelectorOptions, {placeholder: i18next.t("Hero")}))

        const selects = $('#' + id).multipleSelect('getSelects')
        // const selects = $('#optionsExcludeGearFrom').multipleSelect('getSelects');
        $('#' + id).multipleSelect('refresh')
        $('#' + id).multipleSelect('setSelects', selects)
    },

    setMultiHeroSelector: (id) => {
        const heroSelectorOptions = {
            filter: true,
            // customFilter: Utils.customFilter,
            filterAcceptOnEnter: true
        };
        $('#' + id).multipleSelect(Object.assign({}, heroSelectorOptions, {placeholder: i18next.t("Hero")}))
    },


    refreshAllowGearFrom: (index) => {
        if (index == null || index == undefined) {
            index = '';
        }
        const selects = Settings.getExcludeSelects();
        // const selects = $('#optionsExcludeGearFrom').multipleSelect('getSelects');
        $('#optionsExcludeGearFrom' + index).multipleSelect('refresh')
        $('#optionsExcludeGearFrom' + index).multipleSelect('setSelects', selects)
        console.log("DONE REFRESH EXCLUDE", selects);
    },

    refreshInputHeroAdd: () => {
        $('#inputHeroAdd').multipleSelect('refresh')
    },

    getExcludeGearFrom: (index) => {
        if (index == null || index == undefined) {
            index = '';
        }
        const exclude = $('#optionsExcludeGearFrom' + index).multipleSelect('getSelects')

        console.log("Exclude", exclude);
        return exclude;
    },

    getEnhanceLimit: (index) => {
        if (index == null || index == undefined) {
            index = '';
        }
        const enhanceLimit = $('#optionsEnhanceLimit' + index).multipleSelect('getSelects')

        console.log("Enhance limit", enhanceLimit);
        return enhanceLimit;
    },

    getGearMainFilters: (index) => {
        if (index == null || index == undefined) {
            index = '';
        }
        const inputNecklaceStat = $('#inputNecklaceStat' + index).multipleSelect('getSelects')
        const inputRingStat = $('#inputRingStat' + index).multipleSelect('getSelects')
        const inputBootsStat = $('#inputBootsStat' + index).multipleSelect('getSelects')

        console.log("Main stat selectors", inputNecklaceStat, inputRingStat, inputBootsStat);
        return [inputNecklaceStat, inputRingStat, inputBootsStat];
    },

    getSetFilters: (index) => {
        if (index == null || index == undefined) {
            index = '';
        }
        const inputSet1 = $('#inputSet1' + index).multipleSelect('getSelects').map(x => x + "Set")
        const inputSet2 = $('#inputSet2' + index).multipleSelect('getSelects').map(x => x + "Set")
        const inputSet3 = $('#inputSet3' + index).multipleSelect('getSelects').map(x => x + "Set")
        const inputExcludeSet = $('#inputExcludeSet' + index).multipleSelect('getSelects').map(x => x + "Set")

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

    setGearMainAndSetsFromRequest: (request, index) => {
        console.warn("SETS", request, index);
        $('#inputSet1' + index).multipleSelect('setSelects', request.inputSetsOne.map(x => x.replace("Set", "")) || [])
        $('#inputSet2' + index).multipleSelect('setSelects', request.inputSetsTwo.map(x => x.replace("Set", "")) || [])
        $('#inputSet3' + index).multipleSelect('setSelects', request.inputSetsThree.map(x => x.replace("Set", "")) || [])
        $('#inputNecklaceStat' + index).multipleSelect('setSelects', request.inputNecklaceStat || [])
        $('#inputRingStat' + index).multipleSelect('setSelects', request.inputRingStat || [])
        $('#inputBootsStat' + index).multipleSelect('setSelects', request.inputBootsStat || [])
        $('#inputExcludeSet' + index).multipleSelect('setSelects', request.inputExcludeSet || [])
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
