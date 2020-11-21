var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { Link, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import { StyledContainer } from '../components/layout/DefaultLayout.styled';
import { handleError } from '../helpers';
import { codeMessages, commonMessages } from '../helpers/translation';
import { useTask } from '../hooks/task';
import ErrorIcon from '../images/error.svg';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 4rem 1rem;\n"], ["\n  padding: 4rem 1rem;\n"])));
var StyledTitle = styled.h3(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n  color: var(--gray-darker);\n"], ["\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n  color: var(--gray-darker);\n"])));
var StyledButton = styled(Button)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 160px;\n  height: 44px;\n"], ["\n  width: 160px;\n  height: 44px;\n"])));
var OrderTaskPage = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var taskId = useParams().taskId;
    var _a = useAuth(), authToken = _a.authToken, backendEndpoint = _a.backendEndpoint;
    var _b = useTask('order', taskId), task = _b.task, retry = _b.retry;
    var _c = useState(''), errorMessage = _c[0], setErrorMessage = _c[1];
    useEffect(function () {
        var _a;
        if (task === null || task === void 0 ? void 0 : task.failedReason) {
            message.error(formatMessage(commonMessages.status.fail));
            setErrorMessage(task === null || task === void 0 ? void 0 : task.failedReason);
            return;
        }
        if (authToken && (task === null || task === void 0 ? void 0 : task.finishedOn) && ((_a = task === null || task === void 0 ? void 0 : task.returnvalue) === null || _a === void 0 ? void 0 : _a.orderId)) {
            axios
                .post(backendEndpoint + "/tasks/payment/", { orderId: task.returnvalue.orderId }, { headers: { authorization: "Bearer " + authToken } })
                .then(function (_a) {
                var _b = _a.data, code = _b.code, result = _b.result;
                if (code === 'SUCCESS') {
                    history.push("/tasks/payment/" + result.id);
                }
                else {
                    message.error(formatMessage(codeMessages[code]));
                }
            })
                .catch(handleError);
        }
    }, [authToken, backendEndpoint, formatMessage, history, task]);
    if (errorMessage) {
        return (React.createElement(DefaultLayout, { noFooter: true, noHeader: true, centeredBox: true },
            React.createElement(StyledWrapper, { className: "d-flex flex-column justify-content-between align-items-center" },
                React.createElement(Icon, { src: ErrorIcon, className: "mr-4" }),
                React.createElement("div", { className: "mb-4 d-flex flex-column text-center" },
                    React.createElement(StyledTitle, { className: "mb-2" }, errorMessage)),
                React.createElement(Link, { to: "/" },
                    React.createElement(StyledButton, null, formatMessage(commonMessages.button.backToHome))))));
    }
    return (React.createElement(DefaultLayout, { noFooter: true, noHeader: true, centeredBox: true },
        React.createElement(StyledContainer, null,
            "\u78BA\u8A8D\u8A02\u55AE\u4E2D\uFF0C\u8ACB\u7A0D\u5019...",
            (Math.exp(-1 / retry) * 100).toFixed(0),
            "%")));
};
export default OrderTaskPage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=OrderTaskPage.js.map