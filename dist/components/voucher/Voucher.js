var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Divider } from 'antd';
import moment from 'moment';
import React from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { rgba } from '../../helpers';
import { commonMessages, voucherMessages } from '../../helpers/translation';
import GiftIcon from '../../images/gift.svg';
import { BREAK_POINT } from '../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  margin-bottom: 1.25rem;\n  padding: 1.5rem;\n  background: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  &::before,\n  &::after {\n    content: '';\n    position: absolute;\n    top: 50%;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    background-color: #f7f8f8;\n    transform: translateY(-50%);\n  }\n  &::before {\n    left: -10px;\n    box-shadow: inset -4px 0 5px 0 rgba(0, 0, 0, 0.06);\n  }\n  &::after {\n    right: -10px;\n    box-shadow: inset 4px 0 5px 0 rgba(0, 0, 0, 0.06);\n  }\n"], ["\n  position: relative;\n  margin-bottom: 1.25rem;\n  padding: 1.5rem;\n  background: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  &::before,\n  &::after {\n    content: '';\n    position: absolute;\n    top: 50%;\n    width: 20px;\n    height: 20px;\n    border-radius: 50%;\n    background-color: #f7f8f8;\n    transform: translateY(-50%);\n  }\n  &::before {\n    left: -10px;\n    box-shadow: inset -4px 0 5px 0 rgba(0, 0, 0, 0.06);\n  }\n  &::after {\n    right: -10px;\n    box-shadow: inset 4px 0 5px 0 rgba(0, 0, 0, 0.06);\n  }\n"])));
var StyledIcon = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: none;\n\n  justify-content: center;\n  align-items: center;\n  width: 64px;\n  height: 64px;\n  background: ", ";\n  font-size: 2rem;\n  border-radius: 50%;\n\n  svg path {\n    fill: ", ";\n  }\n\n  @media (min-width: ", "px) {\n    display: flex;\n  }\n"], ["\n  display: none;\n\n  justify-content: center;\n  align-items: center;\n  width: 64px;\n  height: 64px;\n  background: ", ";\n  font-size: 2rem;\n  border-radius: 50%;\n\n  svg path {\n    fill: ", ";\n  }\n\n  @media (min-width: ", "px) {\n    display: flex;\n  }\n"])), function (props) { return (props.available ? rgba(props.theme['@primary-color'], 0.1) : "var(--gray-lighter)"); }, function (props) { return (props.available ? props.theme['@primary-color'] : '#CDCDCD'); }, BREAK_POINT);
var StyledContent = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  overflow: hidden;\n  font-size: 14px;\n"], ["\n  overflow: hidden;\n  font-size: 14px;\n"])));
var StyledExtra = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])));
var StyledAction = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: 100%;\n  color: var(--gray-dark);\n  font-size: 14px;\n\n  > .anticon {\n    font-size: 16px;\n    color: #4a4a4a;\n  }\n"], ["\n  width: 100%;\n  color: var(--gray-dark);\n  font-size: 14px;\n\n  > .anticon {\n    font-size: 16px;\n    color: #4a4a4a;\n  }\n"])));
var StyledTitle = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"], ["\n  overflow: hidden;\n  color: var(--gray-darker);\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"])));
var Voucher = function (_a) {
    var title = _a.title, startedAt = _a.startedAt, endedAt = _a.endedAt, productQuantityLimit = _a.productQuantityLimit, available = _a.available, extra = _a.extra, action = _a.action;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledWrapper, null,
        React.createElement("div", { className: "d-flex align-items-center justify-content-start" },
            React.createElement(StyledIcon, { className: "mr-3", available: available },
                React.createElement(Icon, { src: GiftIcon })),
            React.createElement(StyledContent, { className: "flex-grow-1" },
                React.createElement(StyledTitle, { className: "mb-1" }, title),
                React.createElement("div", null,
                    startedAt ? moment(startedAt).format('YYYY/MM/DD') : formatMessage(voucherMessages.content.fromNow),
                    ' ~ ',
                    endedAt ? moment(endedAt).format('YYYY/MM/DD') : formatMessage(voucherMessages.content.noUsePeriod)),
                React.createElement(StyledExtra, { className: "d-flex align-items-center justify-content-between mt-4" },
                    React.createElement("div", null, formatMessage(voucherMessages.content.redeemable) + " " + productQuantityLimit + " " + formatMessage(commonMessages.unit.item)),
                    available && extra && React.createElement("div", null, extra)))),
        action && (React.createElement(React.Fragment, null,
            React.createElement(Divider, null),
            React.createElement(StyledAction, { className: "d-flex justify-content-between align-items-center" }, action)))));
};
export default Voucher;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=Voucher.js.map