import { isProfilePathname, isProfileRoutePath, PROFILE_ROUTE_PATH, toTanStackRoutePath } from './routerPath'

describe('toTanStackRoutePath', () => {
  it('converts React Router params to TanStack Router params', () => {
    expect(toTanStackRoutePath('/programs/:programId/contents/:programContentId')).toBe(
      '/programs/$programId/contents/$programContentId',
    )
  })

  it('keeps the root route unchanged', () => {
    expect(toTanStackRoutePath('/')).toBe('/')
  })

  it('detects the legacy profile route path', () => {
    expect(isProfileRoutePath(PROFILE_ROUTE_PATH)).toBe(true)
    expect(isProfileRoutePath('/members/:memberId')).toBe(false)
  })

  it('detects profile pathnames without catching unrelated single-segment paths', () => {
    expect(isProfilePathname('/@eddy')).toBe(true)
    expect(isProfilePathname('/@eddy/')).toBe(true)
    expect(isProfilePathname('/not-found')).toBe(false)
    expect(isProfilePathname('/@eddy/settings')).toBe(false)
  })
})
