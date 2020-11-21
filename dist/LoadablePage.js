var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Alert } from 'antd';
import React, { lazy, useMemo } from 'react';
import ReactPixel from 'react-facebook-pixel';
import { Redirect, useLocation } from 'react-router-dom';
import { useAuth } from './components/auth/AuthContext';
import { UserRoleName } from './components/common/UserRoleName';
import { useApp } from './containers/common/AppContext';
import { getUserRoleLevel } from './helpers';
import { useGAPageView } from './hooks/util';
var LoadablePage = function (_a) {
    var pageName = _a.pageName, authenticated = _a.authenticated, allowedUserRole = _a.allowedUserRole, props = __rest(_a, ["pageName", "authenticated", "allowedUserRole"]);
    var location = useLocation();
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, isAuthenticating = _b.isAuthenticating, currentUserRole = _b.currentUserRole;
    var settings = useApp().settings;
    useGAPageView();
    settings['tracking.fb_pixel_id'] && ReactPixel.pageView();
    var Page = useMemo(function () {
        return lazy(function () {
            if (isAuthenticating) {
                return import("./pages/LoadingPage");
            }
            var pageComponent = allowedUserRole && getUserRoleLevel(allowedUserRole) > getUserRoleLevel(currentUserRole)
                ? import("./pages/ForbiddenPage") // load forbidden page if not allowed roles
                : import("./pages/" + pageName).catch(function () { return import('./pages/NotFoundPage'); });
            return pageComponent;
        });
    }, [allowedUserRole, currentUserRole, isAuthenticating, pageName]);
    // redirect to home page if not authenticated
    if (authenticated && !isAuthenticating && !isAuthenticated) {
        return React.createElement(Redirect, { to: { pathname: '/', search: "?back=" + location.pathname, state: { from: location } } });
    }
    return (React.createElement(React.Fragment, null,
        getUserRoleLevel(currentUserRole) > getUserRoleLevel('general-member') && (
        // node to string
        React.createElement(Alert, { message: React.createElement(UserRoleName, { userRole: currentUserRole }), type: "warning", closable: true })),
        React.createElement(Page, __assign({}, props))));
};
export default LoadablePage;
//# sourceMappingURL=LoadablePage.js.map