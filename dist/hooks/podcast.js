var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { uniq } from 'ramda';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { useApp } from '../containers/common/AppContext';
import { getFileDownloadableLink, notEmpty } from '../helpers';
export var usePodcastProgramCollection = function (creatorId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_PODCAST_PROGRAM_COLLECTION($creatorId: String) {\n        podcast_program(\n          order_by: { published_at: desc }\n          where: {\n            podcast_program_roles: { member_id: { _eq: $creatorId }, name: { _eq: \"instructor\" } }\n            published_at: { _is_null: false }\n          }\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          duration\n          duration_second\n          list_price\n          sale_price\n          sold_at\n          published_at\n          support_locales\n          podcast_program_roles(where: { name: { _eq: \"instructor\" } }) {\n            id\n            member {\n              id\n              picture_url\n              name\n              username\n            }\n          }\n          podcast_program_categories(order_by: { position: asc_nulls_last }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PODCAST_PROGRAM_COLLECTION($creatorId: String) {\n        podcast_program(\n          order_by: { published_at: desc }\n          where: {\n            podcast_program_roles: { member_id: { _eq: $creatorId }, name: { _eq: \"instructor\" } }\n            published_at: { _is_null: false }\n          }\n        ) {\n          id\n          cover_url\n          title\n          abstract\n          duration\n          duration_second\n          list_price\n          sale_price\n          sold_at\n          published_at\n          support_locales\n          podcast_program_roles(where: { name: { _eq: \"instructor\" } }) {\n            id\n            member {\n              id\n              picture_url\n              name\n              username\n            }\n          }\n          podcast_program_categories(order_by: { position: asc_nulls_last }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n        }\n      }\n    "]))), {
        variables: {
            creatorId: creatorId,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var podcastPrograms = loading || error || !data
        ? []
        : data.podcast_program.map(function (podcastProgram) {
            var instructorMember = podcastProgram.podcast_program_roles.length
                ? podcastProgram.podcast_program_roles[0].member
                : null;
            return {
                id: podcastProgram.id,
                coverUrl: podcastProgram.cover_url,
                title: podcastProgram.title,
                description: podcastProgram.abstract,
                duration: podcastProgram.duration,
                durationSecond: podcastProgram.duration_second,
                instructor: instructorMember
                    ? {
                        id: instructorMember.id || '',
                        avatarUrl: instructorMember.picture_url,
                        name: instructorMember.name || instructorMember.username || '',
                    }
                    : null,
                listPrice: podcastProgram.list_price,
                salePrice: podcastProgram.sold_at && new Date(podcastProgram.sold_at).getTime() > Date.now()
                    ? podcastProgram.sale_price
                    : undefined,
                categories: podcastProgram.podcast_program_categories.map(function (podcastProgramCategory) { return ({
                    id: podcastProgramCategory.category.id,
                    name: podcastProgramCategory.category.name,
                }); }),
                publishedAt: new Date(podcastProgram.published_at),
                supportLocales: podcastProgram.support_locales,
            };
        });
    return {
        loadingPodcastPrograms: loading,
        errorPodcastPrograms: error,
        podcastPrograms: podcastPrograms,
        refetchPodcastPrograms: refetch,
    };
};
export var usePodcastPlanIds = function (creatorId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_PODCAST_PLAN_IDS($creatorId: String!) {\n        podcast_plan(where: { creator_id: { _eq: $creatorId } }) {\n          id\n        }\n      }\n    "], ["\n      query GET_PODCAST_PLAN_IDS($creatorId: String!) {\n        podcast_plan(where: { creator_id: { _eq: $creatorId } }) {\n          id\n        }\n      }\n    "]))), { variables: { creatorId: creatorId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var podcastPlanIds = loading || !!error || !data ? [] : data.podcast_plan.map(function (podcastPlan) { return podcastPlan.id; });
    return {
        loadingPodcastPlans: loading,
        errorPodcastPlans: error,
        podcastPlanIds: podcastPlanIds,
        refetchPodcastPlans: refetch,
    };
};
export var useEnrolledPodcastProgramIds = function (memberId) {
    var _a = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_ENROLLED_PODCAST_PROGRAM_IDS($memberId: String!) {\n        podcast_program_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_program_id\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PODCAST_PROGRAM_IDS($memberId: String!) {\n        podcast_program_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_program_id\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledPodcastProgramIds = loading || error || !data
        ? []
        : data.podcast_program_enrollment.map(function (podcastProgram) { return podcastProgram.podcast_program_id; });
    return {
        loadingPodcastProgramId: loading,
        errorPodcastProgramId: error,
        enrolledPodcastProgramIds: enrolledPodcastProgramIds,
        refetchPodcastProgramId: refetch,
    };
};
export var useEnrolledPodcastPrograms = function (memberId) {
    var _a = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      query GET_ENROLLED_PODCAST_PROGRAMS($memberId: String!) {\n        podcast_program_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_program {\n            id\n            cover_url\n            title\n            abstract\n            duration\n            duration_second\n            list_price\n            sale_price\n            sold_at\n            published_at\n            support_locales\n            podcast_program_categories(order_by: { position: asc_nulls_last }) {\n              id\n              category {\n                id\n                name\n              }\n            }\n            podcast_program_roles(where: { name: { _eq: \"instructor\" } }) {\n              id\n              member {\n                id\n                picture_url\n                name\n                username\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PODCAST_PROGRAMS($memberId: String!) {\n        podcast_program_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_program {\n            id\n            cover_url\n            title\n            abstract\n            duration\n            duration_second\n            list_price\n            sale_price\n            sold_at\n            published_at\n            support_locales\n            podcast_program_categories(order_by: { position: asc_nulls_last }) {\n              id\n              category {\n                id\n                name\n              }\n            }\n            podcast_program_roles(where: { name: { _eq: \"instructor\" } }) {\n              id\n              member {\n                id\n                picture_url\n                name\n                username\n              }\n            }\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId }, fetchPolicy: 'no-cache' }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledPodcastPrograms = loading || error || !data
        ? []
        : data.podcast_program_enrollment
            .map(function (enrollment) {
            if (!enrollment.podcast_program) {
                return null;
            }
            var instructorMember = enrollment.podcast_program.podcast_program_roles.length
                ? enrollment.podcast_program.podcast_program_roles[0].member
                : null;
            return {
                id: enrollment.podcast_program.id,
                coverUrl: enrollment.podcast_program.cover_url,
                title: enrollment.podcast_program.title,
                description: enrollment.podcast_program.abstract,
                duration: enrollment.podcast_program.duration,
                durationSecond: enrollment.podcast_program.duration_second,
                instructor: instructorMember
                    ? {
                        id: instructorMember.id || '',
                        avatarUrl: instructorMember.picture_url,
                        name: instructorMember.name || instructorMember.username || '',
                    }
                    : null,
                listPrice: enrollment.podcast_program.list_price,
                salePrice: enrollment.podcast_program.sold_at &&
                    new Date(enrollment.podcast_program.sold_at).getTime() > Date.now()
                    ? enrollment.podcast_program.sale_price || undefined
                    : undefined,
                categories: enrollment.podcast_program.podcast_program_categories.map(function (podcastProgramCategory) { return ({
                    id: podcastProgramCategory.category.id,
                    name: podcastProgramCategory.category.name,
                }); }),
                publishedAt: new Date(enrollment.podcast_program.published_at),
                supportLocales: enrollment.podcast_program.support_locales,
            };
        })
            .filter(notEmpty);
    return {
        enrolledPodcastPrograms: enrolledPodcastPrograms,
        loadingPodcastProgramIds: loading,
        refetchPodcastProgramIds: refetch,
    };
};
export var usePublishedPodcastPlans = function (memberId) {
    var _a = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_PUBLISHED_PODCAST_PLANS($memberId: String!) {\n        podcast_plan(where: { creator_id: { _eq: $memberId }, _and: { published_at: { _is_null: false } } }) {\n          id\n          creator_id\n          is_subscription\n          period_amount\n          period_type\n          list_price\n          sale_price\n          sold_at\n        }\n      }\n    "], ["\n      query GET_PUBLISHED_PODCAST_PLANS($memberId: String!) {\n        podcast_plan(where: { creator_id: { _eq: $memberId }, _and: { published_at: { _is_null: false } } }) {\n          id\n          creator_id\n          is_subscription\n          period_amount\n          period_type\n          list_price\n          sale_price\n          sold_at\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var publishedPodcastPlans = loading || error || !data
        ? []
        : data.podcast_plan.map(function (PodcastPlan) { return ({
            id: PodcastPlan.id,
            periodAmount: PodcastPlan.period_amount,
            periodType: PodcastPlan.period_type,
            listPrice: PodcastPlan.list_price,
            salePrice: PodcastPlan.sale_price,
            soldAt: PodcastPlan.sold_at,
        }); });
    return {
        publishedPodcastPlans: publishedPodcastPlans,
        loadingPodcastPlans: loading,
        errorPodcastPlan: error,
        refetchPodcastPlans: refetch,
    };
};
export var useEnrolledPodcastPlansCreators = function (memberId) {
    var _a = useQuery(gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      query GET_ENROLLED_PODCAST_PLAN($memberId: String!) {\n        podcast_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_plan {\n            creator {\n              id\n              picture_url\n              name\n              username\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_PODCAST_PLAN($memberId: String!) {\n        podcast_plan_enrollment(where: { member_id: { _eq: $memberId } }) {\n          podcast_plan {\n            creator {\n              id\n              picture_url\n              name\n              username\n            }\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var enrolledPodcastPlansCreators = loading || error || !data
        ? []
        : uniq(data.podcast_plan_enrollment.map(function (enrollment) {
            return enrollment && enrollment.podcast_plan && enrollment.podcast_plan.creator
                ? {
                    id: enrollment.podcast_plan.creator.id || '',
                    pictureUrl: enrollment.podcast_plan.creator.picture_url,
                    name: enrollment.podcast_plan.creator.name || '',
                    username: enrollment.podcast_plan.creator.username || '',
                }
                : {
                    id: '',
                    pictureUrl: '',
                    name: '',
                    username: '',
                };
        }));
    return {
        enrolledPodcastPlansCreators: enrolledPodcastPlansCreators,
        loadingPodcastPlanIds: loading,
        refetchPodcastPlan: refetch,
    };
};
export var usePodcastProgramContent = function (podcastProgramId) {
    var _a, _b;
    var appId = useApp().id;
    var _c = useAuth(), authToken = _c.authToken, backendEndpoint = _c.backendEndpoint;
    var _d = useState(''), url = _d[0], setUrl = _d[1];
    var _e = useQuery(gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      query GET_PODCAST_PROGRAM_WITH_BODY($podcastProgramId: uuid!) {\n        podcast_program_by_pk(id: $podcastProgramId) {\n          id\n          title\n          cover_url\n          abstract\n          content_type\n          filename\n          published_at\n          creator_id\n          podcast_program_categories {\n            category {\n              id\n              name\n            }\n          }\n          podcast_program_tags {\n            tag {\n              name\n            }\n          }\n          podcast_program_body {\n            description\n          }\n          podcast_program_roles {\n            name\n            member_id\n          }\n        }\n      }\n    "], ["\n      query GET_PODCAST_PROGRAM_WITH_BODY($podcastProgramId: uuid!) {\n        podcast_program_by_pk(id: $podcastProgramId) {\n          id\n          title\n          cover_url\n          abstract\n          content_type\n          filename\n          published_at\n          creator_id\n          podcast_program_categories {\n            category {\n              id\n              name\n            }\n          }\n          podcast_program_tags {\n            tag {\n              name\n            }\n          }\n          podcast_program_body {\n            description\n          }\n          podcast_program_roles {\n            name\n            member_id\n          }\n        }\n      }\n    "]))), { variables: { podcastProgramId: podcastProgramId } }), loading = _e.loading, error = _e.error, data = _e.data, refetch = _e.refetch;
    var contentType = (_a = data === null || data === void 0 ? void 0 : data.podcast_program_by_pk) === null || _a === void 0 ? void 0 : _a.content_type;
    var filename = (_b = data === null || data === void 0 ? void 0 : data.podcast_program_by_pk) === null || _b === void 0 ? void 0 : _b.filename;
    var audioFilename = filename ? filename : contentType ? podcastProgramId + "." + contentType : null;
    useEffect(function () {
        audioFilename &&
            getFileDownloadableLink("audios/" + appId + "/" + audioFilename, authToken, backendEndpoint).then(function (url) {
                setUrl(url);
            });
    }, [audioFilename, authToken, backendEndpoint]);
    var podcastProgram = useMemo(function () {
        var _a;
        if (loading || error || !data || !data.podcast_program_by_pk) {
            return null;
        }
        return {
            id: data.podcast_program_by_pk.id || '',
            title: data.podcast_program_by_pk.title || '',
            abstract: data.podcast_program_by_pk.abstract || '',
            description: ((_a = data.podcast_program_by_pk.podcast_program_body) === null || _a === void 0 ? void 0 : _a.description) || null,
            coverUrl: data.podcast_program_by_pk.cover_url || null,
            publishedAt: data.podcast_program_by_pk.published_at && new Date(data.podcast_program_by_pk.published_at),
            tags: data.podcast_program_by_pk.podcast_program_tags.map(function (podcastProgramTag) { return podcastProgramTag.tag.name; }),
            categories: (data.podcast_program_by_pk.podcast_program_categories || []).map(function (programCategory) { return ({
                id: programCategory.category.id || '',
                name: programCategory.category.name || '',
            }); }),
            url: url,
            instructorIds: data.podcast_program_by_pk.podcast_program_roles
                .filter(function (role) { return role.name === 'instructor'; })
                .map(function (role) { return role.member_id; }) || [],
        };
    }, [data, error, loading, url]);
    return {
        loadingPodcastProgram: loading,
        errorPodcastProgram: error,
        podcastProgram: podcastProgram,
        refetchPodcastProgram: refetch,
    };
};
export var usePlaylistCollection = function (memberId) {
    var _a;
    var _b = useQuery(gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      query GET_PLAYLIST_COLLECTION($memberId: String) {\n        playlist(where: { member_id: { _eq: $memberId } }, order_by: { position: asc }) {\n          id\n          title\n          playlist_podcast_programs {\n            id\n            podcast_program_id\n          }\n          playlist_podcast_programs_aggregate {\n            aggregate {\n              max {\n                position\n              }\n            }\n          }\n        }\n        podcast_program_enrollment_aggregate(where: { member_id: { _eq: $memberId } }) {\n          aggregate {\n            count\n          }\n        }\n      }\n    "], ["\n      query GET_PLAYLIST_COLLECTION($memberId: String) {\n        playlist(where: { member_id: { _eq: $memberId } }, order_by: { position: asc }) {\n          id\n          title\n          playlist_podcast_programs {\n            id\n            podcast_program_id\n          }\n          playlist_podcast_programs_aggregate {\n            aggregate {\n              max {\n                position\n              }\n            }\n          }\n        }\n        podcast_program_enrollment_aggregate(where: { member_id: { _eq: $memberId } }) {\n          aggregate {\n            count\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch;
    var playlists = loading || error || !data
        ? []
        : data.playlist.map(function (playlist) {
            var _a, _b;
            return ({
                id: playlist.id,
                title: playlist.title,
                podcastProgramIds: playlist.playlist_podcast_programs.map(function (playlistPodcastProgram) { return playlistPodcastProgram.podcast_program_id; }),
                maxPosition: ((_b = (_a = playlist.playlist_podcast_programs_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.max) === null || _b === void 0 ? void 0 : _b.position) || -1,
            });
        });
    return {
        loadingPlaylists: loading,
        errorPlaylists: error,
        playlists: playlists,
        totalPodcastProgramCount: ((_a = data === null || data === void 0 ? void 0 : data.podcast_program_enrollment_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0,
        refetchPlaylists: refetch,
    };
};
export var useCreatePlaylist = function () {
    var createPlaylist = useMutation(gql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n    mutation CREATE_PLAYLIST($memberId: String!, $title: String!, $position: Int!) {\n      insert_playlist(objects: { member_id: $memberId, title: $title, position: $position }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation CREATE_PLAYLIST($memberId: String!, $title: String!, $position: Int!) {\n      insert_playlist(objects: { member_id: $memberId, title: $title, position: $position }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return createPlaylist;
};
export var useUpdatePlaylist = function () {
    var updatePlaylist = useMutation(gql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n    mutation UPDATE_PLAYLIST($playlistId: uuid!, $title: String!) {\n      update_playlist(where: { id: { _eq: $playlistId } }, _set: { title: $title }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation UPDATE_PLAYLIST($playlistId: uuid!, $title: String!) {\n      update_playlist(where: { id: { _eq: $playlistId } }, _set: { title: $title }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return updatePlaylist;
};
export var useUpdatePlaylistPosition = function () {
    var updatePlaylistPosition = useMutation(gql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n    mutation UPDATE_PLAYLIST_POSITION($data: [playlist_insert_input!]!) {\n      insert_playlist(objects: $data, on_conflict: { constraint: playlist_pkey, update_columns: position }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation UPDATE_PLAYLIST_POSITION($data: [playlist_insert_input!]!) {\n      insert_playlist(objects: $data, on_conflict: { constraint: playlist_pkey, update_columns: position }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return updatePlaylistPosition;
};
export var useDeletePlaylist = function () {
    var deletePlaylist = useMutation(gql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n    mutation DELETE_PLAYLIST($playlistId: uuid!) {\n      delete_playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }) {\n        affected_rows\n      }\n      delete_playlist(where: { id: { _eq: $playlistId } }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation DELETE_PLAYLIST($playlistId: uuid!) {\n      delete_playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }) {\n        affected_rows\n      }\n      delete_playlist(where: { id: { _eq: $playlistId } }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return deletePlaylist;
};
export var usePlaylistPodcastPrograms = function (playlistId) {
    var _a = useQuery(gql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n      query GET_PLAYLIST_PODCAST_PROGRAMS($playlistId: uuid!) {\n        playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }, order_by: { position: asc }) {\n          id\n          podcast_program {\n            id\n            cover_url\n            title\n            duration\n            duration_second\n            podcast_program_roles(where: { name: { _eq: \"instructor\" } }) {\n              id\n              member {\n                id\n                picture_url\n                name\n                username\n              }\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_PLAYLIST_PODCAST_PROGRAMS($playlistId: uuid!) {\n        playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }, order_by: { position: asc }) {\n          id\n          podcast_program {\n            id\n            cover_url\n            title\n            duration\n            duration_second\n            podcast_program_roles(where: { name: { _eq: \"instructor\" } }) {\n              id\n              member {\n                id\n                picture_url\n                name\n                username\n              }\n            }\n          }\n        }\n      }\n    "]))), { fetchPolicy: 'network-only', variables: { playlistId: playlistId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var podcastPrograms = loading || error || !data
        ? []
        : data.playlist_podcast_program.map(function (playlist) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                id: playlist.podcast_program.id,
                coverUrl: playlist.podcast_program.cover_url,
                title: playlist.podcast_program.title,
                duration: playlist.podcast_program.duration,
                durationSecond: playlist.podcast_program.duration_second,
                instructor: {
                    id: ((_b = (_a = playlist.podcast_program.podcast_program_roles[0]) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.id) || '',
                    avatarUrl: ((_d = (_c = playlist.podcast_program.podcast_program_roles[0]) === null || _c === void 0 ? void 0 : _c.member) === null || _d === void 0 ? void 0 : _d.picture_url) || null,
                    name: ((_f = (_e = playlist.podcast_program.podcast_program_roles[0]) === null || _e === void 0 ? void 0 : _e.member) === null || _f === void 0 ? void 0 : _f.name) || ((_h = (_g = playlist.podcast_program.podcast_program_roles[0]) === null || _g === void 0 ? void 0 : _g.member) === null || _h === void 0 ? void 0 : _h.username) ||
                        '',
                },
            });
        });
    return {
        loadingPodcastPrograms: loading,
        errorPodcastPrograms: error,
        podcastPrograms: podcastPrograms,
        refetchPodcastPrograms: refetch,
    };
};
export var useUpdatePlaylistPodcastPrograms = function () {
    var deletePlaylistPodcastPrograms = useMutation(gql(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n    mutation DELETE_PODCAST_PROGRAMS($podcastProgramId: uuid, $playlistIds: [uuid!]!) {\n      delete_playlist_podcast_program(\n        where: { podcast_program_id: { _eq: $podcastProgramId }, playlist_id: { _in: $playlistIds } }\n      ) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation DELETE_PODCAST_PROGRAMS($podcastProgramId: uuid, $playlistIds: [uuid!]!) {\n      delete_playlist_podcast_program(\n        where: { podcast_program_id: { _eq: $podcastProgramId }, playlist_id: { _in: $playlistIds } }\n      ) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    var insertPlaylistPodcastPrograms = useMutation(gql(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n    mutation INSERT_PODCAST_PROGRAMS($data: [playlist_podcast_program_insert_input!]!) {\n      insert_playlist_podcast_program(objects: $data) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation INSERT_PODCAST_PROGRAMS($data: [playlist_podcast_program_insert_input!]!) {\n      insert_playlist_podcast_program(objects: $data) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return function (podcastProgramId, removedPlaylistIds, data) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deletePlaylistPodcastPrograms({
                        variables: {
                            podcastProgramId: podcastProgramId,
                            playlistIds: removedPlaylistIds,
                        },
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertPlaylistPodcastPrograms({ variables: { data: data } })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
};
export var useUpdatePodcastProgramPositions = function () {
    var updatePodcastProgramPositions = useMutation(gql(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n    mutation UPDATE_PODCAST_PROGRAM_POSITIONS($playlistId: uuid!, $data: [playlist_podcast_program_insert_input!]!) {\n      delete_playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }) {\n        affected_rows\n      }\n      insert_playlist_podcast_program(objects: $data) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation UPDATE_PODCAST_PROGRAM_POSITIONS($playlistId: uuid!, $data: [playlist_podcast_program_insert_input!]!) {\n      delete_playlist_podcast_program(where: { playlist_id: { _eq: $playlistId } }) {\n        affected_rows\n      }\n      insert_playlist_podcast_program(objects: $data) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return updatePodcastProgramPositions;
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
//# sourceMappingURL=podcast.js.map