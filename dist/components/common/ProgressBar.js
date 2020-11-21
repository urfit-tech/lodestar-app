var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
var StyledBar = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border-radius: 5px;\n  width: 100%;\n  height: 8px;\n  background-color: var(--gray-light);\n  overflow: hidden;\n"], ["\n  border-radius: 5px;\n  width: 100%;\n  height: 8px;\n  background-color: var(--gray-light);\n  overflow: hidden;\n"])));
var StyledProgress = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: ", "%;\n  height: 100%;\n  background-color: ", ";\n"], ["\n  width: ", "%;\n  height: 100%;\n  background-color: ", ";\n"])), function (props) { return props.percent; }, function (props) { return props.theme['@primary-color']; });
var StyledPercent = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  width: 40px;\n  font-size: 14px;\n  line-height: 1;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-darker);\n  width: 40px;\n  font-size: 14px;\n  line-height: 1;\n  letter-spacing: 0.4px;\n"])));
var ProgressBar = function (_a) {
    var percent = _a.percent, noPercent = _a.noPercent, className = _a.className;
    return (React.createElement("div", { className: "d-flex align-items-center justify-content-between " + className },
        React.createElement(StyledBar, { className: "progress-bar" },
            React.createElement(StyledProgress, { percent: percent })),
        !noPercent && React.createElement(StyledPercent, { className: "ml-2" },
            percent,
            "%")));
};
export default ProgressBar;
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=ProgressBar.js.map