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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import React, { createContext, useState } from 'react';
import { usePodcastProgramContent } from '../hooks/podcast';
var PodcastPlayerContext = createContext({
    visible: false,
    isPlaying: false,
    playlist: null,
    playlistMode: 'loop',
    currentPlayingId: '',
    currentPodcastProgram: null,
    loadingPodcastProgram: false,
    maxDuration: 0,
});
export var PodcastPlayerProvider = function (_a) {
    var children = _a.children;
    var _b = useState(false), visible = _b[0], setVisible = _b[1];
    var _c = useState(false), isPlaying = _c[0], setIsPlaying = _c[1];
    var _d = useState(0), maxDuration = _d[0], setMaxDuration = _d[1];
    var _e = useState(null), playlist = _e[0], setPlaylist = _e[1];
    var _f = useState('loop'), playlistMode = _f[0], setPlaylistMode = _f[1];
    var _g = useState([]), shuffledPodcastProgramIds = _g[0], setShuffledPodcastProgramIds = _g[1];
    var currentPlayingId = (playlist === null || playlist === void 0 ? void 0 : playlist.podcastProgramIds[playlist.currentIndex]) || '';
    var _h = usePodcastProgramContent(currentPlayingId), loadingPodcastProgram = _h.loadingPodcastProgram, podcastProgram = _h.podcastProgram;
    return (React.createElement(PodcastPlayerContext.Provider, { value: {
            visible: visible,
            isPlaying: isPlaying,
            playlist: playlist,
            playlistMode: playlistMode,
            currentPlayingId: currentPlayingId,
            loadingPodcastProgram: loadingPodcastProgram,
            currentPodcastProgram: podcastProgram,
            maxDuration: maxDuration,
            togglePlaylistMode: function () {
                var _a;
                if (playlistMode === 'loop') {
                    setPlaylistMode('single-loop');
                }
                else if (playlistMode === 'single-loop') {
                    setPlaylistMode('random');
                    var currentPodcastProgramId_1 = (playlist === null || playlist === void 0 ? void 0 : playlist.podcastProgramIds[playlist.currentIndex]) || '';
                    var tmpList = __spreadArrays(((playlist === null || playlist === void 0 ? void 0 : playlist.podcastProgramIds.filter(function (podcastProgramId) { return podcastProgramId !== currentPodcastProgramId_1; })) || []));
                    // shuffle the podcast programs in playlist
                    for (var i = tmpList.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        _a = [tmpList[j], tmpList[i]], tmpList[i] = _a[0], tmpList[j] = _a[1];
                    }
                    currentPodcastProgramId_1 && tmpList.unshift(currentPodcastProgramId_1);
                    setShuffledPodcastProgramIds(tmpList);
                }
                else {
                    setPlaylistMode('loop');
                }
            },
            setIsPlaying: setIsPlaying,
            setPlaylist: setPlaylist,
            setupPlaylist: function (playlist) {
                setPlaylist(playlist);
                setPlaylistMode('loop');
                !visible && setVisible(true);
                setIsPlaying(false);
            },
            playNow: function (playlist) {
                setPlaylist(playlist);
                setPlaylistMode('loop');
                !visible && setVisible(true);
                setIsPlaying(true);
            },
            shift: function (quantity) {
                if (!playlist) {
                    return;
                }
                if (playlistMode === 'random') {
                    var currentShuffledIndex = shuffledPodcastProgramIds.findIndex(function (podcastProgramId) { return podcastProgramId === playlist.podcastProgramIds[playlist.currentIndex]; });
                    var targetPodcastProgramId_1 = shuffledPodcastProgramIds[currentShuffledIndex + quantity];
                    if (!targetPodcastProgramId_1) {
                        return;
                    }
                    var targetIndex = playlist.podcastProgramIds.findIndex(function (podcastProgramId) { return podcastProgramId === targetPodcastProgramId_1; });
                    if (targetIndex > -1) {
                        setPlaylist(__assign(__assign({}, playlist), { currentIndex: targetIndex }));
                    }
                }
                else if (playlistMode === 'loop') {
                    setPlaylist(__assign(__assign({}, playlist), { currentIndex: playlist.podcastProgramIds[playlist.currentIndex + quantity]
                            ? playlist.currentIndex + quantity
                            : quantity > 0
                                ? 0
                                : playlist.podcastProgramIds.length - 1 }));
                }
            },
            closePlayer: function () {
                setVisible(false);
                setPlaylist(null);
            },
            setMaxDuration: setMaxDuration,
        } }, children));
};
export default PodcastPlayerContext;
//# sourceMappingURL=PodcastPlayerContext.js.map