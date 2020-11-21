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
import { useQuery } from '@apollo/react-hooks';
import { message } from 'antd';
import axios from 'axios';
import gql from 'graphql-tag';
import { reverse } from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { useAuth } from '../../components/auth/AuthContext';
import VoucherCollectionBlockComponent from '../../components/voucher/VoucherCollectionBlock';
import { handleError } from '../../helpers';
import { codeMessages, voucherMessages } from '../../helpers/translation';
var VoucherCollectionBlock = function () {
    var formatMessage = useIntl().formatMessage;
    var _a = useAuth(), currentMemberId = _a.currentMemberId, authToken = _a.authToken, backendEndpoint = _a.backendEndpoint;
    var _b = useQuery(GET_VOUCHER_COLLECTION), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var voucherCollection = loading || error || !data
        ? []
        : reverse(data.voucher).map(function (voucher) { return (__assign(__assign({}, voucher), { title: voucher.voucher_code.voucher_plan.title, startedAt: voucher.voucher_code.voucher_plan.started_at
                ? new Date(voucher.voucher_code.voucher_plan.started_at)
                : undefined, endedAt: voucher.voucher_code.voucher_plan.ended_at
                ? new Date(voucher.voucher_code.voucher_plan.ended_at)
                : undefined, productQuantityLimit: voucher.voucher_code.voucher_plan.product_quantity_limit, available: !voucher.status || voucher.status.outdated || voucher.status.used ? false : true, productIds: voucher.voucher_code.voucher_plan.voucher_plan_products.map(function (product) { return product.product_id; }), description: decodeURI(voucher.voucher_code.voucher_plan.description || '') })); });
    var handleInsert = function (setLoading, code) {
        if (!currentMemberId) {
            return;
        }
        setLoading(true);
        axios
            .post(backendEndpoint + "/payment/exchange", {
            code: code,
            type: 'Voucher',
        }, {
            headers: { authorization: "Bearer " + authToken },
        })
            .then(function (_a) {
            var _b = _a.data, code = _b.code, errorMessage = _b.message;
            if (code === 'SUCCESS') {
                message.success(formatMessage(voucherMessages.messages.addVoucher));
                refetch();
            }
            else {
                if (/^GraphQL error: Uniqueness violation/.test(errorMessage)) {
                    message.error(formatMessage(voucherMessages.messages.duplicateVoucherCode));
                }
                else {
                    message.error(formatMessage(codeMessages[code]));
                }
            }
        })
            .catch(handleError)
            .finally(function () { return setLoading(false); });
    };
    var handleExchange = function (setVisible, setLoading, selectedProductIds, voucherId) {
        if (!currentMemberId) {
            return;
        }
        setLoading(true);
        exchangeVoucherCode(authToken, backendEndpoint, voucherId, selectedProductIds)
            .then(function (data) {
            setVisible(false);
            message.success(formatMessage(voucherMessages.messages.exchangeVoucher));
            refetch();
        })
            .catch(function (error) {
            try {
                message.error(error.response.data.message);
            }
            catch (error) {
                message.error(formatMessage(voucherMessages.messages.useVoucherError));
            }
        })
            .finally(function () { return setLoading(false); });
    };
    return (React.createElement(VoucherCollectionBlockComponent, { memberId: currentMemberId, loading: loading, error: error, voucherCollection: voucherCollection, onInsert: handleInsert, onExchange: handleExchange }));
};
var exchangeVoucherCode = function (authToken, backendEndpoint, voucherId, selectedProductIds) {
    return axios.post(backendEndpoint + "/tasks/order", {
        paymentModel: { type: 'perpetual' },
        discountId: "Voucher_" + voucherId,
        productIds: selectedProductIds,
        invoice: {},
    }, {
        headers: { authorization: "Bearer " + authToken },
    });
};
var GET_VOUCHER_COLLECTION = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_VOUCHER_COLLECTION {\n    voucher {\n      id\n      status {\n        outdated\n        used\n      }\n      voucher_code {\n        id\n        code\n        voucher_plan {\n          id\n          title\n          description\n          started_at\n          ended_at\n          product_quantity_limit\n          voucher_plan_products {\n            id\n            product_id\n          }\n        }\n      }\n    }\n  }\n"], ["\n  query GET_VOUCHER_COLLECTION {\n    voucher {\n      id\n      status {\n        outdated\n        used\n      }\n      voucher_code {\n        id\n        code\n        voucher_plan {\n          id\n          title\n          description\n          started_at\n          ended_at\n          product_quantity_limit\n          voucher_plan_products {\n            id\n            product_id\n          }\n        }\n      }\n    }\n  }\n"])));
export default VoucherCollectionBlock;
var templateObject_1;
//# sourceMappingURL=VoucherCollectionBlock.js.map