var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import queryString from 'query-string';
import { useIntl } from 'react-intl';
import { css } from 'styled-components';
import { v4 as uuid } from 'uuid';
import { BREAK_POINT } from '../components/common/Responsive';
import { helperMessages } from './translation';
export var TPDirect = window['TPDirect'];
export var getBase64 = function (img, callback) {
    var reader = new FileReader();
    reader.addEventListener('load', function () { return callback(reader.result); });
    reader.readAsDataURL(img);
};
export var validateImage = function (file, fileSize) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var formatMessage = useIntl().formatMessage;
    var isImage = file.type.startsWith('image');
    if (!isImage) {
        message.error(helperMessages.messages.imageFormatError);
    }
    var size = fileSize || 2 * 1024 * 1024;
    var inSize = file.size < size;
    if (!inSize) {
        message.error("\n    \b" + formatMessage(helperMessages.messages.imageSizeError) + "\n     " + (size / 1024 / 1024).toFixed(0) + "MB");
    }
    return isImage && inSize;
};
export var uploadFile = function (key, file, authToken, backendEndpoint, config) { return __awaiter(void 0, void 0, void 0, function () {
    var signedUrl, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                signedUrl = '';
                _a = file;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, axios
                        .post(backendEndpoint + "/sys/sign-url", {
                        operation: 'putObject',
                        params: {
                            Key: key,
                            ContentType: file.type,
                        },
                    }, {
                        headers: { authorization: "Bearer " + authToken },
                    })
                        .then(function (res) {
                        signedUrl = res.data.result;
                        return res.data.result;
                    })
                        .then(function (url) {
                        var query = queryString.parseUrl(url).query;
                        return axios.put(url, file, __assign(__assign({}, config), { headers: __assign(__assign({}, query), { 'Content-Type': file.type }) }));
                    })];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                _a;
                return [2 /*return*/, signedUrl];
        }
    });
}); };
export var getFileDownloadableLink = function (key, authToken, backendEndpoint) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios.post(backendEndpoint + "/sys/sign-url", {
                    operation: 'getObject',
                    params: {
                        Key: key,
                    },
                }, {
                    headers: { authorization: "Bearer " + authToken },
                })];
            case 1:
                data = (_a.sent()).data;
                return [2 /*return*/, data.result];
        }
    });
}); };
export var downloadFile = function (url, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios({ url: url, method: 'GET', responseType: 'blob' }).then(function (response) {
                    var url = window.URL.createObjectURL(new Blob([response.data]));
                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var commaFormatter = function (value) {
    return value !== null && value !== undefined && ("" + value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
export var dateFormatter = function (value, format) { return moment(value).format(format || "YYYY/MM/DD HH:mm"); };
export var dateRangeFormatter = function (_a) {
    var startedAt = _a.startedAt, endedAt = _a.endedAt, dateFormat = _a.dateFormat, timeFormat = _a.timeFormat;
    var startedMoment = moment(startedAt);
    var endedMoment = moment(endedAt);
    var isInSameDay = startedMoment.format('YYYY/MM/DD') === endedMoment.format('YYYY/MM/DD');
    return 'STARTED_DATE STARTED_TIME ~ ENDED_DATE ENDED_TIME'
        .replace('STARTED_DATE', startedMoment.format(dateFormat || 'YYYY-MM-DD(dd)'))
        .replace('STARTED_TIME', startedMoment.format(timeFormat || 'HH:mm'))
        .replace('ENDED_DATE', isInSameDay ? '' : endedMoment.format(dateFormat || 'YYYY-MM-DD(dd)'))
        .replace('ENDED_TIME', endedMoment.format(timeFormat || 'HH:mm'))
        .replace(/  +/g, ' ');
};
export var durationFormatter = function (value) {
    return typeof value === 'number' && "\u7D04 " + (value / 60).toFixed(0) + " \u5206\u9418";
};
export var durationFullFormatter = function (seconds) {
    if (seconds >= 3600) {
        var remainSeconds = seconds % 3600;
        return "HOURS:MINUTES:SECONDS"
            .replace('HOURS', ("" + Math.floor(seconds / 3600)).padStart(2, '0'))
            .replace('MINUTES', ("" + Math.floor(remainSeconds / 60)).padStart(2, '0'))
            .replace('SECONDS', ("" + Math.floor(remainSeconds % 60)).padStart(2, '0'));
    }
    else {
        return "MINUTES:SECONDS"
            .replace('MINUTES', ("" + Math.floor(seconds / 60)).padStart(2, '0'))
            .replace('SECONDS', ("" + Math.floor(seconds % 60)).padStart(2, '0'));
    }
};
export var braftLanguageFn = function (languages, context) {
    if (context === 'braft-editor') {
        languages['zh-hant'].controls.normal = '內文';
        return languages['zh-hant'];
    }
};
export var getNotificationIconType = function (type) {
    switch (type) {
        case 'message':
            return 'message';
        case 'payment':
            return 'dollar';
        case 'content':
            return 'book';
        case 'reaction':
            return 'heart';
        default:
            return 'question';
    }
};
export var rgba = function (hexColor, alpha) {
    hexColor = hexColor.replace('#', '');
    var r = parseInt(hexColor.slice(0, 2), 16);
    var g = parseInt(hexColor.slice(2, 4), 16);
    var b = parseInt(hexColor.slice(4, 6), 16);
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
};
export var hexToHsl = function (hexColor) {
    hexColor = hexColor.replace('#', '');
    var r = parseInt(hexColor.slice(0, 2), 16) / 255;
    var g = parseInt(hexColor.slice(2, 4), 16) / 255;
    var b = parseInt(hexColor.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) {
            h = (g - b) / d + (g < b ? 6 : 0);
        }
        else if (max === g) {
            h = (b - r) / d + 2;
        }
        else {
            h = (r - g) / d + 4;
        }
        h /= 6;
    }
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);
    return { h: h, s: s, l: l };
};
export var snakeToCamel = function (snakeValue) {
    return snakeValue.replace(/([-_][a-z])/g, function (group) { return group.toUpperCase().replace('-', '').replace('_', ''); });
};
export var handleError = function (error) {
    process.env.NODE_ENV === 'development' && console.error(error);
    if (error.response && error.response.data) {
        return message.error(error.response.data.message);
    }
    return message.error(error.message);
};
export var notEmpty = function (value) {
    return value !== null && value !== undefined;
};
export var camelCaseToDash = function (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
export var getUserRoleLevel = function (userRole) {
    switch (userRole) {
        case 'anonymous':
            return 0;
        case 'general-member':
            return 1;
        case 'content-creator':
            return 2;
        case 'app-owner':
            return 3;
        default:
            return -1;
    }
};
export var desktopViewMixin = function (children) { return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  @media (min-width: ", "px) {\n    ", "\n  }\n"], ["\n  @media (min-width: ", "px) {\n    ", "\n  }\n"])), BREAK_POINT, children); };
export var createUploadFn = function (appId, authToken, backendEndpoint) {
    return function (params) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            uploadFile("images/" + appId + "/editor/" + uuid(), params.file, authToken, backendEndpoint).then(function (signedUrl) {
                params.success({
                    url: signedUrl.split('?')[0],
                    meta: {
                        id: '',
                        title: '',
                        alt: '',
                        loop: false,
                        autoPlay: false,
                        controls: false,
                        poster: '',
                    },
                });
            });
            return [2 /*return*/];
        });
    }); };
};
export var shippingMethodFormatter = function (value) {
    switch (value) {
        case 'home-delivery':
            return '宅配';
        case 'seven-eleven':
            return '7-11 超商取貨';
        case 'family-mart':
            return '全家超商取貨';
        case 'hi-life':
            return '萊爾富超商取貨';
        case 'ok-mart':
            return 'OK 超商取貨';
        default:
            return '未知配送方式';
    }
};
export var isUUIDv4 = function (uuid) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};
export var validationRegExp = {
    phone: /^((?:\+|00)[17](?: |-)?|(?:\+|00)[1-9]\d{0,2}(?: |-)?|(?:\+|00)1-\d{3}(?: |-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7}))$/,
    email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phoneBarCode: /^\/{1}[0-9A-Z+-.]{7}$/,
    citizenCode: /^[a-zA-Z]{2}[0-9]{14}$/,
    uniformNumber: /^[0-9]{8}$/,
};
var templateObject_1;
//# sourceMappingURL=index.js.map