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
import { Button, Checkbox, Form, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import { commonMessages } from '../../helpers/translation';
import { useCreatePlaylist, useUpdatePlaylistPodcastPrograms } from '../../hooks/podcast';
var messages = defineMessages({
    saveToPlaylist: { id: 'podcast.label.saveToPlaylist', defaultMessage: '儲存至清單' },
    createPlaylist: { id: 'podcast.ui.createPlaylist', defaultMessage: '新建清單' },
    titlePlaceholder: { id: 'podcast.text.titlePlaceholder', defaultMessage: '字數限12字元' },
    savedPlaylist: { id: 'podcast.text.savedPlaylist', defaultMessage: '已儲存清單' },
});
var StyledModal = styled(Modal)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 24rem;\n"], ["\n  width: 24rem;\n"])));
var PlaylistAdminModal = function (_a) {
    var memberId = _a.memberId, playlists = _a.playlists, selectedPodcastProgramId = _a.selectedPodcastProgramId, onRefetch = _a.onRefetch, onSuccess = _a.onSuccess, props = __rest(_a, ["memberId", "playlists", "selectedPodcastProgramId", "onRefetch", "onSuccess"]);
    var formatMessage = useIntl().formatMessage;
    var titleRef = useRef(null);
    var updatePlaylistPodcastPrograms = useUpdatePlaylistPodcastPrograms();
    var createPlaylist = useCreatePlaylist();
    var prevPlaylistIds = playlists
        .filter(function (playlist) { return playlist.podcastProgramIds.includes(selectedPodcastProgramId || ''); })
        .map(function (playlist) { return playlist.id; });
    var _b = useState(prevPlaylistIds), checkedPlaylistIds = _b[0], setCheckedPlaylistIds = _b[1];
    var _c = useState(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var handleSubmit = function () {
        var _a;
        var title = (_a = titleRef.current) === null || _a === void 0 ? void 0 : _a.value;
        title &&
            createPlaylist({
                variables: {
                    memberId: memberId,
                    title: title,
                    position: playlists.length,
                },
            }).then(function () {
                setIsEditing(false);
                onRefetch && onRefetch();
            });
    };
    return (React.createElement(StyledModal, __assign({ title: formatMessage(messages.saveToPlaylist), centered: true, destroyOnClose: true, okText: formatMessage(commonMessages.button.save), cancelText: formatMessage(commonMessages.button.cancel), okButtonProps: { loading: loading }, onOk: function () {
            setLoading(true);
            updatePlaylistPodcastPrograms(selectedPodcastProgramId, prevPlaylistIds.filter(function (playlistId) { return !checkedPlaylistIds.includes(playlistId); }), checkedPlaylistIds
                .filter(function (playlistId) { return !prevPlaylistIds.includes(playlistId); })
                .map(function (playlistId) {
                var _a;
                return ({
                    playlist_id: playlistId,
                    podcast_program_id: selectedPodcastProgramId,
                    position: ((_a = playlists.find(function (playlist) { return playlist.id === playlistId; })) === null || _a === void 0 ? void 0 : _a.maxPosition) || 0,
                });
            })).then(function () {
                onRefetch && onRefetch();
                message.success(formatMessage(messages.savedPlaylist));
                setLoading(false);
                onSuccess && onSuccess();
            });
        } }, props),
        React.createElement(Checkbox.Group, { defaultValue: checkedPlaylistIds, onChange: function (checkedValues) { return setCheckedPlaylistIds(checkedValues); } }, playlists.map(function (playlist) { return (React.createElement("div", { key: playlist.id },
            React.createElement(Checkbox, { value: playlist.id, className: "mb-3" }, playlist.title))); })),
        isEditing && (React.createElement(Form, { className: "mb-3", onSubmit: function (e) {
                e.preventDefault();
                handleSubmit();
            } },
            React.createElement(Checkbox, null,
                React.createElement("input", { ref: titleRef, autoFocus: true, placeholder: formatMessage(messages.titlePlaceholder), onBlur: function (e) { return handleSubmit(); } })))),
        React.createElement("div", null,
            React.createElement(Button, { type: "link", icon: "plus", onClick: function () { return setIsEditing(true); } }, formatMessage(messages.createPlaylist)))));
};
export default PlaylistAdminModal;
var templateObject_1;
//# sourceMappingURL=PlaylistAdminModal.js.map