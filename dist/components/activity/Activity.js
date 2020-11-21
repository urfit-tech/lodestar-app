var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { productMessages } from '../../helpers/translation';
import EmptyCover from '../../images/empty-cover.png';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"], ["\n  overflow: hidden;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"])));
var StyledCover = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: ", "%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"], ["\n  padding-top: ", "%;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"])), 900 / 16, function (props) { return props.src; });
var StyledDescription = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1.25rem;\n"], ["\n  padding: 1.25rem;\n"])));
var StyledTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])));
var StyledMeta = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  min-height: 1rem;\n  color: var(--black-45);\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"], ["\n  min-height: 1rem;\n  color: var(--black-45);\n  font-size: 14px;\n  letter-spacing: 0.18px;\n"])));
var Activity = function (_a) {
    var id = _a.id, title = _a.title, coverUrl = _a.coverUrl, isParticipantsVisible = _a.isParticipantsVisible, participantCount = _a.participantCount, totalSeats = _a.totalSeats, startedAt = _a.startedAt, endedAt = _a.endedAt;
    var formatMessage = useIntl().formatMessage;
    var startDate = startedAt ? moment(startedAt).format('YYYY-MM-DD(dd)') : '';
    var endDate = endedAt ? moment(endedAt).format('YYYY-MM-DD(dd)') : '';
    return (React.createElement(StyledWrapper, null,
        React.createElement(Link, { to: "/activities/" + id },
            React.createElement(StyledCover, { src: coverUrl || EmptyCover }),
            React.createElement(StyledDescription, null,
                React.createElement(StyledTitle, { className: "mb-4" }, title),
                React.createElement(StyledMeta, { className: "mb-2" }, isParticipantsVisible && (React.createElement(React.Fragment, null,
                    React.createElement(Icon, { as: AiOutlineUser }),
                    React.createElement("span", { className: "ml-2" },
                        formatMessage(productMessages.activity.content.remaining),
                        participantCount && totalSeats ? totalSeats - participantCount : totalSeats)))),
                React.createElement(StyledMeta, null,
                    React.createElement(Icon, { as: AiOutlineCalendar }),
                    startDate && endDate ? (React.createElement("span", { className: "ml-2" },
                        startDate,
                        startDate !== endDate ? " ~ " + endDate : '')) : null)))));
};
export default Activity;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=Activity.js.map