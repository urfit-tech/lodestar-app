var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages, voucherMessages } from '../../helpers/translation';
import { BREAK_POINT } from '../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.5rem;\n  border-radius: 4px;\n  background: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  @media (min-width: ", "px) {\n    padding: 2rem 10rem;\n  }\n"], ["\n  padding: 1.5rem;\n  border-radius: 4px;\n  background: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  @media (min-width: ", "px) {\n    padding: 2rem 10rem;\n  }\n"])), BREAK_POINT);
var StyledTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  font-size: 14px;\n  color: var(--gray-darker);\n"], ["\n  font-size: 14px;\n  color: var(--gray-darker);\n"])));
var StyledInput = styled(Input)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    margin-bottom: 1.25rem;\n    width: 100%;\n\n    @media (min-width: ", "px) {\n      margin-bottom: 0;\n      margin-right: 0.75rem;\n      width: auto;\n    }\n  }\n"], ["\n  && {\n    margin-bottom: 1.25rem;\n    width: 100%;\n\n    @media (min-width: ", "px) {\n      margin-bottom: 0;\n      margin-right: 0.75rem;\n      width: auto;\n    }\n  }\n"])), BREAK_POINT);
var StyledButton = styled(Button)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  && {\n    width: 100%;\n\n    @media (min-width: ", "px) {\n      width: auto;\n    }\n  }\n"], ["\n  && {\n    width: 100%;\n\n    @media (min-width: ", "px) {\n      width: auto;\n    }\n  }\n"])), BREAK_POINT);
var VoucherInsertBlock = function (_a) {
    var form = _a.form, onInsert = _a.onInsert;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var formatMessage = useIntl().formatMessage;
    var handleSubmit = function (e) {
        e.preventDefault();
        form.validateFields(function (err, values) {
            if (err) {
                return;
            }
            if (onInsert) {
                onInsert(setLoading, values.code);
                form.resetFields();
            }
        });
    };
    return (React.createElement(StyledWrapper, null,
        React.createElement(StyledTitle, { className: "mb-2" }, formatMessage(voucherMessages.title.addVoucher)),
        React.createElement(Form, { layout: "inline", onSubmit: handleSubmit },
            React.createElement("div", { className: "d-flex justify-content-between align-items-center flex-wrap" },
                form.getFieldDecorator('code', { rules: [{ required: true, message: null }] })(React.createElement(StyledInput, { placeholder: formatMessage(voucherMessages.form.placeholder.voucherEnter), className: "flex-grow-1", autoComplete: "off" })),
                React.createElement(StyledButton, { loading: loading, type: "primary", htmlType: "submit", disabled: !form.getFieldValue('code') }, formatMessage(commonMessages.button.add))))));
};
export default Form.create()(VoucherInsertBlock);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=VoucherInsertBlock.js.map