var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import ApplicationHelmet from '../../components/common/ApplicationHelmet';
var defaultAppProps = {
    loading: true,
    id: '',
    name: '',
    title: null,
    description: null,
    enabledModules: {},
    navs: [],
    settings: {},
    currencyId: 'TWD',
    currencies: {},
};
var AppContext = createContext(defaultAppProps);
export var useApp = function () { return useContext(AppContext); };
export var AppProvider = function (_a) {
    var _b, _c, _d;
    var appId = _a.appId, children = _a.children;
    var _e = useAuth(), authToken = _e.authToken, refreshToken = _e.refreshToken, backendEndpoint = _e.backendEndpoint, setBackendEndpoint = _e.setBackendEndpoint;
    var _f = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_APP($appId: String!) {\n        currency {\n          id\n          label\n          unit\n        }\n        app_by_pk(id: $appId) {\n          id\n          name\n          title\n          description\n          app_modules {\n            id\n            module_id\n          }\n          app_navs(order_by: { position: asc }) {\n            block\n            position\n            label\n            icon\n            href\n            external\n            locale\n            tag\n          }\n          app_settings {\n            key\n            value\n          }\n        }\n        app_admin(where: { app_id: { _eq: $appId } }, order_by: { position: asc_nulls_last }, limit: 1) {\n          api_host\n        }\n      }\n    "], ["\n      query GET_APP($appId: String!) {\n        currency {\n          id\n          label\n          unit\n        }\n        app_by_pk(id: $appId) {\n          id\n          name\n          title\n          description\n          app_modules {\n            id\n            module_id\n          }\n          app_navs(order_by: { position: asc }) {\n            block\n            position\n            label\n            icon\n            href\n            external\n            locale\n            tag\n          }\n          app_settings {\n            key\n            value\n          }\n        }\n        app_admin(where: { app_id: { _eq: $appId } }, order_by: { position: asc_nulls_last }, limit: 1) {\n          api_host\n        }\n      }\n    "]))), { variables: { appId: appId } }), loading = _f.loading, error = _f.error, data = _f.data;
    var settings = ((_c = (_b = data === null || data === void 0 ? void 0 : data.app_by_pk) === null || _b === void 0 ? void 0 : _b.app_settings) === null || _c === void 0 ? void 0 : _c.reduce(function (accumulator, appSetting, index) {
        accumulator[appSetting.key] = appSetting.value;
        return accumulator;
    }, {})) || {};
    var app = loading || error || !data || !data.app_by_pk
        ? defaultAppProps
        : (function () {
            var enabledModules = {};
            data.app_by_pk &&
                data.app_by_pk.app_modules.forEach(function (appModule) {
                    enabledModules[appModule.module_id] = true;
                });
            return {
                loading: false,
                id: data.app_by_pk.id,
                name: data.app_by_pk.name || '',
                title: data.app_by_pk.title,
                description: data.app_by_pk.description,
                enabledModules: enabledModules,
                navs: data.app_by_pk.app_navs.map(function (appNav) { return ({
                    block: appNav.block,
                    position: appNav.position,
                    label: appNav.label,
                    icon: appNav.icon,
                    href: appNav.href,
                    external: appNav.external,
                    locale: appNav.locale,
                    tag: appNav.tag,
                }); }),
                settings: settings,
                currencyId: settings['currency_id'] || 'TWD',
                currencies: data.currency.reduce(function (accumulation, currency) {
                    accumulation[currency.id] = currency;
                    return accumulation;
                }, {}),
            };
        })();
    // after getting app, fetch the auth token
    var apiHost = (_d = data === null || data === void 0 ? void 0 : data.app_admin[0]) === null || _d === void 0 ? void 0 : _d.api_host;
    useEffect(function () {
        if (!backendEndpoint) {
            if (apiHost) {
                setBackendEndpoint === null || setBackendEndpoint === void 0 ? void 0 : setBackendEndpoint("https://" + apiHost);
            }
            else {
                setBackendEndpoint === null || setBackendEndpoint === void 0 ? void 0 : setBackendEndpoint(process.env.REACT_APP_BACKEND_ENDPOINT || '');
            }
        }
        else if (!authToken) {
            refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken({ appId: appId });
        }
    }, [apiHost, appId, authToken, backendEndpoint, refreshToken, setBackendEndpoint]);
    return (React.createElement(AppContext.Provider, { value: app },
        React.createElement(ApplicationHelmet, null),
        children));
};
var templateObject_1;
//# sourceMappingURL=AppContext.js.map