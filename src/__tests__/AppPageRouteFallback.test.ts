import { shouldRenderRouteFallbackWhileLoading } from '../components/common/routeFallback'

const routesMap = {
  home: {
    path: '/',
    pageName: 'HomePage',
  },
  program: {
    path: '/programs/:programId',
    pageName: 'ProgramPage',
  },
}

describe('shouldRenderRouteFallbackWhileLoading', () => {
  it('does not render the HomePage fallback while the CMS homepage is loading', () => {
    expect(shouldRenderRouteFallbackWhileLoading(routesMap, '/')).toBe(false)
  })

  it('keeps route fallback available for non-home application routes', () => {
    expect(shouldRenderRouteFallbackWhileLoading(routesMap, '/programs/program-1')).toBe(true)
  })
})
