import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import type { Mock } from 'vitest'
import { AppProvider, useApp } from 'lodestar-app-element/src/contexts/AppContext'

type QueryResult = {
  data?: any
  loading: boolean
  error?: Error
  refetch: Mock
}

const mockRefetch = vi.fn()
let mockQueryResult: QueryResult

vi.mock('@apollo/client', () => ({
  gql: vi.fn((strings: TemplateStringsArray) => strings.join('')),
  useQuery: () => mockQueryResult,
}))

const appData = {
  currency: [
    {
      id: 'TWD',
      name: 'Taiwan Dollar',
      label: 'NT$',
      unit: '元',
      minor_units: 0,
    },
  ],
  app_by_pk: {
    id: 'demo-app',
    org_id: null,
    name: 'Demo App',
    title: 'Demo',
    description: 'Demo description',
    app_modules: [{ id: 'module-1', module_id: 'locale' }],
    app_plan_id: 'default',
    app_navs: [],
    app_settings: [{ key: 'title', value: 'Demo title' }],
    app_secrets: [],
    app_hosts: [{ host: 'localhost:3333' }],
    options: {},
    ended_at: null,
  },
}

describe('AppProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    mockRefetch.mockClear()
    mockQueryResult = {
      data: appData,
      loading: false,
      refetch: mockRefetch,
    }
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
  })

  it('keeps the last loaded app data while GET_APP is loading again', () => {
    const snapshots: Array<{ id: string; loading: boolean; title?: string }> = []

    const Consumer = () => {
      const app = useApp()
      snapshots.push({
        id: app.id,
        loading: app.loading,
        title: app.settings.title,
      })
      return null
    }

    act(() => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
    })

    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: false,
      title: 'Demo title',
    })

    mockQueryResult = {
      loading: true,
      refetch: mockRefetch,
    }

    act(() => {
      render(
        <AppProvider appId="demo-app">
          <Consumer />
        </AppProvider>,
        container,
      )
    })

    expect(snapshots[snapshots.length - 1]).toMatchObject({
      id: 'demo-app',
      loading: true,
      title: 'Demo title',
    })
  })
})
