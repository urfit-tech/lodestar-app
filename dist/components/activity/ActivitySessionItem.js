var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon, Skeleton } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { dateRangeFormatter } from '../../helpers';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useActivitySession } from '../../hooks/activity';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 1.5rem 0;\n  background: #f7f8f8;\n  border-radius: 4px;\n  color: #585858;\n"], ["\n  padding: 1.5rem 0;\n  background: #f7f8f8;\n  border-radius: 4px;\n  color: #585858;\n"])));
var StyledTitle = styled.h2(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-left: 1.5rem;\n  border-left: 2px solid ", ";\n  font-size: 16px;\n"], ["\n  padding-left: 1.5rem;\n  border-left: 2px solid ", ";\n  font-size: 16px;\n"])), function (props) { return props.theme['@primary-color']; });
var StyledContent = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  line-height: 1.5;\n  padding: 0 1.5rem;\n\n  > div + div {\n    margin-top: 0.75rem;\n  }\n"], ["\n  line-height: 1.5;\n  padding: 0 1.5rem;\n\n  > div + div {\n    margin-top: 0.75rem;\n  }\n"])));
var ActivitySessionItem = function (_a) {
    var activitySessionId = _a.activitySessionId, renderAttend = _a.renderAttend;
    var _b = useActivitySession(activitySessionId), loadingSession = _b.loadingSession, errorSession = _b.errorSession, session = _b.session;
    var formatMessage = useIntl().formatMessage;
    if (loadingSession) {
        return (React.createElement(StyledWrapper, null,
            React.createElement(Skeleton, { active: true })));
    }
    if (errorSession || !session) {
        return React.createElement(StyledWrapper, null, formatMessage(commonMessages.status.loadingError));
    }
    return (React.createElement(StyledWrapper, null,
        React.createElement(StyledTitle, { className: "mb-3" }, session.title),
        React.createElement(StyledContent, null,
            React.createElement("div", null,
                React.createElement(Icon, { type: "calendar", className: "mr-2" }),
                React.createElement("span", null, dateRangeFormatter({ startedAt: session.startedAt, endedAt: session.endedAt }))),
            React.createElement("div", null,
                React.createElement(Icon, { type: "pushpin", className: "mr-2" }),
                React.createElement("span", null, session.location),
                session.description && React.createElement("span", { className: "ml-2" },
                    "(",
                    session.description,
                    ")")),
            (session.isParticipantsVisible || !!session.threshold) && (React.createElement("div", null,
                React.createElement(Icon, { type: "user", className: "mr-2" }),
                session.isParticipantsVisible && (React.createElement("span", { className: "mr-3" },
                    session.enrollments,
                    " / ",
                    session.maxAmount)),
                session.threshold && (React.createElement("span", null,
                    formatMessage(productMessages.activity.content.least),
                    session.threshold)))),
            renderAttend && React.createElement("div", { className: "pt-2" }, renderAttend))));
};
export default ActivitySessionItem;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ActivitySessionItem.js.map