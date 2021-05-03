/* eslint-disable */
module.exports = {
    initialize: async () => {
        require(Files.path(Files.getDataPath() + '/locales/en/gridlocale.js'))
        require(Files.path(Files.getDataPath() + '/locales/fr/gridlocale.js'))
        require(Files.path(Files.getDataPath() + '/locales/ko/gridlocale.js'))
        require(Files.path(Files.getDataPath() + '/locales/es/gridlocale.js'))
        // require(Files.path(Files.getDataPath() + '/locales/de/gridlocale.js'))
        // require(Files.path(Files.getDataPath() + '/locales/th/gridlocale.js'))
        // require(Files.path(Files.getDataPath() + '/locales/pt/gridlocale.js'))
        // require(Files.path(Files.getDataPath() + '/locales/jp/gridlocale.js'))
        require(Files.path(Files.getDataPath() + '/locales/zh/gridlocale.js'))
        require(Files.path(Files.getDataPath() + '/locales/zh-TW/gridlocale.js'))

        window.i18next.use(window.i18nextHttpBackend).use(window.i18nextBrowserLanguageDetector).init({
            debug: 'true',
            preload: ['en', 'fr','ko','es','zh', 'zh-TW', 'dev'],
            detection: {
                // order and from where user language should be detected
                order: ['querystring', 'cookie', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

                // keys or params to lookup language from
                lookupQuerystring: 'lng',
                lookupCookie: 'i18next',
                // lookupLocalStorage: 'i18nextLng',
                lookupSessionStorage: 'i18nextLng',
                lookupFromPathIndex: 0,
                lookupFromSubdomainIndex: 0,

                // cache user language on
                caches: ['cookie'],
                excludeCacheFor: ['cimode'],
                htmlTag: document.documentElement,
            },
            ignoreIds: ['loadFromGameExportOutputText', 'exportOutputText'],
            translateAttributes: ['placeholder', 'title', 'alt', 'value#input.type=button', 'value#input.type=submit', 'data-content'],
            saveMissing: true,
            saveMissingTo: "current",
            fallbackLng: false,
            keySeparator: false,
            nsSeparator: false,
            pluralSeparator: false,
            contextSeparator: false,
            backend: {
                // backends: [
                // window.i18nextLocalStorageBackend,  // primary
                // window.i18nextHttpBackend               // fallback
                // ],backendOptions: [{
                //   // prefix: 'i18next_res_',
                //   // expiration
                //   // expirationTime: 7*24*60*60*1000,
                //   // store: window.localStorage
                // }, {
                loadPath: Files.path(Files.getDataPath() + '/locales/{{lng}}/{{ns}}.json'),
                addPath: Files.path(Files.getDataPath() + '/locales/{{lng}}/{{ns}}.missing.json'),
                // }]
            }
        });


        window.i18next.on('languageChanged initialized reloadResources', function() {
            if (!i18next.isInitialized) return;
            var text = document.querySelectorAll('[data-t]');
            var lang = i18next.language;
            //console.log(text);
            //localStorage.clear();
            if (lang != 'en') {
                text.forEach(
                    function(currentValue, currentIndex, listObj) {
                        // console.log(currentValue.nodeName);
                        if (['LABEL', 'A', 'TEXT', 'H2', 'U', 'B', 'DIV', 'SPAN', 'OPTION', 'BUTTON'].includes(currentValue.nodeName)) {
                            var textkey = (currentValue.innerText).trim();
                            // console.log('true!'+textkey);
                            currentValue.innerText = i18next.t(textkey)
                            if (currentValue.getAttribute("data-content")) {
                                var datacontent = currentValue.getAttribute("data-content")
                                currentValue.setAttribute("data-content", i18next.t(datacontent.trim()));
                            }
                        } else if (['P'].includes(currentValue.nodeName)) {
                            var textkey = (currentValue.innerHTML.replace(/(\r\n|\n|\r)/gm, "")).trim();
                            // console.log('true! key='+textkey);
                            // console.log('translation='+i18next.t(textkey));
                            currentValue.innerHTML = i18next.t(textkey)
                        } else if (['INPUT'].includes(currentValue.nodeName)) {
                            var textkey = (currentValue.getAttribute("value")).trim();
                            // console.log('true! key='+textkey);
                            currentValue.setAttribute("value", i18next.t(textkey));
                        } else if (['OPTGROUP'].includes(currentValue.nodeName)) {
                            var textkey = (currentValue.getAttribute("label")).trim();
                            // console.log('true! key='+textkey);
                            currentValue.setAttribute("label", i18next.t(textkey));
                        }
                    })
            } else {
                if (!text_en) {
                    var text_en = text
                } else {
                    text = text_en
                }
            }
        });

        function clearlocalCache() {
            console.log('Language Cache Cleared!');
            localStorage.clear();
            i18next.reloadResources();
        };

    }
}
