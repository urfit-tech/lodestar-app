var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { uniq } from 'ramda';
import { useApp } from '../containers/common/AppContext';
import { notEmpty } from '../helpers';
export var useMember = function (memberId) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_MEMBER($memberId: String!) {\n        member_by_pk(id: $memberId) {\n          id\n          role\n          username\n          name\n          email\n          picture_url\n          metadata\n          description\n          created_at\n          logined_at\n          facebook_user_id\n          google_user_id\n          youtube_channel_ids\n        }\n      }\n    "], ["\n      query GET_MEMBER($memberId: String!) {\n        member_by_pk(id: $memberId) {\n          id\n          role\n          username\n          name\n          email\n          picture_url\n          metadata\n          description\n          created_at\n          logined_at\n          facebook_user_id\n          google_user_id\n          youtube_channel_ids\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, data = _a.data, error = _a.error, refetch = _a.refetch;
    var member = loading || error || !data || !data.member_by_pk
        ? null
        : {
            id: data.member_by_pk.id,
            role: data.member_by_pk.role,
            username: data.member_by_pk.username,
            name: data.member_by_pk.name,
            email: data.member_by_pk.email,
            pictureUrl: data.member_by_pk.picture_url,
            metadata: data.member_by_pk.metadata,
            description: data.member_by_pk.description,
            createdAt: data.member_by_pk.created_at,
            loginedAt: data.member_by_pk.logined_at,
            facebookUserId: data.member_by_pk.facebook_user_id,
            googleUserId: data.member_by_pk.google_user_id,
            youtubeChannelIds: data.member_by_pk.youtube_channel_ids,
        };
    return {
        loadingMember: loading,
        errorMember: error,
        member: member,
        refetchMember: refetch,
    };
};
export var usePublicMember = function (memberId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_PUBLIC_MEMBER($memberId: String!) {\n        member_public(where: { id: { _eq: $memberId } }) {\n          id\n          app_id\n          picture_url\n          name\n          username\n          tag_names\n          abstract\n          description\n          role\n          title\n        }\n      }\n    "], ["\n      query GET_PUBLIC_MEMBER($memberId: String!) {\n        member_public(where: { id: { _eq: $memberId } }) {\n          id\n          app_id\n          picture_url\n          name\n          username\n          tag_names\n          abstract\n          description\n          role\n          title\n        }\n      }\n    "]))), { variables: { memberId: memberId } }), loading = _a.loading, data = _a.data, error = _a.error, refetch = _a.refetch;
    var member = loading || error || !data || !data.member_public[0]
        ? null
        : {
            id: data.member_public[0].id || '',
            role: (data.member_public[0].role || 'anonymous'),
            pictureUrl: data.member_public[0].picture_url,
            username: data.member_public[0].username || '',
            name: data.member_public[0].name,
            tags: (data.member_public[0].tag_names || []),
            abstract: data.member_public[0].abstract,
            description: data.member_public[0].description,
            title: data.member_public[0].title,
        };
    return {
        loadingMember: loading,
        errorMember: error,
        member: member,
        refetchMember: refetch,
    };
};
export var useUpdateMember = function () {
    var updateMember = useMutation(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      mutation UPDATE_MEMBER(\n        $memberId: String!\n        $name: String\n        $description: String\n        $username: String\n        $email: String\n        $pictureUrl: String\n      ) {\n        update_member(\n          where: { id: { _eq: $memberId } }\n          _set: { name: $name, description: $description, username: $username, email: $email, picture_url: $pictureUrl }\n        ) {\n          affected_rows\n        }\n      }\n    "], ["\n      mutation UPDATE_MEMBER(\n        $memberId: String!\n        $name: String\n        $description: String\n        $username: String\n        $email: String\n        $pictureUrl: String\n      ) {\n        update_member(\n          where: { id: { _eq: $memberId } }\n          _set: { name: $name, description: $description, username: $username, email: $email, picture_url: $pictureUrl }\n        ) {\n          affected_rows\n        }\n      }\n    "]))))[0];
    return updateMember;
};
export var useUpdateMemberMetadata = function () {
    var updateMemberMetadata = useMutation(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    mutation UPDATE_MEMBER_METADATA($memberId: String!, $metadata: jsonb) {\n      update_member(where: { id: { _eq: $memberId } }, _set: { metadata: $metadata }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation UPDATE_MEMBER_METADATA($memberId: String!, $metadata: jsonb) {\n      update_member(where: { id: { _eq: $memberId } }, _set: { metadata: $metadata }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return updateMemberMetadata;
};
export var useCreatorCollection = function () {
    var appId = useApp().id;
    var _a = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_CREATOR_COLLECTION($appId: String!) {\n        member_public(where: { app_id: { _eq: $appId }, role: { _in: [\"content-creator\"] } }) {\n          id\n          picture_url\n          name\n          username\n          abstract\n          description\n          role\n          title\n        }\n      }\n    "], ["\n      query GET_CREATOR_COLLECTION($appId: String!) {\n        member_public(where: { app_id: { _eq: $appId }, role: { _in: [\"content-creator\"] } }) {\n          id\n          picture_url\n          name\n          username\n          abstract\n          description\n          role\n          title\n        }\n      }\n    "]))), {
        variables: {
            appId: appId,
        },
    }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var creators = loading || !!error || !data
        ? []
        : data.member_public.map(function (member) { return ({
            id: member.id || '',
            avatarUrl: member.picture_url,
            name: member.name || member.username || '',
            abstract: member.abstract,
            description: member.description,
            title: member.title || '',
        }); });
    return {
        loadingCreators: loading,
        errorCreators: error,
        creators: uniq(creators),
        refetchCreators: refetch,
    };
};
export var useUpdateMemberYouTubeChannelIds = function () {
    var updateYoutubeChannelIds = useMutation(gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    mutation UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION($memberId: String!, $data: jsonb) {\n      update_member(where: { id: { _eq: $memberId } }, _set: { youtube_channel_ids: $data }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation UPDATE_YOUTUBE_CHANNEL_ID_COLLECTION($memberId: String!, $data: jsonb) {\n      update_member(where: { id: { _eq: $memberId } }, _set: { youtube_channel_ids: $data }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return updateYoutubeChannelIds;
};
export var useSocialCardCollection = function () {
    var _a = useQuery(gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    query GET_SOCIAL_CARD_COLLECTION {\n      social_card_enrollment {\n        social_card {\n          id\n          name\n          badge_url\n          description\n          member_social {\n            id\n            name\n            profile_url\n            channel_url\n            type\n          }\n        }\n      }\n    }\n  "], ["\n    query GET_SOCIAL_CARD_COLLECTION {\n      social_card_enrollment {\n        social_card {\n          id\n          name\n          badge_url\n          description\n          member_social {\n            id\n            name\n            profile_url\n            channel_url\n            type\n          }\n        }\n      }\n    }\n  "])))), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var socialCards = loading || error || !data
        ? []
        : data.social_card_enrollment
            .map(function (socialCardEnrollment) {
            return socialCardEnrollment.social_card
                ? {
                    id: socialCardEnrollment.social_card.id,
                    channel: {
                        id: socialCardEnrollment.social_card.member_social.id,
                        name: socialCardEnrollment.social_card.member_social.name,
                        profileUrl: socialCardEnrollment.social_card.member_social.profile_url,
                        url: socialCardEnrollment.social_card.member_social.channel_url,
                        type: socialCardEnrollment.social_card.member_social.type,
                    },
                    plan: {
                        id: socialCardEnrollment.social_card.id,
                        name: socialCardEnrollment.social_card.name,
                        badgeUrl: socialCardEnrollment.social_card.badge_url,
                        description: socialCardEnrollment.social_card.description,
                    },
                }
                : null;
        })
            .filter(notEmpty);
    return {
        loadingSocialCards: loading,
        errorSocialCards: error,
        socialCards: socialCards,
        refetchSocialCards: refetch,
    };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=member.js.map