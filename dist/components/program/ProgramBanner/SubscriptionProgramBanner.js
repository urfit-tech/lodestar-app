var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledReactPlayer, StyledTags, StyledTitle, StyledVideoWrapper } from '.';
import { productMessages } from '../../../helpers/translation';
import MemberAvatar from '../../common/MemberAvatar';
import { BREAK_POINT } from '../../common/Responsive';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  background: #f7f8f8;\n\n  ", " {\n    color: #9b9b9b;\n  }\n  ", " {\n    color: #585858;\n    margin-bottom: 2rem;\n  }\n\n  @media (min-width: ", "px) {\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n  }\n"], ["\n  background: #f7f8f8;\n\n  ", " {\n    color: #9b9b9b;\n  }\n  ", " {\n    color: #585858;\n    margin-bottom: 2rem;\n  }\n\n  @media (min-width: ", "px) {\n    display: flex;\n    justify-content: flex-end;\n    align-items: center;\n  }\n"])), StyledTags, StyledTitle, BREAK_POINT);
var StyledMediaBlock = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  @media (min-width: ", "px) {\n    order: 1;\n    width: ", "%;\n  }\n"], ["\n  @media (min-width: ", "px) {\n    order: 1;\n    width: ", "%;\n  }\n"])), BREAK_POINT, (700 / 12).toFixed(6));
var StyledTitleBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  width: 100%;\n  padding: 1.5rem;\n\n  @media (min-width: ", "px) {\n    max-width: 520px;\n  }\n"], ["\n  width: 100%;\n  padding: 1.5rem;\n\n  @media (min-width: ", "px) {\n    max-width: 520px;\n  }\n"])), BREAK_POINT);
var StyledTag = styled.span(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 2px 8px;\n  border: 1px solid #cdcdcd;\n  border-radius: 12px;\n  font-size: 12px;\n"], ["\n  padding: 2px 8px;\n  border: 1px solid #cdcdcd;\n  border-radius: 12px;\n  font-size: 12px;\n"])));
var StyledLink = styled(Link)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: #9b9b9b;\n"], ["\n  color: #9b9b9b;\n"])));
var SubscriptionProgramBanner = function (_a) {
    var program = _a.program;
    var formatMessage = useIntl().formatMessage;
    var instructorId = program.roles.filter(function (role) { return role.name === 'instructor'; }).map(function (role) { return role.memberId; })[0] || '';
    return (React.createElement(StyledWrapper, { id: "program-banner" },
        React.createElement(StyledMediaBlock, null,
            React.createElement(StyledVideoWrapper, { backgroundImage: program.coverUrl || '' }, program.coverVideoUrl && (React.createElement(StyledReactPlayer, { controls: true, url: program.coverVideoUrl, width: "100%", height: "100%" })))),
        React.createElement("div", { className: "d-flex justify-content-center align-items-center flex-grow-1" },
            React.createElement(StyledTitleBlock, null,
                React.createElement(StyledTags, null,
                    React.createElement(StyledTag, { className: "mr-2" }, formatMessage(productMessages.program.content.subscribe)),
                    program.tags.map(function (programTag) { return (React.createElement(StyledLink, { key: programTag, to: "/search?tag=" + programTag + "&tab=programs", className: "mr-2" },
                        "#",
                        programTag)); })),
                React.createElement(StyledTitle, null, program.title),
                React.createElement(MemberAvatar, { memberId: instructorId, withName: true })))));
};
export default SubscriptionProgramBanner;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=SubscriptionProgramBanner.js.map