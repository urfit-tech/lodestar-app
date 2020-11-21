var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Layout, Tag } from 'antd';
import { extname } from 'path';
import styled, { css } from 'styled-components';
import { BREAK_POINT } from '../../components/common/Responsive';
import { desktopViewMixin } from '../../helpers';
export var StyledLayout = styled(Layout)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n"], ["\n  ", "\n"])), function (props) { return (props.variant === 'white' ? 'background: white;' : ''); });
export var StyledLayoutHeader = styled(Layout.Header)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  border-bottom: 1px solid #ececec;\n  overflow: hidden;\n\n  &.hidden {\n    height: 0;\n    border: 0;\n  }\n"], ["\n  border-bottom: 1px solid #ececec;\n  overflow: hidden;\n\n  &.hidden {\n    height: 0;\n    border: 0;\n  }\n"])));
export var LogoBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  height: 36px;\n  line-height: 36px;\n\n  a {\n    display: inline-block;\n  }\n"], ["\n  height: 36px;\n  line-height: 36px;\n\n  a {\n    display: inline-block;\n  }\n"])));
export var SearchBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  max-width: 12rem;\n"], ["\n  max-width: 12rem;\n"])));
export var StyledLogo = styled.img(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  width: auto;\n  max-width: 100%;\n  ", "\n  max-height: 36px;\n"], ["\n  width: auto;\n  max-width: 100%;\n  ", "\n  max-height: 36px;\n"])), function (props) { return (props.src && extname(props.src) === '.svg' ? 'height: 100vh;' : ''); });
export var StyledNavTag = styled(Tag)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 0 0.25rem;\n  border-radius: 9px;\n"], ["\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 0 0.25rem;\n  border-radius: 9px;\n"])));
export var StyledNavLinkButton = styled(Button)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  && {\n    position: relative;\n    height: 3.5rem;\n    color: #585858;\n    line-height: 1.5;\n\n    > ", " {\n      position: absolute;\n      line-height: 1rem;\n    }\n  }\n"], ["\n  && {\n    position: relative;\n    height: 3.5rem;\n    color: #585858;\n    line-height: 1.5;\n\n    > ", " {\n      position: absolute;\n      line-height: 1rem;\n    }\n  }\n"])), StyledNavTag);
export var StyledLayoutContent = styled(Layout.Content)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: relative;\n  height: calc(100vh - 4rem);\n  overflow-y: auto;\n\n  &.full-height {\n    padding-top: 4rem;\n    height: 100vh;\n  }\n"], ["\n  position: relative;\n  height: calc(100vh - 4rem);\n  overflow-y: auto;\n\n  &.full-height {\n    padding-top: 4rem;\n    height: 100vh;\n  }\n"])));
export var LayoutContentWrapper = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  min-height: calc(100vh - 4rem - ", "px);\n\n  ", "\n"], ["\n  min-height: calc(100vh - 4rem - ", "px);\n\n  ",
    "\n"])), function (props) { return props.footerHeight; }, function (props) {
    return props.centeredBox
        ? css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        "], ["\n          display: flex;\n          align-items: center;\n          justify-content: center;\n        "]))) : '';
});
export var CenteredBox = styled.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  margin: 1rem;\n  width: 100%;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  ", "\n"], ["\n  margin: 1rem;\n  width: 100%;\n  background: white;\n  border-radius: 4px;\n  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n      width: calc(100% / 3);\n    "], ["\n      width: calc(100% / 3);\n    "])))));
export var StyledContainer = styled.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  display: flex;\n  justify-content: center;\n  padding: 4rem 1rem;\n  color: #585858;\n\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 4rem;\n  }\n"], ["\n  display: flex;\n  justify-content: center;\n  padding: 4rem 1rem;\n  color: #585858;\n\n  .ant-form-explain {\n    font-size: 14px;\n  }\n\n  @media (min-width: ", "px) {\n    padding: 4rem;\n  }\n"])), BREAK_POINT);
export var EmptyBlock = styled.div(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  height: ", ";\n"], ["\n  height: ", ";\n"])), function (props) { return props.height; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
//# sourceMappingURL=DefaultLayout.styled.js.map