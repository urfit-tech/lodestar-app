import { Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { checkoutMessages } from '../../helpers/translation';
import { useTappay } from '../../hooks/util';
import { StyledInputTarget } from './TapPayForm.styled';
var TapPayForm = function (_a) {
    var onUpdate = _a.onUpdate;
    var formatMessage = useIntl().formatMessage;
    var cardNoRef = useRef(null);
    var cardExpRef = useRef(null);
    var tpCreditCard = useTPCreditCard({ cardNoElement: cardNoRef, cardExpElement: cardExpRef });
    useEffect(function () {
        tpCreditCard && onUpdate && onUpdate(tpCreditCard);
    }, [tpCreditCard, onUpdate]);
    return (React.createElement(Form, { className: "mb-5 d-block" },
        React.createElement(Form.Item, { className: "mb-1", label: formatMessage(checkoutMessages.form.label.cardNo), required: true },
            React.createElement(StyledInputTarget, { ref: cardNoRef })),
        React.createElement(Form.Item, { className: "mb-1", label: formatMessage(checkoutMessages.form.label.cardExp), required: true },
            React.createElement(StyledInputTarget, { ref: cardExpRef }))));
};
var useTPCreditCard = function (options) {
    var TPDirect = useTappay().TPDirect;
    var cardNoElement = options.cardNoElement, cardExpElement = options.cardExpElement;
    var _a = useState(), tpCreditCard = _a[0], setCreditCard = _a[1];
    var readySetup = Boolean(TPDirect && cardNoElement && cardExpElement);
    useEffect(function () {
        if (readySetup) {
            TPDirect.card.setup({
                fields: {
                    number: {
                        element: cardNoElement.current,
                        placeholder: '**** **** **** ****',
                    },
                    expirationDate: {
                        element: cardExpElement.current,
                        placeholder: 'MM / YY',
                    },
                },
            });
            TPDirect.card.onUpdate(setCreditCard);
        }
    }, [readySetup, TPDirect, cardNoElement, cardExpElement]);
    useEffect(function () {
        if (!tpCreditCard) {
            return;
        }
        // tpCreditCard.canGetPrime === true
        // --> you can call TPDirect.card.getPrime()
        if (tpCreditCard.canGetPrime) {
            // Enable submit Button to get prime.
            // submitButton.removeAttribute('disabled')
        }
        else {
            // Disable submit Button to get prime.
            // submitButton.setAttribute('disabled', true)
        }
        // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
        if (tpCreditCard.cardType === 'visa') {
            // Handle card type visa.
        }
        // number 欄位是錯誤的
        if (tpCreditCard.status.number === 2) {
            // setNumberFormGroupToError()
        }
        else if (tpCreditCard.status.number === 0) {
            // setNumberFormGroupToSuccess()
        }
        else {
            // setNumberFormGroupToNormal()
        }
        if (tpCreditCard.status.expiry === 2) {
            // setNumberFormGroupToError()
        }
        else if (tpCreditCard.status.expiry === 0) {
            // setNumberFormGroupToSuccess()
        }
        else {
            // setNumberFormGroupToNormal()
        }
        if (tpCreditCard.status.ccv === 2) {
            // setNumberFormGroupToError()
        }
        else if (tpCreditCard.status.ccv === 0) {
            // setNumberFormGroupToSuccess()
        }
        else {
            // setNumberFormGroupToNormal()
        }
    }, [tpCreditCard]);
    return tpCreditCard;
};
export default React.memo(TapPayForm);
//# sourceMappingURL=TapPayForm.js.map