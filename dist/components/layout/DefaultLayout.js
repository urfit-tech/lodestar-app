import React, { useContext, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import AuthButton from '../../containers/common/AuthButton';
import NotificationContext from '../../contexts/NotificationContext';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { commonMessages } from '../../helpers/translation';
import { useNav } from '../../hooks/data';
import { useAuth } from '../auth/AuthContext';
import AuthModal, { AuthModalContext } from '../auth/AuthModal';
import CartDropdown from '../checkout/CartDropdown';
import Footer from '../common/Footer';
import GlobalSearchInput from '../common/GlobalSearchInput';
import MemberProfileButton from '../common/MemberProfileButton';
import Responsive from '../common/Responsive';
import NotificationDropdown from '../notification/NotificationDropdown';
import { CenteredBox, EmptyBlock, LayoutContentWrapper, LogoBlock, SearchBlock, StyledLayout, StyledLayoutContent, StyledLayoutHeader, StyledLogo, StyledNavLinkButton, StyledNavTag, } from './DefaultLayout.styled';
var DefaultLayout = function (_a) {
    var white = _a.white, noHeader = _a.noHeader, noFooter = _a.noFooter, noCart = _a.noCart, centeredBox = _a.centeredBox, footerBottomSpace = _a.footerBottomSpace, renderTitle = _a.renderTitle, children = _a.children;
    var formatMessage = useIntl().formatMessage;
    var theme = useContext(ThemeContext);
    var _b = useAuth(), currentMemberId = _b.currentMemberId, isAuthenticated = _b.isAuthenticated;
    var _c = useApp(), name = _c.name, settings = _c.settings, enabledModules = _c.enabledModules;
    var navs = useNav().navs;
    var refetchNotifications = useContext(NotificationContext).refetchNotifications;
    var playerVisible = useContext(PodcastPlayerContext).visible;
    var _d = useState(false), visible = _d[0], setVisible = _d[1];
    useEffect(function () {
        refetchNotifications && refetchNotifications();
    }, [refetchNotifications]);
    return (React.createElement(AuthModalContext.Provider, { value: { visible: visible, setVisible: setVisible } },
        visible && React.createElement(AuthModal, null),
        React.createElement(StyledLayout, { variant: white ? 'white' : undefined },
            React.createElement(StyledLayoutHeader, { className: "d-flex align-items-center justify-content-between " + (noHeader ? 'hidden' : '') },
                React.createElement("div", { className: "d-flex align-items-center" },
                    React.createElement(LogoBlock, { className: "mr-4" }, renderTitle ? (renderTitle()) : (React.createElement(Link, { to: "/" }, settings['logo'] ? React.createElement(StyledLogo, { src: settings['logo'], alt: "logo" }) : name))),
                    enabledModules.search && (React.createElement(Responsive.Desktop, null,
                        React.createElement(SearchBlock, null,
                            React.createElement(GlobalSearchInput, null))))),
                React.createElement("div", { className: "d-flex align-items-center" },
                    React.createElement(Responsive.Desktop, null,
                        navs
                            .filter(function (nav) { return nav.block === 'header'; })
                            .map(function (nav) {
                            return nav.external ? (React.createElement("a", { key: nav.label, href: nav.href, target: "_blank", rel: "noopener noreferrer" },
                                React.createElement(StyledNavLinkButton, { type: "link" }, nav.label))) : (React.createElement(Link, { key: nav.label, to: nav.href },
                                React.createElement(StyledNavLinkButton, { type: "link" },
                                    nav.label,
                                    nav.tag && React.createElement(StyledNavTag, { color: theme['@primary-color'] }, nav.tag))));
                        }),
                        isAuthenticated && (React.createElement(Link, { to: "/members/" + currentMemberId },
                            React.createElement(StyledNavLinkButton, { type: "link" }, formatMessage(commonMessages.button.myPage))))),
                    !noCart && React.createElement(CartDropdown, null),
                    currentMemberId && React.createElement(NotificationDropdown, null),
                    currentMemberId ? React.createElement(MemberProfileButton, { memberId: currentMemberId }) : React.createElement(AuthButton, null))),
            React.createElement(StyledLayoutContent, { id: "layout-content", className: "" + (noHeader ? 'full-height' : '') },
                React.createElement(LayoutContentWrapper, { footerHeight: noFooter ? 0 : settings['footer.type'] === 'multiline' ? 108 : 53, centeredBox: centeredBox }, centeredBox ? React.createElement(CenteredBox, null, children) : children),
                !noFooter && React.createElement(Footer, null),
                React.createElement(Responsive.Default, null, typeof footerBottomSpace === 'string' && React.createElement(EmptyBlock, { height: footerBottomSpace })),
                playerVisible && React.createElement(EmptyBlock, { height: "76px" })))));
};
export default DefaultLayout;
//# sourceMappingURL=DefaultLayout.js.map