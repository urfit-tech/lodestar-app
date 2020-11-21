var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Affix, Button, Card } from 'antd';
import { sum } from 'ramda';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { usePublicMember } from '../../hooks/member';
import { useEnrolledProgramIds } from '../../hooks/program';
import { useAuth } from '../auth/AuthContext';
import ProgramPaymentButton from '../checkout/ProgramPaymentButton';
import CountDownTimeBlock from '../common/CountDownTimeBlock';
import { AvatarImage } from '../common/Image';
import PriceLabel from '../common/PriceLabel';
import Responsive, { BREAK_POINT } from '../common/Responsive';
var ProgramInforCard = styled(Card)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    margin-bottom: 2.5rem;\n    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n  }\n\n  .ant-card-body {\n    padding: 1rem;\n  }\n"], ["\n  && {\n    margin-bottom: 2.5rem;\n    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);\n  }\n\n  .ant-card-body {\n    padding: 1rem;\n  }\n"])));
var StyledInstructorName = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin-bottom: 28px;\n  color: #585858;\n  font-size: 18px;\n  font-weight: bold;\n  text-align: center;\n"], ["\n  margin-bottom: 28px;\n  color: #585858;\n  font-size: 18px;\n  font-weight: bold;\n  text-align: center;\n"])));
var StyledCountBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  text-align: center;\n\n  > div {\n    padding: 0 1.5rem;\n    height: 2.5rem;\n    padding-bottom: 0.25rem;\n  }\n  > div + div {\n    border-left: 1px solid #ececec;\n  }\n\n  span:first-child {\n    color: #585858;\n    font-size: 24px;\n    letter-spacing: 0.2px;\n  }\n  span:last-child {\n    color: #9b9b9b;\n    font-size: 14px;\n    letter-spacing: 0.4px;\n  }\n\n  @media (min-width: ", "px) {\n    margin-bottom: 2rem;\n  }\n"], ["\n  text-align: center;\n\n  > div {\n    padding: 0 1.5rem;\n    height: 2.5rem;\n    padding-bottom: 0.25rem;\n  }\n  > div + div {\n    border-left: 1px solid #ececec;\n  }\n\n  span:first-child {\n    color: #585858;\n    font-size: 24px;\n    letter-spacing: 0.2px;\n  }\n  span:last-child {\n    color: #9b9b9b;\n    font-size: 14px;\n    letter-spacing: 0.4px;\n  }\n\n  @media (min-width: ", "px) {\n    margin-bottom: 2rem;\n  }\n"])), BREAK_POINT);
var StyledCountDownBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-top: 15px;\n  span {\n    font-size: 14px;\n  }\n"], ["\n  margin-top: 15px;\n  span {\n    font-size: 14px;\n  }\n"])));
var ProgramInfoBlock = function (_a) {
    var _b;
    var program = _a.program;
    var formatMessage = useIntl().formatMessage;
    var currentMemberId = useAuth().currentMemberId;
    var instructorId = program.roles.filter(function (role) { return role.name === 'instructor'; }).map(function (role) { return role.memberId; })[0] || '';
    var member = usePublicMember(instructorId).member;
    var enrolledProgramIds = useEnrolledProgramIds(currentMemberId || '').enrolledProgramIds;
    var isEnrolled = enrolledProgramIds.includes(program.id);
    var isOnSale = (((_b = program.soldAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0) > Date.now();
    return (React.createElement(React.Fragment, null,
        React.createElement(Responsive.Default, null,
            React.createElement(ProgramInforCard, null,
                React.createElement(ProgramContentCountBlock, { program: program }))),
        React.createElement(Responsive.Desktop, null,
            React.createElement(Affix, { offsetTop: 40, target: function () { return document.getElementById('layout-content'); } },
                React.createElement(ProgramInforCard, null,
                    member && (React.createElement(React.Fragment, null,
                        React.createElement(Link, { to: "/creators/" + member.id + "?tabkey=introduction" },
                            React.createElement(AvatarImage, { src: member.pictureUrl || '', size: 96, className: "my-3 mx-auto" })),
                        React.createElement(Link, { to: "/creators/" + member.id + "?tabkey=introduction" },
                            React.createElement(StyledInstructorName, null, member.name)))),
                    React.createElement(ProgramContentCountBlock, { program: program }),
                    React.createElement("div", { className: "text-center mb-3" },
                        React.createElement(PriceLabel, { variant: "inline", listPrice: program.listPrice || 0, salePrice: isOnSale ? program.salePrice || 0 : undefined }),
                        program.isCountdownTimerVisible && (program === null || program === void 0 ? void 0 : program.soldAt) && isOnSale && (React.createElement(StyledCountDownBlock, null,
                            React.createElement(CountDownTimeBlock, { expiredAt: program.soldAt, icon: true })))),
                    isEnrolled ? (React.createElement(Link, { to: "/programs/" + program.id + "/contents" },
                        React.createElement(Button, { block: true }, formatMessage(commonMessages.button.enter)))) : (React.createElement(ProgramPaymentButton, { program: program, variant: "multiline" })))))));
};
var ProgramContentCountBlock = function (_a) {
    var _b;
    var program = _a.program;
    var formatMessage = useIntl().formatMessage;
    var numProgramContents = sum(program.contentSections.map(function (programContentSection) { return programContentSection.contents.length; }));
    var totalDuration = sum(((_b = program.contentSections) === null || _b === void 0 ? void 0 : _b.map(function (programContentSection) {
        return sum(programContentSection.contents.map(function (programContent) { return programContent.duration || 0; }) || []);
    })) || []);
    return (React.createElement(StyledCountBlock, { className: "d-flex align-items-center justify-content-center" },
        React.createElement("div", { className: "d-flex flex-column justify-content-center" },
            React.createElement("span", null, Math.floor(totalDuration / 60)),
            React.createElement("span", null, formatMessage(commonMessages.unit.min))),
        React.createElement("div", { className: "d-flex flex-column justify-content-center" },
            React.createElement("span", null, program.contentSections.filter(function (programContentSection) { return programContentSection.contents.length; }).length),
            React.createElement("span", null, formatMessage(commonMessages.unit.chapter))),
        React.createElement("div", { className: "d-flex flex-column justify-content-center" },
            React.createElement("span", null, numProgramContents),
            React.createElement("span", null, formatMessage(commonMessages.unit.content)))));
};
export default ProgramInfoBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=ProgramInfoBlock.js.map