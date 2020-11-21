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
import { Skeleton } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import VoucherCollectionTabs from '../../components/voucher/VoucherCollectionTabs';
import VoucherExchangeModal from '../../components/voucher/VoucherExchangeModal';
import VoucherInsertBlock from '../../components/voucher/VoucherInsertBlock';
import { commonMessages } from '../../helpers/translation';
var VoucherCollectionBlock = function (_a) {
    var memberId = _a.memberId, loading = _a.loading, error = _a.error, voucherCollection = _a.voucherCollection, onExchange = _a.onExchange, onInsert = _a.onInsert;
    var formatMessage = useIntl().formatMessage;
    if (!memberId || loading) {
        return React.createElement(Skeleton, { active: true });
    }
    if (error) {
        return React.createElement("div", null, formatMessage(commonMessages.status.loadingError));
    }
    var vouchers = voucherCollection.map(function (voucher) { return (__assign(__assign({}, voucher), { extra: (React.createElement(VoucherExchangeModal, { productQuantityLimit: voucher.productQuantityLimit, productIds: voucher.productIds, onExchange: function (setVisible, setLoading, selectedProductIds) {
                return onExchange(setVisible, setLoading, selectedProductIds, voucher.id);
            }, description: voucher.description })) })); });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "mb-5" },
            React.createElement(VoucherInsertBlock, { onInsert: onInsert })),
        React.createElement(VoucherCollectionTabs, { vouchers: vouchers })));
};
export default VoucherCollectionBlock;
//# sourceMappingURL=VoucherCollectionBlock.js.map