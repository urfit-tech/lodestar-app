export const PROFILE_ROUTE_PATH = '/@:username'

export const isProfileRoutePath = (path: string) => path === PROFILE_ROUTE_PATH

export const isProfilePathname = (pathname: string) => /^\/@[^/]+\/?$/.test(pathname)

export const toTanStackRoutePath = (path: string) => path.replace(/:([A-Za-z0-9_]+)/g, '$$$1')
