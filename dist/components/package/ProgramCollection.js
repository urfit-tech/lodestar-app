var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Icon } from 'antd';
import { uniq } from 'ramda';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
var StyledCategoryButton = styled(Button)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  transition: background-color 0.2s ease-in-out;\n\n  &,\n  &:active,\n  &:hover,\n  &:focus {\n    background-color: ", ";\n    color: ", ";\n  }\n"], ["\n  transition: background-color 0.2s ease-in-out;\n\n  &,\n  &:active,\n  &:hover,\n  &:focus {\n    background-color: ", ";\n    color: ", ";\n  }\n"])), function (props) { return (props.selected ? props.theme['@primary-color'] : 'transparent'); }, function (props) { return (props.selected ? 'white' : props.theme['@primary-color']); });
var StyledSwitchButton = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  display: inline-block;\n  cursor: pointer;\n  transition: all 0.3s;\n\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  display: inline-block;\n  cursor: pointer;\n  transition: all 0.3s;\n\n  &:hover {\n    color: ", ";\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var ProgramCollection = function (_a) {
    var programs = _a.programs, renderItem = _a.renderItem, _b = _a.defaultDisplayType, defaultDisplayType = _b === void 0 ? 'grid' : _b, noDisplayTypeButton = _a.noDisplayTypeButton;
    var _c = useState(null), selectedCategory = _c[0], setSelectedCategory = _c[1];
    var _d = useState(defaultDisplayType), displayType = _d[0], setDisplayType = _d[1];
    var formatMessage = useIntl().formatMessage;
    var categories = uniq(programs.map(function (program) { return program.categories; }).flat());
    return (React.createElement("div", { className: "container p-4" },
        React.createElement("div", { className: "d-flex align-items-center justify-content-start flex-wrap mb-5" },
            React.createElement(StyledCategoryButton, { type: "link", shape: "round", className: "mr-2", onClick: function () { return setSelectedCategory(null); }, selected: !selectedCategory }, formatMessage(commonMessages.button.allCategory)),
            categories.map(function (category) { return (React.createElement(StyledCategoryButton, { key: category.id, type: "link", shape: "round", className: "mr-2", onClick: function () { return setSelectedCategory(category.id); }, selected: selectedCategory === category.id }, category.name)); })),
        !noDisplayTypeButton && (React.createElement(StyledSwitchButton, { className: "mb-3" },
            displayType === 'grid' && (React.createElement("div", { onClick: function () { return setDisplayType('list'); } },
                React.createElement(Icon, { type: "unordered-list", className: "mr-2" }),
                React.createElement("span", null, formatMessage(commonMessages.term.list)))),
            displayType === 'list' && (React.createElement("div", { onClick: function () { return setDisplayType('grid'); } },
                React.createElement(Icon, { type: "appstore", className: "mr-2" }),
                React.createElement("span", null, formatMessage(commonMessages.term.grid)))))),
        React.createElement("div", { className: "row mb-5" }, programs
            .filter(function (program) { return !selectedCategory || program.categories.map(function (category) { return category.id; }).includes(selectedCategory); })
            .map(function (program) { return renderItem && renderItem({ displayType: displayType, program: program }); }))));
};
export default ProgramCollection;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramCollection.js.map