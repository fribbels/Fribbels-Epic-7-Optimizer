var AWN = require('awesome-notifications').default
var globalOptions = {
}
var notifier = new AWN(globalOptions)

module.exports = {
    initialize: () => {
        globalOptions = {
            icons: {enabled: true},
            labels: {
                warning: i18next.t("Warning"),
                alert: i18next.t("Alert"),
                info: i18next.t("Info"),
                success: i18next.t("Success"),
                error: i18next.t("Error"),
            },
            durations: {
                alert: 20000,
                warning: 5000,
                info: 7500,
            },
            position: 'top-right'
        }
        notifier = new AWN(globalOptions)
    },

    info: (text) => {
        notifier.info(i18next.t(text));
    },

    success: (text) => {
        notifier.success(i18next.t(text));
    },

    quick: (text) => {
        notifier.success(i18next.t(text), {durations: {success: 2000}});
    },

    error: (text) => {
        notifier.alert(i18next.t(text));
    },

    warn: (text) => {
        notifier.warning(i18next.t(text));
    },
}
