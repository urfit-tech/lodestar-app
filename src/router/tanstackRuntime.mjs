import React from 'react'
import {
  CatchBoundary,
  ErrorComponent,
  RootRoute,
  Route,
  Router,
  pick,
  routerContext,
  useLayoutEffect,
  useParams,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'

const matchContext = React.createContext(undefined)

const useTransitionCompat = () => {
  if (typeof React.useTransition === 'function') {
    return React.useTransition()
  }

  return [false, callback => callback()]
}

function Transitioner() {
  const router = useRouter()
  const routerState = useRouterState({
    select: state => pick(state, ['isLoading', 'location', 'resolvedLocation', 'isTransitioning']),
  })

  const [isTransitioning, startReactTransition] = useTransitionCompat()

  router.startReactTransition = startReactTransition

  React.useEffect(() => {
    if (isTransitioning) {
      router.__store.setState(state => ({
        ...state,
        isTransitioning,
      }))
    }
  }, [isTransitioning, router])

  const tryLoad = () => {
    const apply = callback => {
      if (!routerState.isTransitioning) {
        startReactTransition(() => callback())
      } else {
        callback()
      }
    }

    apply(() => {
      try {
        router.load()
      } catch (error) {
        console.error(error)
      }
    })
  }

  useLayoutEffect(() => {
    const unsubscribe = router.history.subscribe(() => {
      router.latestLocation = router.parseLocation(router.latestLocation)
      if (routerState.location !== router.latestLocation) {
        tryLoad()
      }
    })

    const nextLocation = router.buildLocation({
      search: true,
      params: true,
      hash: true,
      state: true,
    })

    if (routerState.location.href !== nextLocation.href) {
      router.commitLocation({ ...nextLocation, replace: true })
    }

    return () => {
      unsubscribe()
    }
  }, [router.history])

  useLayoutEffect(() => {
    if (
      routerState.isTransitioning &&
      !isTransitioning &&
      !routerState.isLoading &&
      routerState.resolvedLocation !== routerState.location
    ) {
      router.emit({
        type: 'onResolved',
        fromLocation: routerState.resolvedLocation,
        toLocation: routerState.location,
        pathChanged: routerState.location.href !== routerState.resolvedLocation?.href,
      })

      if (typeof document !== 'undefined' && document.querySelector && routerState.location.hash !== '') {
        const element = document.getElementById(routerState.location.hash)
        element?.scrollIntoView()
      }

      router.__store.setState(state => ({
        ...state,
        isTransitioning: false,
        resolvedLocation: state.location,
      }))
    }
  }, [
    router,
    routerState.isTransitioning,
    isTransitioning,
    routerState.isLoading,
    routerState.resolvedLocation,
    routerState.location,
  ])

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.__TSR_DEHYDRATED__) {
      tryLoad()
    }
  }, [])

  return null
}

const getRenderedMatches = state =>
  state.pendingMatches?.some(match => match.showPending) ? state.pendingMatches : state.matches

function SafeFragment(props) {
  return React.createElement(React.Fragment, null, props.children)
}

function Match({ matchId }) {
  const router = useRouter()
  const match = useRouterState({
    select: state => getRenderedMatches(state).find(renderedMatch => renderedMatch.id === matchId),
  })

  if (!match) {
    return null
  }

  const route = router.routesById[match.routeId]

  if (!route) {
    return null
  }

  const PendingComponent = route.options.pendingComponent ?? router.options.defaultPendingComponent
  const pendingElement = PendingComponent ? React.createElement(PendingComponent) : null
  const routeErrorComponent = route.options.errorComponent ?? router.options.defaultErrorComponent ?? ErrorComponent
  const shouldUseSuspense =
    route.options.wrapInSuspense ??
    PendingComponent ??
    route.options.component?.preload ??
    route.options.pendingComponent?.preload ??
    route.options.errorComponent?.preload
  const ResolvedSuspenseBoundary = shouldUseSuspense ? React.Suspense : SafeFragment
  const ResolvedCatchBoundary = routeErrorComponent ? CatchBoundary : SafeFragment

  return React.createElement(
    matchContext.Provider,
    { value: matchId },
    React.createElement(
      ResolvedSuspenseBoundary,
      { fallback: pendingElement },
      React.createElement(
        ResolvedCatchBoundary,
        {
          getResetKey: () => router.state.resolvedLocation.state?.key,
          errorComponent: routeErrorComponent,
        },
        React.createElement(MatchInner, { match, route, router, pendingElement }),
      ),
    ),
  )
}

function MatchInner({ match, route, router, pendingElement }) {
  if (match.status === 'error') {
    throw match.error
  }

  if (match.status === 'pending') {
    if (match.showPending) {
      return pendingElement
    }

    throw match.loadPromise
  }

  if (match.status === 'success') {
    const Comp = route.options.component ?? router.options.defaultComponent

    return Comp ? React.createElement(Comp) : React.createElement(Outlet)
  }

  throw new Error('Idle routeMatch status encountered during rendering.')
}

export const Outlet = React.memo(function Outlet() {
  const matchId = React.useContext(matchContext)
  const childMatchId = useRouterState({
    select: state => {
      const matches = getRenderedMatches(state)
      const index = matches.findIndex(match => match.id === matchId)

      return matches[index + 1]?.id
    },
  })

  return childMatchId ? React.createElement(Match, { matchId: childMatchId }) : null
})

function Matches() {
  const router = useRouter()
  const matchId = useRouterState({
    select: state => getRenderedMatches(state)[0]?.id,
  })

  return React.createElement(
    matchContext.Provider,
    { value: matchId },
    React.createElement(
      CatchBoundary,
      {
        getResetKey: () => router.state.resolvedLocation.state?.key,
        errorComponent: ErrorComponent,
      },
      matchId ? React.createElement(Match, { matchId }) : null,
    ),
  )
}

export function RouterProvider({ router, ...rest }) {
  router.update({
    ...router.options,
    ...rest,
    context: {
      ...router.options.context,
      ...rest?.context,
    },
  })

  const matches = router.options.InnerWrap
    ? React.createElement(router.options.InnerWrap, null, React.createElement(Matches))
    : React.createElement(Matches)
  const provider = React.createElement(
    routerContext.Provider,
    { value: router },
    matches,
    React.createElement(Transitioner),
  )

  if (router.options.Wrap) {
    return React.createElement(router.options.Wrap, null, provider)
  }

  return provider
}

export { RootRoute, Route, Router, useParams, useRouter, useRouterState } from '@tanstack/react-router'
