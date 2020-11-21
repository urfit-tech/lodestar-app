var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { productMessages } from '../../helpers/translation';
var StyledItemWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: relative;\n  margin-bottom: 0.5rem;\n  margin-right: 0.5rem;\n  padding: 0.75rem;\n  width: 6rem;\n  overflow: hidden;\n  border: solid 1px ", ";\n  color: ", ";\n  border-radius: 4px;\n  cursor: ", ";\n\n  ", "\n"], ["\n  position: relative;\n  margin-bottom: 0.5rem;\n  margin-right: 0.5rem;\n  padding: 0.75rem;\n  width: 6rem;\n  overflow: hidden;\n  border: solid 1px ", ";\n  color: ", ";\n  border-radius: 4px;\n  cursor: ", ";\n\n  ",
    "\n"])), function (props) { return (props.variant === 'disabled' ? 'var(--gray-light)' : 'var(--gray-dark)'); }, function (props) { return (props.variant === 'disabled' ? 'var(--gray-dark)' : 'var(--gray-darker)'); }, function (props) { return (props.variant === 'disabled' ? 'not-allowed' : 'pointer'); }, function (props) {
    return props.variant === 'excluded'
        ? css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n          ::before {\n            display: block;\n            position: absolute;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n            content: ' ';\n            background-image: linear-gradient(90deg, transparent 5.5px, var(--gray) 5.5px);\n            background-size: 6px 100%;\n            background-repeat: repeat;\n            transform: rotate(30deg) scale(2);\n          }\n        "], ["\n          ::before {\n            display: block;\n            position: absolute;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n            content: ' ';\n            background-image: linear-gradient(90deg, transparent 5.5px, var(--gray) 5.5px);\n            background-size: 6px 100%;\n            background-repeat: repeat;\n            transform: rotate(30deg) scale(2);\n          }\n        "]))) : '';
});
var StyledItemTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  margin-bottom: 0.25rem;\n  letter-spacing: 0.2px;\n"], ["\n  position: relative;\n  margin-bottom: 0.25rem;\n  letter-spacing: 0.2px;\n"])));
var StyledItemMeta = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  font-size: 12px;\n  letter-spacing: 0.34px;\n"], ["\n  position: relative;\n  font-size: 12px;\n  letter-spacing: 0.34px;\n"])));
var AppointmentPeriodItem = function (_a) {
    var id = _a.id, startedAt = _a.startedAt, isEnrolled = _a.isEnrolled, isExcluded = _a.isExcluded;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledItemWrapper, { variant: isEnrolled ? 'disabled' : isExcluded ? 'excluded' : 'default' },
        React.createElement(StyledItemTitle, null,
            startedAt.getHours().toString().padStart(2, '0'),
            ":",
            startedAt.getMinutes().toString().padStart(2, '0')),
        React.createElement(StyledItemMeta, null, isEnrolled
            ? formatMessage(productMessages.appointment.status.booked)
            : isExcluded
                ? formatMessage(productMessages.appointment.status.closed)
                : formatMessage(productMessages.appointment.status.bookable))));
};
export default AppointmentPeriodItem;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=AppointmentItem.js.map