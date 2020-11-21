var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { shippingMethodFormatter } from '../../helpers';
import IconList from '../../images/list-o.svg';
import CommonModal from '../common/CommonModal';
var messages = defineMessages({
    shippingInfo: { id: 'product.merchandise.ui.shippingInfo', defaultMessage: '收件資訊' },
    shippingName: { id: 'product.merchandise.ui.shippingName', defaultMessage: '收件姓名' },
    shippingMethod: { id: 'product.merchandise.ui.shippingMethod', defaultMessage: '收件方式' },
    shippingPhone: { id: 'product.merchandise.ui.shippingPhone', defaultMessage: '收件人電話' },
    shippingAddress: { id: 'product.merchandise.ui.shippingAddress', defaultMessage: '收件地址' },
    shippingMail: { id: 'product.merchandise.ui.shippingMail', defaultMessage: '收件人信箱' },
});
var StyledShippingInfoSubtitle = styled.h4(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"], ["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"])));
var StyledShippingInfoContent = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 24px;\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"], ["\n  margin-bottom: 24px;\n  font-size: 16px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.2px;\n  color: var(--gray-darker);\n"])));
var MerchandiseShippingInfoModal = function (_a) {
    var shipping = _a.shipping, invoice = _a.invoice;
    var formatMessage = useIntl().formatMessage;
    var _b = useDisclosure(), isOpen = _b.isOpen, onOpen = _b.onOpen, onClose = _b.onClose;
    return (React.createElement(CommonModal, { title: formatMessage(messages.shippingInfo), renderTrigger: function () { return (React.createElement(Button, { leftIcon: React.createElement(Icon, { src: IconList }), variant: "ghost", colorScheme: "white", onClick: onOpen }, formatMessage(messages.shippingInfo))); }, isOpen: isOpen, onClose: onClose },
        React.createElement("div", null,
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-4" },
                    React.createElement(StyledShippingInfoSubtitle, { className: "mb-1" }, formatMessage(messages.shippingName)),
                    React.createElement(StyledShippingInfoContent, null, shipping === null || shipping === void 0 ? void 0 : shipping.name)),
                React.createElement("div", { className: "col-8" },
                    React.createElement(StyledShippingInfoSubtitle, { className: "mb-1" }, formatMessage(messages.shippingMethod)),
                    React.createElement(StyledShippingInfoContent, null, shippingMethodFormatter(shipping === null || shipping === void 0 ? void 0 : shipping.shippingMethod))),
                React.createElement("div", { className: "col-12" },
                    React.createElement(StyledShippingInfoSubtitle, { className: "mb-1" }, formatMessage(messages.shippingPhone)),
                    React.createElement(StyledShippingInfoContent, null, shipping === null || shipping === void 0 ? void 0 : shipping.phone)),
                React.createElement("div", { className: "col-12" },
                    React.createElement(StyledShippingInfoSubtitle, { className: "mb-1" }, formatMessage(messages.shippingAddress)),
                    React.createElement(StyledShippingInfoContent, null, shipping === null || shipping === void 0 ? void 0 : shipping.address)),
                React.createElement("div", { className: "col-12" },
                    React.createElement(StyledShippingInfoSubtitle, { className: "mb-1" }, formatMessage(messages.shippingMail)),
                    React.createElement(StyledShippingInfoContent, null, invoice === null || invoice === void 0 ? void 0 : invoice.email))))));
};
export default MerchandiseShippingInfoModal;
var templateObject_1, templateObject_2;
//# sourceMappingURL=MerchandiseShippingInfoModal.js.map