import { message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import { StyledContainer } from '../components/layout/DefaultLayout.styled';
import SpGatewayForm from '../components/payment/SpGatewayForm';
import { handleError } from '../helpers';
import { codeMessages } from '../helpers/translation';
var PaymentPage = function () {
    var paymentNo = useParams().paymentNo;
    var _a = usePayForm(parseInt(paymentNo)), loadingForm = _a.loadingForm, PayForm = _a.PayForm;
    return (React.createElement(DefaultLayout, { noFooter: true, noHeader: true, centeredBox: true },
        React.createElement(StyledContainer, null, loadingForm ? React.createElement("div", null, "\u8ACB\u6C42\u4ED8\u6B3E\u8CC7\u8A0A\u4E2D...") : PayForm)));
};
var usePayForm = function (paymentNo) {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var _a = useAuth(), authToken = _a.authToken, currentMemberId = _a.currentMemberId, backendEndpoint = _a.backendEndpoint;
    var _b = useState(false), loadingForm = _b[0], setLoadingForm = _b[1];
    var _c = useState(null), PayForm = _c[0], setPayForm = _c[1];
    useEffect(function () {
        var clientBackUrl = window.location.origin;
        if (authToken) {
            setLoadingForm(true);
            axios
                .post(backendEndpoint + "/payment/pay-form", {
                paymentNo: paymentNo,
                options: {
                    notifyUrl: backendEndpoint + "/payment/order-notification",
                    clientBackUrl: clientBackUrl,
                    returnUrl: backendEndpoint + "/payment/payment-proxy",
                },
            }, {
                headers: { authorization: "Bearer " + authToken },
            })
                .then(function (_a) {
                var _b = _a.data, code = _b.code, result = _b.result;
                if (code === 'SUCCESS') {
                    switch (result.gateway) {
                        case 'spgateway':
                            if (result.html) {
                                setPayForm(React.createElement(SpGatewayForm, { formHtml: result.html, clientBackUrl: clientBackUrl }));
                            }
                            else {
                                // window.location.assign(`/members/${currentMemberId}`)
                                history.push("/members/" + currentMemberId);
                            }
                            break;
                        case 'tappay':
                            // window.location.assign(`/payments/${paymentNo}/tappay`)
                            history.push("/payments/" + paymentNo + "/tappay");
                            break;
                        default:
                            message.error('invalid gateway');
                            break;
                    }
                }
                else {
                    message.error(formatMessage(codeMessages[code]));
                }
            })
                .catch(handleError)
                .finally(function () { return setLoadingForm(false); });
        }
    }, [authToken, backendEndpoint, currentMemberId, formatMessage, history, paymentNo]);
    return { loadingForm: loadingForm, PayForm: PayForm };
};
export default PaymentPage;
//# sourceMappingURL=PaymentPage.js.map