import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from '@tanstack/react-router'
import { Outlet, RootRoute, Route, Router, RouterProvider, useRouter } from './tanstackRuntime.mjs'

const HomePage = () => {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        router.history.push('/programs/d883b7d3-4de5-401b-b435-f681297e20c7')
        router.history.notify?.()
      }}
    >
      open program
    </button>
  )
}

const ProgramPage = () => <div>program detail</div>

const createTestRouter = () => {
  const rootRoute = new RootRoute({
    component: () => <Outlet />,
  })
  const homeRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage,
  })
  const programRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/programs/$programId',
    component: ProgramPage,
  })

  return new Router({
    history: createMemoryHistory({ initialEntries: ['/'] }),
    routeTree: rootRoute.addChildren([homeRoute, programRoute]),
  })
}

describe('RouterProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
  })

  it('navigates from the home route to a program route without rendering stale matches', async () => {
    const router = createTestRouter()
    await router.load()

    act(() => {
      render(<RouterProvider router={router as any} />, container)
    })

    expect(container.textContent).toContain('open program')

    await act(async () => {
      container.querySelector('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await Promise.resolve()
    })

    expect(container.textContent).toContain('program detail')
  })
})
