var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Icon as AntdIcon } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import ReactPlayer from 'react-player';
import styled, { css } from 'styled-components';
import { useApp } from '../../containers/common/AppContext';
import { desktopViewMixin } from '../../helpers';
import ArrowUpCircleIcon from '../../images/arrow-up-circle.svg';
import EmptyCover from '../../images/empty-cover.png';
import ShopOIcon from '../../images/shop-o.svg';
import MerchandiseModal from './MerchandiseModal';
var messages = defineMessages({
    checkMerchandises: { id: 'common.ui.checkMerchandises', defaultMessage: '查看商品' },
});
var StyledPictureCover = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 26rem;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"], ["\n  height: 26rem;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n"])), function (props) { return props.pictureUrl; });
var StyledVideoCover = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  background: black;\n\n  ", "\n"], ["\n  background: black;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    padding: 2.5rem 0;\n  "], ["\n    padding: 2.5rem 0;\n  "])))));
var StyledVideoBlock = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (props) {
    return props.variant === 'mini-player'
        ? css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          z-index: 1;\n          position: fixed;\n          right: 1.5rem;\n          bottom: 1.5rem;\n          padding: 1rem 1rem;\n          width: 20rem;\n          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);\n          background: white;\n          animation-duration: 0.5s;\n        "], ["\n          z-index: 1;\n          position: fixed;\n          right: 1.5rem;\n          bottom: 1.5rem;\n          padding: 1rem 1rem;\n          width: 20rem;\n          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);\n          background: white;\n          animation-duration: 0.5s;\n        "]))) : '';
});
var StyledVideoWrapper = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: relative;\n  padding-top: 56.25%;\n"], ["\n  position: relative;\n  padding-top: 56.25%;\n"])));
var StyledHeader = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  margin-bottom: 0.75rem;\n\n  > i {\n    margin-left: 0.75rem;\n  }\n"], ["\n  margin-bottom: 0.75rem;\n\n  > i {\n    margin-left: 0.75rem;\n  }\n"])));
var StyledTitle = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  font-size: 14px;\n  font-weight: bold;\n  letter-spacing: 0.4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  color: var(--gray-darker);\n  font-size: 14px;\n  font-weight: bold;\n  letter-spacing: 0.4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])));
var StyledButton = styled(Button)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  width: 100%;\n\n  ", "\n"], ["\n  width: 100%;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    margin: 0 auto;\n    padding: 0 3.5rem;\n    width: auto;\n  "], ["\n    margin: 0 auto;\n    padding: 0 3.5rem;\n    width: auto;\n  "])))));
var StyledOverlayBlock = styled.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  z-index: 1;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: ", ";\n  overflow: hidden;\n  animation-duration: 0.5s;\n"], ["\n  z-index: 1;\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: ", ";\n  overflow: hidden;\n  animation-duration: 0.5s;\n"])), function (props) { return (props.width ? props.width + "px" : '100%'); });
var StyledOverlay = styled.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  padding: 0.75rem 1rem;\n  background: white;\n  border-bottom-left-radius: 12px;\n  border-bottom-right-radius: 12px;\n  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.3);\n"], ["\n  padding: 0.75rem 1rem;\n  background: white;\n  border-bottom-left-radius: 12px;\n  border-bottom-right-radius: 12px;\n  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.3);\n"])));
var PostCover = function (_a) {
    var title = _a.title, coverUrl = _a.coverUrl, type = _a.type, merchandises = _a.merchandises, isScrollingDown = _a.isScrollingDown;
    var formatMessage = useIntl().formatMessage;
    var enabledModules = useApp().enabledModules;
    var coverRef = useRef(null);
    var _b = useState(false), isClosed = _b[0], setIsClosed = _b[1];
    var _c = useState(null), coverHeight = _c[0], setCoverHeight = _c[1];
    var layoutContentElem = document.querySelector('#layout-content');
    var backToTop = useCallback(function () {
        layoutContentElem === null || layoutContentElem === void 0 ? void 0 : layoutContentElem.scroll({ top: 0, behavior: 'smooth' });
    }, [layoutContentElem]);
    useEffect(function () {
        var _a;
        setCoverHeight(((_a = coverRef.current) === null || _a === void 0 ? void 0 : _a.scrollHeight) || null);
    }, []);
    var merchandiseModal = merchandises.length ? (React.createElement(MerchandiseModal, { renderTrigger: function (_a) {
            var setVisible = _a.setVisible;
            return isScrollingDown ? (React.createElement(StyledOverlayBlock, { className: "animated fadeInDown pb-4", width: layoutContentElem === null || layoutContentElem === void 0 ? void 0 : layoutContentElem.scrollWidth },
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-12 col-lg-9" },
                            React.createElement(StyledOverlay, { className: "d-flex align-items-center justify-content-between" },
                                React.createElement(StyledTitle, null, title),
                                enabledModules.merchandise && merchandises.length > 0 && (React.createElement(Button, { type: "link", size: "small", onClick: setVisible },
                                    React.createElement(Icon, { src: ShopOIcon }),
                                    formatMessage(messages.checkMerchandises))))))))) : enabledModules.merchandise && merchandises.length > 0 && type === 'video' ? (React.createElement("div", { className: "container p-3 p-lg-0 pt-lg-4 text-center" },
                React.createElement(StyledButton, { type: "primary", onClick: setVisible },
                    React.createElement(Icon, { src: ShopOIcon }),
                    formatMessage(messages.checkMerchandises)))) : null;
        }, merchandises: merchandises })) : null;
    if (type === 'picture') {
        return (React.createElement(StyledPictureCover, { id: "post-cover", pictureUrl: coverUrl || EmptyCover }, merchandiseModal));
    }
    return (React.createElement(StyledVideoCover, { ref: coverRef, id: "post-cover", style: { height: coverHeight ? coverHeight + "px" : '' } },
        React.createElement("div", { className: "container" },
            React.createElement(StyledVideoBlock, { className: "" + (!isClosed && isScrollingDown ? 'animated fadeInUp' : ''), variant: !isClosed && isScrollingDown ? 'mini-player' : undefined },
                React.createElement(StyledHeader, { className: "" + (isScrollingDown ? 'd-flex' : 'd-none') },
                    React.createElement(StyledTitle, { className: "flex-grow-1" }, title),
                    React.createElement(Icon, { src: ArrowUpCircleIcon, className: "cursor-pointer", onClick: function () { return backToTop(); } }),
                    React.createElement(AntdIcon, { type: "close", className: "cursor-pointer", onClick: function () { return setIsClosed(true); } })),
                React.createElement(StyledVideoWrapper, null,
                    React.createElement(ReactPlayer, { url: coverUrl || undefined, width: "100%", height: "100%", style: {
                            position: 'absolute',
                            top: '0',
                            left: '0',
                        }, controls: true })))),
        merchandiseModal));
};
export default PostCover;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
//# sourceMappingURL=PostCover.js.map