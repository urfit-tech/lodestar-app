import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mergeDeepLeft } from 'ramda';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import '../../styles.scss';
import defaultThemeVars from '../../theme.json';
var defaultChakraTheme = {
    components: {
        Button: {
            baseStyle: {
                fontWeight: '400',
                borderRadius: '2px',
                _focus: {
                    boxShadow: '0',
                },
            },
        },
        CloseButton: {
            baseStyle: {
                _focus: {
                    boxShadow: '0',
                },
            },
        },
        Modal: {
            baseStyle: {
                dialog: {
                    borderRadius: '2px',
                },
            },
        },
    },
    colors: {
        gray: {
            100: 'rgba(0, 0, 0, 0.1)',
            200: '#f7f8f8',
            300: '#ececec',
            400: '#cdcece',
            500: '#cdcdcd',
            600: '#9b9b9b',
            700: '#585858',
            800: '#4a4a4a',
            900: 'rgba(0, 0, 0, 0.45)',
        },
    },
};
export var AppThemeProvider = function (_a) {
    var children = _a.children;
    var settings = useApp().settings;
    var themeVars = Object.keys(settings)
        .filter(function (key) { return key.split('.')[0] === 'theme'; })
        .map(function (key) { return key.split('.')[1]; })
        .reduce(function (vars, themeKey) {
        vars[themeKey] = settings["theme." + themeKey];
        return vars;
    }, defaultThemeVars);
    var customTheme = Object.keys(settings)
        .filter(function (key) { return key.split('.')[0] === 'chakraTheme'; })
        .map(function (key) { return key.split('.').slice(1).join('.'); })
        .reduce(function (vars, themeKey) {
        return mergeDeepLeft(vars, themeKey
            .split('.')
            .reverse()
            .reduce(function (acc, key) {
            var obj = {};
            obj[key] = acc;
            return obj;
        }, settings["chakraTheme." + themeKey]));
    }, {});
    return (React.createElement(ChakraProvider, { theme: extendTheme(mergeDeepLeft(customTheme, defaultChakraTheme)) },
        React.createElement(ThemeProvider, { theme: themeVars }, children)));
};
//# sourceMappingURL=AppThemeContext.js.map