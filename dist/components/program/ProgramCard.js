var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { durationFormatter } from '../../helpers';
import { productMessages } from '../../helpers/translation';
import EmptyCover from '../../images/empty-cover.png';
import { CustomRatioImage } from '../common/Image';
import MemberAvatar from '../common/MemberAvatar';
import PriceLabel from '../common/PriceLabel';
var InstructorPlaceHolder = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 2rem;\n"], ["\n  height: 2rem;\n"])));
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  overflow: hidden;\n  border-radius: 4px;\n  background-color: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"], ["\n  overflow: hidden;\n  border-radius: 4px;\n  background-color: white;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n"])));
var StyledContentBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: 1.25rem;\n"], ["\n  padding: 1.25rem;\n"])));
var StyledTitle = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: ", ";\n  height: 3em;\n  color: var(--gray-darker);\n  font-size: ", ";\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: ", ";\n  height: 3em;\n  color: var(--gray-darker);\n  font-size: ", ";\n  font-weight: bold;\n  letter-spacing: 0.8px;\n"])), function (props) { return (props.variant === 'brief' ? '0.5rem' : '1.25rem'); }, function (props) { return (props.variant === 'brief' ? '16px' : '18px'); });
var StyledDescription = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: 12px;\n  height: ", ";\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"], ["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  margin-bottom: 12px;\n  height: ", ";\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n"])), function (props) { return (props.variant === 'brief' ? '' : '3em'); });
var StyledMetaBlock = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  line-height: 1;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  line-height: 1;\n"])));
var ProgramCard = function (_a) {
    var _b, _c;
    var program = _a.program, variant = _a.variant, programType = _a.programType, isEnrolled = _a.isEnrolled, noInstructor = _a.noInstructor, noPrice = _a.noPrice, noTotalDuration = _a.noTotalDuration, withMeta = _a.withMeta, renderCustomDescription = _a.renderCustomDescription;
    var formatMessage = useIntl().formatMessage;
    var instructorId = program.roles.length > 0 && program.roles[0].memberId;
    var listPrice = program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0;
    var salePrice = program.isSubscription && program.plans.length > 0 && (((_b = program.plans[0].soldAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0) > Date.now()
        ? program.plans[0].salePrice
        : (((_c = program.soldAt) === null || _c === void 0 ? void 0 : _c.getTime()) || 0) > Date.now()
            ? program.salePrice
            : undefined;
    var periodType = program.isSubscription && program.plans.length > 0 ? program.plans[0].periodType : null;
    return (React.createElement(React.Fragment, null,
        !noInstructor && instructorId && (React.createElement(InstructorPlaceHolder, { className: "mb-3" },
            React.createElement(Link, { to: "/creators/" + instructorId + "?tabkey=introduction" },
                React.createElement(MemberAvatar, { memberId: instructorId, withName: true })))),
        React.createElement(Link, { to: isEnrolled
                ? "/programs/" + program.id + "/contents"
                : "/programs/" + program.id + (programType ? "?type=" + programType : '') },
            React.createElement(StyledWrapper, null,
                React.createElement(CustomRatioImage, { width: "100%", ratio: 9 / 16, src: program.coverUrl ? program.coverUrl : EmptyCover }),
                React.createElement(StyledContentBlock, null,
                    React.createElement(StyledTitle, { variant: variant }, program.title),
                    renderCustomDescription && renderCustomDescription(),
                    React.createElement(StyledDescription, { variant: variant }, program.abstract),
                    withMeta && (React.createElement(StyledMetaBlock, { className: "d-flex flex-row-reverse justify-content-between align-items-center" },
                        !noPrice && (React.createElement("div", null, program.isSubscription && program.plans.length === 0 ? (React.createElement("span", null, formatMessage(productMessages.program.content.notForSale))) : (React.createElement(PriceLabel, { variant: "inline", listPrice: listPrice, salePrice: salePrice, periodType: periodType || undefined })))),
                        !program.isSubscription && !noTotalDuration && !!program.totalDuration && (React.createElement("div", null, durationFormatter(program.totalDuration))))))))));
};
export default ProgramCard;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ProgramCard.js.map