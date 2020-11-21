var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Form, Icon, Input } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import { BREAK_POINT } from '../components/common/Responsive';
import DefaultLayout from '../components/layout/DefaultLayout';
import { useApp } from '../containers/common/AppContext';
import { handleError } from '../helpers';
import { codeMessages, commonMessages } from '../helpers/translation';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 4rem 1rem;\n  color: #585858;\n\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 4rem;\n  }\n"], ["\n  padding: 4rem 1rem;\n  color: #585858;\n\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 4rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 2rem;\n  color: #585858;\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n"], ["\n  margin-bottom: 2rem;\n  color: #585858;\n  font-size: 20px;\n  font-weight: bold;\n  text-align: center;\n  line-height: 1.6;\n  letter-spacing: 0.8px;\n"])));
var ForgotPasswordPage = function (_a) {
    var form = _a.form;
    var appId = useApp().id;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var backendEndpoint = useAuth().backendEndpoint;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        form.validateFields(function (error, values) {
            if (error) {
                return;
            }
            axios
                .post(backendEndpoint + "/auth/forgot-password", {
                appId: appId,
                account: values.email,
            })
                .then(function (_a) {
                var _b = _a.data, code = _b.code, message = _b.message, result = _b.result;
                if (code === 'SUCCESS') {
                    history.push("/check-email?email=" + values.email + "&type=forgot-password");
                }
                else {
                    message.error(formatMessage(codeMessages[code]));
                }
            })
                .catch(handleError)
                .finally(function () { return setLoading(false); });
            setLoading(true);
        });
    };
    return (React.createElement(DefaultLayout, { noFooter: true, centeredBox: true },
        React.createElement(StyledContainer, null,
            React.createElement(StyledTitle, null, formatMessage(commonMessages.title.forgotPassword)),
            React.createElement(Form, { onSubmit: handleSubmit },
                React.createElement(Form.Item, null, form.getFieldDecorator('email', {
                    validateTrigger: 'onSubmit',
                    rules: [
                        {
                            required: true,
                            message: formatMessage(commonMessages.form.message.enterEmail),
                        },
                        {
                            type: 'email',
                            message: formatMessage(commonMessages.form.message.emailFormat),
                        },
                    ],
                })(React.createElement(Input, { placeholder: formatMessage(commonMessages.form.option.email), suffix: React.createElement(Icon, { type: "mail" }) }))),
                React.createElement(Form.Item, { className: "m-0" },
                    React.createElement(Button, { htmlType: "submit", type: "primary", block: true, loading: loading }, formatMessage(commonMessages.button.confirm)))))));
};
export default Form.create()(ForgotPasswordPage);
var templateObject_1, templateObject_2;
//# sourceMappingURL=ForgotPasswordPage.js.map