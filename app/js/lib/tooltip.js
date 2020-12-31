const tippy = require('tippy.js').default;

module.exports = {
    setupTooltips: () => {
        tippy('#forceModeTooltip', {
          content: 'Tooltip',
        });

        tippy('#accessoryMainStatsTooltip', {
          content: 'Tooltip',
        });

        tippy('#sets', {
          content: 'Tooltip',
        });
    },
}