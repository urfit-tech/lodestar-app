import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { max, min } from 'lodash'
import { flatten, uniq } from 'ramda'
import hasura from '../hasura'
import { MerchandiseBriefProps, MerchandiseProps, OrderLogWithMerchandiseSpecProps } from '../types/merchandise'

export const useMerchandiseCollection = (options?: {
  search?: string | null
  isPhysical?: boolean
  categories?: string
  ownerId?: string
}) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_MERCHANDISE_COLLECTION,
    hasura.GET_MERCHANDISE_COLLECTIONVariables
  >(
    gql`
      query GET_MERCHANDISE_COLLECTION($search: String, $isPhysical: Boolean, $ownerId: String) {
        merchandise(
          where: {
            published_at: { _is_null: false }
            member_shop: { published_at: { _is_null: false }, member_id: { _eq: $ownerId } }
            title: { _like: $search }
            is_physical: { _eq: $isPhysical }
          }
          order_by: { position: asc, published_at: desc, updated_at: desc }
        ) {
          id
          title
          sold_at
          is_physical
          merchandise_tags(order_by: { position: asc }) {
            tag_name
          }
          merchandise_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
              position
            }
          }
          merchandise_imgs(where: { type: { _eq: "cover" } }, limit: 1) {
            id
            url
          }
          merchandise_specs {
            id
            title
            list_price
            sale_price
          }
        }
      }
    `,
    {
      variables: {
        search: options?.search ? `%${options?.search}%` : undefined,
        isPhysical: options?.isPhysical,
        ownerId: options?.ownerId,
      },
    },
  )

  const merchandises: MerchandiseBriefProps[] =
    loading || error || !data
      ? []
      : data.merchandise
          .filter(merchandise =>
            options?.categories
              ? merchandise.merchandise_categories.some(v => options.categories?.includes(v.category.id))
              : merchandise,
          )
          .map(merchandise => ({
            id: merchandise.id,
            title: merchandise.title,
            soldAt: merchandise.sold_at ? new Date(merchandise.sold_at) : null,
            isPhysical: merchandise.is_physical,
            minPrice: min(
              merchandise.merchandise_specs.map(spec =>
                merchandise.sold_at &&
                new Date(merchandise.sold_at).getTime() > Date.now() &&
                typeof spec.sale_price === 'number'
                  ? spec.sale_price
                  : spec.list_price || 0,
              ),
            ),
            maxPrice: max(
              merchandise.merchandise_specs.map(spec =>
                merchandise.sold_at &&
                new Date(merchandise.sold_at).getTime() > Date.now() &&
                typeof spec.sale_price === 'number'
                  ? spec.sale_price
                  : spec.list_price || 0,
              ),
            ),
            tags: merchandise.merchandise_tags.map(v => v.tag_name),
            categories: merchandise.merchandise_categories.map(v => ({
              id: v.category.id,
              name: v.category.name,
              position: v.category.position,
            })),
            images: merchandise.merchandise_imgs.map(v => ({
              id: v.id,
              url: v.url,
              isCover: true,
            })),
            specs: merchandise.merchandise_specs.map(spec => ({
              id: spec.id,
              title: spec.title,
              listPrice: spec.list_price,
              salePrice: spec.sale_price,
            })),
          }))

  const merchandiseTags = uniq(flatten(merchandises.map(merchandise => merchandise.tags))).slice(0, 6)

  return {
    loadingMerchandise: loading,
    errorMerchandise: error,
    merchandises,
    merchandiseTags,
    refetchMerchandise: refetch,
  }
}

export const useMerchandise = (merchandiseId: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_MERCHANDISE, hasura.GET_MERCHANDISEVariables>(
    gql`
      query GET_MERCHANDISE($merchandiseId: uuid!) {
        merchandise_by_pk(id: $merchandiseId) {
          id
          title
          sold_at
          abstract
          description
          started_at
          ended_at
          is_limited
          is_physical
          is_customized
          is_countdown_timer_visible

          merchandise_tags(order_by: { position: asc }) {
            tag_name
          }
          merchandise_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          merchandise_imgs(order_by: { position: asc }) {
            id
            type
            url
          }
          member_shop {
            id
            title
            shipping_methods
          }
          merchandise_specs {
            id
            title
            list_price
            sale_price
            quota
            merchandise_spec_inventory_status {
              buyable_quantity
            }
          }
        }
      }
    `,
    { variables: { merchandiseId } },
  )

  const merchandise: MerchandiseProps | null =
    loading || error || !data || !data.merchandise_by_pk
      ? null
      : {
          id: data.merchandise_by_pk.id,
          title: data.merchandise_by_pk.title,
          soldAt: data.merchandise_by_pk.sold_at ? new Date(data.merchandise_by_pk.sold_at) : null,
          minPrice: min(
            data.merchandise_by_pk.merchandise_specs.map(spec =>
              data.merchandise_by_pk?.sold_at &&
              new Date(data.merchandise_by_pk.sold_at).getTime() > Date.now() &&
              typeof spec.sale_price === 'number'
                ? spec.sale_price
                : spec.list_price || 0,
            ),
          ),
          maxPrice: max(
            data.merchandise_by_pk.merchandise_specs.map(spec =>
              data.merchandise_by_pk?.sold_at &&
              new Date(data.merchandise_by_pk.sold_at).getTime() > Date.now() &&
              typeof spec.sale_price === 'number'
                ? spec.sale_price
                : spec.list_price || 0,
            ),
          ),
          abstract: data.merchandise_by_pk.abstract,
          description: data.merchandise_by_pk.description,
          startedAt: data.merchandise_by_pk.started_at ? new Date(data.merchandise_by_pk.started_at) : null,
          endedAt: data.merchandise_by_pk.ended_at ? new Date(data.merchandise_by_pk.ended_at) : null,
          isLimited: data.merchandise_by_pk.is_limited,
          isPhysical: data.merchandise_by_pk.is_physical,
          isCustomized: data.merchandise_by_pk.is_customized,
          isCountdownTimerVisible: data.merchandise_by_pk.is_countdown_timer_visible,

          images: data.merchandise_by_pk.merchandise_imgs.map(image => ({
            id: image.id,
            url: image.url,
            isCover: image.type === 'cover',
          })),
          categories: data.merchandise_by_pk.merchandise_categories.map(merchandiseCategory => ({
            id: merchandiseCategory.id,
            name: merchandiseCategory.category.name,
          })),
          tags: data.merchandise_by_pk.merchandise_tags.map(merchandiseTag => merchandiseTag.tag_name),
          memberShop: data.merchandise_by_pk.member_shop
            ? {
                id: data.merchandise_by_pk.member_shop.id,
                title: data.merchandise_by_pk.member_shop.title,
                shippingMethods: data.merchandise_by_pk.member_shop.shipping_methods,
              }
            : null,
          specs: data.merchandise_by_pk.merchandise_specs.map(v => ({
            id: v.id,
            title: v.title,
            listPrice: v.list_price,
            salePrice: v.sale_price,
            quota: v.quota,
            buyableQuantity: v.merchandise_spec_inventory_status?.buyable_quantity || 0,
          })),
        }

  return {
    loadingMerchandise: loading,
    errorMerchandise: error,
    merchandise,
    refetchMerchandise: refetch,
  }
}

export const useOrderLogsWithMerchandiseSpec = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC,
    hasura.GET_ORDER_LOGS_WITH_MERCHANDISE_SPECVariables
  >(
    gql`
      query GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC($memberId: String!) {
        order_log(
          where: {
            member_id: { _eq: $memberId }
            status: { _eq: "SUCCESS" }
            order_products: { product_id: { _like: "Merchandise%" } }
          }
        ) {
          id
          created_at
          updated_at
          delivered_at
          deliver_message
          shipping
          invoice

          order_products(where: { product_id: { _like: "Merchandise%" } }) {
            id
            product_id
            options
            order_product_files {
              id
              data
            }
          }
          order_contacts {
            id
            order_id
            message
            created_at
            updated_at
            member {
              id
              name
              picture_url
            }
          }
        }
      }
    `,
    { variables: { memberId }, fetchPolicy: 'no-cache' },
  )

  const orderLogs: OrderLogWithMerchandiseSpecProps[] =
    data?.order_log.map(v => ({
      id: v.id,
      createdAt: new Date(v.created_at),
      updatedAt: v.updated_at && new Date(v.updated_at),
      deliveredAt: v.delivered_at && new Date(v.delivered_at),
      deliverMessage: v.deliver_message,
      shipping: v.shipping,
      invoice: v.invoice,
      orderProducts: v.order_products.map(w => ({
        id: w.id,
        merchandiseSpecId: w.product_id.split('_')[1],
        quantity: w.options?.quantity || 1,
        filenames: w.order_product_files.map(x => x.data.name),
      })),
    })) || []

  return {
    loadingOrderLogs: loading,
    errorOrderLogs: error,
    orderLogs,
    refetchOrderLogs: refetch,
  }
}
