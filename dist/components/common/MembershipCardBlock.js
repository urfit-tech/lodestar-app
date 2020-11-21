var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon } from 'antd';
import moment from 'moment';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import MembershipCard from './MembershipCard';
import { BraftContent } from './StyledBraftEditor';
var StyledCardContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-width: 100px;\n  margin-bottom: 2rem;\n"], ["\n  min-width: 100px;\n  margin-bottom: 2rem;\n"])));
var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n  overflow: hidden;\n  color: #585858;\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"], ["\n  margin-bottom: 0.75rem;\n  overflow: hidden;\n  color: #585858;\n  font-size: 20px;\n  font-weight: bold;\n  line-height: 1.3;\n  letter-spacing: 0.77px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"])));
var StyledSubTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-bottom: 1rem;\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"], ["\n  margin-bottom: 1rem;\n  color: rgba(0, 0, 0, 0.45);\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"])));
var MembershipCardBlock = function (_a) {
    var template = _a.template, templateVars = _a.templateVars, title = _a.title, expiredAt = _a.expiredAt, description = _a.description, variant = _a.variant;
    var formatMessage = useIntl().formatMessage;
    if (variant === 'list-item') {
        return (React.createElement("div", { className: "d-flex justify-content-between" },
            React.createElement("div", { className: "flex-grow-1" },
                React.createElement(StyledTitle, null, title),
                description && React.createElement(BraftContent, null, description)),
            React.createElement(StyledCardContainer, { className: "m-0 ml-5" },
                React.createElement(MembershipCard, { template: template, templateVars: templateVars }))));
    }
    return (React.createElement("div", null,
        React.createElement(StyledCardContainer, null,
            React.createElement(MembershipCard, { template: template, templateVars: templateVars })),
        React.createElement(StyledTitle, null, title),
        React.createElement(StyledSubTitle, null,
            React.createElement(Icon, { type: "calendar", className: "mr-2" }),
            expiredAt
                ? formatMessage({ id: 'common.expiredTime', defaultMessage: '{expiredTime} 止' }, {
                    expiredTime: moment(expiredAt).format('YYYY/MM/DD'),
                })
                : formatMessage(commonMessages.content.noPeriod)),
        description && React.createElement(BraftContent, null, description)));
};
export default MembershipCardBlock;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=MembershipCardBlock.js.map