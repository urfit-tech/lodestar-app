import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
var messages = defineMessages({
    sevenEleven: { id: 'merchandise.label.sevenEleven', defaultMessage: '7-11超商取貨' },
    familyMart: { id: 'merchandise.label.familyMart', defaultMessage: '全家超商取貨' },
    hiLife: { id: 'merchandise.label.hiLife', defaultMessage: '萊爾富超商取貨' },
    okMart: { id: 'merchandise.label.okMart', defaultMessage: 'OK超商取貨' },
    homeDelivery: { id: 'merchandise.label.homeDelivery', defaultMessage: '宅配' },
    sendByPost: { id: 'merchandise.label.sendByPost', defaultMessage: '郵寄' },
    other: { id: 'merchandise.label.other', defaultMessage: '其他' },
});
var ShippingMethodLabel = function (_a) {
    var shippingMethodId = _a.shippingMethodId;
    var formatMessage = useIntl().formatMessage;
    switch (shippingMethodId) {
        case 'seven-eleven':
            return React.createElement(React.Fragment, null, formatMessage(messages.sevenEleven));
        case 'family-mart':
            return React.createElement(React.Fragment, null, formatMessage(messages.familyMart));
        case 'hi-life':
            return React.createElement(React.Fragment, null, formatMessage(messages.hiLife));
        case 'ok-mart':
            return React.createElement(React.Fragment, null, formatMessage(messages.okMart));
        case 'home-delivery':
            return React.createElement(React.Fragment, null, formatMessage(messages.homeDelivery));
        case 'send-by-post':
            return React.createElement(React.Fragment, null, formatMessage(messages.sendByPost));
        case 'other':
            return React.createElement(React.Fragment, null, formatMessage(messages.other));
        default:
            return null;
    }
};
export default ShippingMethodLabel;
//# sourceMappingURL=ShippingMethodLabel.js.map