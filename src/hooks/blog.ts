import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { max, min } from 'lodash'
import hasura from '../hasura'
import { isUUIDv4 } from '../helpers'
import { PostLatestProps, PostLinkProps, PostPreviewProps, PostProps } from '../types/blog'

export const usePostPreviewCollection = (filter?: { authorId?: string; tags?: string[]; categories?: string[] }) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_POST_PREVIEW_COLLECTION,
    hasura.GET_POST_PREVIEW_COLLECTIONVariables
  >(
    gql`
      query GET_POST_PREVIEW_COLLECTION($authorId: String) {
        post(
          where: {
            is_deleted: { _eq: false }
            published_at: { _is_null: false }
            post_roles: { name: { _eq: "author" }, member_id: { _eq: $authorId } }
          }
          order_by: [{ position: asc }, { published_at: desc }]
        ) {
          id
          code_name
          title
          cover_url
          video_url
          abstract
          published_at
          post_roles(where: { name: { _eq: "author" } }) {
            id
            name
            member {
              id
              name
              username
            }
          }
          post_categories(order_by: { category: { position: asc } }) {
            id
            category {
              id
              name
            }
          }
          post_tags(order_by: { position: asc }) {
            id
            tag_name
          }
        }
      }
    `,
    { variables: { authorId: filter?.authorId } },
  )

  const posts: PostPreviewProps[] =
    loading || error || !data
      ? []
      : data.post
          .filter(
            post =>
              !filter ||
              typeof filter.categories === 'undefined' ||
              typeof filter.tags === 'undefined' ||
              post.post_tags.some(postTag => filter.categories?.includes(postTag.tag_name)) ||
              post.post_tags.some(postTag => filter.tags?.includes(postTag.tag_name)),
          )
          .map(post => ({
            id: post.id,
            codeName: post.code_name,
            title: post.title,
            coverUrl: post.cover_url,
            videoUrl: post.video_url,
            abstract: post.abstract,
            author: {
              id: post.post_roles[0]?.member?.id || '',
              name: post.post_roles[0]?.member?.name || post.post_roles[0]?.member?.username || '',
            },
            publishedAt: post.published_at ? new Date(post.published_at) : null,
            categories: post.post_categories.map(postCategory => ({
              id: postCategory.category.id,
              name: postCategory.category.name,
            })),
            tags: post.post_tags.map(tag => tag.tag_name),
          }))

  return {
    loadingPosts: loading,
    errorPosts: error,
    posts,
    refetchPosts: refetch,
  }
}

export const usePopularPostCollection = () => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_POPULAR_POST_COLLECTION,
    hasura.GET_POPULAR_POST_COLLECTIONVariables
  >(
    gql`
      query GET_POPULAR_POST_COLLECTION($offset: Int) {
        post_aggregate(where: { is_deleted: { _eq: false }, published_at: { _is_null: false } }) {
          aggregate {
            count
          }
        }
        post(
          where: { is_deleted: { _eq: false }, published_at: { _is_null: false } }
          order_by: { views: desc }
          offset: $offset
          limit: 5
        ) {
          id
          code_name
          title
          cover_url
          video_url
        }
      }
    `,
  )

  const posts: PostLinkProps[] =
    loading || error || !data
      ? []
      : data.post.map(post => ({
          id: post.id,
          codeName: post.code_name,
          title: post.title,
          coverUrl: post.cover_url,
          videoUrl: post.video_url,
        }))

  const postCount = data?.post_aggregate.aggregate?.count || 0
  const fetchMorePost = (page: number) =>
    fetchMore({
      variables: { offset: page * 5 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return Object.assign({}, prev, {
          post: [...prev.post, ...fetchMoreResult.post],
        })
      },
    })

  return {
    loadingPosts: loading,
    errorPosts: error,
    posts,
    refetchPosts: refetch,
    postCount,
    fetchMorePost,
  }
}

export const useRelativePostCollection = (id: string, tags?: string[]) => {
  const { loading, error, data, refetch, fetchMore } = useQuery<
    hasura.GET_RELATIVE_POST_COLLECTION,
    hasura.GET_RELATIVE_POST_COLLECTIONVariables
  >(
    gql`
      query GET_RELATIVE_POST_COLLECTION($tags: [String!], $offset: Int) {
        post_aggregate(
          where: {
            is_deleted: { _eq: false }
            published_at: { _is_null: false }
            post_tags: { tag_name: { _in: $tags } }
          }
        ) {
          aggregate {
            count
          }
        }
        post(
          where: {
            is_deleted: { _eq: false }
            published_at: { _is_null: false }
            post_tags: { tag_name: { _in: $tags } }
          }
          order_by: { published_at: desc }
          offset: $offset
          limit: 5
        ) {
          id
          title
          code_name
          cover_url
          video_url
        }
      }
    `,
    { variables: { tags } },
  )

  const posts: PostLinkProps[] =
    loading || error || !data
      ? []
      : data.post
          .filter(post => post.id !== id)
          .map(post => ({
            id: post.id,
            codeName: post.code_name,
            title: post.title,
            coverUrl: post.cover_url,
            videoUrl: post.video_url,
          }))

  const postCount = (data?.post_aggregate.aggregate?.count || 1) - 1
  const fetchMorePost = (page: number) =>
    fetchMore({
      variables: { offset: page * 5 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
        return Object.assign({}, prev, {
          post: [...prev.post, ...fetchMoreResult.post],
        })
      },
    })

  return {
    loadingPost: loading,
    errorPost: error,
    posts,
    refetchPost: refetch,
    postCount,
    fetchMorePost,
  }
}

export const usePost = (search: string) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_POST, hasura.GET_POSTVariables>(
    gql`
      fragment PostParts on post {
        id
        code_name
        title
        description
        cover_url
        video_url
        abstract
        views
        published_at
        post_roles(where: { name: { _eq: "author" } }) {
          id
          member {
            id
            name
            picture_url
            abstract
          }
        }
        post_categories {
          id
          category {
            id
            name
          }
        }
        post_tags {
          id
          tag_name
        }
        post_merchandises(
          where: { merchandise: { is_deleted: { _eq: false }, published_at: { _is_null: false } } }
          order_by: [{ position: asc }, { merchandise: { published_at: desc } }]
        ) {
          id
          merchandise {
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
              url
              type
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
      }

      query GET_POST($id: uuid!, $search: String!) {
        post(where: { code_name: { _eq: $search } }) {
          ...PostParts
        }
        post_by_pk(id: $id) {
          ...PostParts
        }
      }
    `,
    {
      variables: {
        id: isUUIDv4(search) ? search : '00000000-0000-0000-0000-000000000000',
        search,
      },
    },
  )

  const dataPost = data?.post[0] || data?.post_by_pk || null
  const { prevPost, nextPost } = useNearPost(dataPost?.published_at)

  const post: PostProps | null = !dataPost
    ? null
    : {
        id: dataPost.id,
        codeName: dataPost.code_name,
        title: dataPost.title,
        coverUrl: dataPost.cover_url,
        videoUrl: dataPost.video_url,
        abstract: dataPost.abstract,
        author: {
          id: dataPost.post_roles[0]?.member?.id || '',
          name: dataPost.post_roles[0]?.member?.name || '',
          avatarUrl: dataPost.post_roles[0]?.member?.picture_url || null,
          abstract: dataPost.post_roles[0]?.member?.abstract || null,
        },
        publishedAt: dataPost.published_at,
        categories: dataPost.post_categories.map(postCategory => ({
          id: postCategory.category.id,
          name: postCategory.category.name,
        })),
        tags: dataPost.post_tags.map(postTag => postTag.tag_name),
        views: dataPost.views,
        merchandises: dataPost.post_merchandises.map(v => ({
          id: v.merchandise.id,
          title: v.merchandise.title,
          soldAt: v.merchandise.sold_at ? new Date(v.merchandise.sold_at) : null,
          minPrice: min(
            v.merchandise.merchandise_specs.map(spec =>
              v.merchandise?.sold_at && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0,
            ),
          ),
          maxPrice: max(
            v.merchandise.merchandise_specs.map(spec =>
              v.merchandise?.sold_at && typeof spec.sale_price === 'number' ? spec.sale_price : spec.list_price || 0,
            ),
          ),
          abstract: v.merchandise.abstract,
          description: v.merchandise.description,
          startedAt: v.merchandise.started_at ? new Date(v.merchandise.started_at) : null,
          endedAt: v.merchandise.ended_at ? new Date(v.merchandise.ended_at) : null,
          isLimited: v.merchandise.is_limited,
          isPhysical: v.merchandise.is_physical,
          isCustomized: v.merchandise.is_customized,
          isCountdownTimerVisible: v.merchandise.is_countdown_timer_visible,

          images: v.merchandise.merchandise_imgs.map(image => ({
            id: image.id,
            url: image.url,
            isCover: image.type === 'cover',
          })),
          categories: v.merchandise.merchandise_categories.map(merchandiseCategory => ({
            id: merchandiseCategory.id,
            name: merchandiseCategory.category.name,
          })),
          tags: v.merchandise.merchandise_tags.map(merchandiseTag => merchandiseTag.tag_name),
          memberShop: v.merchandise.member_shop
            ? {
                id: v.merchandise.member_shop.id,
                title: v.merchandise.member_shop.title,
                shippingMethods: v.merchandise.member_shop.shipping_methods,
              }
            : null,
          specs: v.merchandise.merchandise_specs.map(v => ({
            id: v.id,
            title: v.title,
            listPrice: v.list_price,
            salePrice: v.sale_price,
            quota: v.quota,
            buyableQuantity: v.merchandise_spec_inventory_status?.buyable_quantity || 0,
          })),
        })),
        description: dataPost.description,
        prevPost,
        nextPost,
      }

  return {
    loadingPost: loading,
    errorPost: error,
    post,
    refetchPosts: refetch,
  }
}

const useNearPost = (publishedAt?: Date) => {
  const { data: dataPrevPost } = useQuery<hasura.GET_PREV_POST, hasura.GET_PREV_POSTVariables>(
    gql`
      query GET_PREV_POST($publishedAt: timestamptz) {
        post(
          where: { is_deleted: { _eq: false }, published_at: { _lt: $publishedAt } }
          order_by: { published_at: desc }
          limit: 1
        ) {
          id
          code_name
          title
        }
      }
    `,
    { variables: { publishedAt } },
  )
  const { data: dataNextPost } = useQuery<hasura.GET_NEXT_POST, hasura.GET_NEXT_POSTVariables>(
    gql`
      query GET_NEXT_POST($publishedAt: timestamptz) {
        post(
          where: { is_deleted: { _eq: false }, published_at: { _gt: $publishedAt } }
          order_by: { published_at: asc }
          limit: 1
        ) {
          id
          code_name
          title
        }
      }
    `,
    { variables: { publishedAt } },
  )

  const prevPost = dataPrevPost?.post[0]
    ? {
        id: dataPrevPost.post[0].id,
        codeName: dataPrevPost.post[0].code_name,
        title: dataPrevPost.post[0].title,
      }
    : null
  const nextPost = dataNextPost?.post[0]
    ? {
        id: dataNextPost.post[0].id,
        codeName: dataNextPost.post[0].code_name,
        title: dataNextPost.post[0].title,
      }
    : null

  return {
    prevPost,
    nextPost,
  }
}

export const useAddPostViews = () => {
  const [addPostViews] = useMutation<hasura.ADD_POST_VIEWS, hasura.ADD_POST_VIEWSVariables>(gql`
    mutation ADD_POST_VIEWS($id: uuid!) {
      update_post(where: { id: { _eq: $id } }, _inc: { views: 1 }) {
        affected_rows
      }
    }
  `)

  return (id: string) => addPostViews({ variables: { id } })
}

export const useLatestPost = (filter?: { limit?: number }) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_LATEST_POST, hasura.GET_LATEST_POSTVariables>(
    gql`
      query GET_LATEST_POST($limit: Int) {
        post(
          where: {
            is_deleted: { _eq: false }
            published_at: { _is_null: false }
            post_roles: { name: { _eq: "author" } }
          }
          order_by: [{ published_at: desc }, { position: asc }]
          limit: $limit
        ) {
          id
          code_name
          title
          cover_url
          video_url
          abstract
          description
          published_at
        }
      }
    `,
    { variables: { limit: filter?.limit } },
  )
  const posts: PostLatestProps[] =
    loading || error || !data
      ? []
      : data.post.map(post => ({
          id: post.id,
          codeName: post.code_name,
          title: post.title,
          coverUrl: post.cover_url,
          videoUrl: post.video_url,
          abstract: post.abstract,
          publishedAt: post.published_at ? new Date(post.published_at) : null,
          description: post.description,
        }))

  return {
    loadingPosts: loading,
    errorPosts: error,
    posts,
    refetchPosts: refetch,
  }
}
