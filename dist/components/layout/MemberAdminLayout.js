var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { useRouteKeys } from '../../hooks/util';
import { MemberAdminMenu } from '../common/AdminMenu';
import Responsive from '../common/Responsive';
import DefaultLayout from './DefaultLayout';
var StyledContent = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  min-width: 240px;\n  height: calc(100vh - 64px - ", "px);\n  overflow-y: auto;\n  overflow-x: hidden;\n  ", "\n"], ["\n  min-width: 240px;\n  height: calc(100vh - 64px - ", "px);\n  overflow-y: auto;\n  overflow-x: hidden;\n  ", "\n"])), function (props) { return props.footerHeight; }, function (props) { return (props.white ? 'background: white;' : ''); });
var MemberAdminLayout = function (_a) {
    var children = _a.children;
    var defaultSelectedKeys = useRouteKeys();
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(DefaultLayout, { noFooter: true, renderTitle: function () { return (React.createElement(Link, { to: "/settings" },
            React.createElement(Button, { type: "link" }, formatMessage(commonMessages.button.backstage)))); } },
        React.createElement("div", { className: "d-flex" },
            React.createElement(Responsive.Desktop, null,
                React.createElement(StyledContent, { className: "pl-5 py-5", footerHeight: 0 },
                    React.createElement(MemberAdminMenu, { defaultSelectedKeys: defaultSelectedKeys }))),
            React.createElement(StyledContent, { className: "flex-grow-1 p-3 p-sm-5", footerHeight: 0 }, children))));
};
export default MemberAdminLayout;
var templateObject_1;
//# sourceMappingURL=MemberAdminLayout.js.map