var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { CircularProgress } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import ReactPlayer from 'react-player';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import styled from 'styled-components';
import { commonMessages, productMessages } from '../../helpers/translation';
import IconNext from '../../images/icon-next.svg';
import { useAuth } from '../auth/AuthContext';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var StyledCover = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  z-index: 1;\n  position: absolute;\n  background: black;\n  width: 100%;\n  height: 100%;\n"], ["\n  z-index: 1;\n  position: absolute;\n  background: black;\n  width: 100%;\n  height: 100%;\n"])));
var StyledCoverWrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  text-align: center;\n"], ["\n  text-align: center;\n"])));
var StyledCoverTitle = styled.h2(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n  color: #ffffff;\n"], ["\n  font-size: 18px;\n  font-weight: bold;\n  letter-spacing: 0.8px;\n  color: #ffffff;\n"])));
var StyledCoverSubtitle = styled.h3(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"], ["\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n  color: var(--gray-dark);\n"])));
var StyledIconWrapper = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  position: relative;\n  user-select: none;\n  cursor: pointer;\n"], ["\n  position: relative;\n  user-select: none;\n  cursor: pointer;\n"])));
var StyledIcon = styled(ReactSVG)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 36px;\n  color: white;\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 36px;\n  color: white;\n"])));
var StyledCancelButton = styled.span(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  width: 30px;\n  height: 20px;\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.8px;\n  color: #ffffff;\n  user-select: none;\n  cursor: pointer;\n"], ["\n  width: 30px;\n  height: 20px;\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.8px;\n  color: #ffffff;\n  user-select: none;\n  cursor: pointer;\n"])));
var message = defineMessages({
    next: { id: 'program.text.next', defaultMessage: '接下來' },
});
var ProgramContentPlayer = function (_a) {
    var programContentBody = _a.programContentBody, nextProgramContent = _a.nextProgramContent, _b = _a.lastProgress, lastProgress = _b === void 0 ? 0 : _b, onProgress = _a.onProgress, onEnded = _a.onEnded;
    var formatMessage = useIntl().formatMessage;
    var currentMember = useAuth().currentMember;
    var _c = useState(null), player = _c[0], setPlayer = _c[1];
    var _d = useState(false), isCoverShowing = _d[0], setIsCoverShowing = _d[1];
    return (React.createElement(StyledContainer, null,
        nextProgramContent && isCoverShowing && (React.createElement(ProgramContentPlayerCover, { nextProgramContent: nextProgramContent, onSetIsCoverShowing: setIsCoverShowing })),
        React.createElement(ReactPlayer, { url: "https://vimeo.com/" + programContentBody.data.vimeoVideoId, width: "100%", height: "100%", playing: true, progressInterval: 3000, controls: true, config: {
                vimeo: {
                    playerOptions: { responsive: true },
                },
            }, onReady: function (player) { return setPlayer(player); }, onDuration: function (duration) { return player === null || player === void 0 ? void 0 : player.seekTo(duration * (lastProgress === 1 ? 0 : lastProgress), 'seconds'); }, onProgress: onProgress, onEnded: function () {
                setIsCoverShowing(true);
                onEnded === null || onEnded === void 0 ? void 0 : onEnded();
            } }),
        currentMember && (React.createElement("div", { className: "p-1 p-sm-2", style: {
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'rgba(255, 255, 255, 0.6)',
            } }, formatMessage(productMessages.program.content.provide) + " " + currentMember.name + "-" + currentMember.email + " " + formatMessage(productMessages.program.content.watch)))));
};
var ProgramContentPlayerCover = function (_a) {
    var nextProgramContent = _a.nextProgramContent, onSetIsCoverShowing = _a.onSetIsCoverShowing;
    var history = useHistory();
    var _b = useRouteMatch(), currentContentId = _b.params.programContentId, url = _b.url;
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledCover, { className: "d-flex align-items-center justify-content-center" },
        React.createElement(StyledCoverWrapper, null,
            React.createElement(StyledCoverSubtitle, { className: "mb-2" }, formatMessage(message.next)),
            React.createElement(StyledCoverTitle, { className: "mb-4" }, nextProgramContent.title),
            React.createElement(CountDownPlayButton, { onPlayNext: function () {
                    onSetIsCoverShowing === null || onSetIsCoverShowing === void 0 ? void 0 : onSetIsCoverShowing(false);
                    history.push(url.replace(currentContentId, nextProgramContent.id));
                } }),
            React.createElement(StyledCancelButton, { onClick: function () { return onSetIsCoverShowing === null || onSetIsCoverShowing === void 0 ? void 0 : onSetIsCoverShowing(false); } }, formatMessage(commonMessages.button.cancel)))));
};
var CountDownPlayButton = function (_a) {
    var _b = _a.duration, duration = _b === void 0 ? 5 : _b, onPlayNext = _a.onPlayNext;
    var _c = useState(0), progress = _c[0], setProgress = _c[1];
    useEffect(function () {
        var counter = setTimeout(function () {
            setProgress(function (progress) { return progress + 5; });
        }, (duration * 1000) / 20);
        return function () { return clearTimeout(counter); };
    }, [duration, progress]);
    if (progress > 100) {
        onPlayNext === null || onPlayNext === void 0 ? void 0 : onPlayNext();
    }
    return (React.createElement(StyledIconWrapper, { onClick: function () { return onPlayNext === null || onPlayNext === void 0 ? void 0 : onPlayNext(); } },
        React.createElement(CircularProgress, { trackColor: "var(--gray-darker)", color: "white", thickness: "6px", value: progress, size: "72px" }),
        React.createElement(StyledIcon, { src: IconNext, className: "mb-4" })));
};
export default ProgramContentPlayer;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=ProgramContentPlayer.js.map