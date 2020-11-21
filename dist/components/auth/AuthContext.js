var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { default as Axios } from 'axios';
import jwt from 'jsonwebtoken';
import React, { useContext, useState } from 'react';
import ReactGA from 'react-ga';
var defaultAuthContext = {
    isAuthenticating: true,
    isAuthenticated: false,
    currentUserRole: 'anonymous',
    currentMemberId: null,
    authToken: null,
    currentMember: null,
    backendEndpoint: null,
};
var AuthContext = React.createContext(defaultAuthContext);
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = useState(defaultAuthContext.isAuthenticating), isAuthenticating = _b[0], setIsAuthenticating = _b[1];
    var _c = useState(null), authToken = _c[0], setAuthToken = _c[1];
    var _d = useState(null), backendEndpoint = _d[0], setBackendEndpoint = _d[1];
    // TODO: add auth payload type
    var payload = authToken && jwt.decode(authToken);
    if (payload) {
        var _window = window;
        _window.insider_object = {
            user: {
                gdpr_optin: true,
                sms_optin: true,
                email: payload.email,
                phone_number: payload.phoneNumber,
                email_optin: true,
            },
        };
        ReactGA.set({ userId: payload.sub });
    }
    return (React.createElement(AuthContext.Provider, { value: {
            isAuthenticating: isAuthenticating,
            isAuthenticated: Boolean(authToken),
            currentUserRole: (payload && payload.role) || 'anonymous',
            currentMemberId: payload && payload.sub,
            authToken: authToken,
            currentMember: payload && {
                name: payload.name,
                username: payload.username,
                email: payload.email,
                pictureUrl: payload.pictureUrl,
            },
            backendEndpoint: backendEndpoint,
            setBackendEndpoint: setBackendEndpoint,
            refreshToken: backendEndpoint
                ? function (_a) {
                    var appId = _a.appId;
                    return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            return [2 /*return*/, Axios.post(backendEndpoint + "/auth/refresh-token", { appId: appId }, {
                                    method: 'POST',
                                    withCredentials: true,
                                })
                                    .then(function (_a) {
                                    var _b = _a.data, code = _b.code, message = _b.message, result = _b.result;
                                    if (code === 'SUCCESS') {
                                        setAuthToken(result.authToken);
                                    }
                                    else {
                                        setAuthToken(null);
                                    }
                                })
                                    .finally(function () { return setIsAuthenticating(false); })];
                        });
                    });
                }
                : undefined,
            register: backendEndpoint
                ? function (_a) {
                    var appId = _a.appId, username = _a.username, email = _a.email, password = _a.password;
                    return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            return [2 /*return*/, Axios.post(backendEndpoint + "/auth/register", {
                                    appId: appId,
                                    username: username,
                                    email: email,
                                    password: password,
                                }, { withCredentials: true }).then(function (_a) {
                                    var _b = _a.data, code = _b.code, message = _b.message, result = _b.result;
                                    if (code === 'SUCCESS') {
                                        setAuthToken(result.authToken);
                                    }
                                    else {
                                        setAuthToken(null);
                                        throw new Error(code);
                                    }
                                })];
                        });
                    });
                }
                : undefined,
            login: backendEndpoint
                ? function (_a) {
                    var appId = _a.appId, account = _a.account, password = _a.password;
                    return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            return [2 /*return*/, Axios.post(backendEndpoint + "/auth/general-login", { appId: appId, account: account, password: password }, { withCredentials: true }).then(function (_a) {
                                    var _b = _a.data, code = _b.code, result = _b.result;
                                    if (code === 'SUCCESS') {
                                        setAuthToken(result.authToken);
                                    }
                                    else if (code === 'I_RESET_PASSWORD') {
                                        window.location.assign("/check-email?email=" + account + "&type=reset-password");
                                    }
                                    else {
                                        setAuthToken(null);
                                        throw new Error(code);
                                    }
                                })];
                        });
                    });
                }
                : undefined,
            socialLogin: backendEndpoint
                ? function (_a) {
                    var appId = _a.appId, provider = _a.provider, providerToken = _a.providerToken;
                    return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_b) {
                            return [2 /*return*/, Axios.post(backendEndpoint + "/auth/social-login", {
                                    appId: appId,
                                    provider: provider,
                                    providerToken: providerToken,
                                }, { withCredentials: true }).then(function (_a) {
                                    var _b = _a.data, code = _b.code, message = _b.message, result = _b.result;
                                    if (code === 'SUCCESS') {
                                        setAuthToken(result.authToken);
                                    }
                                    else {
                                        setAuthToken(null);
                                        throw new Error(code);
                                    }
                                })];
                        });
                    });
                }
                : undefined,
            logout: backendEndpoint
                ? function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        localStorage.clear();
                        Axios(backendEndpoint + "/auth/logout", {
                            method: 'POST',
                            withCredentials: true,
                        }).then(function (_a) {
                            var _b = _a.data, code = _b.code, message = _b.message, result = _b.result;
                            setAuthToken(null);
                            if (code !== 'SUCCESS') {
                                throw new Error(code);
                            }
                        });
                        return [2 /*return*/];
                    });
                }); }
                : undefined,
        } }, children));
};
export var useAuth = function () { return useContext(AuthContext); };
//# sourceMappingURL=AuthContext.js.map