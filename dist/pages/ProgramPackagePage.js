var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Button } from 'antd';
import React, { createRef, useEffect } from 'react';
import ReactGA from 'react-ga';
import { defineMessages, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import ProgramCollection from '../components/package/ProgramCollection';
import ProgramPackageBanner from '../components/package/ProgramPackageBanner';
import ProgramPackagePlanCard from '../components/package/ProgramPackagePlanCard';
import { ProgramDisplayedCard } from '../components/program/ProgramDisplayedCard';
import { ProgramDisplayedListItem } from '../components/program/ProgramDisplayedListItem';
import { desktopViewMixin } from '../helpers';
import { commonMessages } from '../helpers/translation';
import { useEnrolledProgramPackagePlanIds, useProgramPackageIntroduction } from '../hooks/programPackage';
import NotFoundPage from './NotFoundPage';
var StyledTitle = styled.h2(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  color: var(--gray-darker);\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledFixedBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  z-index: 100;\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 0.5rem 0.75rem;\n  background: white;\n\n  ", "\n"], ["\n  z-index: 100;\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 0.5rem 0.75rem;\n  background: white;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    display: none;\n  "], ["\n    display: none;\n  "])))));
var messages = defineMessages({
    introduction: { id: 'programPackage.label.introduction', defaultMessage: '介紹' },
    includedItems: { id: 'programPackage.label.includedItems', defaultMessage: '包含項目' },
    checkPlans: { id: 'programPackage.ui.checkPlans', defaultMessage: '查看購買方案' },
});
var ProgramPackagePage = function () {
    var formatMessage = useIntl().formatMessage;
    var programPackageId = useParams().programPackageId;
    var currentMemberId = useAuth().currentMemberId;
    var _a = useProgramPackageIntroduction(programPackageId), loadingProgramPackage = _a.loadingProgramPackage, errorProgramPackage = _a.errorProgramPackage, programPackageIntroduction = _a.programPackageIntroduction;
    var _b = useEnrolledProgramPackagePlanIds(currentMemberId || ''), loadingProgramPackageIds = _b.loadingProgramPackageIds, enrolledProgramPackagePlanIds = _b.enrolledProgramPackagePlanIds;
    var planBlockRef = createRef();
    useEffect(function () {
        if (programPackageIntroduction) {
            programPackageIntroduction.programPackagePlans.forEach(function (programPackagePlan, index) {
                ReactGA.plugin.execute('ec', 'addProduct', {
                    id: programPackagePlan.id,
                    name: programPackagePlan.title,
                    category: 'ProgramPackage',
                    price: "" + programPackagePlan.listPrice,
                    quantity: '1',
                    currency: 'TWD',
                });
                ReactGA.plugin.execute('ec', 'addImpression', {
                    id: programPackagePlan.id,
                    name: programPackagePlan.title,
                    category: 'ProgramPackage',
                    price: "" + programPackagePlan.listPrice,
                    position: index + 1,
                });
            });
            ReactGA.plugin.execute('ec', 'setAction', 'detail');
            ReactGA.ga('send', 'pageview');
        }
    }, [programPackageIntroduction]);
    if (!loadingProgramPackage && !programPackageIntroduction.id) {
        return React.createElement(NotFoundPage, null);
    }
    if (errorProgramPackage) {
        return React.createElement(React.Fragment, null, formatMessage(commonMessages.status.readingError));
    }
    return (React.createElement(DefaultLayout, { white: true, footerBottomSpace: "4rem" },
        React.createElement(ProgramPackageBanner, { title: programPackageIntroduction.title, coverUrl: programPackageIntroduction.coverUrl, programPackageId: programPackageIntroduction.id }),
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "row" }, programPackageIntroduction.programPackagePlans.length > 0 ? (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "col-12 col-lg-8 pt-5" },
                    React.createElement(StyledTitle, { className: "mb-4" }, formatMessage(messages.introduction)),
                    React.createElement("div", { className: "mb-5" },
                        React.createElement(BraftContent, null, programPackageIntroduction.description)),
                    React.createElement(StyledTitle, { className: "mb-4" }, formatMessage(messages.includedItems)),
                    React.createElement(ProgramCollection, { programs: programPackageIntroduction.includedPrograms, renderItem: function (_a) {
                            var displayType = _a.displayType, program = _a.program;
                            return displayType === 'grid' ? (React.createElement("div", { className: "col-12 col-md-6 col-lg-6 mb-4" },
                                React.createElement(ProgramDisplayedCard, { key: program.id, program: program }))) : displayType === 'list' ? (React.createElement("div", { className: "col-12" },
                                React.createElement(ProgramDisplayedListItem, { key: program.id, program: program }))) : null;
                        } })),
                React.createElement("div", { ref: planBlockRef, className: "col-12 col-lg-4 pt-5" }, programPackageIntroduction.programPackagePlans.map(function (programPackagePlan) { return (React.createElement("div", { key: programPackagePlan.id, className: "mb-4" },
                    React.createElement(ProgramPackagePlanCard, __assign({ programPackageId: programPackageId }, programPackagePlan, { loading: loadingProgramPackageIds, isEnrolled: enrolledProgramPackagePlanIds.includes(programPackagePlan.id) })))); })))) : (React.createElement("div", { className: "col-12 col-lg-12 pt-5" },
                React.createElement(StyledTitle, { className: "mb-4" }, formatMessage(messages.introduction)),
                React.createElement("div", { className: "mb-5" },
                    React.createElement(BraftContent, null, programPackageIntroduction.description)),
                React.createElement(StyledTitle, { className: "mb-4" }, formatMessage(messages.includedItems)),
                React.createElement(ProgramCollection, { programs: programPackageIntroduction.includedPrograms, renderItem: function (_a) {
                        var displayType = _a.displayType, program = _a.program;
                        return displayType === 'grid' ? (React.createElement("div", { className: "col-12 col-md-6 col-lg-4" },
                            React.createElement(ProgramDisplayedCard, { key: program.id, program: program }))) : displayType === 'list' ? (React.createElement("div", { className: "col-12" },
                            React.createElement(ProgramDisplayedListItem, { key: program.id, program: program }))) : null;
                    } }))))),
        React.createElement(StyledFixedBlock, null,
            React.createElement(Button, { type: "primary", block: true, onClick: function () { var _a; return (_a = planBlockRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); } }, formatMessage(messages.checkPlans)))));
};
export default ProgramPackagePage;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ProgramPackagePage.js.map