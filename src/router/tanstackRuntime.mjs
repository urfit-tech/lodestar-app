import React from 'react'
import {
  Matches,
  Outlet,
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

export { Outlet, RootRoute, Route, Router, useParams, useRouter, useRouterState } from '@tanstack/react-router'
