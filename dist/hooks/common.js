var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useIntl } from 'react-intl';
import { commonMessages } from '../helpers/translation';
export var useSimpleProduct = function (_a) {
    var _b, _c, _d, _e;
    var id = _a.id, startedAt = _a.startedAt;
    var formatMessage = useIntl().formatMessage;
    var _f = id.split('_'), targetId = _f[1];
    var _g = useQuery(GET_PRODUCT_SIMPLE, {
        variables: {
            targetId: targetId,
            startedAt: startedAt,
        },
    }), loading = _g.loading, error = _g.error, data = _g.data;
    var target = loading || error || !data
        ? null
        : data.program_by_pk
            ? {
                id: data.program_by_pk.id,
                productType: 'Program',
                title: data.program_by_pk.title,
                coverUrl: data.program_by_pk.cover_url || undefined,
                listPrice: data.program_by_pk.list_price,
                salePrice: data.program_by_pk.sold_at && new Date(data.program_by_pk.sold_at).getTime() > Date.now()
                    ? data.program_by_pk.sale_price
                    : undefined,
            }
            : data.program_plan_by_pk
                ? {
                    id: data.program_plan_by_pk.id,
                    productType: 'ProgramPlan',
                    title: data.program_plan_by_pk.program.title + " - " + (data.program_plan_by_pk.title || ''),
                    coverUrl: data.program_plan_by_pk.program.cover_url || undefined,
                    listPrice: data.program_plan_by_pk.list_price,
                    salePrice: data.program_plan_by_pk.sold_at && new Date(data.program_plan_by_pk.sold_at).getTime() > Date.now()
                        ? data.program_plan_by_pk.sale_price
                        : undefined,
                    discountDownPrice: data.program_plan_by_pk.discount_down_price || undefined,
                    periodType: data.program_plan_by_pk.period_type,
                }
                : data.program_package_plan_by_pk
                    ? {
                        id: data.program_package_plan_by_pk.id,
                        productType: 'ProgramPackagePlan',
                        title: data.program_package_plan_by_pk.title,
                        coverUrl: data.program_package_plan_by_pk.program_package.cover_url || undefined,
                        listPrice: data.program_package_plan_by_pk.list_price,
                        salePrice: data.program_package_plan_by_pk.sold_at &&
                            new Date(data.program_package_plan_by_pk.sold_at).getTime() > Date.now()
                            ? data.program_package_plan_by_pk.sale_price
                            : undefined,
                        discountDownPrice: data.program_package_plan_by_pk.discount_down_price,
                        periodAmount: data.program_package_plan_by_pk.period_amount,
                        periodType: data.program_package_plan_by_pk.period_type,
                        isSubscription: data.program_package_plan_by_pk.is_subscription,
                    }
                    : data.card_by_pk
                        ? {
                            id: data.card_by_pk.id,
                            productType: 'Card',
                            title: data.card_by_pk.title,
                            listPrice: 0,
                        }
                        : data.project_plan_by_pk
                            ? {
                                id: data.project_plan_by_pk.id,
                                productType: 'ProjectPlan',
                                title: data.project_plan_by_pk.project.title + " - " + data.project_plan_by_pk.title,
                                coverUrl: data.project_plan_by_pk.cover_url || undefined,
                                listPrice: data.project_plan_by_pk.list_price,
                                salePrice: data.project_plan_by_pk.sold_at && new Date(data.project_plan_by_pk.sold_at).getTime() > Date.now()
                                    ? data.project_plan_by_pk.sale_price
                                    : undefined,
                                discountDownPrice: data.project_plan_by_pk.discount_down_price || undefined,
                                periodAmount: data.project_plan_by_pk.period_amount,
                                periodType: data.project_plan_by_pk.period_type,
                                isLimited: data.project_plan_by_pk.is_limited,
                                isPhysical: data.project_plan_by_pk.is_physical,
                            }
                            : data.podcast_program_by_pk
                                ? {
                                    id: data.podcast_program_by_pk.id,
                                    productType: 'PodcastProgram',
                                    title: data.podcast_program_by_pk.title,
                                    coverUrl: data.podcast_program_by_pk.cover_url,
                                    listPrice: data.podcast_program_by_pk.list_price,
                                    salePrice: data.podcast_program_by_pk.sold_at && new Date(data.podcast_program_by_pk.sold_at).getTime() > Date.now()
                                        ? data.podcast_program_by_pk.sale_price
                                        : undefined,
                                }
                                : data.podcast_plan_by_pk && data.podcast_plan_by_pk.creator
                                    ? {
                                        id: data.podcast_plan_by_pk.id,
                                        productType: 'PodcastPlan',
                                        title: formatMessage(commonMessages.title.podcastSubscription) + " - " + (data.podcast_plan_by_pk.creator.name || data.podcast_plan_by_pk.creator.username),
                                        coverUrl: 'https://static.kolable.com/images/reservation.svg',
                                    }
                                    : data.appointment_plan_by_pk
                                        ? {
                                            id: data.appointment_plan_by_pk.id,
                                            productType: 'AppointmentPlan',
                                            title: data.appointment_plan_by_pk.title,
                                            coverUrl: data.appointment_plan_by_pk.creator && data.appointment_plan_by_pk.creator.picture_url,
                                            startedAt: (_b = data.appointment_plan_by_pk.appointment_periods[0]) === null || _b === void 0 ? void 0 : _b.started_at,
                                            endedAt: (_c = data.appointment_plan_by_pk.appointment_periods[0]) === null || _c === void 0 ? void 0 : _c.ended_at,
                                        }
                                        : data.merchandise_by_pk
                                            ? {
                                                id: data.merchandise_by_pk.id,
                                                productType: 'Merchandise',
                                                title: data.merchandise_by_pk.title,
                                                listPrice: data.merchandise_by_pk.list_price,
                                                salePrice: data.merchandise_by_pk.sold_at && new Date(data.merchandise_by_pk.sold_at).getTime() > Date.now()
                                                    ? data.merchandise_by_pk.sale_price
                                                    : undefined,
                                                coverUrl: (_d = data.merchandise_by_pk.merchandise_imgs[0]) === null || _d === void 0 ? void 0 : _d.url,
                                                isPhysical: data.merchandise_by_pk.is_physical,
                                            }
                                            : data.merchandise_spec_by_pk
                                                ? {
                                                    id: data.merchandise_spec_by_pk.id,
                                                    productType: 'MerchandiseSpec',
                                                    title: data.merchandise_spec_by_pk.merchandise.title + " - " + data.merchandise_spec_by_pk.title,
                                                    listPrice: data.merchandise_spec_by_pk.list_price,
                                                    salePrice: data.merchandise_spec_by_pk.merchandise.sold_at &&
                                                        new Date(data.merchandise_spec_by_pk.merchandise.sold_at).getTime() > Date.now()
                                                        ? data.merchandise_spec_by_pk.sale_price
                                                        : undefined,
                                                    coverUrl: (_e = data.merchandise_spec_by_pk.merchandise.merchandise_imgs[0]) === null || _e === void 0 ? void 0 : _e.url,
                                                    // quantity: options.quantity,
                                                    isPhysical: data.merchandise_spec_by_pk.merchandise.is_physical,
                                                    isCustomized: data.merchandise_spec_by_pk.merchandise.is_customized,
                                                }
                                                : {
                                                    id: targetId,
                                                    productType: null,
                                                    title: '',
                                                };
    return {
        loading: loading,
        error: error,
        target: target,
    };
};
var GET_PRODUCT_SIMPLE = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  query GET_PRODUCT_SIMPLE($targetId: uuid!, $startedAt: timestamptz) {\n    program_by_pk(id: $targetId) {\n      id\n      title\n      cover_url\n      is_subscription\n      list_price\n      sale_price\n      sold_at\n    }\n    program_plan_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      discount_down_price\n      period_type\n      program {\n        id\n        title\n        cover_url\n      }\n    }\n    program_package_plan_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      discount_down_price\n      period_amount\n      period_type\n      is_subscription\n      program_package {\n        id\n        title\n        cover_url\n      }\n    }\n    card_by_pk(id: $targetId) {\n      id\n      title\n    }\n    activity_ticket_by_pk(id: $targetId) {\n      id\n      title\n      price\n      activity {\n        id\n        title\n        cover_url\n      }\n    }\n    project_plan_by_pk(id: $targetId) {\n      id\n      title\n      cover_url\n      list_price\n      sale_price\n      sold_at\n      discount_down_price\n      period_amount\n      period_type\n      project {\n        id\n        title\n      }\n      is_limited\n      is_physical\n    }\n    podcast_program_by_pk(id: $targetId) {\n      id\n      title\n      cover_url\n      list_price\n      sale_price\n      sold_at\n    }\n    podcast_plan_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      creator {\n        name\n        username\n      }\n    }\n    appointment_plan_by_pk(id: $targetId) {\n      id\n      title\n      price\n      creator {\n        name\n        username\n        picture_url\n      }\n      appointment_periods(where: { started_at: { _eq: $startedAt } }) {\n        started_at\n        ended_at\n        booked\n      }\n    }\n    merchandise_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      is_physical\n      merchandise_imgs(where: { type: { _eq: \"cover\" } }) {\n        url\n      }\n    }\n    merchandise_spec_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      merchandise {\n        id\n        title\n        sold_at\n        is_physical\n        is_customized\n        merchandise_imgs(where: { type: { _eq: \"cover\" } }) {\n          id\n          url\n        }\n      }\n    }\n  }\n"], ["\n  query GET_PRODUCT_SIMPLE($targetId: uuid!, $startedAt: timestamptz) {\n    program_by_pk(id: $targetId) {\n      id\n      title\n      cover_url\n      is_subscription\n      list_price\n      sale_price\n      sold_at\n    }\n    program_plan_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      discount_down_price\n      period_type\n      program {\n        id\n        title\n        cover_url\n      }\n    }\n    program_package_plan_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      discount_down_price\n      period_amount\n      period_type\n      is_subscription\n      program_package {\n        id\n        title\n        cover_url\n      }\n    }\n    card_by_pk(id: $targetId) {\n      id\n      title\n    }\n    activity_ticket_by_pk(id: $targetId) {\n      id\n      title\n      price\n      activity {\n        id\n        title\n        cover_url\n      }\n    }\n    project_plan_by_pk(id: $targetId) {\n      id\n      title\n      cover_url\n      list_price\n      sale_price\n      sold_at\n      discount_down_price\n      period_amount\n      period_type\n      project {\n        id\n        title\n      }\n      is_limited\n      is_physical\n    }\n    podcast_program_by_pk(id: $targetId) {\n      id\n      title\n      cover_url\n      list_price\n      sale_price\n      sold_at\n    }\n    podcast_plan_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      creator {\n        name\n        username\n      }\n    }\n    appointment_plan_by_pk(id: $targetId) {\n      id\n      title\n      price\n      creator {\n        name\n        username\n        picture_url\n      }\n      appointment_periods(where: { started_at: { _eq: $startedAt } }) {\n        started_at\n        ended_at\n        booked\n      }\n    }\n    merchandise_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      sold_at\n      is_physical\n      merchandise_imgs(where: { type: { _eq: \"cover\" } }) {\n        url\n      }\n    }\n    merchandise_spec_by_pk(id: $targetId) {\n      id\n      title\n      list_price\n      sale_price\n      merchandise {\n        id\n        title\n        sold_at\n        is_physical\n        is_customized\n        merchandise_imgs(where: { type: { _eq: \"cover\" } }) {\n          id\n          url\n        }\n      }\n    }\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=common.js.map