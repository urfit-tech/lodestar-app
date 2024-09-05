import { ApolloClient, gql, useApolloClient, useQuery } from '@apollo/client'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { MetaProductType } from 'lodestar-app-element/src/types/metaProduct'
import { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../hasura'
import { getProductEnrollmentFromLodestar, useDeepCompareEffect } from '../helpers'
import { commonMessages } from '../helpers/translation'
import { MemberPageProductType, ProductData, SignupProperty } from '../types/general'
import { Product, ProductType } from '../types/product'
import { PeriodType } from '../types/program'
import { executeQuery } from './util'

const GetProgramPlanProducts = gql`
  query GetProgramPlanProducts($targetIds: [uuid!]!) {
    program_plan(where: { id: { _in: $targetIds }, is_deleted: { _eq: false } }) {
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
        cover_thumbnail_url
        cover_type
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
      auto_renewed
    }
  }
`
const GetProgramPackagePlanProducts = gql`
  query GetProgramPackagePlanProducts($targetIds: [uuid!]!) {
    program_package_plan(where: { id: { _in: $targetIds } }) {
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
  }
`
const GetActivityTicketProducts = gql`
  query GetActivityTicketProducts($targetIds: [uuid!]!) {
    activity_ticket(where: { id: { _in: $targetIds }, deleted_at: { _is_null: true } }) {
      id
      title
      price
      activity {
        id
        title
        cover_url
      }
    }
  }
`
const GetCardProducts = gql`
  query GetCardProducts($targetIds: [uuid!]!) {
    card(where: { id: { _in: $targetIds }, deleted_at: { _is_null: true } }) {
      id
      title
    }
  }
`
const GetProjectPlanProducts = gql`
  query GetProjectPlanProducts($targetIds: [uuid!]!) {
    project_plan(where: { id: { _in: $targetIds } }) {
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
      is_subscription
    }
  }
`
const GetPodcastProgramProducts = gql`
  query GetPodcastProgramProducts($targetIds: [uuid!]!) {
    podcast_program(where: { id: { _in: $targetIds } }) {
      id
      title
      cover_url
      list_price
      sale_price
      sold_at
    }
  }
`
const GetPodcastPlanProducts = gql`
  query GetPodcastPlanProducts($targetIds: [uuid!]!) {
    podcast_plan(where: { id: { _in: $targetIds } }) {
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
  }
`
const GetAppointmentPlanProducts = gql`
  query GetAppointmentPlanProducts($targetIds: [uuid!]!) {
    appointment_plan(where: { id: { _in: $targetIds } }) {
      id
      title
      price
      creator {
        name
        username
        picture_url
      }
      appointment_periods {
        started_at
        ended_at
        booked
      }
    }
  }
`
const GetMerchandiseSpecProducts = gql`
  query GetMerchandiseSpecProducts($targetIds: [uuid!]!) {
    merchandise_spec(where: { id: { _in: $targetIds }, is_deleted: { _eq: false } }) {
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
  }
`

const strategyProductMap: {
  [key: string]: (product: {
    productIds: string[]
    queryClient: ApolloClient<object>
    options: { podcastSubscription?: string }
  }) => Promise<Product[]>
} = {
  ProgramPlan: async product => {
    const data: hasura.GetProgramPlanProducts = await executeQuery(product.queryClient, {
      query: GetProgramPlanProducts,
      variables: { targetIds: product.productIds },
    })
    return (
      data?.program_plan.map(v => ({
        targetId: v.id,
        productType: 'ProgramPlan',
        title: `${v.program?.title || ''} - ${v.title || ''}`,
        coverUrl: v.program?.cover_url || '',
        coverType: v.program?.cover_type || '',
        coverThumbnailUrl: v.program?.cover_thumbnail_url || '',
        listPrice: v.list_price,
        isOnSale: v.sold_at ? new Date(v.sold_at).getTime() > Date.now() : false,
        salePrice: v.sold_at && new Date(v.sold_at).getTime() > Date.now() ? v.sale_price : undefined,
        discountDownPrice: v?.discount_down_price || 0,
        periodAmount: v.period_amount,
        periodType: v.period_type as PeriodType,
        groupBuyingPeople: v?.group_buying_people || 0,
        isSubscription: !!v?.auto_renewed,
      })) || []
    )
  },
  ProgramPackagePlan: async product => {
    const data: hasura.GetProgramPackagePlanProducts = await executeQuery(product.queryClient, {
      query: GetProgramPackagePlanProducts,
      variables: { targetIds: product.productIds },
    })
    return (
      data?.program_package_plan.map(v => ({
        targetId: v.id,
        productType: 'ProgramPackagePlan',
        title: v.title,
        coverUrl: v.program_package?.cover_url || '',
        listPrice: v.list_price,
        isOnSale: v.sold_at ? new Date(v.sold_at).getTime() > Date.now() : false,
        salePrice: v.sold_at && new Date(v.sold_at).getTime() > Date.now() ? v.sale_price : undefined,
        discountDownPrice: v.discount_down_price,
        periodAmount: v.period_amount,
        periodType: v.period_type as PeriodType,
        isSubscription: v.is_subscription,
      })) || []
    )
  },
  ActivityTicket: async product => {
    const data: hasura.GetActivityTicketProducts = await executeQuery(product.queryClient, {
      query: GetActivityTicketProducts,
      variables: { targetIds: product.productIds },
    })
    return (
      data.activity_ticket.map(v => ({
        targetId: v.id,
        productType: 'ActivityTicket',
        title: `${v.activity?.title || ''} - ${v.title || ''}`,
        listPrice: v.price,
        coverUrl: v.activity?.cover_url || '',
        isSubscription: false,
      })) || []
    )
  },
  Card: async product => {
    const data: hasura.GetCardProducts = await executeQuery(product.queryClient, {
      query: GetCardProducts,
      variables: { targetIds: product.productIds },
    })
    return data.card.map(v => ({
      targetId: v.id,
      productType: 'Card',
      title: v.title,
      listPrice: 0,
      isSubscription: false,
    }))
  },
  ProjectPlan: async product => {
    const data: hasura.GetProjectPlanProducts = await executeQuery(product.queryClient, {
      query: GetProjectPlanProducts,
      variables: { targetIds: product.productIds },
    })
    return (
      data.project_plan.map(v => ({
        targetId: v.id,
        productType: 'ProjectPlan',
        title: `${v.project?.title || ''} - ${v.title || ''}`,
        coverUrl: v.cover_url || '',
        listPrice: v.list_price,
        isOnSale: v.sold_at ? new Date(v.sold_at).getTime() > Date.now() : false,
        salePrice: v.sold_at && new Date(v.sold_at).getTime() > Date.now() ? v.sale_price : 0,
        discountDownPrice: v.discount_down_price || 0,
        periodAmount: v.period_amount,
        periodType: v.period_type as PeriodType,
        isLimited: v.is_limited,
        isPhysical: v.is_physical,
        isSubscription: v.is_subscription,
      })) || []
    )
  },
  PodcastProgram: async product => {
    const data: hasura.GetPodcastProgramProducts = await executeQuery(product.queryClient, {
      query: GetPodcastProgramProducts,
      variables: { targetIds: product.productIds },
    })
    return data.podcast_program.map(v => ({
      targetId: v.id,
      productType: 'PodcastProgram',
      title: v.title,
      coverUrl: v.cover_url || '',
      listPrice: v.list_price,
      isOnSale: v.sold_at ? new Date(v.sold_at).getTime() > Date.now() : false,
      salePrice: v.sold_at && new Date(v.sold_at).getTime() > Date.now() ? v.sale_price : 0,
      isSubscription: false,
    }))
  },
  PodcastPlan: async product => {
    const data: hasura.GetPodcastPlanProducts = await executeQuery(product.queryClient, {
      query: GetPodcastPlanProducts,
      variables: { targetIds: product.productIds },
    })
    return data.podcast_plan.map(v => ({
      targetId: v.id,
      productType: 'PodcastPlan',
      title: `${product.options?.podcastSubscription || ''} - ${v.creator?.name || v.creator?.username || ''}`,
      coverUrl: 'https://static.kolable.com/images/reservation.svg',
      isSubscription: v.is_subscription,
    }))
  },
  AppointmentPlan: async product => {
    const data: hasura.GetAppointmentPlanProducts = await executeQuery(product.queryClient, {
      query: GetAppointmentPlanProducts,
      variables: { targetIds: product.productIds },
    })
    return data.appointment_plan.map(v => ({
      targetId: v.id,
      productType: 'AppointmentPlan',
      title: v.title,
      coverUrl: v.creator?.picture_url || '',
      startedAt: v.appointment_periods[0]?.started_at,
      endedAt: v.appointment_periods[0]?.ended_at,
      isSubscription: false,
    }))
  },
  MerchandiseSpec: async product => {
    const data: hasura.GetMerchandiseSpecProducts = await executeQuery(product.queryClient, {
      query: GetMerchandiseSpecProducts,
      variables: { targetIds: product.productIds },
    })
    return data.merchandise_spec.map(v => ({
      targetId: v.id,
      productType: 'MerchandiseSpec',
      title: `${v.merchandise.title} - ${v.title}`,
      listPrice: v.list_price,
      isOnSale: v.merchandise.sold_at ? new Date(v.merchandise.sold_at).getTime() > Date.now() : false,
      salePrice: v.merchandise.sold_at && new Date(v.merchandise.sold_at).getTime() > Date.now() ? v.sale_price : 0,
      currencyId: v.merchandise.currency_id,
      coverUrl: v.merchandise.merchandise_imgs[0]?.url,
      isPhysical: v.merchandise.is_physical,
      isCustomized: v.merchandise.is_customized,
      isSubscription: false,
    }))
  },
}

export const useProductCollection = (productIds: string[]) => {
  const queryClient = useApolloClient()
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Product[]>([])
  const podcastSubscription = formatMessage(commonMessages.title.podcastSubscription)

  const fetchProductsData = useCallback(
    async (productIds: string[]) => {
      try {
        setLoading(true)
        const productData = productIds.reduce((accumulator, currentValue) => {
          const [productType, targetId] = currentValue.split('_')
          return {
            ...accumulator,
            [productType]: [...(accumulator[productType] || []), targetId],
          }
        }, {} as Record<string, string[]>)
        const productTypes = Object.keys(productData) as ProductType[]

        const products = await Promise.all(
          productTypes.map(async productType => {
            const productIds = productData[productType]
            return await strategyProductMap[productType]({
              productIds,
              queryClient,
              options: { podcastSubscription },
            })
          }),
        )
        setResult(products.flat())
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    },
    [podcastSubscription, queryClient],
  )

  useDeepCompareEffect(() => {
    fetchProductsData(productIds)
  }, [productIds])

  return {
    loading,
    productCollection: result,
  }
}

export const GET_PRODUCT_SKU = gql`
  query GET_PRODUCT_SKU($targetId: String!) {
    product(where: { target: { _eq: $targetId } }) {
      id
      type
      target
      sku
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
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/
  const isEmailInvalid = !!email && !emailRegex.test(email)
  const memberId: string | null = data?.member_public[0]?.id || null

  type Status = 'success' | 'error' | 'validating' | undefined

  const siteMemberValidateStatus: Status = !email
    ? undefined
    : loading
    ? 'validating'
    : !memberId || memberId === currentMemberId || isEmailInvalid
    ? 'error'
    : 'success'

  const nonMemberValidateStatus: Status = !email
    ? undefined
    : loading
    ? 'validating'
    : memberId === currentMemberId || isEmailInvalid
    ? 'error'
    : 'success'

  return {
    errorMemberId: error,
    isEmailInvalid,
    memberId,
    siteMemberValidateStatus,
    nonMemberValidateStatus,
    refetchMemberId: refetch,
  }
}

export const useIdentity = (type: MetaProductType, roleName?: string) => {
  const condition: hasura.GET_IDENTITYVariables['condition'] = {
    type: { _eq: type },
    name: { _eq: roleName },
  }
  const { loading, error, data } = useQuery<hasura.GET_IDENTITY, hasura.GET_IDENTITYVariables>(
    gql`
      query GET_IDENTITY($condition: identity_bool_exp!) {
        identity(where: $condition, order_by: { position: asc }) {
          id
          name
          position
        }
      }
    `,
    { variables: { condition } },
  )
  const identityCollection =
    loading || error || !data
      ? []
      : data.identity.map(v => ({
          id: v.id,
          name: v.name,
          position: v.position,
        }))

  return {
    identityCollection,
  }
}

export const useSignUpProperty = (isBusiness: boolean = false) => {
  const { loading, error, data } = useQuery<hasura.GET_SIGNUP_PROPERTY>(
    gql`
      query GET_SIGNUP_PROPERTY($isBusiness: Boolean!) {
        signup_property(where: { property: { is_business: { _eq: $isBusiness } } }, order_by: { position: asc }) {
          id
          is_required
          options
          type
          property {
            id
            name
          }
        }
      }
    `,
    { variables: { isBusiness } },
  )
  const signUpProperties: SignupProperty[] =
    data?.signup_property.map(v => ({
      id: v.id,
      propertyId: v.property.id,
      type: v.type,
      name: v.property.name,
      isRequired: v.is_required,
      placeHolder: v.options?.placeholder || '',
      selectOptions: v.options?.options || [],
      ruleMessage: v.options?.ruleMessage || '',
      rowAmount: v.options?.rowAmount || 1,
    })) || []

  return {
    loadingSignUpProperty: loading,
    signUpProperties,
    errorSignUpProperty: error,
  }
}

export const useMemberSignUpProperty = (propertyList: string[], memberId: string) => {
  const { loading, error, data } = useQuery<
    hasura.GET_MEMBER_SIGNUP_PROPERTY,
    hasura.GET_MEMBER_SIGNUP_PROPERTYVariables
  >(
    gql`
      query GET_MEMBER_SIGNUP_PROPERTY($propertyList: [uuid!], $memberId: String!) {
        member_property(where: { property_id: { _in: $propertyList }, member_id: { _eq: $memberId } }) {
          id
          property_id
          value
        }
        member(where: { id: { _eq: $memberId } }) {
          id
          name
        }
      }
    `,
    { variables: { propertyList, memberId } },
  )

  const memberSignUpProperties: { id: string; propertyId: string; value: string }[] =
    data?.member_property.map(v => ({
      id: v.id,
      propertyId: v.property_id,
      value: v.value,
    })) || []

  const memberName = data?.member[0].name

  return {
    loading,
    error,
    memberSignUpProperties,
    memberName,
  }
}

export const useMemberPageEnrollmentsCounts = (memberId: string) => {
  const { loading: loadingProjectPlanEnrollments, data: projectPlanEnrollments } = useQuery<
    hasura.GetProjectPlanEnrollments,
    hasura.GetProjectPlanEnrollmentsVariables
  >(
    gql`
      query GetProjectPlanEnrollments($memberId: String!) {
        product_enrollment(
          where: { _and: [{ product_id: { _like: "ProjectPlan%" } }, { member_id: { _eq: $memberId } }] }
        ) {
          product_id
        }
      }
    `,
    { variables: { memberId } },
  )

  const { loading: loadingAppointmentEnrollments, data: appointmentEnrollments } = useQuery<
    hasura.GetAppointmentEnrollments,
    hasura.GetAppointmentEnrollmentsVariables
  >(
    gql`
      query GetAppointmentEnrollments($memberId: String!) {
        appointment_enrollment(where: { member_id: { _eq: $memberId } }) {
          appointment_plan_id
        }
      }
    `,
    { variables: { memberId } },
  )
  const { loading: loadingMerchandiseOrderEnrollments, data: merchandiseOrderEnrollments } = useQuery<
    hasura.GetMerchandiseOrderEnrollments,
    hasura.GetMerchandiseOrderEnrollmentsVariables
  >(
    gql`
      query GetMerchandiseOrderEnrollments($memberId: String!) {
        order_log(
          where: {
            member_id: { _eq: $memberId }
            status: { _eq: "SUCCESS" }
            order_products: { product_id: { _like: "Merchandise%" } }
          }
        ) {
          id
        }
      }
    `,
    { variables: { memberId } },
  )

  return {
    loadingProjectPlanEnrollments,
    loadingAppointmentEnrollments,
    loadingMerchandiseOrderEnrollments,
    projectPlanEnrollments: projectPlanEnrollments?.product_enrollment.length || 0,
    appointmentEnrollments: appointmentEnrollments?.appointment_enrollment.length || 0,
    merchandiseOrderEnrollments: merchandiseOrderEnrollments?.order_log.length || 0,
  }
}

export const useProductEnrollment = <T extends MemberPageProductType>(product: T, memberId?: string) => {
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>()
  const [data, setData] = useState<ProductData<T>[]>([])

  const fetch = useCallback(async () => {
    if (authToken) {
      try {
        setLoading(true)
        const programEnrollmentData = await getProductEnrollmentFromLodestar(product, authToken, memberId)
        setData(programEnrollmentData)
      } catch (err) {
        console.log(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    }
  }, [authToken])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { fetch, data, error, loading }
}
