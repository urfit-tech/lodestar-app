import React, { useEffect, useMemo } from 'react'
import { useParams as useTanStackParams, useRouter, useRouterState } from './tanstackRuntime'

type LocationDescriptorObject<S = unknown> = {
  pathname?: string
  search?: string
  hash?: string
  state?: S
}
type LocationDescriptor<S = unknown> = string | LocationDescriptorObject<S>

type ReactRouterLocation<S = unknown> = {
  pathname: string
  search: string
  hash: string
  state: S | undefined
  key?: string
}

const isAbsoluteUrl = (value: string) => /^[a-z][a-z\d+\-.]*:/i.test(value)

const isModifiedEvent = (event: React.MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey

const ensureSearch = (search?: string) => {
  if (!search) return ''
  return search.startsWith('?') ? search : `?${search}`
}

const ensureHash = (hash?: string) => {
  if (!hash) return ''
  return hash.startsWith('#') ? hash : `#${hash}`
}

const getCurrentLocation = (): ReactRouterLocation => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  state: window.history.state,
})

const toPath = <S,>(to: LocationDescriptor<S>, currentLocation = getCurrentLocation()) => {
  if (typeof to === 'string') return to

  return `${to.pathname || currentLocation.pathname}${ensureSearch(to.search)}${ensureHash(to.hash)}`
}

const getLocationState = <S,>(to: LocationDescriptor<S>, fallback?: S) =>
  typeof to === 'string' ? fallback : to.state ?? fallback

const isExternalHref = (href: string) => {
  if (!isAbsoluteUrl(href)) return false
  return new URL(href, window.location.href).origin !== window.location.origin
}

export function useLocation<S = unknown>(): ReactRouterLocation<S> {
  const location = useRouterState({
    select: state => state.location,
  })

  return {
    pathname: location.pathname,
    search: location.searchStr,
    hash: location.hash,
    state: location.state as S | undefined,
    key: location.state?.key,
  }
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  const params = useTanStackParams({ strict: false } as any) as T
  const location = useLocation()

  if (location.pathname.startsWith('/@')) {
    const profileUsername = params.username || params['*']
    if (typeof profileUsername === 'string') {
      return { ...params, username: profileUsername.replace(/^@/, '') } as T
    }
  }

  return params
}

export function useRouteMatch<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  const match = useRouterState({
    select: state => state.matches[state.matches.length - 1],
  }) as any

  return {
    params: (match?.params || {}) as T,
    path: match?.routeId || '',
    url: match?.pathname || '',
    isExact: true,
  }
}

export function useHistory<S = unknown>() {
  const router = useRouter()
  const location = useLocation<S>()

  return useMemo(
    () => ({
      location,
      push: (to: LocationDescriptor<S>, state?: S) => {
        const path = toPath(to, location)
        if (isExternalHref(path)) {
          window.location.assign(path)
          return
        }
        router.history.push(path, getLocationState(to, state))
      },
      replace: (to: LocationDescriptor<S>, state?: S) => {
        const path = toPath(to, location)
        if (isExternalHref(path)) {
          window.location.replace(path)
          return
        }
        router.history.replace(path, getLocationState(to, state))
      },
      go: (delta: number) => router.history.go(delta),
      goBack: () => router.history.back(),
      goForward: () => router.history.forward(),
      createHref: (to: LocationDescriptor<S>) => router.history.createHref(toPath(to, location)),
      listen: (listener: () => void) => router.history.subscribe(listener),
      block: () => () => {},
    }),
    [location, router],
  )
}

type LinkProps<S = unknown> = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: LocationDescriptor<S>
  replace?: boolean
  innerRef?: React.Ref<HTMLAnchorElement>
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, onClick, target, innerRef, ...props }, forwardedRef) => {
    const history = useHistory()
    const location = useLocation()
    const href = toPath(to, location)
    const ref = forwardedRef || innerRef

    return (
      <a
        {...props}
        href={href}
        ref={ref}
        target={target}
        onClick={event => {
          onClick?.(event)
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            (target && target !== '_self') ||
            isModifiedEvent(event) ||
            isExternalHref(href)
          ) {
            return
          }

          event.preventDefault()
          replace ? history.replace(to) : history.push(to)
        }}
      />
    )
  },
)

Link.displayName = 'Link'

export const NavLink = Link

export const Redirect: React.FC<{ to: LocationDescriptor; push?: boolean }> = ({ to, push }) => {
  const history = useHistory()

  useEffect(() => {
    push ? history.push(to) : history.replace(to)
  }, [history, push, to])

  return null
}

export const BrowserRouter: React.FC = ({ children }) => <>{children}</>
export const Router = BrowserRouter
export const Switch: React.FC = ({ children }) => <>{children}</>
export const Route: React.FC = () => null

export default {
  BrowserRouter,
  Link,
  NavLink,
  Redirect,
  Route,
  Router,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
}
