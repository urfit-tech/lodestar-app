var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Icon, List, message, Popover } from 'antd';
import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { commonMessages } from '../../helpers/translation';
import { useNav } from '../../hooks/data';
import { useMember } from '../../hooks/member';
import { useAuth } from '../auth/AuthContext';
import { MemberAdminMenu } from './AdminMenu';
import GlobalSearchInput from './GlobalSearchInput';
import MemberAvatar from './MemberAvatar';
import Responsive from './Responsive';
export var Wrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding: 12px 0;\n  width: 100vw;\n  max-width: 320px;\n"], ["\n  padding: 12px 0;\n  width: 100vw;\n  max-width: 320px;\n"])));
export var StyledList = styled(List)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    padding: 0 12px;\n    max-height: 70vh;\n    overflow-y: auto;\n    overflow-x: hidden;\n\n    a {\n      color: rgba(0, 0, 0, 0.65);\n    }\n  }\n"], ["\n  && {\n    padding: 0 12px;\n    max-height: 70vh;\n    overflow-y: auto;\n    overflow-x: hidden;\n\n    a {\n      color: rgba(0, 0, 0, 0.65);\n    }\n  }\n"])));
var BlankIcon = styled.i(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n"], ["\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n"])));
var BorderedItem = styled(List.Item)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  border-bottom: 1px solid #e8e8e8;\n\n  &.shift-left {\n    margin-left: -24px;\n    margin-right: -12px;\n  }\n"], ["\n  border-bottom: 1px solid #e8e8e8;\n\n  &.shift-left {\n    margin-left: -24px;\n    margin-right: -12px;\n  }\n"])));
export var CustomNavLinks = function () {
    var navs = useNav().navs;
    return (React.createElement(React.Fragment, null, navs
        .filter(function (nav) { return nav.block === 'header'; })
        .map(function (nav, idx) {
        var ListItem = (React.createElement(List.Item, { key: idx, style: { cursor: 'pointer' } },
            nav.icon ? React.createElement(Icon, { type: nav.icon, className: "mr-2" }) : React.createElement(BlankIcon, { className: "mr-2" }),
            nav.label));
        return nav.external ? (React.createElement("a", { key: idx, href: nav.href, target: "_blank", rel: "noopener noreferrer" }, ListItem)) : (React.createElement(Link, { key: idx, to: nav.href }, ListItem));
    })));
};
var MemberProfileButton = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var closePlayer = useContext(PodcastPlayerContext).closePlayer;
    var _b = useAuth(), currentMemberId = _b.currentMemberId, logout = _b.logout;
    var enabledModules = useApp().enabledModules;
    var member = useMember(memberId).member;
    var content = (React.createElement(Wrapper, null,
        React.createElement(StyledList, { split: false },
            enabledModules.search && (React.createElement(Responsive.Default, null,
                React.createElement(GlobalSearchInput, null))),
            React.createElement(BorderedItem, { className: "justify-content-between" },
                React.createElement("div", null, member && member.name),
                React.createElement(Responsive.Default, null,
                    React.createElement(MemberAvatar, { memberId: currentMemberId || '', size: 36 }))),
            React.createElement(Responsive.Default, null,
                React.createElement(CustomNavLinks, null),
                React.createElement(BorderedItem, { onClick: function () { return history.push("/members/" + currentMemberId); }, style: { cursor: 'pointer' } },
                    React.createElement(BlankIcon, { className: "mr-2" }),
                    formatMessage(commonMessages.content.myPage))),
            React.createElement(BorderedItem, { className: "shift-left" },
                React.createElement(MemberAdminMenu, { style: { border: 'none' } })),
            React.createElement(List.Item, { className: "cursor-pointer", onClick: function () {
                    closePlayer && closePlayer();
                    logout && logout();
                    history.push('/');
                    message.success('已成功登出');
                } },
                React.createElement(Icon, { type: "logout", className: "mr-2" }),
                formatMessage(commonMessages.content.logout)))));
    return (React.createElement(Popover, { placement: "bottomRight", trigger: "click", content: content },
        React.createElement(Responsive.Default, null,
            React.createElement(Button, { type: "link", icon: "menu" })),
        React.createElement(Responsive.Desktop, null,
            React.createElement("div", { className: "cursor-pointer" },
                React.createElement(MemberAvatar, { memberId: currentMemberId || '', size: 36 })))));
};
export default MemberProfileButton;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=MemberProfileButton.js.map