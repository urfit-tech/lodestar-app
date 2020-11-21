var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Button, Divider, Icon as AntdIcon, Popover } from 'antd';
import isMobile from 'is-mobile';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useContext, useRef, useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import ReactPlayer from 'react-player';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { desktopViewMixin } from '../../helpers';
import Backward5Icon from '../../images/backward-5.svg';
import EllipsisIcon from '../../images/ellipsis.svg';
import Forward5Icon from '../../images/forward-5.svg';
import NextIcon from '../../images/icon-next.svg';
import PrevIcon from '../../images/icon-prev.svg';
import LoopIcon from '../../images/loop.svg';
import PlayRate05xIcon from '../../images/multiple-0-5.svg';
import PlayRate10xIcon from '../../images/multiple-1-0.svg';
import PlayRate15xIcon from '../../images/multiple-1-5.svg';
import PlayRate20xIcon from '../../images/multiple-2-0.svg';
import PauseCircleIcon from '../../images/pause-circle.svg';
import PlayCircleIcon from '../../images/play-circle.svg';
import PlaylistIcon from '../../images/playlist.svg';
import ShuffleIcon from '../../images/shuffle.svg';
import SingleLoopIcon from '../../images/single-loop.svg';
import TimesIcon from '../../images/times.svg';
import Responsive, { BREAK_POINT } from '../common/Responsive';
import PlaylistOverlay from './PlaylistOverlay';
var messages = defineMessages({
    playRate: { id: 'podcast.label.playRate', defaultMessage: '播放速度' },
    listLoop: { id: 'podcast.label.listLoop', defaultMessage: '列表循環' },
    singleLoop: { id: 'podcast.label.singleLoop', defaultMessage: '單曲循環' },
    random: { id: 'podcast.label.random', defaultMessage: '隨機播放' },
});
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1000;\n"], ["\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1000;\n"])));
var StyledSlider = styled(Slider)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  && {\n    z-index: 1003;\n    padding: 0;\n    width: 100%;\n    height: ", ";\n    border-radius: 0;\n  }\n  .rc-slider-rail {\n    border-radius: 0;\n    ", "\n  }\n  .rc-slider-track {\n    ", "\n    background: ", ";\n    border-radius: 0;\n  }\n  .rc-slider-step {\n    cursor: pointer;\n    ", "\n  }\n  .rc-slider-handle {\n    display: none;\n    width: 20px;\n    height: 20px;\n    margin-top: -9px;\n    cursor: pointer;\n  }\n"], ["\n  && {\n    z-index: 1003;\n    padding: 0;\n    width: 100%;\n    height: ", ";\n    border-radius: 0;\n  }\n  .rc-slider-rail {\n    border-radius: 0;\n    ", "\n  }\n  .rc-slider-track {\n    ", "\n    background: ", ";\n    border-radius: 0;\n  }\n  .rc-slider-step {\n    cursor: pointer;\n    ", "\n  }\n  .rc-slider-handle {\n    display: none;\n    width: 20px;\n    height: 20px;\n    margin-top: -9px;\n    cursor: pointer;\n  }\n"])), function (props) { return (props.height ? props.height + "px;" : '0.25em'); }, function (props) { return (props.height ? "height: " + props.height + "px;" : ''); }, function (props) { return (props.height ? "height: " + props.height + "px;" : ''); }, function (props) { return props.theme['@primary-color']; }, function (props) { return (props.height ? "height: " + props.height + "px;" : ''); });
var OverlayBlock = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: absolute;\n  top: 1rem;\n  z-index: 1001;\n  width: 100%;\n  transition: transform 0.2s ease-in-out;\n  transform: translateY(", ");\n"], ["\n  position: absolute;\n  top: 1rem;\n  z-index: 1001;\n  width: 100%;\n  transition: transform 0.2s ease-in-out;\n  transform: translateY(", ");\n"])), function (props) { return (props.active ? '-100%' : '0%'); });
var ActionBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 0.75rem 0;\n  background: white;\n  color: ", ";\n  font-size: 14px;\n  border-radius: 8px 8px 0 0;\n  overflow: hidden;\n  box-shadow: 0 -1px 6px 1px rgba(0, 0, 0, 0.1);\n"], ["\n  padding: 0.75rem 0;\n  background: white;\n  color: ", ";\n  font-size: 14px;\n  border-radius: 8px 8px 0 0;\n  overflow: hidden;\n  box-shadow: 0 -1px 6px 1px rgba(0, 0, 0, 0.1);\n"])), function (props) { return props.theme['@primary-color']; });
var BarBlock = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  position: relative;\n  bottom: 0;\n  z-index: 1002;\n  background: #323232;\n  color: white;\n"], ["\n  position: relative;\n  bottom: 0;\n  z-index: 1002;\n  background: #323232;\n  color: white;\n"])));
var StyledLink = styled(Link)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  overflow: hidden;\n"], ["\n  overflow: hidden;\n"])));
var StyledTitle = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  overflow: hidden;\n  color: white;\n  font-size: 14px;\n  line-height: 24px;\n  letter-spacing: 0.2px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  ", "\n"], ["\n  overflow: hidden;\n  color: white;\n  font-size: 14px;\n  line-height: 24px;\n  letter-spacing: 0.2px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  ",
    "\n"])), desktopViewMixin(css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    font-size: 16px;\n  "], ["\n    font-size: 16px;\n  "])))));
var StyledDuration = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 12px;\n  line-height: 24px;\n  letter-spacing: 0.6px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 12px;\n  line-height: 24px;\n  letter-spacing: 0.6px;\n"])));
var StyledButtonGroup = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  margin: 0 12px;\n\n  @media (min-width: ", "px) {\n    margin: 0 20px;\n  }\n"], ["\n  margin: 0 12px;\n\n  @media (min-width: ", "px) {\n    margin: 0 20px;\n  }\n"])), BREAK_POINT);
var StyledButton = styled(Button)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  && {\n    padding: 0;\n    height: ", ";\n    line-height: 24px;\n    color: white;\n  }\n  span {\n    line-height: 1.5;\n  }\n  div {\n    color: var(--gray-darker);\n  }\n  .anticon {\n    font-size: 24px;\n    color: ", ";\n  }\n  ", "\n"], ["\n  && {\n    padding: 0;\n    height: ", ";\n    line-height: 24px;\n    color: white;\n  }\n  span {\n    line-height: 1.5;\n  }\n  div {\n    color: var(--gray-darker);\n  }\n  .anticon {\n    font-size: 24px;\n    color: ", ";\n  }\n  ",
    "\n"])), function (props) { return (props.height ? props.height : props.variant === 'overlay' ? '52px' : '24px'); }, function (props) { return (props.variant === 'overlay' ? 'var(--gray-darker)' : 'white'); }, function (props) {
    return props.variant === 'bar'
        ? css(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n          &:hover .anticon {\n            color: #cdcdcd;\n          }\n        "], ["\n          &:hover .anticon {\n            color: #cdcdcd;\n          }\n        "]))) : '';
});
var StyledShiftButton = styled(StyledButton)(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  @media (max-width: 320px) {\n    display: none;\n  }\n"], ["\n  @media (max-width: 320px) {\n    display: none;\n  }\n"])));
var CloseBlock = styled.div(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  .anticon {\n    font-size: 16px;\n  }\n  ", "\n"], ["\n  .anticon {\n    font-size: 16px;\n  }\n  ",
    "\n"])), desktopViewMixin(css(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    .anticon {\n      font-size: 20px;\n    }\n  "], ["\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    .anticon {\n      font-size: 20px;\n    }\n  "])))));
var durationFormat = function (time) {
    return Math.floor(time / 60) + ":" + Math.floor(time % 60)
        .toString()
        .padStart(2, '0');
};
var PodcastPlayer = function (_a) {
    var memberId = _a.memberId;
    var _b = useContext(PodcastPlayerContext), playlist = _b.playlist, playlistMode = _b.playlistMode, isPlaying = _b.isPlaying, currentPlayingId = _b.currentPlayingId, currentPodcastProgram = _b.currentPodcastProgram, loadingPodcastProgram = _b.loadingPodcastProgram, maxDuration = _b.maxDuration, togglePlaylistMode = _b.togglePlaylistMode, shift = _b.shift, closePlayer = _b.closePlayer, setIsPlaying = _b.setIsPlaying, setMaxDuration = _b.setMaxDuration;
    var playerRef = useRef(null);
    var _c = useState(0), progress = _c[0], setProgress = _c[1];
    var _d = useState(false), isSeeking = _d[0], setIsSeeking = _d[1];
    var _e = useState(1), playRate = _e[0], setPlayRate = _e[1];
    var _f = useState(false), showAction = _f[0], setShowAction = _f[1];
    var _g = useState(false), isAudioLoading = _g[0], setIsAudioLoading = _g[1];
    var handlePlayRate = function () {
        playRate < 1 ? setPlayRate(1) : playRate < 1.5 ? setPlayRate(1.5) : playRate < 2 ? setPlayRate(2) : setPlayRate(0.5);
    };
    // initialize when changing podcast program
    if ((currentPodcastProgram === null || currentPodcastProgram === void 0 ? void 0 : currentPodcastProgram.id) !== currentPlayingId && maxDuration > 0 && setMaxDuration) {
        setMaxDuration(0);
        setProgress(0);
    }
    return (React.createElement(StyledWrapper, null,
        !loadingPodcastProgram && currentPodcastProgram && (React.createElement(ReactPlayer, { ref: playerRef, url: currentPodcastProgram.url, style: { display: 'none' }, playsinline: true, playing: isPlaying && currentPodcastProgram.id === currentPlayingId, playbackRate: playRate, progressInterval: 500, onDuration: function (duration) {
                setMaxDuration && setMaxDuration(parseFloat(duration.toFixed(1)));
            }, onProgress: function (progress) {
                if (!isSeeking) {
                    setProgress(progress.playedSeconds);
                }
            }, onEnded: function () {
                setIsPlaying && setIsPlaying(false);
                if (playlistMode === 'single-loop') {
                    setTimeout(function () {
                        setProgress(0);
                        setIsPlaying && setIsPlaying(true);
                    }, 500);
                }
                else {
                    setTimeout(function () {
                        setProgress(maxDuration);
                        shift && shift(1);
                    }, 500);
                }
            } })),
        React.createElement(Responsive.Default, null,
            React.createElement(OverlayBlock, { active: showAction },
                React.createElement(ActionBlock, { className: "d-flex align-items-center justify-content-around" },
                    React.createElement("div", { className: "flex-grow-1 text-center" },
                        React.createElement(PlayRateButton, { variant: "overlay", playRate: playRate, onChange: handlePlayRate })),
                    React.createElement(Divider, { type: "vertical", style: { height: '49px' } }),
                    React.createElement("div", { className: "flex-grow-1 text-center" },
                        React.createElement(PlayModeButton, { variant: "overlay", mode: playlistMode, onChange: togglePlaylistMode }))))),
        React.createElement("div", { className: "pt-3" },
            React.createElement(StyledSlider, { height: 8, max: maxDuration, step: 0.1, value: progress, onBeforeChange: function () { return setIsSeeking(true); }, onChange: function (value) { return setProgress(value); }, onAfterChange: function (value) {
                    setIsSeeking(false);
                    playerRef.current && playerRef.current.seekTo(value, 'seconds');
                } })),
        React.createElement(BarBlock, { className: "py-1" },
            React.createElement("div", { className: "container" },
                React.createElement(Responsive.Default, null,
                    React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
                        React.createElement(StyledLink, { to: "/podcasts/" + ((currentPodcastProgram === null || currentPodcastProgram === void 0 ? void 0 : currentPodcastProgram.id) || '') },
                            React.createElement(StyledTitle, { className: "flex-grow-1" }, currentPodcastProgram === null || currentPodcastProgram === void 0 ? void 0 : currentPodcastProgram.title)),
                        React.createElement(StyledDuration, { className: "flex-shrink-0" },
                            durationFormat(progress),
                            "/",
                            durationFormat(maxDuration)))),
                React.createElement("div", { className: "row flex-nowrap py-2" },
                    React.createElement(CloseBlock, { className: "col-1 d-flex align-items-center" },
                        React.createElement(StyledButton, { type: "link", variant: "bar", onClick: function () { return closePlayer && closePlayer(); } },
                            React.createElement(Icon, { src: TimesIcon }))),
                    React.createElement("div", { className: "col-2 col-lg-4 d-flex d-lg-block align-items-center justify-content-start" },
                        React.createElement(Responsive.Desktop, null,
                            React.createElement(Link, { to: "/podcasts/" + ((currentPodcastProgram === null || currentPodcastProgram === void 0 ? void 0 : currentPodcastProgram.id) || '') },
                                React.createElement(StyledTitle, null, currentPodcastProgram === null || currentPodcastProgram === void 0 ? void 0 : currentPodcastProgram.title)),
                            React.createElement(StyledDuration, null,
                                durationFormat(progress),
                                "/",
                                durationFormat(maxDuration)))),
                    React.createElement("div", { className: "col-6 col-lg-4 d-flex align-items-center justify-content-center" },
                        React.createElement(StyledShiftButton, { type: "link", variant: "bar", onClick: function () { return shift && shift(-1); } },
                            React.createElement(Icon, { src: PrevIcon })),
                        React.createElement(StyledButtonGroup, { className: "d-flex align-items-center justify-content-center" },
                            React.createElement(StyledButton, { type: "link", variant: "bar", onClick: function () { var _a; return (_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(playerRef.current.getCurrentTime() - 5); } },
                                React.createElement(Icon, { src: Backward5Icon })),
                            React.createElement(StyledButton, { type: "link", variant: "bar", className: "mx-2 mx-lg-3", height: "44px", onClick: function () {
                                    setIsPlaying && setIsPlaying(!isPlaying);
                                    if (isMobile() && progress === 0) {
                                        setIsAudioLoading(true);
                                        setTimeout(function () {
                                            setIsAudioLoading(false);
                                        }, 2500);
                                    }
                                    else {
                                        setIsAudioLoading(false);
                                    }
                                } }, loadingPodcastProgram || maxDuration === 0 || isAudioLoading ? (React.createElement(AntdIcon, { type: "loading", style: { fontSize: '44px' } })) : (React.createElement(AntdIcon, { component: function () { return (isPlaying ? React.createElement(Icon, { src: PauseCircleIcon }) : React.createElement(Icon, { src: PlayCircleIcon })); }, style: { fontSize: '44px' } }))),
                            React.createElement(StyledButton, { type: "link", variant: "bar", onClick: function () { var _a; return (_a = playerRef.current) === null || _a === void 0 ? void 0 : _a.seekTo(playerRef.current.getCurrentTime() + 5); } },
                                React.createElement(Icon, { src: Forward5Icon }))),
                        React.createElement(StyledShiftButton, { type: "link", variant: "bar", onClick: function () { return shift && shift(1); } },
                            React.createElement(Icon, { src: NextIcon }))),
                    React.createElement("div", { className: "col-3 col-lg-4 d-flex align-items-center justify-content-end" },
                        React.createElement(Responsive.Desktop, null,
                            React.createElement(PlayRateButton, { variant: "bar", playRate: playRate, onChange: handlePlayRate }),
                            React.createElement(PlayModeButton, { variant: "bar", mode: playlistMode, className: "ml-4", onChange: togglePlaylistMode })),
                        !(playlist === null || playlist === void 0 ? void 0 : playlist.isPreview) && (React.createElement(Popover, { placement: "topRight", trigger: "click", content: React.createElement(PlaylistOverlay, { memberId: memberId, defaultPlaylistId: (playlist === null || playlist === void 0 ? void 0 : playlist.id) || '' }) },
                            React.createElement(StyledButton, { type: "link", variant: "bar", className: "ml-lg-4", onClick: function () { return setShowAction(false); } },
                                React.createElement(Icon, { src: PlaylistIcon })))),
                        React.createElement(Responsive.Default, null,
                            React.createElement(StyledButton, { type: "link", variant: "bar", className: "ml-2 ml-lg-4", onClick: function () { return setShowAction(!showAction); } },
                                React.createElement(Icon, { src: EllipsisIcon })))))))));
};
var PlayRateButton = function (_a) {
    var variant = _a.variant, playRate = _a.playRate, onChange = _a.onChange, props = __rest(_a, ["variant", "playRate", "onChange"]);
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledButton, __assign({ type: "link", variant: variant, onClick: function () { return onChange && onChange(); } }, props),
        playRate < 1 ? (React.createElement(Icon, { src: PlayRate05xIcon })) : playRate < 1.5 ? (React.createElement(Icon, { src: PlayRate10xIcon })) : playRate < 2 ? (React.createElement(Icon, { src: PlayRate15xIcon })) : (React.createElement(Icon, { src: PlayRate20xIcon })),
        variant === 'overlay' && React.createElement("div", null, formatMessage(messages.playRate))));
};
var PlayModeButton = function (_a) {
    var variant = _a.variant, mode = _a.mode, onChange = _a.onChange, props = __rest(_a, ["variant", "mode", "onChange"]);
    var formatMessage = useIntl().formatMessage;
    return (React.createElement(StyledButton, __assign({ type: "link", variant: variant, onClick: function () { return onChange && onChange(); } }, props),
        mode === 'loop' ? (React.createElement(Icon, { src: LoopIcon })) : mode === 'single-loop' ? (React.createElement(Icon, { src: SingleLoopIcon })) : (React.createElement(Icon, { src: ShuffleIcon })),
        variant === 'overlay' && (React.createElement("div", null, formatMessage(mode === 'loop' ? messages.listLoop : mode === 'single-loop' ? messages.singleLoop : messages.random)))));
};
export default PodcastPlayer;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
//# sourceMappingURL=PodcastPlayer.js.map