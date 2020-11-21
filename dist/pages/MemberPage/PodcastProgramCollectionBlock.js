var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Dropdown, Form, Icon as AntdIcon, Menu } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Icon from 'react-inlinesvg';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AvatarImage } from '../../components/common/Image';
import PodcastProgramCard from '../../components/podcast/PodcastProgramCard';
import PodcastProgramTimeline from '../../containers/podcast/PodcastProgramTimeline';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { handleError } from '../../helpers';
import { commonMessages, productMessages } from '../../helpers/translation';
import { useDeletePlaylist, useEnrolledPodcastPlansCreators, useEnrolledPodcastPrograms, usePlaylistCollection, useUpdatePlaylist, } from '../../hooks/podcast';
import AngleRightIcon from '../../images/angle-right.svg';
var StyledTitle = styled.h3(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 32px;\n  color: var(--gray-darker);\n  font-family: NotoSansCJKtc;\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"], ["\n  margin-bottom: 32px;\n  color: var(--gray-darker);\n  font-family: NotoSansCJKtc;\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 0.2px;\n"])));
var StyledParagraph = styled.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: var(--gray-dark);\n  font-family: NotoSansCJKtc;\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n"], ["\n  color: var(--gray-dark);\n  font-family: NotoSansCJKtc;\n  font-size: 14px;\n  font-weight: 500;\n  letter-spacing: 0.4px;\n"])));
var StyledEnrolledPodcastPlanCreatorName = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  color: var(--gray-darker);\n  transition: 0.3s;\n  &:hover {\n    color: ", ";\n  }\n"], ["\n  color: var(--gray-darker);\n  transition: 0.3s;\n  &:hover {\n    color: ", ";\n  }\n"])), function (props) { return props.theme['@primary-color']; });
var StyledPlaylistItem = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  padding: 1rem 0.75rem;\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"], ["\n  padding: 1rem 0.75rem;\n  color: var(--gray-darker);\n  line-height: 1.5;\n  letter-spacing: 0.2px;\n"])));
var StyledInput = styled.input(templateObject_5 || (templateObject_5 = __makeTemplateObject([""], [""])));
var PodcastProgramCollectionBlock = function (_a) {
    var memberId = _a.memberId;
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var playNow = useContext(PodcastPlayerContext).playNow;
    var _b = useEnrolledPodcastPrograms(memberId), enrolledPodcastPrograms = _b.enrolledPodcastPrograms, refetchPodcastProgramIds = _b.refetchPodcastProgramIds;
    var _c = useEnrolledPodcastPlansCreators(memberId), enrolledPodcastPlansCreators = _c.enrolledPodcastPlansCreators, refetchPodcastPlan = _c.refetchPodcastPlan;
    var _d = usePlaylistCollection(memberId), playlists = _d.playlists, totalPodcastProgramCount = _d.totalPodcastProgramCount, refetchPlaylists = _d.refetchPlaylists;
    var updatePlaylist = useUpdatePlaylist();
    var deletePlaylist = useDeletePlaylist();
    useEffect(function () {
        refetchPodcastProgramIds();
        refetchPodcastPlan();
    }, [refetchPodcastProgramIds, refetchPodcastPlan]);
    return (React.createElement("div", { className: "container py-3" },
        React.createElement("div", { className: "row" },
            React.createElement("div", { className: "col-12 col-lg-8 mb-5" },
                React.createElement(StyledTitle, null, formatMessage(productMessages.podcast.title.podcast)),
                React.createElement(PodcastProgramTimeline, { memberId: memberId, podcastPrograms: enrolledPodcastPrograms, renderItem: function (_a) {
                        var podcastProgram = _a.podcastProgram, isEnrolled = _a.isEnrolled;
                        return (React.createElement(Link, { to: "/podcasts/" + podcastProgram.id, key: podcastProgram.id },
                            React.createElement(PodcastProgramCard, { coverUrl: podcastProgram.coverUrl, title: podcastProgram.title, instructor: podcastProgram.instructor, salePrice: podcastProgram.salePrice, listPrice: podcastProgram.listPrice, duration: podcastProgram.duration, durationSecond: podcastProgram.durationSecond, isEnrolled: isEnrolled, noPrice: true })));
                    } })),
            React.createElement("div", { className: "col-12 col-lg-4 mb-5 pl-4" },
                React.createElement(StyledTitle, null, formatMessage(productMessages.podcast.title.subscribe)),
                enrolledPodcastPlansCreators.length === 0 ? (React.createElement(StyledParagraph, null, formatMessage(productMessages.podcast.content.unsubscribed))) : (enrolledPodcastPlansCreators.map(function (enrolledPodcastPlansCreator) { return (React.createElement(Link, { key: enrolledPodcastPlansCreator.id, to: "/creators/" + enrolledPodcastPlansCreator.id + "?tabkey=podcasts" },
                    React.createElement("div", { className: "d-flex justify-content-between align-items-center mb-3" },
                        React.createElement("div", { className: "d-flex justify-content-between align-items-center" },
                            React.createElement(AvatarImage, { shape: "circle", size: "64px", className: "flex-shrink-0 mr-3", src: enrolledPodcastPlansCreator.pictureUrl }),
                            React.createElement(StyledEnrolledPodcastPlanCreatorName, null, enrolledPodcastPlansCreator.name || enrolledPodcastPlansCreator.username)),
                        React.createElement(Icon, { src: AngleRightIcon })))); })),
                React.createElement(StyledTitle, { className: "mt-5" }, formatMessage(productMessages.podcast.title.playlist)),
                React.createElement(StyledPlaylistItem, { className: "cursor-pointer", onClick: function () {
                        if (enrolledPodcastPrograms.length === 0) {
                            return;
                        }
                        history.push("/podcasts/" + enrolledPodcastPrograms[0].id);
                        playNow &&
                            playNow({
                                id: null,
                                podcastProgramIds: enrolledPodcastPrograms.map(function (podcastProgram) { return podcastProgram.id; }),
                                currentIndex: 0,
                            });
                    } },
                    formatMessage(productMessages.podcast.title.allPodcast),
                    " (",
                    totalPodcastProgramCount,
                    ")"),
                playlists.map(function (playlist) { return (React.createElement(PlaylistItem, { key: playlist.id, id: playlist.id, title: playlist.title, count: playlist.podcastProgramIds.length, onSave: function (id, title) {
                        return updatePlaylist({ variables: { playlistId: id, title: title } })
                            .catch(handleError)
                            .then(function () { return refetchPlaylists(); });
                    }, onDelete: function (id) {
                        return deletePlaylist({ variables: { playlistId: id } })
                            .catch(handleError)
                            .then(function () { return refetchPlaylists(); });
                    }, onClick: function () {
                        if (playlist.podcastProgramIds.length === 0) {
                            return;
                        }
                        history.push("/podcasts/" + playlist.podcastProgramIds[0]);
                        playNow &&
                            playNow({
                                id: playlist.id,
                                podcastProgramIds: playlist.podcastProgramIds,
                                currentIndex: 0,
                            });
                    } })); })))));
};
var PlaylistItem = function (_a) {
    var id = _a.id, title = _a.title, count = _a.count, onSave = _a.onSave, onDelete = _a.onDelete, onClick = _a.onClick;
    var formatMessage = useIntl().formatMessage;
    var titleRef = useRef(null);
    var _b = useState(false), isEditing = _b[0], setIsEditing = _b[1];
    return (React.createElement(StyledPlaylistItem, { className: "d-flex align-items-center" },
        React.createElement("div", { className: "flex-grow-1" }, isEditing ? (React.createElement(Form, { onSubmit: function (e) {
                var _a;
                e.preventDefault();
                onSave && onSave(id, ((_a = titleRef.current) === null || _a === void 0 ? void 0 : _a.value) || title).then(function () { return setIsEditing(false); });
            } },
            React.createElement(StyledInput, { ref: titleRef, autoFocus: true, defaultValue: title, placeholder: formatMessage(productMessages.podcast.title.playlistPlaceholder), onBlur: function (e) {
                    if (e.target.value !== title) {
                        onSave && onSave(id, e.target.value).then(function () { return setIsEditing(false); });
                    }
                    else {
                        setIsEditing(false);
                    }
                } }))) : (React.createElement("div", { className: "cursor-pointer", onClick: function () { return onClick && onClick(); } },
            title,
            " (",
            count,
            ")"))),
        React.createElement(Dropdown, { placement: "bottomRight", trigger: ['click'], overlay: React.createElement(Menu, null,
                React.createElement(Menu.Item, { onClick: function () { return setIsEditing(true); } }, formatMessage(commonMessages.button.edit)),
                React.createElement(Menu.Item, { onClick: function () { return onDelete && onDelete(id); } }, formatMessage(commonMessages.button.delete))) },
            React.createElement(AntdIcon, { type: "more" }))));
};
export default PodcastProgramCollectionBlock;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
//# sourceMappingURL=PodcastProgramCollectionBlock.js.map