var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled, { css } from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import Responsive, { BREAK_POINT } from '../common/Responsive';
import ProjectPlanCollection from './ProjectPlanCollection';
var StyledIntroductionContent = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  img {\n    width: 100%;\n  }\n"], ["\n  img {\n    width: 100%;\n  }\n"])));
var TabPaneContent = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n\n  ", "\n"], ["\n  position: relative;\n\n  ",
    "\n"])), function (props) {
    return props.collapsed
        ? css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n          @media (max-width: ", "px) {\n            position: relative;\n            overflow: hidden;\n            max-height: 100vh;\n\n            &::before {\n              content: ' ';\n              display: block;\n              position: absolute;\n              bottom: 0;\n              width: 100%;\n              height: 200px;\n              background: linear-gradient(to bottom, transparent, white);\n            }\n          }\n        "], ["\n          @media (max-width: ", "px) {\n            position: relative;\n            overflow: hidden;\n            max-height: 100vh;\n\n            &::before {\n              content: ' ';\n              display: block;\n              position: absolute;\n              bottom: 0;\n              width: 100%;\n              height: 200px;\n              background: linear-gradient(to bottom, transparent, white);\n            }\n          }\n        "])), BREAK_POINT - 1) : '';
});
var StyledExpandButton = styled(Button)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  top: 100vh;\n  font-weight: 600;\n  width: calc(100% - 30px);\n  color: black;\n  transform: translateY(-100%);\n"], ["\n  position: absolute;\n  top: 100vh;\n  font-weight: 600;\n  width: calc(100% - 30px);\n  color: black;\n  transform: translateY(-100%);\n"])));
var FundingIntroductionPane = function (_a) {
    var introduction = _a.introduction, projectPlans = _a.projectPlans;
    var _b = useState(false), collapsed = _b[0], setCollapsed = _b[1];
    var formatMessage = useIntl().formatMessage;
    return (React.createElement("div", { className: "container" },
        React.createElement("div", { className: "row" },
            React.createElement(TabPaneContent, { className: "col-12 col-lg-8 mb-5", collapsed: collapsed },
                React.createElement(StyledIntroductionContent, { dangerouslySetInnerHTML: { __html: introduction } }),
                collapsed && (React.createElement(Responsive.Default, null,
                    React.createElement(StyledExpandButton, { onClick: function () { return setCollapsed(false); } }, formatMessage(commonMessages.button.expand))))),
            React.createElement("div", { className: "col-12 col-lg-4 mb-5" },
                React.createElement(ProjectPlanCollection, { projectPlans: projectPlans })))));
};
export default FundingIntroductionPane;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=FundingIntroductionPane.js.map