import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import { useQueryParam } from 'use-query-params'
import { Post } from '../types/blog'
import BlogPostCollectionPage from './BlogPostCollectionPage'
import BlogPostPageHelmet from './BlogPostPage/BlogPostPageHelmet'
import NotFoundPage from './NotFoundPage'

jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({
  useApp: () => ({ loading: false, enabledModules: { blog: true }, settings: { title: 'Test site' } }),
}))
jest.mock('lodestar-app-element/src/components/common', () => ({ MultiLineTruncationMixin: '' }))
jest.mock('../contexts/LocaleContext', () => ({
  __esModule: true,
  default: require('react').createContext({ defaultLocale: 'zh-tw' }),
}))
jest.mock('../helpers', () => ({
  desktopViewMixin: () => '',
  getBraftContent: () => '',
  getOgLocale: () => 'zh_TW',
  getInfinityDate: () => new Date('9999-12-31'),
  notEmpty: (value: unknown) => value != null,
}))
jest.mock('../hooks/blog', () => ({ usePostPreviewCollection: () => ({ posts: [] }) }))
jest.mock('../components/blog', () => ({ StyledPostTitle: 'h2' }))
jest.mock('../components/blog/PostLinkCollection', () => ({ PopularPostCollection: () => null }))
jest.mock('../components/blog/PostPreviewCover', () => () => null)
jest.mock('../components/blog/PostPreviewMeta', () => () => null)
jest.mock('../components/layout/DefaultLayout', () => ({ children }: { children: React.ReactNode }) => <>{children}</>)
jest.mock('../components/layout/DefaultLayout/DefaultLayout.styled', () => ({ CenteredBox: 'div' }))
jest.mock('@chakra-ui/icons', () => ({ Icon: () => null }))
jest.mock('@chakra-ui/react', () => ({ Button: 'button', Stack: 'div' }))
jest.mock('antd', () => ({ Icon: () => null }))
jest.mock('./OrderPage', () => ({ messages: { orderTracking: { id: 'orderTracking' } } }))
jest.mock('react-router-dom', () => ({ useHistory: () => ({ goBack: jest.fn() }), Link: 'a' }))
jest.mock('use-query-params', () => ({ useQueryParam: jest.fn(), StringParam: {} }))
jest.mock('react-intl', () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: () => ({
    formatMessage: (message: { defaultMessage?: string }) => message.defaultMessage || '',
  }),
}))

const mockQuery = useQueryParam as jest.Mock
const renderHead = (element: React.ReactElement) => {
  Helmet.canUseDOM = false
  renderToStaticMarkup(element)
  const head = Helmet.renderStatic()
  return { meta: head.meta.toString(), link: head.link.toString(), title: head.title.toString() }
}

beforeEach(() => mockQuery.mockImplementation(() => [undefined]))

describe('article canonical', () => {
  const post = {
    id: 'post-uuid',
    title: 'Article',
    updatedAt: new Date('2026-10-28'),
    publishedAt: new Date('2026-10-27'),
    author: { id: 'author', name: 'Author' },
    categories: [],
    tags: [],
  } as unknown as Post

  it.each([
    ['custom-slug', 'custom-slug'],
    ['設計 思考/?#%', '%E8%A8%AD%E8%A8%88%20%E6%80%9D%E8%80%83%2F%3F%23%25'],
    [null, 'post-uuid'],
    ['', 'post-uuid'],
  ])('uses the encoded slug or UUID (%s)', (codeName, expected) => {
    const head = renderHead(<BlogPostPageHelmet post={{ ...post, codeName }} />)
    expect(head.link).toContain(`href="${window.location.origin}/posts/${expected}"`)
    expect(head.meta).toContain(`property="og:url" content="${window.location.href}"`)
  })
})

describe('tag collection robots', () => {
  it.each(['design', '', '設計,創意'])('marks tags=%s noindex, follow', tags => {
    mockQuery.mockImplementation((key: string) => [key === 'tags' ? tags : undefined])
    const head = renderHead(<BlogPostCollectionPage />)
    expect(head.meta).toContain('name="robots" content="noindex, follow"')
    expect(head.title).toContain('部落格')
  })

  it.each([undefined, 'category-id'])('leaves category indexing unchanged (%s)', categories => {
    mockQuery.mockImplementation((key: string) => [key === 'categories' ? categories : undefined])
    expect(renderHead(<BlogPostCollectionPage />).meta).not.toContain('name="robots"')
  })
})

describe('not-found prerender status', () => {
  it('marks a missing route 404 and gives it a title', () => {
    const head = renderHead(<NotFoundPage />)
    expect(head.meta).toContain('name="prerender-status-code" content="404"')
    expect(head.meta).toContain('name="robots" content="noindex"')
    expect(head.title).toContain('找不到')
  })

  it.each(['error', 'repairing'] as const)('does not mark %s as a missing route', variant => {
    expect(renderHead(<NotFoundPage variant={variant} />).meta).not.toContain('prerender-status-code')
  })

  it('does not mark a payment gateway error as a missing route', () => {
    mockQuery.mockImplementation((key: string) => [key === 'code' ? 'E_PAYMENT_GATEWAY' : undefined])
    expect(renderHead(<NotFoundPage />).meta).not.toContain('prerender-status-code')
  })
})
