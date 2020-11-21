var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { max, min } from 'lodash';
import { isUUIDv4 } from '../helpers';
export var usePostPreviewCollection = function (filter) {
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_POST_PREVIEW_COLLECTION($authorId: String) {\n        post(\n          where: {\n            is_deleted: { _eq: false }\n            published_at: { _is_null: false }\n            post_roles: { name: { _eq: \"author\" }, member_id: { _eq: $authorId } }\n          }\n          order_by: [{ position: asc }, { published_at: desc }]\n        ) {\n          id\n          code_name\n          title\n          cover_url\n          video_url\n          abstract\n          published_at\n          post_roles(where: { name: { _eq: \"author\" } }) {\n            id\n            name\n            member {\n              id\n              name\n              username\n            }\n          }\n          post_categories(order_by: { category: { position: asc } }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          post_tags(order_by: { position: asc }) {\n            id\n            tag_name\n          }\n        }\n      }\n    "], ["\n      query GET_POST_PREVIEW_COLLECTION($authorId: String) {\n        post(\n          where: {\n            is_deleted: { _eq: false }\n            published_at: { _is_null: false }\n            post_roles: { name: { _eq: \"author\" }, member_id: { _eq: $authorId } }\n          }\n          order_by: [{ position: asc }, { published_at: desc }]\n        ) {\n          id\n          code_name\n          title\n          cover_url\n          video_url\n          abstract\n          published_at\n          post_roles(where: { name: { _eq: \"author\" } }) {\n            id\n            name\n            member {\n              id\n              name\n              username\n            }\n          }\n          post_categories(order_by: { category: { position: asc } }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          post_tags(order_by: { position: asc }) {\n            id\n            tag_name\n          }\n        }\n      }\n    "]))), { variables: { authorId: filter === null || filter === void 0 ? void 0 : filter.authorId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var posts = loading || error || !data
        ? []
        : data.post
            .filter(function (post) {
            return !filter ||
                typeof filter.tags === 'undefined' ||
                post.post_tags.some(function (postTag) { var _a; return (_a = filter.tags) === null || _a === void 0 ? void 0 : _a.includes(postTag.tag_name); });
        })
            .map(function (post) {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: post.id,
                codeName: post.code_name,
                title: post.title,
                coverUrl: post.cover_url,
                videoUrl: post.video_url,
                abstract: post.abstract,
                author: {
                    id: ((_b = (_a = post.post_roles[0]) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.id) || '',
                    name: ((_d = (_c = post.post_roles[0]) === null || _c === void 0 ? void 0 : _c.member) === null || _d === void 0 ? void 0 : _d.name) || ((_f = (_e = post.post_roles[0]) === null || _e === void 0 ? void 0 : _e.member) === null || _f === void 0 ? void 0 : _f.username) || '',
                },
                publishedAt: post.published_at ? new Date(post.published_at) : null,
                categories: post.post_categories.map(function (postCategory) { return ({
                    id: postCategory.category.id,
                    name: postCategory.category.name,
                }); }),
                tags: post.post_tags.map(function (tag) { return tag.tag_name; }),
            });
        });
    return {
        loadingPosts: loading,
        errorPosts: error,
        posts: posts,
        refetchPosts: refetch,
    };
};
export var usePopularPostCollection = function () {
    var _a;
    var _b = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_POPULAR_POST_COLLECTION($offset: Int) {\n        post_aggregate(where: { is_deleted: { _eq: false }, published_at: { _is_null: false } }) {\n          aggregate {\n            count\n          }\n        }\n        post(\n          where: { is_deleted: { _eq: false }, published_at: { _is_null: false } }\n          order_by: { views: desc }\n          offset: $offset\n          limit: 5\n        ) {\n          id\n          code_name\n          title\n          cover_url\n          video_url\n        }\n      }\n    "], ["\n      query GET_POPULAR_POST_COLLECTION($offset: Int) {\n        post_aggregate(where: { is_deleted: { _eq: false }, published_at: { _is_null: false } }) {\n          aggregate {\n            count\n          }\n        }\n        post(\n          where: { is_deleted: { _eq: false }, published_at: { _is_null: false } }\n          order_by: { views: desc }\n          offset: $offset\n          limit: 5\n        ) {\n          id\n          code_name\n          title\n          cover_url\n          video_url\n        }\n      }\n    "])))), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch, fetchMore = _b.fetchMore;
    var posts = loading || error || !data
        ? []
        : data.post.map(function (post) { return ({
            id: post.id,
            codeName: post.code_name,
            title: post.title,
            coverUrl: post.cover_url,
            videoUrl: post.video_url,
        }); });
    var postCount = ((_a = data === null || data === void 0 ? void 0 : data.post_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 0;
    var fetchMorePost = function (page) {
        return fetchMore({
            variables: { offset: page * 5 },
            updateQuery: function (prev, _a) {
                var fetchMoreResult = _a.fetchMoreResult;
                if (!fetchMoreResult)
                    return prev;
                return Object.assign({}, prev, {
                    post: __spreadArrays(prev.post, fetchMoreResult.post),
                });
            },
        });
    };
    return {
        loadingPosts: loading,
        errorPosts: error,
        posts: posts,
        refetchPosts: refetch,
        postCount: postCount,
        fetchMorePost: fetchMorePost,
    };
};
export var useRelativePostCollection = function (id, tags) {
    var _a;
    var _b = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_RELATIVE_POST_COLLECTION($tags: [String!], $offset: Int) {\n        post_aggregate(\n          where: {\n            is_deleted: { _eq: false }\n            published_at: { _is_null: false }\n            post_tags: { tag_name: { _in: $tags } }\n          }\n        ) {\n          aggregate {\n            count\n          }\n        }\n        post(\n          where: {\n            is_deleted: { _eq: false }\n            published_at: { _is_null: false }\n            post_tags: { tag_name: { _in: $tags } }\n          }\n          order_by: { published_at: desc }\n          offset: $offset\n          limit: 5\n        ) {\n          id\n          title\n          code_name\n          cover_url\n          video_url\n        }\n      }\n    "], ["\n      query GET_RELATIVE_POST_COLLECTION($tags: [String!], $offset: Int) {\n        post_aggregate(\n          where: {\n            is_deleted: { _eq: false }\n            published_at: { _is_null: false }\n            post_tags: { tag_name: { _in: $tags } }\n          }\n        ) {\n          aggregate {\n            count\n          }\n        }\n        post(\n          where: {\n            is_deleted: { _eq: false }\n            published_at: { _is_null: false }\n            post_tags: { tag_name: { _in: $tags } }\n          }\n          order_by: { published_at: desc }\n          offset: $offset\n          limit: 5\n        ) {\n          id\n          title\n          code_name\n          cover_url\n          video_url\n        }\n      }\n    "]))), { variables: { tags: tags } }), loading = _b.loading, error = _b.error, data = _b.data, refetch = _b.refetch, fetchMore = _b.fetchMore;
    var posts = loading || error || !data
        ? []
        : data.post
            .filter(function (post) { return post.id !== id; })
            .map(function (post) { return ({
            id: post.id,
            codeName: post.code_name,
            title: post.title,
            coverUrl: post.cover_url,
            videoUrl: post.video_url,
        }); });
    var postCount = (((_a = data === null || data === void 0 ? void 0 : data.post_aggregate.aggregate) === null || _a === void 0 ? void 0 : _a.count) || 1) - 1;
    var fetchMorePost = function (page) {
        return fetchMore({
            variables: { offset: page * 5 },
            updateQuery: function (prev, _a) {
                var fetchMoreResult = _a.fetchMoreResult;
                if (!fetchMoreResult)
                    return prev;
                return Object.assign({}, prev, {
                    post: __spreadArrays(prev.post, fetchMoreResult.post),
                });
            },
        });
    };
    return {
        loadingPost: loading,
        errorPost: error,
        posts: posts,
        refetchPost: refetch,
        postCount: postCount,
        fetchMorePost: fetchMorePost,
    };
};
export var usePost = function (search) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _j = useQuery(gql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n      fragment PostParts on post {\n        id\n        code_name\n        title\n        description\n        cover_url\n        video_url\n        abstract\n        views\n        published_at\n        post_roles(where: { name: { _eq: \"author\" } }) {\n          id\n          member {\n            id\n            name\n            picture_url\n            abstract\n          }\n        }\n        post_categories {\n          id\n          category {\n            id\n            name\n          }\n        }\n        post_tags {\n          id\n          tag_name\n        }\n        post_merchandises(\n          where: { merchandise: { is_deleted: { _eq: false }, published_at: { _is_null: false } } }\n          order_by: [{ position: asc }, { merchandise: { published_at: desc } }]\n        ) {\n          id\n          merchandise {\n            id\n            title\n            sold_at\n            abstract\n            description\n            started_at\n            ended_at\n            is_limited\n            is_physical\n            is_customized\n            is_countdown_timer_visible\n            merchandise_tags(order_by: { position: asc }) {\n              tag_name\n            }\n            merchandise_categories(order_by: { position: asc }) {\n              id\n              category {\n                id\n                name\n              }\n            }\n            merchandise_imgs(order_by: { position: asc }) {\n              id\n              url\n              type\n            }\n            member_shop {\n              id\n              title\n              shipping_methods\n            }\n            merchandise_specs {\n              id\n              title\n              list_price\n              sale_price\n              quota\n              merchandise_spec_inventory_status {\n                buyable_quantity\n              }\n            }\n          }\n        }\n      }\n\n      query GET_POST($id: uuid!, $search: String!) {\n        post(where: { code_name: { _eq: $search } }) {\n          ...PostParts\n        }\n        post_by_pk(id: $id) {\n          ...PostParts\n        }\n      }\n    "], ["\n      fragment PostParts on post {\n        id\n        code_name\n        title\n        description\n        cover_url\n        video_url\n        abstract\n        views\n        published_at\n        post_roles(where: { name: { _eq: \"author\" } }) {\n          id\n          member {\n            id\n            name\n            picture_url\n            abstract\n          }\n        }\n        post_categories {\n          id\n          category {\n            id\n            name\n          }\n        }\n        post_tags {\n          id\n          tag_name\n        }\n        post_merchandises(\n          where: { merchandise: { is_deleted: { _eq: false }, published_at: { _is_null: false } } }\n          order_by: [{ position: asc }, { merchandise: { published_at: desc } }]\n        ) {\n          id\n          merchandise {\n            id\n            title\n            sold_at\n            abstract\n            description\n            started_at\n            ended_at\n            is_limited\n            is_physical\n            is_customized\n            is_countdown_timer_visible\n            merchandise_tags(order_by: { position: asc }) {\n              tag_name\n            }\n            merchandise_categories(order_by: { position: asc }) {\n              id\n              category {\n                id\n                name\n              }\n            }\n            merchandise_imgs(order_by: { position: asc }) {\n              id\n              url\n              type\n            }\n            member_shop {\n              id\n              title\n              shipping_methods\n            }\n            merchandise_specs {\n              id\n              title\n              list_price\n              sale_price\n              quota\n              merchandise_spec_inventory_status {\n                buyable_quantity\n              }\n            }\n          }\n        }\n      }\n\n      query GET_POST($id: uuid!, $search: String!) {\n        post(where: { code_name: { _eq: $search } }) {\n          ...PostParts\n        }\n        post_by_pk(id: $id) {\n          ...PostParts\n        }\n      }\n    "]))), {
        variables: {
            id: isUUIDv4(search) ? search : '00000000-0000-0000-0000-000000000000',
            search: search,
        },
    }), loading = _j.loading, error = _j.error, data = _j.data, refetch = _j.refetch;
    var dataPost = (data === null || data === void 0 ? void 0 : data.post[0]) || (data === null || data === void 0 ? void 0 : data.post_by_pk) || null;
    var _k = useNearPost(dataPost === null || dataPost === void 0 ? void 0 : dataPost.published_at), prevPost = _k.prevPost, nextPost = _k.nextPost;
    var post = !dataPost
        ? null
        : {
            id: dataPost.id,
            codeName: dataPost.code_name,
            title: dataPost.title,
            coverUrl: dataPost.cover_url,
            videoUrl: dataPost.video_url,
            abstract: dataPost.abstract,
            author: {
                id: ((_b = (_a = dataPost.post_roles[0]) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.id) || '',
                name: ((_d = (_c = dataPost.post_roles[0]) === null || _c === void 0 ? void 0 : _c.member) === null || _d === void 0 ? void 0 : _d.name) || '',
                avatarUrl: ((_f = (_e = dataPost.post_roles[0]) === null || _e === void 0 ? void 0 : _e.member) === null || _f === void 0 ? void 0 : _f.picture_url) || null,
                abstract: ((_h = (_g = dataPost.post_roles[0]) === null || _g === void 0 ? void 0 : _g.member) === null || _h === void 0 ? void 0 : _h.abstract) || null,
            },
            publishedAt: dataPost.published_at,
            categories: dataPost.post_categories.map(function (postCategory) { return ({
                id: postCategory.category.id,
                name: postCategory.category.name,
            }); }),
            tags: dataPost.post_tags.map(function (postTag) { return postTag.tag_name; }),
            views: dataPost.views,
            merchandises: dataPost.post_merchandises.map(function (v) { return ({
                id: v.merchandise.id,
                title: v.merchandise.title,
                soldAt: v.merchandise.sold_at ? new Date(v.merchandise.sold_at) : null,
                minPrice: min(v.merchandise.merchandise_specs.map(function (spec) { var _a; return ((_a = v.merchandise) === null || _a === void 0 ? void 0 : _a.sold_at) && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0; })),
                maxPrice: max(v.merchandise.merchandise_specs.map(function (spec) { var _a; return ((_a = v.merchandise) === null || _a === void 0 ? void 0 : _a.sold_at) && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0; })),
                abstract: v.merchandise.abstract,
                description: v.merchandise.description,
                startedAt: v.merchandise.started_at ? new Date(v.merchandise.started_at) : null,
                endedAt: v.merchandise.ended_at ? new Date(v.merchandise.ended_at) : null,
                isLimited: v.merchandise.is_limited,
                isPhysical: v.merchandise.is_physical,
                isCustomized: v.merchandise.is_customized,
                isCountdownTimerVisible: v.merchandise.is_countdown_timer_visible,
                images: v.merchandise.merchandise_imgs.map(function (image) { return ({
                    id: image.id,
                    url: image.url,
                    isCover: image.type === 'cover',
                }); }),
                categories: v.merchandise.merchandise_categories.map(function (merchandiseCategory) { return ({
                    id: merchandiseCategory.id,
                    name: merchandiseCategory.category.name,
                }); }),
                tags: v.merchandise.merchandise_tags.map(function (merchandiseTag) { return merchandiseTag.tag_name; }),
                memberShop: v.merchandise.member_shop
                    ? {
                        id: v.merchandise.member_shop.id,
                        title: v.merchandise.member_shop.title,
                        shippingMethods: v.merchandise.member_shop.shipping_methods,
                    }
                    : null,
                specs: v.merchandise.merchandise_specs.map(function (v) {
                    var _a;
                    return ({
                        id: v.id,
                        title: v.title,
                        listPrice: v.list_price,
                        salePrice: v.sale_price,
                        quota: v.quota,
                        buyableQuantity: ((_a = v.merchandise_spec_inventory_status) === null || _a === void 0 ? void 0 : _a.buyable_quantity) || 0,
                    });
                }),
            }); }),
            description: dataPost.description,
            prevPost: prevPost,
            nextPost: nextPost,
        };
    return {
        loadingPost: loading,
        errorPost: error,
        post: post,
        refetchPosts: refetch,
    };
};
var useNearPost = function (publishedAt) {
    var dataPrevPost = useQuery(gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      query GET_PREV_POST($publishedAt: timestamptz) {\n        post(\n          where: { is_deleted: { _eq: false }, published_at: { _lt: $publishedAt } }\n          order_by: { published_at: desc }\n          limit: 1\n        ) {\n          id\n          code_name\n          title\n        }\n      }\n    "], ["\n      query GET_PREV_POST($publishedAt: timestamptz) {\n        post(\n          where: { is_deleted: { _eq: false }, published_at: { _lt: $publishedAt } }\n          order_by: { published_at: desc }\n          limit: 1\n        ) {\n          id\n          code_name\n          title\n        }\n      }\n    "]))), { variables: { publishedAt: publishedAt } }).data;
    var dataNextPost = useQuery(gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n      query GET_NEXT_POST($publishedAt: timestamptz) {\n        post(\n          where: { is_deleted: { _eq: false }, published_at: { _gt: $publishedAt } }\n          order_by: { published_at: asc }\n          limit: 1\n        ) {\n          id\n          code_name\n          title\n        }\n      }\n    "], ["\n      query GET_NEXT_POST($publishedAt: timestamptz) {\n        post(\n          where: { is_deleted: { _eq: false }, published_at: { _gt: $publishedAt } }\n          order_by: { published_at: asc }\n          limit: 1\n        ) {\n          id\n          code_name\n          title\n        }\n      }\n    "]))), { variables: { publishedAt: publishedAt } }).data;
    var prevPost = (dataPrevPost === null || dataPrevPost === void 0 ? void 0 : dataPrevPost.post[0]) ? {
        id: dataPrevPost.post[0].id,
        codeName: dataPrevPost.post[0].code_name,
        title: dataPrevPost.post[0].title,
    }
        : null;
    var nextPost = (dataNextPost === null || dataNextPost === void 0 ? void 0 : dataNextPost.post[0]) ? {
        id: dataNextPost.post[0].id,
        codeName: dataNextPost.post[0].code_name,
        title: dataNextPost.post[0].title,
    }
        : null;
    return {
        prevPost: prevPost,
        nextPost: nextPost,
    };
};
export var useAddPostViews = function () {
    var addPostViews = useMutation(gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    mutation ADD_POST_VIEWS($id: uuid!) {\n      update_post(where: { id: { _eq: $id } }, _inc: { views: 1 }) {\n        affected_rows\n      }\n    }\n  "], ["\n    mutation ADD_POST_VIEWS($id: uuid!) {\n      update_post(where: { id: { _eq: $id } }, _inc: { views: 1 }) {\n        affected_rows\n      }\n    }\n  "]))))[0];
    return function (id) { return addPostViews({ variables: { id: id } }); };
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=blog.js.map