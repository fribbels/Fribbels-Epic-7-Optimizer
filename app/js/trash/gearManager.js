var grid;

module.exports = {
    initialize: async () => {
        setupEventListeners();
        const getAllItemsResponse = await Api.getAllItems();
        const gridOptions = {
            defaultColDef: {
                width: 50,
                sortable: true,
                sortingOrder: ['desc', 'asc'],
                // valueFormatter: numberFormatter,
            },

            columnDefs: [
                {headerName: 'Set', field: 'set', width: 100, filter: 'agTextColumnFilter'},
                {headerName: 'Gear', field: 'gear', width: 80, filter: 'agTextColumnFilter'},
                {headerName: 'Rank', field: 'rank'},
                {headerName: 'Level', field: 'level'},
                {headerName: 'Enhance', field: 'enhance'},
                {headerName: 'Main', field: 'main.type', width: 150},
                {headerName: 'Value', field: 'main.value'},
                {headerName: 'Atk%', field: 'augmentedStats.AttackPercent'},
                {headerName: 'Atk', field: 'augmentedStats.Attack'},
                {headerName: 'Spd', field: 'augmentedStats.Speed'},
                {headerName: 'Cr', field: 'augmentedStats.CriticalHitChancePercent'},
                {headerName: 'Cd', field: 'augmentedStats.CriticalHitDamagePercent'},
                {headerName: 'Hp%', field: 'augmentedStats.HealthPercent'},
                {headerName: 'Hp', field: 'augmentedStats.Health'},
                {headerName: 'Def%', field: 'augmentedStats.DefensePercent'},
                {headerName: 'Def', field: 'augmentedStats.Defense'},
                {headerName: 'Eff', field: 'augmentedStats.EffectivenessPercent'},
                {headerName: 'Res', field: 'augmentedStats.EffectResistancePercent'},
                {headerName: 'Equipped', field: 'equippedById'},
                {headerName: 'Locked', field: 'locked'},
            ],
            rowSelection: 'single',
            rowData: getAllItemsResponse.items,
            // onRowSelected: onRowSelected,
        };
        let gridDiv = document.getElementById('gear-grid');
        grid = new Grid(gridDiv, gridOptions);
        global.gearGrid = grid;
        console.log("!!! gearGrid", grid);

        // document.getElementById('updateGear').addEventListener("click", () => {
        //     module.exports.redraw();
        // });

        // module.exports.redraw();
    },

    redraw: () => {
        console.log("Redraw");
        Api.getAllItems().then(getAllItemsResponse => {
            grid.gridOptions.api.setRowData(getAllItemsResponse.items)
        });
    },
}

var setFilter;
const setCheckboxes = [];

var gearFilter;
const gearCheckboxes = [];

function setupEventListeners() {
    // Sets

    const sets = Object.keys(Assets.getAssetsBySet())
    console.log("SETUP", sets);
    for (var set of sets) {
        console.log("TEST!!!!", document.getElementById('checkboxImage' + set));
        const checkbox = document.getElementById('checkboxImage' + set);
        checkbox.addEventListener('change', function(event) {
            var eventSet = event.target.id.split("checkboxImage")[1];
            if (event.target.checked) {
                setFilter = eventSet
                for (var checkbox of setCheckboxes) {
                    if (checkbox != event.target)
                        checkbox.checked = false;
                }
            } else {
                setFilter = null;
            }

            refreshFilters();
        });   
        setCheckboxes.push(checkbox);
    }

    document.getElementById('checkboxImageClearSets').addEventListener('change', function(event) {
        console.log(event);
        if (event.target.checked) {
            setFilter = null;
            for (var checkbox of setCheckboxes) {
                checkbox.checked = false;
            }
        } else {
            
        }

        refreshFilters();
    });   

    // Gear
    
    const gears = Object.keys(Assets.getAssetsByGear())
    console.log("SETUP", gears);
    for (var gear of gears) {
        console.log("TEST!!!!", document.getElementById('checkboxImage' + gear));
        const checkbox = document.getElementById('checkboxImage' + gear);
        checkbox.addEventListener('change', function(event) {
            var eventGear = event.target.id.split("checkboxImage")[1];
            if (event.target.checked) {
                gearFilter = eventGear
                for (var checkbox of gearCheckboxes) {
                    if (checkbox != event.target)
                        checkbox.checked = false;
                }
            } else {
                gearFilter = null;
            }

            refreshFilters();
        });   
        gearCheckboxes.push(checkbox);
    }

    document.getElementById('checkboxImageClearGears').addEventListener('change', function(event) {
        console.log(event);
        if (event.target.checked) {
            gearFilter = null;
            for (var checkbox of gearCheckboxes) {
                checkbox.checked = false;
            }
        } else {
            
        }

        refreshFilters();
    });   
}

function refreshFilters() {
    const setFilterComponent = gearGrid.gridOptions.api.getFilterInstance('set');
    if (!setFilter) {
        document.getElementById('checkboxImageClearSets').checked = true;
        setFilterComponent.setModel(null);
    } else {
        document.getElementById('checkboxImageClearSets').checked = false;
        
        setFilterComponent.setModel({
            type: 'startsWith',
            filter: setFilter
        });
    }

    const gearFilterComponent = gearGrid.gridOptions.api.getFilterInstance('gear');
    if (!gearFilter) {
        document.getElementById('checkboxImageClearGears').checked = true;
        gearFilterComponent.setModel(null);
    } else {
        document.getElementById('checkboxImageClearGears').checked = false;
        
        gearFilterComponent.setModel({
            type: 'startsWith',
            filter: gearFilter
        });
    }

    gearGrid.gridOptions.api.onFilterChanged();
}; 