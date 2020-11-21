var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import BlurredBanner from '../common/BlurredBanner';
var StyledTitleBlock = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  padding: ", ";\n  color: white;\n"], ["\n  position: relative;\n  padding: ", ";\n  color: white;\n"])), function (props) { return (props.withChildren ? '4rem 0 2rem' : '10rem 1rem'); });
var StyledCategoryLabel = styled.span(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  letter-spacing: 0.8px;\n  font-size: 14px;\n\n  :not(:first-child) {\n    margin-left: 0.5rem;\n  }\n"], ["\n  letter-spacing: 0.8px;\n  font-size: 14px;\n\n  :not(:first-child) {\n    margin-left: 0.5rem;\n  }\n"])));
var StyledExtraBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  margin-bottom: -1px;\n  padding: 2px;\n  background: linear-gradient(to bottom, transparent 60%, white 60%);\n"], ["\n  position: relative;\n  margin-bottom: -1px;\n  padding: 2px;\n  background: linear-gradient(to bottom, transparent 60%, white 60%);\n"])));
var StyledTitle = styled.h1(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  color: white;\n  font-size: 40px;\n  font-weight: bold;\n  line-height: 1;\n  letter-spacing: 1px;\n"], ["\n  color: white;\n  font-size: 40px;\n  font-weight: bold;\n  line-height: 1;\n  letter-spacing: 1px;\n"])));
var StyledQRCode = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  display: inline-block;\n  padding: 2.5rem;\n  background: white;\n  line-height: normal;\n  box-shadow: 0 2px 21px 0 rgba(0, 0, 0, 0.15);\n"], ["\n  display: inline-block;\n  padding: 2.5rem;\n  background: white;\n  line-height: normal;\n  box-shadow: 0 2px 21px 0 rgba(0, 0, 0, 0.15);\n"])));
var ActivityBanner = function (_a) {
    var coverImage = _a.coverImage, activityCategories = _a.activityCategories, activityTitle = _a.activityTitle, children = _a.children;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(BlurredBanner, { coverUrl: coverImage },
        React.createElement(StyledTitleBlock, { withChildren: !!children, className: "text-center" },
            React.createElement("div", { className: "mb-4" }, activityCategories.map(function (activityCategory) { return (React.createElement(StyledCategoryLabel, { key: activityCategory.category.id },
                "#",
                activityCategory.category.name)); })),
            React.createElement(StyledTitle, { className: "m-0" }, activityTitle)),
        children && (React.createElement(StyledExtraBlock, { className: "text-center" },
            React.createElement(StyledQRCode, { className: "mb-4" }, children),
            React.createElement("div", null,
                React.createElement(Button, { type: "link", onClick: function () { return window.print(); } }, formatMessage(commonMessages.button.print)))))));
};
export default ActivityBanner;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=ActivityBanner.js.map