var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useQuery } from '@apollo/react-hooks';
import { Button, Divider, message, Spin } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { downloadFile, getFileDownloadableLink } from '../../helpers';
import EmptyCover from '../../images/empty-cover.png';
import { useAuth } from '../auth/AuthContext';
import { CustomRatioImage } from '../common/Image';
var messages = defineMessages({
    download: { id: 'merchandise.ui.download', defaultMessage: '下載' },
    isDownloading: { id: 'merchandise.ui.isDownloading', defaultMessage: '下載中' },
});
var StyledQuantity = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.71;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  line-height: 1.71;\n  letter-spacing: 0.4px;\n"])));
var MerchandiseSpecItem = function (_a) {
    var merchandiseSpecId = _a.merchandiseSpecId, quantity = _a.quantity, orderProductId = _a.orderProductId, _b = _a.orderProductFilenames, orderProductFilenames = _b === void 0 ? [] : _b;
    var formatMessage = useIntl().formatMessage;
    var _c = useAuth(), authToken = _c.authToken, backendEndpoint = _c.backendEndpoint;
    var appId = useApp().id;
    var _d = useMerchandiseSpec(merchandiseSpecId), loadingMerchandiseSpec = _d.loadingMerchandiseSpec, merchandiseSpec = _d.merchandiseSpec;
    var _e = useState(false), isDownloading = _e[0], setIsDownloading = _e[1];
    if (!appId || loadingMerchandiseSpec) {
        return React.createElement(Spin, null);
    }
    if (!merchandiseSpec) {
        return null;
    }
    var files = __spreadArrays(merchandiseSpec.files.map(function (file) { return ({
        name: file.data.name,
        from: 'merchandise',
    }); }), orderProductFilenames.map(function (name) { return ({
        name: name,
        from: 'orderProduct',
    }); }));
    return (React.createElement("div", null,
        React.createElement(Divider, null),
        React.createElement("div", { className: "d-flex align-items-center" },
            React.createElement(CustomRatioImage, { className: "mr-3 flex-shrink-0", width: "64px", ratio: 1, src: merchandiseSpec.merchandise.coverUrl || EmptyCover, shape: "rounded" }),
            React.createElement("div", { className: "flex-grow-1" },
                merchandiseSpec.merchandise.title,
                " - ",
                merchandiseSpec.title),
            merchandiseSpec.merchandise.isPhysical && React.createElement(StyledQuantity, { className: "px-4" },
                "x",
                quantity),
            files.length > 0 && (React.createElement(Button, { loading: isDownloading, onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var counter;
                    return __generator(this, function (_a) {
                        setIsDownloading(true);
                        counter = 0;
                        files.forEach(function (file) { return __awaiter(void 0, void 0, void 0, function () {
                            var fileKey, fileLink, fileRequest, response, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        fileKey = file.from === 'merchandise'
                                            ? "merchandise_files/" + appId + "/" + merchandiseSpec.merchandise.id + "_" + file.name
                                            : "merchandise_files/" + appId + "/" + orderProductId + "_" + file.name;
                                        return [4 /*yield*/, getFileDownloadableLink(fileKey, authToken, backendEndpoint)];
                                    case 1:
                                        fileLink = _a.sent();
                                        fileRequest = new Request(fileLink);
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, fetch(fileRequest)];
                                    case 3:
                                        response = _a.sent();
                                        response.url &&
                                            downloadFile(response.url, file.name).then(function () {
                                                counter += 1;
                                                counter === files.length && setIsDownloading(false);
                                            });
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_1 = _a.sent();
                                        message.error(error_1);
                                        return [3 /*break*/, 5];
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); } }, isDownloading ? formatMessage(messages.isDownloading) : formatMessage(messages.download))))));
};
var useMerchandiseSpec = function (merchandiseSpecId) {
    var _a;
    var _b = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_MERCHANDISE_SPEC($merchandiseSpecId: uuid!) {\n        merchandise_spec_by_pk(id: $merchandiseSpecId) {\n          id\n          title\n          merchandise_spec_files {\n            id\n            data\n          }\n          merchandise {\n            id\n            title\n            is_physical\n            merchandise_imgs(where: { type: { _eq: \"cover\" } }, limit: 1) {\n              id\n              url\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_MERCHANDISE_SPEC($merchandiseSpecId: uuid!) {\n        merchandise_spec_by_pk(id: $merchandiseSpecId) {\n          id\n          title\n          merchandise_spec_files {\n            id\n            data\n          }\n          merchandise {\n            id\n            title\n            is_physical\n            merchandise_imgs(where: { type: { _eq: \"cover\" } }, limit: 1) {\n              id\n              url\n            }\n          }\n        }\n      }\n    "]))), { variables: { merchandiseSpecId: merchandiseSpecId } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var merchandiseSpec = (data === null || data === void 0 ? void 0 : data.merchandise_spec_by_pk) ? {
        id: data.merchandise_spec_by_pk.id,
        title: data.merchandise_spec_by_pk.title,
        merchandise: {
            id: data.merchandise_spec_by_pk.merchandise.id,
            title: data.merchandise_spec_by_pk.merchandise.title,
            coverUrl: ((_a = data.merchandise_spec_by_pk.merchandise.merchandise_imgs[0]) === null || _a === void 0 ? void 0 : _a.url) || null,
            isPhysical: data.merchandise_spec_by_pk.merchandise.is_physical,
        },
        files: data.merchandise_spec_by_pk.merchandise_spec_files.map(function (v) { return ({
            id: v.id,
            data: v.data,
        }); }),
    }
        : null;
    return {
        loadingMerchandiseSpec: loading,
        errorMerchandiseSpec: error,
        merchandiseSpec: merchandiseSpec,
        refetchMerchandiseSpec: refetch,
    };
};
export default MerchandiseSpecItem;
var templateObject_1, templateObject_2;
//# sourceMappingURL=MerchandiseSpecItem.js.map