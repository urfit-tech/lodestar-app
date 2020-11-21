var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { max, min } from 'lodash';
import { flatten, uniq } from 'ramda';
export var useMerchandiseCollection = function (search) {
    if (search === void 0) { search = null; }
    var _a = useQuery(gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      query GET_MERCHANDISE_COLLECTION($search: String) {\n        merchandise(\n          where: {\n            published_at: { _is_null: false }\n            member_shop: { published_at: { _is_null: false } }\n            merchandise_specs: {}\n            title: { _like: $search }\n          }\n          order_by: { position: asc }\n        ) {\n          id\n          title\n          sold_at\n          merchandise_tags(order_by: { position: asc }) {\n            tag_name\n          }\n          merchandise_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          merchandise_imgs(where: { type: { _eq: \"cover\" } }, limit: 1) {\n            id\n            url\n          }\n          merchandise_specs {\n            id\n            title\n            list_price\n            sale_price\n          }\n        }\n      }\n    "], ["\n      query GET_MERCHANDISE_COLLECTION($search: String) {\n        merchandise(\n          where: {\n            published_at: { _is_null: false }\n            member_shop: { published_at: { _is_null: false } }\n            merchandise_specs: {}\n            title: { _like: $search }\n          }\n          order_by: { position: asc }\n        ) {\n          id\n          title\n          sold_at\n          merchandise_tags(order_by: { position: asc }) {\n            tag_name\n          }\n          merchandise_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          merchandise_imgs(where: { type: { _eq: \"cover\" } }, limit: 1) {\n            id\n            url\n          }\n          merchandise_specs {\n            id\n            title\n            list_price\n            sale_price\n          }\n        }\n      }\n    "]))), { variables: { search: search && "%" + search + "%" } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var merchandises = loading || error || !data
        ? []
        : data.merchandise.map(function (merchandise) { return ({
            id: merchandise.id,
            title: merchandise.title,
            soldAt: merchandise.sold_at ? new Date(merchandise.sold_at) : null,
            minPrice: min(merchandise.merchandise_specs.map(function (spec) {
                return merchandise.sold_at &&
                    new Date(merchandise.sold_at).getTime() > Date.now() &&
                    typeof spec.sale_price === 'number'
                    ? spec.sale_price
                    : spec.list_price || 0;
            })),
            maxPrice: max(merchandise.merchandise_specs.map(function (spec) {
                return merchandise.sold_at &&
                    new Date(merchandise.sold_at).getTime() > Date.now() &&
                    typeof spec.sale_price === 'number'
                    ? spec.sale_price
                    : spec.list_price || 0;
            })),
            tags: merchandise.merchandise_tags.map(function (v) { return v.tag_name; }),
            categories: merchandise.merchandise_categories.map(function (v) { return ({
                id: v.category.id,
                name: v.category.name,
            }); }),
            images: merchandise.merchandise_imgs.map(function (v) { return ({
                id: v.id,
                url: v.url,
                isCover: true,
            }); }),
            specs: merchandise.merchandise_specs.map(function (spec) { return ({
                id: spec.id,
                title: spec.title,
                listPrice: spec.list_price,
                salePrice: spec.sale_price,
            }); }),
        }); });
    var merchandiseTags = uniq(flatten(merchandises.map(function (merchandise) { return merchandise.tags; }))).slice(0, 6);
    return {
        loadingMerchandise: loading,
        errorMerchandise: error,
        merchandises: merchandises,
        merchandiseTags: merchandiseTags,
        refetchMerchandise: refetch,
    };
};
export var useMerchandise = function (merchandiseId) {
    var _a = useQuery(gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      query GET_MERCHANDISE($merchandiseId: uuid!) {\n        merchandise_by_pk(id: $merchandiseId) {\n          id\n          title\n          sold_at\n          abstract\n          description\n          started_at\n          ended_at\n          is_limited\n          is_physical\n          is_customized\n          is_countdown_timer_visible\n\n          merchandise_tags(order_by: { position: asc }) {\n            tag_name\n          }\n          merchandise_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          merchandise_imgs(order_by: { position: asc }) {\n            id\n            type\n            url\n          }\n          member_shop {\n            id\n            title\n            shipping_methods\n          }\n          merchandise_specs {\n            id\n            title\n            list_price\n            sale_price\n            quota\n            merchandise_spec_inventory_status {\n              buyable_quantity\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_MERCHANDISE($merchandiseId: uuid!) {\n        merchandise_by_pk(id: $merchandiseId) {\n          id\n          title\n          sold_at\n          abstract\n          description\n          started_at\n          ended_at\n          is_limited\n          is_physical\n          is_customized\n          is_countdown_timer_visible\n\n          merchandise_tags(order_by: { position: asc }) {\n            tag_name\n          }\n          merchandise_categories(order_by: { position: asc }) {\n            id\n            category {\n              id\n              name\n            }\n          }\n          merchandise_imgs(order_by: { position: asc }) {\n            id\n            type\n            url\n          }\n          member_shop {\n            id\n            title\n            shipping_methods\n          }\n          merchandise_specs {\n            id\n            title\n            list_price\n            sale_price\n            quota\n            merchandise_spec_inventory_status {\n              buyable_quantity\n            }\n          }\n        }\n      }\n    "]))), { variables: { merchandiseId: merchandiseId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var merchandise = loading || error || !data || !data.merchandise_by_pk
        ? null
        : {
            id: data.merchandise_by_pk.id,
            title: data.merchandise_by_pk.title,
            soldAt: data.merchandise_by_pk.sold_at ? new Date(data.merchandise_by_pk.sold_at) : null,
            minPrice: min(data.merchandise_by_pk.merchandise_specs.map(function (spec) {
                var _a;
                return ((_a = data.merchandise_by_pk) === null || _a === void 0 ? void 0 : _a.sold_at) &&
                    new Date(data.merchandise_by_pk.sold_at).getTime() > Date.now() &&
                    typeof spec.sale_price === 'number'
                    ? spec.sale_price
                    : spec.list_price || 0;
            })),
            maxPrice: max(data.merchandise_by_pk.merchandise_specs.map(function (spec) {
                var _a;
                return ((_a = data.merchandise_by_pk) === null || _a === void 0 ? void 0 : _a.sold_at) &&
                    new Date(data.merchandise_by_pk.sold_at).getTime() > Date.now() &&
                    typeof spec.sale_price === 'number'
                    ? spec.sale_price
                    : spec.list_price || 0;
            })),
            abstract: data.merchandise_by_pk.abstract,
            description: data.merchandise_by_pk.description,
            startedAt: data.merchandise_by_pk.started_at ? new Date(data.merchandise_by_pk.started_at) : null,
            endedAt: data.merchandise_by_pk.ended_at ? new Date(data.merchandise_by_pk.ended_at) : null,
            isLimited: data.merchandise_by_pk.is_limited,
            isPhysical: data.merchandise_by_pk.is_physical,
            isCustomized: data.merchandise_by_pk.is_customized,
            isCountdownTimerVisible: data.merchandise_by_pk.is_countdown_timer_visible,
            images: data.merchandise_by_pk.merchandise_imgs.map(function (image) { return ({
                id: image.id,
                url: image.url,
                isCover: image.type === 'cover',
            }); }),
            categories: data.merchandise_by_pk.merchandise_categories.map(function (merchandiseCategory) { return ({
                id: merchandiseCategory.id,
                name: merchandiseCategory.category.name,
            }); }),
            tags: data.merchandise_by_pk.merchandise_tags.map(function (merchandiseTag) { return merchandiseTag.tag_name; }),
            memberShop: data.merchandise_by_pk.member_shop
                ? {
                    id: data.merchandise_by_pk.member_shop.id,
                    title: data.merchandise_by_pk.member_shop.title,
                    shippingMethods: data.merchandise_by_pk.member_shop.shipping_methods,
                }
                : null,
            specs: data.merchandise_by_pk.merchandise_specs.map(function (v) {
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
        };
    return {
        loadingMerchandise: loading,
        errorMerchandise: error,
        merchandise: merchandise,
        refetchMerchandise: refetch,
    };
};
export var useOrderLogsWithMerchandiseSpec = function (memberId) {
    var _a = useQuery(gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      query GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC($memberId: String!) {\n        order_log(\n          where: {\n            member_id: { _eq: $memberId }\n            status: { _eq: \"SUCCESS\" }\n            order_products: { product_id: { _like: \"Merchandise%\" } }\n          }\n        ) {\n          id\n          created_at\n          updated_at\n          delivered_at\n          deliver_message\n          shipping\n          invoice\n\n          order_products(where: { product_id: { _like: \"Merchandise%\" } }) {\n            id\n            product_id\n            options\n            order_product_files {\n              id\n              data\n            }\n          }\n          order_contacts {\n            id\n            order_id\n            message\n            created_at\n            updated_at\n            member {\n              id\n              name\n              picture_url\n            }\n          }\n        }\n      }\n    "], ["\n      query GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC($memberId: String!) {\n        order_log(\n          where: {\n            member_id: { _eq: $memberId }\n            status: { _eq: \"SUCCESS\" }\n            order_products: { product_id: { _like: \"Merchandise%\" } }\n          }\n        ) {\n          id\n          created_at\n          updated_at\n          delivered_at\n          deliver_message\n          shipping\n          invoice\n\n          order_products(where: { product_id: { _like: \"Merchandise%\" } }) {\n            id\n            product_id\n            options\n            order_product_files {\n              id\n              data\n            }\n          }\n          order_contacts {\n            id\n            order_id\n            message\n            created_at\n            updated_at\n            member {\n              id\n              name\n              picture_url\n            }\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId }, fetchPolicy: 'no-cache' }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var orderLogs = (data === null || data === void 0 ? void 0 : data.order_log.map(function (v) { return ({
        id: v.id,
        createdAt: new Date(v.created_at),
        updatedAt: v.updated_at && new Date(v.updated_at),
        deliveredAt: v.delivered_at && new Date(v.delivered_at),
        deliverMessage: v.deliver_message,
        shipping: v.shipping,
        invoice: v.invoice,
        orderProducts: v.order_products.map(function (w) {
            var _a;
            return ({
                id: w.id,
                merchandiseSpecId: w.product_id.split('_')[1],
                quantity: ((_a = w.options) === null || _a === void 0 ? void 0 : _a.quantity) || 1,
                filenames: w.order_product_files.map(function (x) { return x.data.name; }),
            });
        }),
    }); })) || [];
    return {
        loadingOrderLogs: loading,
        errorOrderLogs: error,
        orderLogs: orderLogs,
        refetchOrderLogs: refetch,
    };
};
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=merchandise.js.map