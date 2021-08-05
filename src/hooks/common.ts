import { useApolloClient, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useIntl } from 'react-intl'
import { useAuth } from '../components/auth/AuthContext'
import { useApp } from '../containers/common/AppContext'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { commonMessages } from '../helpers/translation'
import { ProductType } from '../types/product'
import { PeriodType } from '../types/program'

type TargetProps = {
  id: string
  productType: ProductType | null
  title: string
  coverUrl?: string | null
  listPrice?: number
  salePrice?: number
  discountDownPrice?: number
  currencyId?: string
  periodAmount?: number
  periodType?: PeriodType
  startedAt?: Date
  endedAt?: Date
  variant?: 'default' | 'simple' | 'cartProduct' | 'simpleCartProduct' | 'checkout'
  isSubscription?: boolean
  isLimited?: boolean
  isPhysical?: boolean
  isCustomized?: boolean
  groupBuyingPeople?: number
} | null

export const useSimpleProduct = ({ id, startedAt }: { id: string; startedAt?: Date }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const [, targetId] = id.split('_')

  const { loading, error, data } = useQuery<hasura.GET_PRODUCT_SIMPLE, hasura.GET_PRODUCT_SIMPLEVariables>(
    GET_PRODUCT_SIMPLE,
    {
      variables: {
        targetId,
        startedAt,
      },
    },
  )

  const target: TargetProps =
    loading || error || !data
      ? null
      : data.program_by_pk
      ? {
          id: data.program_by_pk.id,
          productType: 'Program',
          title: data.program_by_pk.title,
          coverUrl: data.program_by_pk.cover_url || undefined,
          listPrice: data.program_by_pk.list_price,
          salePrice:
            data.program_by_pk.sold_at && new Date(data.program_by_pk.sold_at).getTime() > Date.now()
              ? data.program_by_pk.sale_price
              : undefined,
        }
      : data.program_plan_by_pk
      ? {
          id: data.program_plan_by_pk.id,
          productType: 'ProgramPlan',
          title: `${data.program_plan_by_pk.program.title} - ${data.program_plan_by_pk.title || ''}`,
          coverUrl: data.program_plan_by_pk.program.cover_url || undefined,
          listPrice: data.program_plan_by_pk.list_price,
          salePrice:
            data.program_plan_by_pk.sold_at && new Date(data.program_plan_by_pk.sold_at).getTime() > Date.now()
              ? data.program_plan_by_pk.sale_price
              : undefined,
          discountDownPrice: data.program_plan_by_pk.discount_down_price || undefined,
          currencyId: data.program_plan_by_pk.currency_id || settings['currency_id'],
          periodAmount: data.program_plan_by_pk.period_amount,
          periodType: data.program_plan_by_pk.period_type as PeriodType,
          groupBuyingPeople: data.program_plan_by_pk?.group_buying_people || 0,
        }
      : data.program_package_plan_by_pk
      ? {
          id: data.program_package_plan_by_pk.id,
          productType: 'ProgramPackagePlan',
          title: data.program_package_plan_by_pk.title,
          coverUrl: data.program_package_plan_by_pk.program_package.cover_url || undefined,
          listPrice: data.program_package_plan_by_pk.list_price,
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
          title: `${data.project_plan_by_pk.project.title} - ${data.project_plan_by_pk.title}`,
          coverUrl: data.project_plan_by_pk.cover_url || undefined,
          listPrice: data.project_plan_by_pk.list_price,
          salePrice:
            data.project_plan_by_pk.sold_at && new Date(data.project_plan_by_pk.sold_at).getTime() > Date.now()
              ? data.project_plan_by_pk.sale_price
              : undefined,
          discountDownPrice: data.project_plan_by_pk.discount_down_price || undefined,
          periodAmount: data.project_plan_by_pk.period_amount,
          periodType: data.project_plan_by_pk.period_type as PeriodType,
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
          salePrice:
            data.podcast_program_by_pk.sold_at && new Date(data.podcast_program_by_pk.sold_at).getTime() > Date.now()
              ? data.podcast_program_by_pk.sale_price
              : undefined,
        }
      : data.podcast_plan_by_pk && data.podcast_plan_by_pk.creator
      ? {
          id: data.podcast_plan_by_pk.id,
          productType: 'PodcastPlan',
          title: `${formatMessage(commonMessages.title.podcastSubscription)} - ${
            data.podcast_plan_by_pk.creator.name || data.podcast_plan_by_pk.creator.username
          }`,
          coverUrl: 'https://static.kolable.com/images/reservation.svg',
        }
      : data.appointment_plan_by_pk
      ? {
          id: data.appointment_plan_by_pk.id,
          productType: 'AppointmentPlan',
          title: data.appointment_plan_by_pk.title,
          coverUrl: data.appointment_plan_by_pk.creator && data.appointment_plan_by_pk.creator.picture_url,
          startedAt: data.appointment_plan_by_pk.appointment_periods[0]?.started_at,
          endedAt: data.appointment_plan_by_pk.appointment_periods[0]?.ended_at,
        }
      : data.merchandise_by_pk
      ? {
          id: data.merchandise_by_pk.id,
          productType: 'Merchandise',
          title: data.merchandise_by_pk.title,
          listPrice: data.merchandise_by_pk.list_price,
          salePrice:
            data.merchandise_by_pk.sold_at && new Date(data.merchandise_by_pk.sold_at).getTime() > Date.now()
              ? data.merchandise_by_pk.sale_price
              : undefined,
          coverUrl: data.merchandise_by_pk.merchandise_imgs[0]?.url,
          isPhysical: data.merchandise_by_pk.is_physical,
        }
      : data.merchandise_spec_by_pk
      ? {
          id: data.merchandise_spec_by_pk.id,
          productType: 'MerchandiseSpec',
          title: `${data.merchandise_spec_by_pk.merchandise.title} - ${data.merchandise_spec_by_pk.title}`,
          listPrice: data.merchandise_spec_by_pk.list_price,
          salePrice:
            data.merchandise_spec_by_pk.merchandise.sold_at &&
            new Date(data.merchandise_spec_by_pk.merchandise.sold_at).getTime() > Date.now()
              ? data.merchandise_spec_by_pk.sale_price
              : undefined,
          coverUrl: data.merchandise_spec_by_pk.merchandise.merchandise_imgs[0]?.url,
          // quantity: options.quantity,
          isPhysical: data.merchandise_spec_by_pk.merchandise.is_physical,
          isCustomized: data.merchandise_spec_by_pk.merchandise.is_customized,
        }
      : {
          id: targetId,
          productType: null,
          title: '',
        }

  return {
    loading,
    error,
    target,
  }
}

const GET_PRODUCT_SIMPLE = gql`
  query GET_PRODUCT_SIMPLE($targetId: uuid!, $startedAt: timestamptz) {
    program_by_pk(id: $targetId) {
      id
      title
      cover_url
      is_subscription
      list_price
      sale_price
      sold_at
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
      }
      is_limited
      is_physical
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
      appointment_periods(where: { started_at: { _eq: $startedAt } }) {
        started_at
        ended_at
        booked
      }
    }
    merchandise_by_pk(id: $targetId) {
      id
      title
      list_price
      sale_price
      sold_at
      is_physical
      merchandise_imgs(where: { type: { _eq: "cover" } }) {
        url
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
        merchandise_imgs(where: { type: { _eq: "cover" } }) {
          id
          url
        }
      }
    }
  }
`

export const useMemberValidation = (email: string) => {
  const { currentMemberId } = useAuth()
  const { id: appId } = useApp()
  const { loading, error, data, refetch } = useQuery(
    gql`
      query SEARCH_MEMBER($email: String!, $appId: String!) {
        member_public(where: { email: { _eq: $email }, app_id: { _eq: $appId } }) {
          id
        }
      }
    `,
    { variables: { email, appId } },
  )

  const memberId: string | null = data?.member_public[0]?.id || null

  const validateStatus: 'success' | 'error' | 'validating' | undefined = !email
    ? undefined
    : loading
    ? 'validating'
    : !memberId || memberId === currentMemberId
    ? 'error'
    : 'success'

  return {
    loadingMemberId: loading,
    errorMemberId: error,
    memberId,
    validateStatus,
    refetchMemberId: refetch,
  }
}

export const useSearchMembers = () => {
  const apolloClient = useApolloClient()
  const { id: appId } = useApp()
  const searchMembers = async (emails: string[]) => {
    try {
      const { data } = await apolloClient.query<hasura.SEARCH_MEMBERS, hasura.SEARCH_MEMBERSVariables>({
        query: gql`
          query SEARCH_MEMBERS($emails: [String!]!, $appId: String!) {
            member_public(where: { email: { _in: $emails }, app_id: { _eq: $appId } }) {
              id
              email
            }
          }
        `,
        variables: {
          emails: emails.filter(notEmpty),
          appId,
        },
        fetchPolicy: 'no-cache',
      })

      const members =
        data?.member_public
          .filter(v => v.id && v.email)
          .map(v => ({
            id: v.id || '',
            email: v.email || '',
          })) || []

      return members
    } catch {
      return []
    }
  }

  return searchMembers
}
