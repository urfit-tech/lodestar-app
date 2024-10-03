import { gql, useQuery } from '@apollo/client'
import { Exact, Scalars } from 'lodestar-app-element/src/hasura'
import { commonMessages } from 'lodestar-app-element/src/helpers/translation'
import { PeriodType } from 'lodestar-app-element/src/types/data'
import { ProductType } from 'lodestar-app-element/src/types/product'
import { useIntl } from 'react-intl'

export const useMuiltiPeriodProduct = ({ id, startedAts }: { id: string; startedAts: Array<Date> }) => {
  const { formatMessage } = useIntl()
  const [type, targetId] = id.split('_')

  const { loading, error, data } = useQuery<GET_MUILTI_PERIOD_PRODUCT, GET_MUILTI_PERIOD_PRODUCTVariables>(
    GET_MUILTI_PERIOD_PRODUCT,
    {
      variables: {
        targetId,
        startedAts,
      },
    },
  )

  const target: Target | null = data?.program_plan_by_pk
    ? {
        id: data.program_plan_by_pk.id,
        productType: 'ProgramPlan',
        title: `${data.program_plan_by_pk.program?.title || ''} - ${data.program_plan_by_pk.title || ''}`,
        coverUrl: data.program_plan_by_pk.program?.cover_url || undefined,
        listPrice: data.program_plan_by_pk.list_price,
        isOnSale: data.program_plan_by_pk.sold_at
          ? new Date(data.program_plan_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.program_plan_by_pk.sold_at && new Date(data.program_plan_by_pk.sold_at).getTime() > Date.now()
            ? data.program_plan_by_pk.sale_price
            : undefined,
        discountDownPrice: data.program_plan_by_pk.discount_down_price || undefined,
        periodAmount: data.program_plan_by_pk.period_amount,
        periodType: data.program_plan_by_pk.period_type as PeriodType,
        groupBuyingPeople: data.program_plan_by_pk?.group_buying_people || 0,
        isSubscription: !!data.program_plan_by_pk?.auto_renewed,
      }
    : data?.program_package_plan_by_pk
    ? {
        id: data.program_package_plan_by_pk.id,
        productType: 'ProgramPackagePlan',
        title: data.program_package_plan_by_pk.title,
        coverUrl: data.program_package_plan_by_pk.program_package?.cover_url || undefined,
        listPrice: data.program_package_plan_by_pk.list_price,
        isOnSale: data.program_package_plan_by_pk.sold_at
          ? new Date(data.program_package_plan_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.program_package_plan_by_pk.sold_at &&
          new Date(data.program_package_plan_by_pk.sold_at).getTime() > Date.now()
            ? data.program_package_plan_by_pk.sale_price
            : undefined,
        discountDownPrice: data.program_package_plan_by_pk.discount_down_price,
        periodAmount: data.program_package_plan_by_pk.period_amount,
        periodType: data.program_package_plan_by_pk.period_type as PeriodType,
        isSubscription: data.program_package_plan_by_pk.is_subscription,
      }
    : data?.activity_ticket_by_pk
    ? {
        id: data.activity_ticket_by_pk.id,
        productType: 'ActivityTicket',
        title: `${data.activity_ticket_by_pk.activity?.title || ''} - ${data.activity_ticket_by_pk.title || ''}`,
        listPrice: data.activity_ticket_by_pk.price,
        coverUrl: data.activity_ticket_by_pk.activity?.cover_url || undefined,
        isSubscription: false,
        endedAt: data.activity_ticket_by_pk.ended_at,
      }
    : data?.card_by_pk
    ? {
        id: data.card_by_pk.id,
        productType: 'Card',
        title: data.card_by_pk.title,
        listPrice: 0,
        isSubscription: false,
      }
    : data?.project_plan_by_pk
    ? {
        id: data.project_plan_by_pk.id,
        productType: 'ProjectPlan',
        title: `${data.project_plan_by_pk.project?.title || ''} - ${data.project_plan_by_pk.title || ''}`,
        coverUrl: data.project_plan_by_pk.cover_url || undefined,
        listPrice: data.project_plan_by_pk.list_price,
        isOnSale: data.project_plan_by_pk.sold_at
          ? new Date(data.project_plan_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.project_plan_by_pk.sold_at && new Date(data.project_plan_by_pk.sold_at).getTime() > Date.now()
            ? data.project_plan_by_pk.sale_price
            : undefined,
        discountDownPrice: data.project_plan_by_pk.discount_down_price || undefined,
        periodAmount: data.project_plan_by_pk.period_amount,
        periodType: data.project_plan_by_pk.period_type as PeriodType,
        isLimited: data.project_plan_by_pk.is_limited,
        isPhysical: data.project_plan_by_pk.is_physical,
        isSubscription: data.project_plan_by_pk.is_subscription,
        expiredAt: data.project_plan_by_pk.project.expired_at,
      }
    : data?.podcast_program_by_pk
    ? {
        id: data.podcast_program_by_pk.id,
        productType: 'PodcastProgram',
        title: data.podcast_program_by_pk.title,
        coverUrl: data.podcast_program_by_pk.cover_url || undefined,
        listPrice: data.podcast_program_by_pk.list_price,
        isOnSale: data.podcast_program_by_pk.sold_at
          ? new Date(data.podcast_program_by_pk.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.podcast_program_by_pk.sold_at && new Date(data.podcast_program_by_pk.sold_at).getTime() > Date.now()
            ? data.podcast_program_by_pk.sale_price
            : undefined,
        isSubscription: false,
      }
    : data?.podcast_plan_by_pk && data.podcast_plan_by_pk.creator
    ? {
        id: data.podcast_plan_by_pk.id,
        productType: 'PodcastPlan',
        title: `${formatMessage(commonMessages.title.podcastSubscription)} - ${
          data.podcast_plan_by_pk.creator.name || data.podcast_plan_by_pk.creator.username
        }`,
        coverUrl: 'https://static.kolable.com/images/reservation.svg',
        isSubscription: data.podcast_plan_by_pk.is_subscription,
      }
    : data?.appointment_plan_by_pk
    ? {
        id: data.appointment_plan_by_pk.id,
        productType: 'AppointmentPlan',
        title: data.appointment_plan_by_pk.title,
        coverUrl: data.appointment_plan_by_pk.creator && data.appointment_plan_by_pk.creator.picture_url,
        appointment_periods: data.appointment_plan_by_pk.appointment_periods.map(period => ({
          startedAt: period?.started_at,
          endedAt: period?.ended_at,
          booked: period?.booked,
        })),
        isSubscription: false,
      }
    : data?.merchandise_spec_by_pk
    ? {
        id: data.merchandise_spec_by_pk.id,
        productType: 'MerchandiseSpec',
        title: `${data.merchandise_spec_by_pk.merchandise.title} - ${data.merchandise_spec_by_pk.title}`,
        listPrice: data.merchandise_spec_by_pk.list_price,
        isOnSale: data.merchandise_spec_by_pk.merchandise.sold_at
          ? new Date(data.merchandise_spec_by_pk.merchandise.sold_at).getTime() > Date.now()
          : false,
        salePrice:
          data.merchandise_spec_by_pk.merchandise.sold_at &&
          new Date(data.merchandise_spec_by_pk.merchandise.sold_at).getTime() > Date.now()
            ? data.merchandise_spec_by_pk.sale_price
            : undefined,
        coverUrl: data.merchandise_spec_by_pk.merchandise.merchandise_imgs[0]?.url,
        // quantity: options.quantity,
        isPhysical: data.merchandise_spec_by_pk.merchandise.is_physical,
        isCustomized: data.merchandise_spec_by_pk.merchandise.is_customized,
        isSubscription: false,
        currencyId: data.merchandise_spec_by_pk.merchandise.currency_id,
      }
    : data?.voucher_plan_by_pk
    ? {
        id: data.voucher_plan_by_pk.id,
        productType: 'VoucherPlan',
        title: data.voucher_plan_by_pk.title,
        isOnSale: false,
        listPrice: data.voucher_plan_by_pk.sale_price,
        salePrice: data.voucher_plan_by_pk.sale_price,
        saleAmount: data.voucher_plan_by_pk?.sale_amount || 1,
        isSubscription: false,
      }
    : null

  return {
    loading,
    error,
    target,
    type,
  }
}

type GET_MUILTI_PERIOD_PRODUCT = {
  __typename?: 'query_root'
  program_by_pk?: {
    __typename?: 'program'
    id: any
    title: string
    cover_url?: string | null
    is_subscription: boolean
    list_price?: any | null
    sale_price?: any | null
    sold_at?: any | null
    program_categories: Array<{
      __typename?: 'program_category'
      id: any
      category: { __typename?: 'category'; id: string; name: string }
    }>
    program_roles: Array<{
      __typename?: 'program_role'
      id: any
      name: string
      member_id: string
      member?: { __typename?: 'member_public'; id?: string | null; name?: string | null } | null
    }>
  } | null
  program_plan_by_pk?: {
    __typename?: 'program_plan'
    id: any
    title: string
    list_price: any
    sale_price?: any | null
    sold_at?: any | null
    discount_down_price: any
    currency_id: string
    period_amount?: any | null
    period_type?: string | null
    group_buying_people?: any | null
    auto_renewed: boolean
    program: { __typename?: 'program'; id: any; title: string; cover_url?: string | null }
  } | null
  program_package_plan_by_pk?: {
    __typename?: 'program_package_plan'
    id: any
    title: string
    list_price: any
    sale_price?: any | null
    sold_at?: any | null
    discount_down_price?: any | null
    period_amount?: any | null
    period_type?: string | null
    is_subscription: boolean
    program_package: { __typename?: 'program_package'; id: any; title: string; cover_url?: string | null }
  } | null
  card_by_pk?: { __typename?: 'card'; id: any; title: string } | null
  activity_ticket_by_pk?: {
    __typename?: 'activity_ticket'
    id: any
    title: string
    price: any
    ended_at: any
    activity: { __typename?: 'activity'; id: any; title: string; cover_url?: string | null }
  } | null
  project_plan_by_pk?: {
    __typename?: 'project_plan'
    id: any
    title: string
    cover_url?: string | null
    list_price?: any | null
    sale_price?: any | null
    sold_at?: any | null
    discount_down_price: any
    period_amount?: any | null
    period_type?: string | null
    is_limited: boolean
    is_physical: boolean
    is_subscription: boolean
    project: { __typename?: 'project'; id: any; title: string; expired_at?: any | null }
  } | null
  podcast_program_by_pk?: {
    __typename?: 'podcast_program'
    id: any
    title: string
    cover_url?: string | null
    list_price: any
    sale_price?: any | null
    sold_at?: any | null
  } | null
  podcast_plan_by_pk?: {
    __typename?: 'podcast_plan'
    id: any
    title: string
    list_price: any
    sale_price?: any | null
    sold_at?: any | null
    is_subscription: boolean
    creator?: { __typename?: 'member_public'; name?: string | null; username?: string | null } | null
  } | null
  appointment_plan_by_pk?: {
    __typename?: 'appointment_plan'
    id: any
    title: string
    price: any
    creator?: {
      __typename?: 'member_public'
      name?: string | null
      username?: string | null
      picture_url?: string | null
    } | null
    appointment_periods: Array<{
      __typename?: 'appointment_period'
      started_at?: Date | null
      ended_at?: Date | null
      booked?: boolean | null
    }>
  } | null
  merchandise_spec_by_pk?: {
    __typename?: 'merchandise_spec'
    id: any
    title: string
    list_price: any
    sale_price?: any | null
    merchandise: {
      __typename?: 'merchandise'
      id: any
      title: string
      sold_at?: any | null
      is_physical: boolean
      is_customized: boolean
      currency_id: string
      merchandise_imgs: Array<{ __typename?: 'merchandise_img'; id: any; url: string }>
    }
  } | null
  voucher_plan_by_pk?: {
    __typename?: 'voucher_plan'
    id: any
    title: string
    sale_price?: any | null
    sale_amount?: number | null
  } | null
}

type GET_MUILTI_PERIOD_PRODUCTVariables = Exact<{
  targetId: Scalars['uuid']
  startedAts: Array<Scalars['timestamptz']>
}>

export type Target = {
  id: string
  productType: ProductType | null
  title: string
  isSubscription: boolean
  coverUrl?: string | null
  listPrice?: number
  isOnSale?: boolean
  salePrice?: number
  saleAmount?: number
  discountDownPrice?: number
  currencyId?: string
  periodAmount?: number
  periodType?: PeriodType
  startedAt?: Array<Date>
  endedAt?: Array<Date>
  variant?: 'default' | 'simple' | 'cartProduct' | 'simpleCartProduct' | 'checkout'
  isLimited?: boolean
  isPhysical?: boolean
  isCustomized?: boolean
  groupBuyingPeople?: number
  categories?: string[]
  roles?: string[]
  expiredAt?: Date
  appointment_periods?: Array<{
    startedAt?: Date | null
    endedAt?: Date | null
    booked?: boolean | null
  }>
}

const GET_MUILTI_PERIOD_PRODUCT = gql`
<<<<<<< HEAD
  query GET_MUILTI_PERIOD_PRODUCT($targetId: uuid!, $startedAts: [timestamptz!]) {
=======
  query GET_MUILTI_PERIOD_PRODUCT($targetId: uuid!, $startedAts: [timestamptz]) {
>>>>>>> 6e112ebb (Merge branch 'develop' into release)
    program_by_pk(id: $targetId) {
      id
      title
      cover_url
      is_subscription
      list_price
      sale_price
      sold_at
      program_categories(order_by: { position: asc }) {
        id
        category {
          id
          name
        }
      }
      program_roles {
        id
        name
        member_id
        member {
          id
          name
        }
      }
    }
    program_plan_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      discount_down_price
      currency_id
      period_amount
      period_type
      group_buying_people
      program {
        id
        title
        cover_url
      }
      auto_renewed
    }
    program_package_plan_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      discount_down_price
      period_amount
      period_type
      is_subscription
      program_package {
        id
        title
        cover_url
      }
    }
    card_by_pk(id: $targetId) {
      id
      title
    }
    activity_ticket_by_pk(id: $targetId) {
      id
      title
      price
      ended_at
      activity {
        id
        title
        cover_url
      }
    }
    project_plan_by_pk(id: $targetId) {
      id
      title
      cover_url
      list_price
      sale_price
      sold_at
      discount_down_price
      period_amount
      period_type
      project {
        id
        title
        expired_at
      }
      is_limited
      is_physical
      is_subscription
    }
    podcast_program_by_pk(id: $targetId) {
      id
      title
      cover_url
      list_price
      sale_price
      sold_at
    }
    podcast_plan_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      creator {
        name
        username
      }
      is_subscription
    }
    appointment_plan_by_pk(id: $targetId) {
      id
      title
      price
      creator {
        name
        username
        picture_url
      }
      appointment_periods(where: { started_at: { _in: $startedAts } }) {
        started_at
        ended_at
        booked
      }
    }
    merchandise_spec_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      merchandise {
        id
        title
        sold_at
        is_physical
        is_customized
        currency_id
        merchandise_imgs(where: { type: { _eq: "cover" } }) {
          id
          url
        }
      }
    }
    voucher_plan_by_pk(id: $targetId) {
      id
      title
      sale_price
      sale_amount
    }
  }
`
