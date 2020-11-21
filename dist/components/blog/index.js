var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { defineMessages } from 'react-intl';
import styled, { css } from 'styled-components';
import { desktopViewMixin } from '../../helpers';
export var messages = defineMessages({
    latest: { id: 'blog.label.latest', defaultMessage: '最新' },
    popular: { id: 'blog.label.popular', defaultMessage: '熱門' },
    relative: { id: 'blog.label.relative', defaultMessage: '相關文章' },
});
export var StyledTitle = styled.h1(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 1rem;\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n  color: var(--gray-darker);\n"], ["\n  margin-bottom: 1rem;\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n  color: var(--gray-darker);\n"])));
export var StyledPostTitle = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: ", ";\n  margin-bottom: 0.75rem;\n  overflow: hidden;\n  width: 100%;\n  height: calc(", " * 1.5em);\n  color: var(--gray-darker);\n  font-size: 16px;\n  letter-spacing: 0.2px;\n\n  &.headline,\n  &.featuring {\n    color: white;\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.77px;\n  }\n  &.list-item {\n    -webkit-line-clamp: 2;\n    font-size: 16px;\n    font-weight: bold;\n  }\n\n  ", "\n"], ["\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: ", ";\n  margin-bottom: 0.75rem;\n  overflow: hidden;\n  width: 100%;\n  height: calc(", " * 1.5em);\n  color: var(--gray-darker);\n  font-size: 16px;\n  letter-spacing: 0.2px;\n\n  &.headline,\n  &.featuring {\n    color: white;\n    font-size: 20px;\n    font-weight: bold;\n    letter-spacing: 0.77px;\n  }\n  &.list-item {\n    -webkit-line-clamp: 2;\n    font-size: 16px;\n    font-weight: bold;\n  }\n\n  ",
    "\n"])), function (props) { return props.rows || 1; }, function (props) { return props.rows || 1; }, desktopViewMixin(css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    font-weight: bold;\n\n    &.headline {\n      font-size: 20px;\n      font-weight: bold;\n    }\n    &.featuring {\n      font-size: 16px;\n      font-weight: normal;\n    }\n    &.list-item {\n      -webkit-line-clamp: 1;\n      height: 1.5em;\n      font-size: 20px;\n    }\n  "], ["\n    font-weight: bold;\n\n    &.headline {\n      font-size: 20px;\n      font-weight: bold;\n    }\n    &.featuring {\n      font-size: 16px;\n      font-weight: normal;\n    }\n    &.list-item {\n      -webkit-line-clamp: 1;\n      height: 1.5em;\n      font-size: 20px;\n    }\n  "])))));
export var StyledPostMeta = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n\n  i,\n  span {\n    line-height: 20px;\n  }\n\n  ", "\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n  letter-spacing: 0.4px;\n\n  i,\n  span {\n    line-height: 20px;\n  }\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    > div {\n      display: inline;\n    }\n  "], ["\n    > div {\n      display: inline;\n    }\n  "])))));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=index.js.map