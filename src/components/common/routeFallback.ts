type RouteLike = {
  path: string
}

export const routePathMatches = (routePath: string, pathname: string) => {
  if (routePath === '/') {
    return pathname === '/'
  }

  const routeSegments = routePath.replace(/^\/|\/$/g, '').split('/')
  const pathnameSegments = pathname.replace(/^\/|\/$/g, '').split('/')

  if (routeSegments.length !== pathnameSegments.length) {
    return false
  }

  return routeSegments.every((segment, index) => {
    const pathnameSegment = pathnameSegments[index]
    if (segment.startsWith(':')) {
      return Boolean(pathnameSegment)
    }
    if (segment.includes(':')) {
      const pattern = new RegExp(`^${segment.replace(/:[^/]+/g, '[^/]+')}$`)
      return pattern.test(pathnameSegment)
    }
    return segment === pathnameSegment
  })
}

export const shouldRenderRouteFallbackWhileLoading = (routesMap: { [routeKey: string]: RouteLike }, pathname: string) =>
  Object.values(routesMap).some(route => route.path !== '/' && routePathMatches(route.path, pathname))
