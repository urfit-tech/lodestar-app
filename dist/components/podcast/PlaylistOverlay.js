var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Dropdown, Icon as AntdIcon, List, Menu, Skeleton } from 'antd';
import React, { useContext, useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import styled, { css } from 'styled-components';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { productMessages } from '../../helpers/translation';
import { useEnrolledPodcastPrograms, usePlaylistCollection, usePlaylistPodcastPrograms, useUpdatePodcastProgramPositions, } from '../../hooks/podcast';
import AddToPlaylistIcon from '../../images/add-to-playlist.svg';
import EmptyCover from '../../images/empty-cover.png';
import { AvatarImage, CustomRatioImage } from '../common/Image';
import PlaylistAdminModal from './PlaylistAdminModal';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100vw;\n  max-width: 28rem;\n  height: 28rem;\n  background: white;\n  box-shadow: 0 6px 6px 6px rgba(0, 0, 0, 0.1);\n  border-radius: 8px;\n"], ["\n  width: 100vw;\n  max-width: 28rem;\n  height: 28rem;\n  background: white;\n  box-shadow: 0 6px 6px 6px rgba(0, 0, 0, 0.1);\n  border-radius: 8px;\n"])));
var StyledListTitle = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-size: 14px;\n"], ["\n  color: var(--gray-dark);\n  font-size: 14px;\n"])));
var StyledListContent = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  max-height: 23rem;\n  overflow: auto;\n"], ["\n  max-height: 23rem;\n  overflow: auto;\n"])));
var StyledListItem = styled(List.Item)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (props) {
    return props.variant === 'playing'
        ? css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          background-color: var(--gray-lighter);\n        "], ["\n          background-color: var(--gray-lighter);\n        "]))) : '';
});
var StyledMenu = styled(Menu)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  max-height: 20rem;\n  overflow: auto;\n"], ["\n  max-height: 20rem;\n  overflow: auto;\n"])));
var StyledCoverBlock = styled.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  position: relative;\n"], ["\n  position: relative;\n"])));
var StyledDuration = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  position: absolute;\n  bottom: 0.5rem;\n  left: 0.5rem;\n  padding: 0 0.25rem;\n  border-radius: 2px;\n  background: rgba(0, 0, 0, 0.6);\n  color: white;\n  font-size: 12px;\n  letter-spacing: 0.58px;\n"], ["\n  position: absolute;\n  bottom: 0.5rem;\n  left: 0.5rem;\n  padding: 0 0.25rem;\n  border-radius: 2px;\n  background: rgba(0, 0, 0, 0.6);\n  color: white;\n  font-size: 12px;\n  letter-spacing: 0.58px;\n"])));
var StyledTitle = styled.div(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"], ["\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n"])));
var StyledInstructorName = styled.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  letter-spacing: 0.4px;\n  font-size: 14px;\n"], ["\n  color: var(--gray-dark);\n  letter-spacing: 0.4px;\n  font-size: 14px;\n"])));
var StyledButton = styled(Button)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  color: ", ";\n  &:hover,\n  &:hover .anticon {\n    color: ", ";\n  }\n"], ["\n  color: ", ";\n  &:hover,\n  &:hover .anticon {\n    color: ", ";\n  }\n"])), function (props) { return props.color || 'var(--gray-dark)'; }, function (props) { return props.theme['@primary-color']; });
var PlaylistOverlay = function (_a) {
    var memberId = _a.memberId, defaultPlaylistId = _a.defaultPlaylistId;
    var formatMessage = useIntl().formatMessage;
    var _b = usePlaylistCollection(memberId), playlists = _b.playlists, totalPodcastProgramCount = _b.totalPodcastProgramCount, refetchPlaylists = _b.refetchPlaylists;
    var _c = useState(defaultPlaylistId), selectedPlaylistId = _c[0], setSelectedPlaylistId = _c[1];
    var selectedPlaylist = playlists.find(function (playlist) { return playlist.id === selectedPlaylistId; });
    return (React.createElement(StyledWrapper, null,
        React.createElement(List, { size: "small", header: React.createElement("div", { className: "d-flex align-items-center justify-content-between py-2 px-3" },
                React.createElement(StyledListTitle, null,
                    selectedPlaylistId ? selectedPlaylist === null || selectedPlaylist === void 0 ? void 0 : selectedPlaylist.title : formatMessage(productMessages.podcast.title.allPodcast),
                    " (",
                    selectedPlaylistId ? selectedPlaylist === null || selectedPlaylist === void 0 ? void 0 : selectedPlaylist.podcastProgramIds.length : totalPodcastProgramCount,
                    ")"),
                React.createElement(Dropdown, { overlay: React.createElement(StyledMenu, { className: "px-2" },
                        React.createElement(Menu.Item, { onClick: function () { return setSelectedPlaylistId(null); } },
                            formatMessage(productMessages.podcast.title.allPodcast),
                            " (",
                            totalPodcastProgramCount,
                            ")"),
                        playlists.map(function (playlist) { return (React.createElement(Menu.Item, { key: playlist.id, onClick: function () { return setSelectedPlaylistId(playlist.id); } },
                            playlist.title,
                            " (",
                            playlist.podcastProgramIds.length,
                            ")")); })), trigger: ['click'], placement: "bottomRight" },
                    React.createElement(StyledButton, { type: "link", size: "small", color: "var(--gray-darker)" },
                        React.createElement("span", null, formatMessage(productMessages.podcast.title.playlist)),
                        React.createElement(AntdIcon, { type: "caret-down" })))) },
            React.createElement(StyledListContent, null, selectedPlaylistId ? (React.createElement(PlaylistPodcastProgramBlock, { memberId: memberId, playlists: playlists, playlistId: selectedPlaylistId, onRefetch: refetchPlaylists })) : (React.createElement(AllPodcastProgramBlock, { memberId: memberId, playlists: playlists, onRefetch: refetchPlaylists }))))));
};
var AllPodcastProgramBlock = function (_a) {
    var memberId = _a.memberId, playlists = _a.playlists, onRefetch = _a.onRefetch;
    var history = useHistory();
    var _b = useContext(PodcastPlayerContext), currentPlayingId = _b.currentPlayingId, playNow = _b.playNow;
    var _c = useEnrolledPodcastPrograms(memberId), loadingPodcastProgramIds = _c.loadingPodcastProgramIds, enrolledPodcastPrograms = _c.enrolledPodcastPrograms;
    var _d = useState(false), visible = _d[0], setVisible = _d[1];
    var _e = useState(null), selectedPodcastProgramId = _e[0], setSelectedPodcastProgramId = _e[1];
    if (loadingPodcastProgramIds) {
        return React.createElement(Skeleton, { active: true });
    }
    return (React.createElement(React.Fragment, null,
        typeof selectedPodcastProgramId === 'string' && (React.createElement(PlaylistAdminModal, { memberId: memberId, selectedPodcastProgramId: selectedPodcastProgramId, playlists: playlists, visible: visible, destroyOnClose: true, onCancel: function () {
                setVisible(false);
                setSelectedPodcastProgramId(null);
            }, onRefetch: function () { return onRefetch && onRefetch(); }, onSuccess: function () {
                setVisible(false);
                setSelectedPodcastProgramId(null);
            } })),
        enrolledPodcastPrograms.map(function (podcastProgram) {
            var _a, _b, _c;
            return (React.createElement(PodcastProgramItem, { key: podcastProgram.id, id: podcastProgram.id, coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, instructor: {
                    id: ((_a = podcastProgram.instructor) === null || _a === void 0 ? void 0 : _a.id) || '',
                    avatarUrl: ((_b = podcastProgram.instructor) === null || _b === void 0 ? void 0 : _b.avatarUrl) || null,
                    name: ((_c = podcastProgram.instructor) === null || _c === void 0 ? void 0 : _c.name) || '',
                }, isPlaying: podcastProgram.id === currentPlayingId, onPlay: function (podcastProgramId) {
                    history.push("/podcasts/" + podcastProgramId);
                    playNow &&
                        playNow({
                            id: null,
                            podcastProgramIds: enrolledPodcastPrograms.map(function (podcastProgram) { return podcastProgram.id; }),
                            currentIndex: enrolledPodcastPrograms.findIndex(function (podcastProgram) { return podcastProgram.id === podcastProgramId; }),
                        });
                }, onEdit: function (podcastProgramId) {
                    setVisible(true);
                    setSelectedPodcastProgramId(podcastProgramId);
                } }));
        })));
};
var PlaylistPodcastProgramBlock = function (_a) {
    var memberId = _a.memberId, playlists = _a.playlists, playlistId = _a.playlistId, onRefetch = _a.onRefetch;
    var history = useHistory();
    var _b = useContext(PodcastPlayerContext), currentPlayingId = _b.currentPlayingId, playNow = _b.playNow;
    var _c = usePlaylistPodcastPrograms(playlistId), loadingPodcastPrograms = _c.loadingPodcastPrograms, podcastPrograms = _c.podcastPrograms, refetchPodcastPrograms = _c.refetchPodcastPrograms;
    var updatePodcastProgramPositions = useUpdatePodcastProgramPositions();
    var _d = useState(false), visible = _d[0], setVisible = _d[1];
    var _e = useState(null), selectedPodcastProgramId = _e[0], setSelectedPodcastProgramId = _e[1];
    var _f = useState(false), loading = _f[0], setLoading = _f[1];
    var _g = useState([]), tmpPodcastProgramIds = _g[0], setTmpPodcastProgramIds = _g[1];
    if (loadingPodcastPrograms) {
        return React.createElement(Skeleton, { active: true });
    }
    return (React.createElement(React.Fragment, null,
        typeof selectedPodcastProgramId === 'string' && (React.createElement(PlaylistAdminModal, { memberId: memberId, selectedPodcastProgramId: selectedPodcastProgramId, playlists: playlists, visible: visible, destroyOnClose: true, onCancel: function () {
                setVisible(false);
                setSelectedPodcastProgramId(null);
            }, onRefetch: function () {
                refetchPodcastPrograms();
                onRefetch && onRefetch();
            }, onSuccess: function () {
                setVisible(false);
                setSelectedPodcastProgramId(null);
            } })),
        React.createElement(ReactSortable, { handle: ".handler", list: podcastPrograms, setList: function (newPodcastPrograms) {
                return setTmpPodcastProgramIds(newPodcastPrograms.map(function (podcastProgram) { return podcastProgram.id; }));
            }, onEnd: function (evt) {
                if (loading) {
                    return;
                }
                setLoading(true);
                updatePodcastProgramPositions({
                    variables: {
                        playlistId: playlistId,
                        data: tmpPodcastProgramIds.map(function (podcastProgramId, index) { return ({
                            playlist_id: playlistId,
                            podcast_program_id: podcastProgramId,
                            position: index,
                        }); }),
                    },
                }).then(function () {
                    return refetchPodcastPrograms().then(function (_a) {
                        var data = _a.data;
                        setTmpPodcastProgramIds(data.playlist_podcast_program.map(function (playlist) { return playlist.podcast_program.id; }));
                        setLoading(false);
                    });
                });
            } }, podcastPrograms.map(function (podcastProgram) { return (React.createElement(PodcastProgramItem, { key: podcastProgram.id, id: podcastProgram.id, coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, instructor: podcastProgram.instructor, withHandler: true, isPlaying: podcastProgram.id === currentPlayingId, onPlay: function (podcastProgramId) {
                history.push("/podcasts/" + podcastProgramId);
                playNow &&
                    playNow({
                        id: playlistId,
                        podcastProgramIds: podcastPrograms.map(function (podcastProgram) { return podcastProgram.id; }),
                        currentIndex: podcastPrograms.findIndex(function (podcastProgram) { return podcastProgram.id === podcastProgramId; }),
                    });
            }, onEdit: function (podcastProgramId) {
                setVisible(true);
                setSelectedPodcastProgramId(podcastProgramId);
            } })); }))));
};
var PodcastProgramItem = function (_a) {
    var id = _a.id, coverUrl = _a.coverUrl, title = _a.title, duration = _a.duration, instructor = _a.instructor, withHandler = _a.withHandler, isPlaying = _a.isPlaying, onPlay = _a.onPlay, onEdit = _a.onEdit;
    return (React.createElement(StyledListItem, { className: "d-flex align-items-center justify-content-between " + (withHandler ? 'pr-4' : 'px-4'), variant: isPlaying ? 'playing' : undefined },
        withHandler && (React.createElement("div", { className: "flex-shrink-0" },
            React.createElement(AntdIcon, { type: "drag", className: "mx-1 cursor-pointer handler" }))),
        React.createElement(StyledCoverBlock, { className: "cursor-pointer", onClick: function () { return onPlay && onPlay(id); } },
            React.createElement(CustomRatioImage, { ratio: 1, width: "72px", src: coverUrl || EmptyCover, className: "mr-2 flex-shrink-0" }),
            React.createElement(StyledDuration, null,
                ("" + duration).padStart(2, '0'),
                ":00")),
        React.createElement("div", { className: "flex-grow-1 cursor-pointer", onClick: function () { return onPlay && onPlay(id); } },
            React.createElement(StyledTitle, null, title),
            React.createElement("div", { className: "d-flex align-items-center" },
                React.createElement(AvatarImage, { size: "24px", src: instructor.avatarUrl, className: "mr-1 flex-shrink-0" }),
                React.createElement(StyledInstructorName, { className: "flex-grow-1" }, instructor.name))),
        typeof onEdit !== 'undefined' && (React.createElement(StyledButton, { type: "link", className: "flex-shrink-0 ml-4 p-0", onClick: function () { return onEdit(id); } },
            React.createElement(Icon, { src: AddToPlaylistIcon })))));
};
export default PlaylistOverlay;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
//# sourceMappingURL=PlaylistOverlay.js.map