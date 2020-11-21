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
import { Icon } from '@chakra-ui/react';
import { Button, Divider } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import SVG from 'react-inlinesvg';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { desktopViewMixin } from '../../helpers';
import { useEnrolledPodcastProgramIds } from '../../hooks/podcast';
import PauseCircleIcon from '../../images/pause-circle.svg';
import PlayCircleIcon from '../../images/play-circle.svg';
import { BraftContent } from '../common/StyledBraftEditor';
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 4rem 1.5rem;\n  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(", ");\n  background-size: cover;\n  background-position: center;\n  color: white;\n  text-align: center;\n\n  ", "\n"], ["\n  padding: 4rem 1.5rem;\n  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(", ");\n  background-size: cover;\n  background-position: center;\n  color: white;\n  text-align: center;\n\n  ",
    "\n"])), function (props) { return props.coverUrl || ''; }, desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    height: calc(100vh - 64px);\n    padding: 4rem;\n    text-align: left;\n  "], ["\n    height: calc(100vh - 64px);\n    padding: 4rem;\n    text-align: left;\n  "])))));
var StyledTitle = styled.h1(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  margin-bottom: 2.5rem;\n  color: white;\n  font-size: 28px;\n  font-weight: 500;\n  line-height: 1.3;\n  letter-spacing: 0.23px;\n  overflow: hidden;\n\n  ", "\n"], ["\n  margin-bottom: 2.5rem;\n  color: white;\n  font-size: 28px;\n  font-weight: 500;\n  line-height: 1.3;\n  letter-spacing: 0.23px;\n  overflow: hidden;\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    font-size: 40px;\n    font-weight: bold;\n    letter-spacing: 1px;\n  "], ["\n    font-size: 40px;\n    font-weight: bold;\n    letter-spacing: 1px;\n  "])))));
var StyledMeta = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  font-size: 14px;\n  letter-spacing: 0.8px;\n\n  span:not(:first-child) {\n    margin-left: 0.5rem;\n  }\n"], ["\n  font-size: 14px;\n  letter-spacing: 0.8px;\n\n  span:not(:first-child) {\n    margin-left: 0.5rem;\n  }\n"])));
var StyledDescription = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  font-size: 14px;\n  letter-spacing: 0.8px;\n\n  p {\n    color: white;\n  }\n"], ["\n  font-size: 14px;\n  letter-spacing: 0.8px;\n\n  p {\n    color: white;\n  }\n"])));
var StyledIcon = styled(SVG)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  && {\n    color: white;\n    font-size: 40px;\n  }\n"], ["\n  && {\n    color: white;\n    font-size: 40px;\n  }\n"])));
var StyledLink = styled(Link)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: white;\n"], ["\n  color: white;\n"])));
var PodcastProgramCover = function (_a) {
    var memberId = _a.memberId, podcastProgramId = _a.podcastProgramId, coverUrl = _a.coverUrl, title = _a.title, publishedAt = _a.publishedAt, tags = _a.tags, description = _a.description;
    var _b = useContext(PodcastPlayerContext), isPlaying = _b.isPlaying, visible = _b.visible, playlist = _b.playlist, currentPlayingId = _b.currentPlayingId, loadingPodcastProgram = _b.loadingPodcastProgram, maxDuration = _b.maxDuration, playNow = _b.playNow, setIsPlaying = _b.setIsPlaying, setupPlaylist = _b.setupPlaylist;
    var enrolledPodcastProgramIds = useEnrolledPodcastProgramIds(memberId).enrolledPodcastProgramIds;
    var _c = useState(false), isPlayerInitialized = _c[0], setIsPlayerInitialized = _c[1];
    useEffect(function () {
        if (!playlist && !isPlayerInitialized) {
            setIsPlayerInitialized(true);
            setupPlaylist &&
                setupPlaylist(enrolledPodcastProgramIds.includes(podcastProgramId)
                    ? {
                        id: null,
                        podcastProgramIds: enrolledPodcastProgramIds,
                        currentIndex: enrolledPodcastProgramIds.findIndex(function (id) { return id === podcastProgramId; }),
                    }
                    : {
                        id: null,
                        podcastProgramIds: [podcastProgramId],
                        currentIndex: 0,
                        isPreview: true,
                    });
        }
    }, [enrolledPodcastProgramIds, playlist, podcastProgramId, isPlayerInitialized, setupPlaylist]);
    var handlePlay = function () {
        if (isPlayerInitialized && visible && setIsPlaying) {
            setIsPlaying(true);
            return;
        }
        if (!playNow) {
            return;
        }
        var position = playlist === null || playlist === void 0 ? void 0 : playlist.podcastProgramIds.findIndex(function (id) { return id === podcastProgramId; });
        playNow(playlist && position && position > -1
            ? __assign(__assign({}, playlist), { currentIndex: position }) : enrolledPodcastProgramIds.includes(podcastProgramId)
            ? {
                id: null,
                podcastProgramIds: enrolledPodcastProgramIds,
                currentIndex: enrolledPodcastProgramIds.findIndex(function (id) { return id === podcastProgramId; }),
            }
            : {
                id: null,
                podcastProgramIds: [podcastProgramId],
                currentIndex: 0,
                isPreview: true,
            });
    };
    return (React.createElement(StyledWrapper, { coverUrl: coverUrl || '' },
        React.createElement(StyledMeta, { className: "mb-4" }, moment(publishedAt).format('YYYY-MM-DD')),
        React.createElement(StyledMeta, { className: "mb-3" }, tags.map(function (tag) { return (React.createElement(StyledLink, { key: tag, to: "/search?tag=" + tag + "&tab=podcasts" },
            "#",
            tag)); })),
        React.createElement(StyledTitle, null, title),
        React.createElement(StyledDescription, { className: "mb-2" },
            React.createElement(BraftContent, null, description)),
        React.createElement("div", { className: "d-flex align-items-center justify-content-between" },
            React.createElement("div", { className: "flex-grow-1 mr-2" },
                React.createElement(Divider, null)),
            React.createElement("div", { className: "flex-shrink-0" }, loadingPodcastProgram || maxDuration === 0 ? (React.createElement(Icon, { as: AiOutlineLoading, style: { fontSize: '44px' } })) : podcastProgramId === currentPlayingId ? (React.createElement(Button, { type: "link", onClick: function () { return setIsPlaying && setIsPlaying(!isPlaying); } }, isPlaying ? React.createElement(StyledIcon, { src: PauseCircleIcon }) : React.createElement(StyledIcon, { src: PlayCircleIcon }))) : (React.createElement(Button, { type: "link", loading: loadingPodcastProgram, onClick: handlePlay },
                React.createElement(StyledIcon, { src: PlayCircleIcon })))))));
};
export default PodcastProgramCover;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=PodcastProgramCover.js.map