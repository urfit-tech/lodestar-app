import moment from 'moment';
import 'moment/locale/zh-tw';
import React, { createContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useApp } from '../containers/common/AppContext';
var supportedLanguages = ['zh', 'en', 'vi'];
var LanguageContext = createContext({
    currentLanguage: 'zh',
});
export var LanguageProvider = function (_a) {
    var children = _a.children;
    var enabledModules = useApp().enabledModules;
    var _b = useState('zh'), currentLanguage = _b[0], setCurrentLanguage = _b[1];
    useEffect(function () {
        var browserLanguage = navigator.language.split('-')[0];
        var cachedLanguage = localStorage.getItem('kolable.app.language');
        setCurrentLanguage(enabledModules.locale
            ? typeof cachedLanguage === 'string' && supportedLanguages.includes(cachedLanguage)
                ? cachedLanguage
                : supportedLanguages.includes(browserLanguage)
                    ? browserLanguage
                    : 'zh'
            : 'zh');
    }, [enabledModules]);
    moment.locale(currentLanguage);
    var messages = {};
    try {
        if (enabledModules.locale) {
            messages = require("../translations/locales/" + currentLanguage + ".json");
        }
    }
    catch (_c) { }
    var language = {
        currentLanguage: currentLanguage,
        setCurrentLanguage: function (language) {
            if (supportedLanguages.includes(language)) {
                localStorage.setItem('kolable.app.language', language);
                setCurrentLanguage(language);
                switch (language) {
                    case 'zh':
                        moment.locale('zh-tw');
                        break;
                    default:
                        moment.locale(language);
                }
            }
        },
    };
    return (React.createElement(LanguageContext.Provider, { value: language },
        React.createElement(IntlProvider, { defaultLocale: "zh", locale: currentLanguage, messages: messages }, children)));
};
export default LanguageContext;
//# sourceMappingURL=LanguageContext.js.map