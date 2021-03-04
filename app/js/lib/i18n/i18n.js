window.i18next.use(window.i18nextChainedBackend).use(window.i18nextBrowserLanguageDetector).init({
  debug: 'true',
  //preload:['en','zh','zh-TW','dev'],
  detection: {
    // order and from where user language should be detected
    order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

    // keys or params to lookup language from
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupLocalStorage: 'i18nextLng',
    lookupSessionStorage: 'i18nextLng',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,

    // cache user language on
    caches: ['localStorage', 'cookie'],
    excludeCacheFor: ['cimode'],
    htmlTag: document.documentElement,
  },
  ignoreIds: ['loadFromGameExportOutputText','exportOutputText'],
  translateAttributes: ['placeholder', 'title', 'alt', 'value#input.type=button', 'value#input.type=submit','data-content'],
  cleanIndent: 'true',
  ignoreCleanIndentFor: ['PRE', 'CODE'],
  //saveMissing: 'true',
  backend: {
    backends: [
    window.i18nextLocalStorageBackend,  // primary
    window.i18nextHttpBackend               // fallback
    ],backendOptions: [{
      prefix: 'i18next_res_',
      // expiration
      expirationTime: 7*24*60*60*1000,
      store: window.localStorage
    }, {
        loadPath: 'locales/{{lng}}/{{ns}}.json',
        addPath: 'locales/{{lng}}/{{ns}}.missing.json',
      }]
      }
});


window.i18next.on('languageChanged initialized', function() {
  if (!i18next.isInitialized) return;
  var text = document.querySelectorAll('[data-t]');
  var lang = i18next.language;
  console.log(text);
  if (lang != 'en'){
  text.forEach(
    function(currentValue, currentIndex, listObj) {
      currentValue.innerHTML=i18next.t(currentValue.innerHTML)
    })
  } else {
    if (!text_en){
      var text_en = text
    } else {
       text = text_en
    }
  }
});
