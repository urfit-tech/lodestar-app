import { ConfigProvider } from 'antd';
import zhTW from 'antd/lib/locale-provider/zh_TW';
import 'braft-editor/dist/index.css';
import 'braft-editor/dist/output.css';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { AuthProvider } from './components/auth/AuthContext';
import { ApiProvider } from './components/common/ApiContext';
import { AppThemeProvider } from './components/common/AppThemeContext';
import { AppProvider } from './containers/common/AppContext';
import ErrorBoundary from './containers/common/ErrorBoundary';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PodcastPlayerProvider } from './contexts/PodcastPlayerContext';
import Routes from './Routes';
var Application = function (_a) {
    var appId = _a.appId, extraRouteProps = _a.extraRouteProps;
    return (React.createElement(BrowserRouter, null,
        React.createElement(QueryParamProvider, { ReactRouterRoute: Route },
            React.createElement(AuthProvider, null,
                React.createElement(ApiProvider, { appId: appId },
                    React.createElement(AppProvider, { appId: appId },
                        React.createElement(LanguageProvider, null,
                            React.createElement(CartProvider, null,
                                React.createElement(NotificationProvider, null,
                                    React.createElement(PodcastPlayerProvider, null,
                                        React.createElement(AppThemeProvider, null,
                                            React.createElement(ErrorBoundary, null,
                                                React.createElement(ConfigProvider, { locale: zhTW },
                                                    React.createElement(Routes, { extra: extraRouteProps }))))))))))))));
};
export default Application;
//# sourceMappingURL=Application.js.map