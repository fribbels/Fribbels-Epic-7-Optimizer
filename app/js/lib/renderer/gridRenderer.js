module.exports = {

    // [0, 0, 4, 2, 0, ...]
    renderSets: (setCounters, iconClass) => {
        return renderSets(setCounters, iconClass);
    },

    renderStar: (value) => {
        return renderStar(value);
    },

    arrowKeyNavigator: (binding, gridName, callback) => {
        return navigateToNextCell(binding, gridName, callback);
    }
}

function renderSets(setCounters, iconClass) {
    if (!setCounters) return;
    if (!iconClass) iconClass = 'optimizerSetIcon';

    const sets = [];
    for (var i = 0; i < setCounters.length; i++) {
        const setsFound = Math.floor(setCounters[i] / Constants.piecesBySetIndex[i]);
        for (var j = 0; j < setsFound; j++) {
            sets.push(Constants.setsByIndex[i]);
        }
    }

    sets.sort((a, b) => {
        if (fourPieceSets.includes(a)) {
            return -1;
        } else if (fourPieceSets.includes(b)) {
            return 1;
        } else {
            return a.localeCompare(b);
        }
    })

    const images = sets.map(x => '<img class="' + iconClass + ' " src=' + Assets.getSetAsset(x) + '></img>');
    return images.join("");
}

const fourPieceSets = [
    "AttackSet",
    "SpeedSet",
    "DestructionSet",
    "LifestealSet",
    "CounterSet",
    "RageSet",
    "RevengeSet",
    "InjurySet"
]

function renderStar(value) {
    if (!value) return;

    if (value == "star") {
        return '<img class="optimizerStarIcon" src=' + Assets.getStar() + '></img>'
    }
}

// define some handy keycode constants
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;

function navigateToNextCell(params, gridName, callback) {
  return function(params) {
    var grid;
    if (gridName == "heroesGrid") {
      grid = heroesGrid;
    } else if (gridName == "optimizerGrid") {
      grid = optimizerGrid;
    } else if (gridName == "buildsGrid") {
      grid = buildsGrid;
    } else if (gridName == "itemsGrid") {
      grid = itemsGrid;
    }
    if (!grid) {
      console.warn("!GRID", params, grid);

      return;
    }
    console.log(params, grid);

    var previousCell = params.previousCellPosition,
      suggestedNextCell = params.nextCellPosition,
      nextRowIndex,
      renderedRowCount;

    switch (params.key) {
      case KEY_DOWN:
        // return the cell below
        nextRowIndex = previousCell.rowIndex + 1;
        renderedRowCount = grid.gridOptions.api.getModel().getRowCount();
        if (nextRowIndex >= renderedRowCount) {
          return null;
        } // returning null means don't navigate

        var newSelectedNode = grid.gridOptions.api.getDisplayedRowAtIndex(nextRowIndex);
        grid.gridOptions.api.selectNode(newSelectedNode)

        if (callback) {
          callback(newSelectedNode);
        }
        return {
          rowIndex: nextRowIndex,
          column: previousCell.column,
          floating: previousCell.floating,
        };
      case KEY_UP:
        // return the cell above
        nextRowIndex = previousCell.rowIndex - 1;
        if (nextRowIndex <= -1) {
          return null;
        } // returning null means don't navigate

        var newSelectedNode = grid.gridOptions.api.getDisplayedRowAtIndex(nextRowIndex);
        grid.gridOptions.api.selectNode(newSelectedNode)

        if (callback) {
          callback(newSelectedNode);
        }
        return {
          rowIndex: nextRowIndex,
          column: previousCell.column,
          floating: previousCell.floating,
        };
      case KEY_LEFT:
      case KEY_RIGHT:
        return suggestedNextCell;
      default:
        throw 'this will never happen, navigation is always one of the 4 keys above';
    }
  }
}
