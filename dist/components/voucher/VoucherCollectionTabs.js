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
import { Tabs } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { commonMessages } from '../../helpers/translation';
import Voucher from './Voucher';
var VoucherCollectionTabs = function (_a) {
    var vouchers = _a.vouchers;
    var _b = useState('available'), activeKey = _b[0], setActiveKey = _b[1];
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(Tabs, { activeKey: activeKey, onChange: function (key) { return setActiveKey(key); } },
        React.createElement(Tabs.TabPane, { key: "available", tab: formatMessage(commonMessages.status.available) },
            React.createElement("div", { className: "row" }, vouchers
                .filter(function (voucher) { return voucher.available; })
                .map(function (voucher) { return (React.createElement("div", { key: voucher.id, className: "col-12 col-lg-6" },
                React.createElement(Voucher, __assign({}, voucher)))); }))),
        React.createElement(Tabs.TabPane, { key: "unavailable", tab: formatMessage(commonMessages.status.expired) },
            React.createElement("div", { className: "row" }, vouchers
                .filter(function (voucher) { return !voucher.available; })
                .map(function (voucher) { return (React.createElement("div", { key: voucher.id, className: "col-12 col-lg-6" },
                React.createElement(Voucher, __assign({}, voucher)))); })))));
};
export default VoucherCollectionTabs;
//# sourceMappingURL=VoucherCollectionTabs.js.map