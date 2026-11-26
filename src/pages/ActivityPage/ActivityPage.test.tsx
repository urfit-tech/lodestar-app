import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useEnrolledActivity } from '../../hooks/activity'
import ActivityPage from './ActivityPage'

jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({ useApp: () => ({ id: 'app-id' }) }))
jest.mock('lodestar-app-element/src/contexts/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: false, currentMemberId: null }),
}))
jest.mock('lodestar-app-element/src/hooks/resource', () => ({
  useResourceCollection: () => ({ resourceCollection: [] }),
}))
jest.mock('lodestar-app-element/src/components/common/StyledBraftEditor', () => ({ BraftContent: () => null }))
jest.mock('lodestar-app-element/src/components/common/Tracking', () => ({ Detail: () => null }))
jest.mock('@chakra-ui/react', () => ({ Button: 'button', Divider: 'hr', SkeletonText: 'div' }))
jest.mock('react-bootstrap', () => ({ Container: 'div', Row: 'div', Col: 'div' }))
jest.mock('react-ga', () => ({ plugin: { execute: jest.fn() }, ga: jest.fn() }))
jest.mock('react-intl', () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: () => ({ formatMessage: (message: { defaultMessage?: string }) => message?.defaultMessage || '' }),
}))
jest.mock('react-router-dom', () => ({
  useHistory: () => ({ push: jest.fn() }),
  useParams: () => ({ activityId: 'activity-1' }),
}))
jest.mock('../../components/activity/ActivityBanner', () => () => <div data-testid="activity-banner" />)
jest.mock('../../components/activity/ActivitySessionItem', () => () => null)
jest.mock('../../components/activity/ActivityTicketCard', () => () => null)
jest.mock('../../components/activity/ActivityTicketPaymentButton', () => () => null)
jest.mock('../../components/auth/AuthModal', () => ({
  AuthModalContext: require('react').createContext({ setVisible: () => {} }),
}))
jest.mock('../../components/common/CreatorCard', () => () => null)
jest.mock('../../components/common/Responsive', () => ({ BREAK_POINT: 768 }))
jest.mock('../../components/layout/DefaultLayout', () => ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
))
jest.mock('../../contexts/LocaleContext', () => ({
  __esModule: true,
  default: require('react').createContext({ currentLocale: 'zh-tw' }),
}))
jest.mock('../../helpers/translation', () => {
  const message = new Proxy({}, { get: () => ({ defaultMessage: '' }) })
  const group = new Proxy({}, { get: () => message })
  return { commonMessages: group, productMessages: new Proxy({}, { get: () => group }) }
})
jest.mock('../../hooks/activity', () => ({ useEnrolledActivity: jest.fn() }))
jest.mock('../../hooks/member', () => ({ usePublicMember: () => ({ member: null }) }))
jest.mock('../NotFoundPage', () => () => <div data-testid="not-found" />)
jest.mock('./ActivityPageHelmet', () => () => null)

const mockUseEnrolledActivity = useEnrolledActivity as jest.Mock

const activity = (overrides: Record<string, unknown> = {}) => ({
  id: 'activity-1',
  title: 'Activity',
  organizerId: 'organizer-1',
  description: null,
  isParticipantsVisible: false,
  coverUrl: null,
  publishedAt: '2025-01-16T03:04:00Z',
  supportLocales: null,
  activityTags: [],
  activityCategories: [],
  activityTickets: [],
  ...overrides,
})

const render = (data: unknown) => {
  mockUseEnrolledActivity.mockReturnValue({ loading: false, error: undefined, data })
  return renderToStaticMarkup(<ActivityPage />)
}

describe('ActivityPage', () => {
  it('renders the activity when it is not deleted', () => {
    const html = render(activity({ deletedAt: null }))
    expect(html).toContain('activity-banner')
    expect(html).not.toContain('not-found')
  })

  it('renders the activity when lodestar-server does not return deletedAt', () => {
    const html = render(activity())
    expect(html).toContain('activity-banner')
    expect(html).not.toContain('not-found')
  })

  it('shows the not found page for a deleted activity, even if it is still published', () => {
    const html = render(activity({ deletedAt: '2025-01-16T03:10:00Z' }))
    expect(html).toContain('not-found')
    expect(html).not.toContain('activity-banner')
  })
})
