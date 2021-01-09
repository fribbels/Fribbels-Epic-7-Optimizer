var AWN = require('awesome-notifications').default
var globalOptions = {
    icons: {enabled: true},
    labels: {
        warning: "Warning",
    },
    durations: {
        alert: 20000,
        warning: 5000,
        info: 7500,
    },
    position: 'top-right'
}
var notifier = new AWN(globalOptions)

module.exports = {

    info: (text) => {
        notifier.info(text);
    },

    success: (text) => {
        notifier.success(text);
    },

    quick: (text) => {
        notifier.success(text, {durations: {success: 2000}});
    },

    error: (text) => {
        notifier.alert(text);
    },

    warn: (text) => {
        notifier.warning(text);
    },
}